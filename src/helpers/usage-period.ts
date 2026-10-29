/**
 * Plan allowances (AI credits, page views) are counted inside a 30-day period anchored on
 * the day the account was created, not inside the calendar month.
 *
 * The database is the authority: private.usage_period_anchor / _start / _end in
 * supabase/migrations/20261029120000_usage_period_from_signup.sql. This mirror exists for
 * the Cloudflare Worker, which reaches the database over REST and cannot call a private
 * function. Keep the two in step - including USAGE_PERIOD_EPOCH.
 */

export const USAGE_PERIOD_DAYS = 30;

/**
 * The switch-over from calendar months, as the first day of the month it was deployed in.
 * No period reaches back past it, so turning this on could not make an account's counted
 * usage go up. Mirrored by the literal in the migration named above.
 */
export const USAGE_PERIOD_EPOCH = "2026-11-01T00:00:00.000Z";

const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC midnight of the day a timestamp falls on. */
const utcDayStart = (value: Date) =>
  new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
  );

/**
 * The account's current usage period. `start` is what usage is counted from and `end` is
 * when the allowance resets; both land on 00:00 UTC, so they can be read as UTC days
 * against `analytics.day`.
 */
export function usagePeriod(
  signupAt: string | Date,
  now: Date = new Date()
): { start: Date; end: Date } {
  const signupDay = utcDayStart(new Date(signupAt));
  const elapsed = Math.max(
    Math.floor((utcDayStart(now).getTime() - signupDay.getTime()) / DAY_MS),
    0
  );
  const anchor = new Date(
    signupDay.getTime() +
      Math.floor(elapsed / USAGE_PERIOD_DAYS) * USAGE_PERIOD_DAYS * DAY_MS
  );
  const epoch = new Date(USAGE_PERIOD_EPOCH);
  const start =
    epoch.getTime() <= now.getTime() && anchor.getTime() < epoch.getTime()
      ? epoch
      : anchor;
  // From the anchor, never the clamped start: the epoch shortens the first period after
  // the switch-over, it does not move a reset date.
  return {
    end: new Date(anchor.getTime() + USAGE_PERIOD_DAYS * DAY_MS),
    start,
  };
}

/** `YYYY-MM-DD` in UTC, the shape `analytics.day` is filtered on. */
export const usagePeriodDays = (
  signupAt: string | Date,
  now?: Date
): { start: string; end: string } => {
  const { start, end } = usagePeriod(signupAt, now);
  return {
    end: end.toISOString().slice(0, 10),
    start: start.toISOString().slice(0, 10),
  };
};
