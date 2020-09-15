const fs = require('fs');
const initializeParser = require('./lib/initializeParser');
const checkMessagesFileExistence = require('./lib/checkMessagesFileExistence');

const messagesFilePath = './input-files/Messages.xml';
const messagesFileEncoding = 'UTF-8';

checkMessagesFileExistence(messagesFilePath, (err) => {
  if (err) {
    console.error(err)
    process.exit(1);
  }
});

const stream = fs.createReadStream(messagesFilePath, messagesFileEncoding);

const parser = initializeParser({
  onError: err => {
    console.error(err);
    process.exit(1);
  },
  onSuccess: result => {
    // we will just log the message list. We can add some saving to db here (`result` variable is array of objects)
    console.log('Messages List');
    console.log(JSON.stringify(result, 2, 2));
  }
});

stream.pipe(parser);



