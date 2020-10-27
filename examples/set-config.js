/**
 * ============================================================================
 *
 * SEN0291 Wattmeter Sensor (ina219)
 * This file is a node.js port of the official DFRobot INA219 Python / Raspberry Pi code
 * @see https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/set_config.py
 *
 * ============================================================================
 *
 * This sensor can detect Voltage, Current, and Power.
 * This demo is used to change configuration mode.
 *
 * The module has four possible I2C addresses:
 *
 * INA219_I2C_ADDRESS.ADDRESS_1   0x40  A0 = 0  A1 = 0
 * INA219_I2C_ADDRESS.ADDRESS_2   0x41  A0 = 1  A1 = 0
 * INA219_I2C_ADDRESS.ADDRESS_3   0x44  A0 = 0  A1 = 1
 * INA219_I2C_ADDRESS.ADDRESS_4   0x45  A0 = 1  A1 = 1 (Default)
 *
 * setBusRNG: Set the Bus Voltage Range
 *   value  = INA219_BUS_VOLTAGE_RANGE.RANGE_16V
 *            INA219_BUS_VOLTAGE_RANGE.RANGE_32V (Default)
 *
 * setPGA: Set the Programmable Gain Amplifier Bits
 *   bits   = INA219_PGA_BITS.PGA_BITS_1
 *            INA219_PGA_BITS.PGA_BITS_2
 *            INA219_PGA_BITS.PGA_BITS_4
 *            INA219_PGA_BITS.PGA_BITS_8
 *
 * setBusADC: Set the Bus ADC (Analogue to Digital Converter) Resolution
 * setShuntADC: Set the Shunt ADC (Analogue to Digital Converter) Resolution
 *   bits =   INA219_ADC_BITS.ADC_BITS_9
 *            INA219_ADC_BITS.ADC_BITS_10
 *            INA219_ADC_BITS.ADC_BITS_11
 *            INA219_ADC_BITS.ADC_BITS_12
 *
 *   sample = INA219_ADC_SAMPLE.ADC_SAMPLE_1
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_2
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_4
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_8
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_16
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_32
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_64
 *            INA219_ADC_SAMPLE.ADC_SAMPLE_128
 *
 * setMode: Set the operating mode of the ina219
 *   mode =   INA219_MODE.POWER_DOWN
 *            INA219_MODE.SHUNT_VOL_TRIG
 *            INA219_MODE.BUS_VOL_TRIG
 *            INA219_MODE.SHUNT_AND_BUS_VOL_TRIG
 *            INA219_MODE.ADC_OFF
 *            INA219_MODE.SHUNT_VOL_CON
 *            INA219_MODE.BUS_VOL_CON
 *            INA219_MODE.SHUNT_AND_BUS_VOL_CON
 */

const { 
  Ina219,
  INA219_I2C_ADDRESS,
  INA219_BUS_VOLTAGE_RANGE,
  INA219_MODE,
  INA219_ADC_SAMPLE,
  INA219_ADC_BITS,
  INA219_PGA_BITS
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../lib/index');

const busNumber = 1;
// Change the I2C address of the SEN0291 by changing the DIP switches
const address = INA219_I2C_ADDRESS.ADDRESS_4;

const ina219 = new Ina219();

const run = async() => {
  // Initialise the ina219 using the bus and address
  const initResult = await(ina219.init(busNumber, address));

  // If the device was initialised and could be contacted the initResult will return true
  if (initResult === true) {
    ina219.setBusRNG(INA219_BUS_VOLTAGE_RANGE.RANGE_16V);
    ina219.setPGA(INA219_PGA_BITS.PGA_BITS_8);
    ina219.setBusADC(INA219_ADC_BITS.ADC_BITS_9, INA219_ADC_SAMPLE.ADC_SAMPLE_8);
    ina219.setShuntADC(INA219_ADC_BITS.ADC_BITS_12, INA219_ADC_SAMPLE.ADC_SAMPLE_128);
    ina219.setMode(INA219_MODE.SHUNT_AND_BUS_VOL_CON);

    // Resets all registers to default values
    // ina219.reset();

    const measureInterval = setInterval(async () => {
      try {
        // Get all readings at once
        const readings = await ina219.getAll();
        console.log(`Bus Voltage   : ${readings.busVoltage_V} V`);
        console.log(`Shunt Voltage : ${readings.shuntVoltage_mV} mV`);
        console.log(`Current       : ${readings.current_mA} mA`);
        console.log(`Power         : ${readings.power_mW} mW`);
        console.log('');

        // Get individual readings
        // console.log(`Calibration   : ${await ina219.getCalibration()}`);
        // console.log(`Shunt Voltage : ${await ina219.getShuntVoltage_mV()} mV`);
        // console.log(`Bus Voltage   : ${await ina219.getBusVoltage_V()} V`);
        // console.log(`Current       : ${await ina219.getCurrent_mA()} mA`);
        // console.log(`Power         : ${await ina219.getPower_mW()} mW`);
        // console.log('');
      } catch (err) {
        console.error('An unexpected error occurred while reading the ina219: ', err);
      }
    }, 1000);

    // When the process is terminated, kill the interval
    process.on('SIGINT', async () => {
      clearInterval(measureInterval);
    });

  } else {
    // If the I2C or ina219 were not initialised then the initResult will return an error
    console.error(initResult);
  }
}

run();
