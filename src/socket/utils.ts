import { config } from 'config';
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
export const warning = (...args) => {
  // debug on development and staging.
  if (config.ENV === 'production') return;

  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error.apply(console, args);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.

    throw new Error(args.join(' '));
    /* eslint-disable no-empty */
  } catch (e) { }
  /* eslint-enable no-empty */
};

export const debug = (...args) => {
  if (config.ENV === 'production') return;

  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.debug === 'function') {
    console.debug.apply(console, args);
  }
};
