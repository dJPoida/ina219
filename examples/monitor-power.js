const {Ina219} = require('../lib/index');

const ina219 = new Ina219();

ina219.init().then((initResult) => {
  console.log('initResult: ', initResult);
});
