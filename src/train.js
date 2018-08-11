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
  for (i = 0; i < 2000; i++) {
    selectData.push(trainingData[Math.floor((Math.random() * trainingData.length))]);
  }
  // maps encoded training data
  selectData = compute(selectData);

  // trains network and exports to JSON
  net.train(selectData, {
    iterations: 2000,
    log: true
  });
  trainedNet = net.toJSON();
  return trainedNet;
}

module.exports.init = function () {
  var net = train();
  fs.writeFileSync('network.json', JSON.stringify(trainedNet));
};