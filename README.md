# ina219
NodeJS port of the [DFRobot INA219 (SEN0291) IIC Digital Wattmeter](https://wiki.dfrobot.com/Gravity:%20I2C%20Digital%20Wattmeter%20SKU:%20SEN0291)

An almost direct port of the [DFRobot Python library](https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py)

## Features
- Written in TypeScript
- Asynchronous (Promises, Async/Await)
- Works in Node 12
- Works without access to hardware

## Installation

```
npm install @djpoida/ina219
```

## Example (Async/Await)
```js
const { Ina219 } = require('ina219');

const ina219 = new Ina219();

const run = async() => {
  const initResult = await ina219.init();
  if (initResult === true) {
    // Read and output the values
    console.log('busVoltage (V):', await ina219.getBusVoltage_V());
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
  if (initResult === true) {
    // Periodically output the power values
    setInterval(async () => {
      console.log('busVoltage (V):', await ina219.getBusVoltage_V());
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

## Reference

### init
Initialise the connection to the ina219 over i2c

`init: (busNumber?: number, address?: AN_INA219_I2C_ADDRESS) => Promise<true | Error>;`

  - `busNumber` (default = 1) the i2c bus number to use
  - `address` (default = INA219_I2C_ADDRESS.ADDRESS_4 (0x45)) the i2c address of the INA219
returns `true` | `Error` true if initialisation was successful, an Error object if not.

### close
Close the connection to the ina219 and release the I2C Resources

`close: () => Promise<void>;`

### reset
Reset the config on the ina219 to the default firmware values

`reset: () => Promise<void>;`

### getBusVoltage_V
Get the Bus Voltage (V)
`getBusVoltage_V: () => Promise<number>;`

### getShuntVoltage_mV
Get the Shunt Voltage in millivolts (mV)
`getShuntVoltage_mV: () => Promise<number>;`

### getCurrent_mA
Get the Current in milliamps (mA)
`getShuntVoltage_mV: () => Promise<number>;`

### getPower_mW
Get the Power in milliwatts (mW)

`getPower_mW: () => Promise<number>;`

### setBusRNG
Set the Bus Voltage Range (16v or 32v)
  - value

`setBusRNG: (value: AN_INA219_BUS_VOLTAGE_RANGE) => Promise<void>;`

## Credits
- [DFRobot INA219 (SEN0291) IIC Digital Wattmeter](https://wiki.dfrobot.com/Gravity:%20I2C%20Digital%20Wattmeter%20SKU:%20SEN0291)
- [DFRobot Python library](https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py)
