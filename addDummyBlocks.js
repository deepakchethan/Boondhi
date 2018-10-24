const Blockchain = require('./src/models/chain');

const bc = new Blockchain();

for (let i = 0; i < 10; i += 1) {
  console.log(bc.addBlock(`dummy block number ${i}`).toString());
}
