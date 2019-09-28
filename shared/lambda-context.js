/**
 * This object is used to simulate lambda context object
 * - getRemainingTimeInMillis: return number of milisecond left before execution timeout.
 */

const {
  DEFAULT_REMAINING_TIME_IN_MILLIS = 5000,
} = process.env;

module.exports = {
  getRemainingTimeInMillis() { return +DEFAULT_REMAINING_TIME_IN_MILLIS; },
};
