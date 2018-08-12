/*
  -- train.js --
  Trains new LSTM on training data in excerpts.js.
*/

// init
const fs = require('fs');
const brain = require('brain.js');

// encodes extended ascii to normalised value
function encode(arg) {
  return arg.split('').map(x => (x.charCodeAt(0) / 255));
}

// processes data to correct format for training
function compute(data) {
  return data.map(d => {
    return {
      input: encode(d.input),
      output: d.output
    }
  });
}

// creates and trains net
function train() {
  // gets net and training data
  var net = new brain.NeuralNetwork();
  var trainingDataRaw = fs.readFileSync('./excerpts.js');
  var trainingData = JSON.parse(trainingDataRaw);
  
  // gets a few excerpts
  var selectData = [];
  for (i = 0; i < 20; i++) {
    var next = trainingData[Math.floor((Math.random() * trainingData.length))];
    selectData.push(next);
  }
  // maps encoded training data
  selectData = compute(selectData);
  
  // trains network and returns it
  net.train(selectData, {
    log: true
  });
  
  return net;
}

module.exports.init = function () {
  var net = train().toJSON();
  fs.writeFileSync('network.json', JSON.stringify(net));
};