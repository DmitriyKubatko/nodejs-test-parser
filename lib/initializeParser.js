const node_xml_stream = require('node-xml-stream');
const parseString = require('xml2js').parseString;
const R = require('ramda');

module.exports = function initializeParser({ onError, onSuccess }) {
  const parser = new node_xml_stream();

  let xmlString = '';
  let restrictedTags = ['script'];
  let currentTagNotAllowed = false;

  parser.on('opentag', (openTagName, attrs) => {
    if (restrictedTags.includes(openTagName)) {
      currentTagNotAllowed = true;
      return
    }
    xmlString += `<${openTagName}>`;

  });

  parser.on('closetag', (closeTagName) => {
    if (restrictedTags.includes(closeTagName)) {
      currentTagNotAllowed = false;
      return
    }
    xmlString += `</${closeTagName}>`;
  });

  parser.on('text', (text) => {
    if (currentTagNotAllowed) return;
    xmlString += text;
  });

  // callback to do something after stream has finished
  parser.on('finish', () => {
    parseString(xmlString, function (err, result) {
      onSuccess(R.pipe(
        R.pathOr({}, ['FileDump', 'Message']),
        R.map(R.map(R.head))
      )(result))
    });
  });

  parser.on('error', onError);

  return parser;
}
