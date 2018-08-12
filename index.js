/*
  -- index.js --
  Interface for generated neural network.
*/

const fs = require('fs');
const brain = require('brain.js');

var netJSON = fs.readFileSync('src/network.json');
if (netJSON instanceof Error) {
  return new Error('Unable to read from neural network file.');
} else {
  netJSON = JSON.parse(netJSON);
  var net = new brain.NeuralNetwork();
  net.fromJSON(netJSON);
}

function encode(arg) {
  return arg.split('').map(x => (x.charCodeAt(0) / 255));
}

function normalise(arg) {
  if (arg.length < 100) {
    argOriginal = arg;
    while (arg.length < 100) {
      for (var i in argOriginal) {
        arg.push(i);
      }
    }
    arg = arg.slice(0, 100);
  } else if (arg.length > 100) {
    arg = arg.slice(0, 100);
  }
  
  return arg;
}

module.exports = async (excerpt, callback) => {
  var result = await net.run(normalise(encode(excerpt)))
  var largest = 0;
  var largestName = '';
  
  for (var key in result) {
    if (result[key] > largest) {
      largest = result[key];
      largestName = key;
    }
  }
  callback(undefined, largestName);
}