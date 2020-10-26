# ina219
NodeJS port of the [DFRobot INA219 (SEN0291) IIC Digital Wattmeter](https://wiki.dfrobot.com/Gravity:%20I2C%20Digital%20Wattmeter%20SKU:%20SEN0291)

An almost direct port of the [DFRobot Python library](https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py)

## Features
- Written in TypeScript
- Asynchronous (Promises, Async/Await)
- Works in Node 12

## Example (Async/Await)
```js
const { Ina219 } = require('ina219');

const ina219 = new Ina219();

const run = async() => {
  const initResult = await ina219.init();
  if (initResult) {
    // Read and output the values
    console.log('busVoltage (V):', await ina219.getBusVoltage());
    console.log('shuntVoltage (mV):', await ina219.getShuntVoltage_mV());
    console.log('current (mA):', await ina219.getCurrent_mA());
    console.log('power (mW):', await ina219.getPower_mW());
  } else {
    // Spit out the error
    console.log('initResult: ', initResult);
  }
}

run();
```

## Example (Promises)
```js
const { Ina219 } = require('ina219');

const ina219 = new Ina219();

ina219.init().then((initResult) => {
  // Successful initialisation
  if (initResult) {
    // Periodically output the power values
    setInterval(async () => {
      console.log('busVoltage (V):', await ina219.getBusVoltage());
      console.log('shuntVoltage (mV):', await ina219.getShuntVoltage_mV());
      console.log('current (mA):', await ina219.getCurrent_mA());
      console.log('power (mW):', await ina219.getPower_mW());
    }, 1000);
  
  } else {
    // Spit out the error
    console.log('initResult: ', initResult);
  }
});
```

## Installation

```
npm install @dJPoida/ina219
```

## API Reference

## Credits
- [DFRobot INA219 (SEN0291) IIC Digital Wattmeter](https://wiki.dfrobot.com/Gravity:%20I2C%20Digital%20Wattmeter%20SKU:%20SEN0291)
- [DFRobot Python library](https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py)
