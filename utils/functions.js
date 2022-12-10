/**
 * @param {String} text
 * @returns {Boolean}
 */
const isURL = (text) => {
  return (text.startsWith('http://') || text.startsWith('https://'));
};

module.exports = { isURL };