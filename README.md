# chaiML

A machine learning library trained on all of Shakespeare's plays.

__Note:__ chaiML produces incorrect results for almost all given excerpts, but this will be easily fixed by 0.1.0. The current version is just a proof-of-concept.

## Installation

    npm i chaiml

## Usage

```js
const chaiML = require('chaiml');

chaiML("To be, or not to be: that is the question:", (err, result) => {
  if (err) {
    // error handling
  } else {
    // profit!
  }
});
```
