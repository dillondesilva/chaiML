/*
  -- convert.js --
  Converts the text files of Shakespeares plays into a JSON format for training.
*/

// init
const fs = require('fs');
const request = require('request');

// gets plays
function getPlay(website) {
  return new Promise((resolve, reject) => {
    // requests the play from the website
    request(website, (err, resp, body) => {
      if (err) reject('Invalid URL \'' + resp.url + '\'');
      if (resp.statusCode != 200) {
        reject('Invalid status code <' + resp.statusCode + '>');
      }
      // return the text minus all tabs, new lines and carraige returns
      resolve(body.replace(/\t|\n|\r/g, " "));
    });
  });
}

// gets excerpts from plays
async function findExcerpts(callback) {
  var excerptList = new Array();
  // gets play websites and names
  var data = await fs.readFileSync('plays.txt');
  if (data instanceof Error) {
    callback(new Error('Unable to read text file with list of plays `plays.txt`'), undefined)
  } else {
    // formats play websites
    var entries = data.toString().split('\n');
    for (var i = 0; i < entries.length; i++) {
      var website = entries[i].split(' ')[0];
      var name = entries[i].split(' ').slice(1).join(' ');

      // gets text from plays
      var resp = await getPlay(website);
      if (resp instanceof Error) {
        callback(err, undefined);
      } else {
        // gets 100 char bits from play
        var chunks = resp.toString().split(/(.{100})/).filter(O => O);
        // formats for training
        for (var j = 0; j < chunks.length; j++) {
          var excerpt = {
            input: chunks[j],
            output: {}
          };
          excerpt.output[name.toString()] = 1;
          excerptList.push(excerpt);
        }
      }

    }
    callback(undefined, excerptList);
  }
}

module.exports.init = function () {
  findExcerpts((err, data) => {
    if (err) console.log(err);
    else {
      // saves excerpts to file
      fs.writeFile('./excerpts.js', JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
    }
  });
};