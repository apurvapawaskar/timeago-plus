export { timeAgo } from "./core";

export type { TimeAgoInput, TimeAgoLabels } from "./core";

/**
 * Options for customizing the timeAgo output.
 *
 * - `now`: Reference time to compare against. Defaults to current time.
 * - `short`: Use short unit labels (e.g. '4m').
 * - `future`: Allow future dates (e.g. 'in 4m').
 * - `locale`: Locale code for labels (e.g. 'en').
 * - `labels`: Override unit labels (advanced).
 * - `justNowThreshold`: Seconds within which to show 'just now'. Minimum 2, defaults to 2.
 * - `futureDisabledLabel`: String to return when future: false and input is a future date. Defaults to 'just now'.
 */
export type TimeAgoOptions = import("./core").TimeAgoOptions;

export { BUILTIN_LOCALES, getLocaleLabels } from "./locales";

