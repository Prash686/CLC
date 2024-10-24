/**
 * Wraps an async function to handle errors gracefully.
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns {Function} - A new function that handles errors.
 */
module.exports = (fn) => {
    return (req, res, next) => {
        // Call the async function and catch any errors
        fn(req, res, next).catch(next);
    }
}
