const fs = require('fs');

module.exports = function checkMessagesFileExistence(path, callback) {
  fs.access(path, fs.F_OK, callback);
}
