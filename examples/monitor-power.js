const {Ina219} = require('../lib/index');

const ina219 = new Ina219();

ina219.init().then((initResult) => {
  if (initResult) {
    setInterval(async () => {
      console.log('busVoltage (V):', await ina219.getBusVoltage());
      console.log('shuntVoltage (mV):', await ina219.getShuntVoltage_mV());
      console.log('current (mA):', await ina219.getCurrent_mA());
      console.log('power (mW):', await ina219.getPower_mW());
    }, 1000);
  
  } else {
    console.log('initResult: ', initResult);
  }
});
