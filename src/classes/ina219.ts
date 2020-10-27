import { PromisifiedBus } from 'i2c-bus';
import { openPromisified } from './i2c.mock';
import { AN_INA219_I2C_ADDRESS, INA219_I2C_ADDRESS } from '../const/ina219-i2c-address.const';
import { A_HARDWARE_AVAILABILITY_STATE, HARDWARE_AVAILABILITY_STATE } from '../const/hardware-availability-state.const';
import { AN_INA219_REGISTER, INA219_REGISTER } from '../const/ina219-register.const';
import { AN_INA219_BUS_VOLTAGE_RANGE, INA219_BUS_VOLTAGE_RANGE } from '../const/ina219-bus-voltage-range.const';
import { AN_INA219_MODE, INA219_MODE } from '../const/ina219-mode.const';
import { AN_INA219_PGA_BITS, INA219_PGA_BITS } from '../const/ina219-pga-bits.const';
import { AN_INA219_ADC_BITS, INA219_ADC_BITS } from '../const/ina219-adc-bits.const';
import { AN_INA219_ADC_SAMPLE, INA219_ADC_SAMPLE } from '../const/ina219-adc-sample.const';

const INA219_CONFIG_RESET = 0x8000;

/**
 * @class Ina219
 * This class is ported from DFRobot's own Python / Raspberry pi library ans *SHOULD* behave identically
 *
 * @see https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py
 */
export class Ina219 {

  private _initialised = false;

  private _i2cHardwareState: A_HARDWARE_AVAILABILITY_STATE = HARDWARE_AVAILABILITY_STATE.UNKNOWN;
  
  private _ina219HardwareState: A_HARDWARE_AVAILABILITY_STATE = HARDWARE_AVAILABILITY_STATE.UNKNOWN;

  private i2cBus: PromisifiedBus;

  private _address: AN_INA219_I2C_ADDRESS = INA219_I2C_ADDRESS.ADDRESS_4;

  private calValue = 4096;


  /**
   * Initialise the connection to the ina219 over i2c
   * @param busNumber (default = 1) the i2c bus number to use
   * @param address (default = INA219_I2C_ADDRESS.ADDRESS_4 (0x45)) the i2c address of the INA219
   * 
   * @returns true | Error true if initialisation was successful, an Error object if not.
   */
  public init = async (busNumber = 1, address: AN_INA219_I2C_ADDRESS = INA219_I2C_ADDRESS.ADDRESS_4): Promise<true | Error> => {
    try {
      // Attempt to open the I2C Bus. This will return false if the hardware is not available.
      const newI2cBus = await openPromisified(busNumber);

      // If false is returned from the i2c safety wrapper, don't continue the initialisation.
      if (!newI2cBus) {
        throw new Error('Failed to open I2C Bus. Perhaps this device is not capable? Or you may not have installed the "i2c-bus" library. Try running an "npm install" first.');
      }

      this.i2cBus = newI2cBus;
      this._i2cHardwareState = HARDWARE_AVAILABILITY_STATE.AVAILABLE;

      // Attempt to locate the device
      const scanResult = await this.i2cBus.scan(address);
      if (!scanResult.includes(address)) {
        throw new Error(`I2C was unable to reach the INA219 device on bus ${busNumber} at address 0x${address.toString(16)}.`);
      }

      // Record the config
      this._address = address;
      this._ina219HardwareState = HARDWARE_AVAILABILITY_STATE.AVAILABLE;
      this._initialised = true;

      // Set the default config
      this.calValue = 4096;
      await this.writeRegister(INA219_REGISTER.CALIBRATION, this.calValue);
      await this.setBusRNG(INA219_BUS_VOLTAGE_RANGE.RANGE_32V);
      await this.setPGA(INA219_PGA_BITS.PGA_BITS_8);
      await this.setBusADC(INA219_ADC_BITS.ADC_BITS_12, INA219_ADC_SAMPLE.ADC_SAMPLE_8);
      await this.setShuntADC(INA219_ADC_BITS.ADC_BITS_12, INA219_ADC_SAMPLE.ADC_SAMPLE_8);
      await this.setMode(INA219_MODE.SHUNT_AND_BUS_VOL_CON);

    } catch (err) {
      // If the I2C Bus was connected but the ina219's address couldn't be reached, shut the i2c bus down again
      if (this.i2cBus) {
        try {
          await this.i2cBus.close();
        } catch {
          // Sink. Don't care
        }
      }

      this._initialised = false;

      return err;
    }

    return true;
  }


  /**
   * Close the connection to the ina219 and release the I2C Resources
   */
  public close = async ():Promise<void> => {
    if (this.initialised) {
      try {
        // Reset the ina219
        await this.reset();
        
        // Close the I2C Bus
        await this.i2cBus.close();
      } catch {
        // Sink. Don't care.
      }

      this._initialised = false;
      this._ina219HardwareState = HARDWARE_AVAILABILITY_STATE.UNKNOWN;
      // Leave the i2cHardware State alone
      // this._i2cHardwareState
    }
  }


  /**
   * Reset the config on the ina219 to the default firmware values
   */
  public reset = async ():Promise<void> => {
    return this.writeRegister(INA219_REGISTER.CONFIG, INA219_CONFIG_RESET);
  }


  /**
   * Get the Bus Voltage (V)
   */
  public getBusVoltage_V = async (): Promise<number> => {
    return (await this.readInaRegister(INA219_REGISTER.BUSVOLTAGE) >> 1) * 0.001;
  }


  /**
   * Get the Shunt Voltage in millivolts (mV)
   */
  public getShuntVoltage_mV = async (): Promise<number> => {
    return await this.readInaRegister(INA219_REGISTER.SHUNTVOLTAGE);
  }


  /**
   * Get the Current in milliamps (mA)
   * 
   * As pointed out by many other packages, sometimes a sharp load will reset the
   * INA219, which will reset the cal register, meaning CURRENT and POWER will
   * not be available. To resolve this we always set the cal value even if
   * it's an unfortunate extra step
   */
  public getCurrent_mA = async (): Promise<number> => {
    const activeCalValue = await this.readInaRegister(INA219_REGISTER.CALIBRATION);
    if (activeCalValue !== this.calValue) {
      // console.warn('Calibration Lost!');
      await this.writeRegister(INA219_REGISTER.CALIBRATION, this.calValue);
    }
    return await this.readInaRegister(INA219_REGISTER.CURRENT);
  }


  /**
   * Get the Power in milliwatts (mW)
   */
  public getPower_mW = async (): Promise<number> => {
    await this.writeRegister(INA219_REGISTER.CALIBRATION, this.calValue);
    return (await this.readInaRegister(INA219_REGISTER.POWER) * 20);
  }


  /**
   * Get the Calibration Value
   */
  public getCalibration = async (): Promise<number> => {
    return await this.readInaRegister(INA219_REGISTER.CALIBRATION);
  }


  /**
   * Get all of the sensor values at once
   */
  public getAll = async (): Promise<{
    busVoltage_V: number,
    shuntVoltage_mV: number,
    current_mA: number,
    power_mW: number,
  }> => {
    const activeCalValue = await this.readInaRegister(INA219_REGISTER.CALIBRATION);
    if (activeCalValue !== this.calValue) {
      await this.writeRegister(INA219_REGISTER.CALIBRATION, this.calValue);
    }
    
    const promises = [
      this.readInaRegister(INA219_REGISTER.BUSVOLTAGE),
      this.readInaRegister(INA219_REGISTER.SHUNTVOLTAGE),
      this.readInaRegister(INA219_REGISTER.CURRENT),
      this.readInaRegister(INA219_REGISTER.POWER),
    ];

    const result = await Promise.all(promises);

    return {
      busVoltage_V: (result[0] >> 1) * 0.001,
      shuntVoltage_mV: result[1],
      current_mA: result[2],
      power_mW: result[3] * 20,
    };
  }


  /**
   * Set the Bus Voltage Range (16v or 32v)
   * @param value
   */
  public setBusRNG = async (value: AN_INA219_BUS_VOLTAGE_RANGE): Promise<void> => {
    if (!this.initialised) throw new Error('Cannot call `setBusRNG` prior to initialisation.');

    let conf = 0;
    conf = await this.readInaRegister(INA219_REGISTER.CONFIG);
    conf &= ~(0x01 << 13);
    conf |= value << 13;
    return this.writeRegister(INA219_REGISTER.CONFIG, conf);
  }


  /**
   * Set the Programmable Gain Amplifier
   * @param bits
   */
  public setPGA = async (bits: AN_INA219_PGA_BITS): Promise<void> => {
    if (!this.initialised) throw new Error('Cannot call `setPGA` prior to initialisation.');

    let conf = 0;
    conf = await this.readInaRegister(INA219_REGISTER.CONFIG);
    conf &= ~(0x03 << 11);
    conf |= bits << 11;
    return this.writeRegister(INA219_REGISTER.CONFIG, conf);
  }


  /**
   * Set the Bus ADC
   * @param bits 
   * @param sample 
   */
  public setBusADC = async (bits: AN_INA219_ADC_BITS, sample: AN_INA219_ADC_SAMPLE): Promise<void> => {
    if (!this.initialised) throw new Error('Cannot call `setBusADC` prior to initialisation.');

    let conf = 0;
    let value = 0;

    if((bits < INA219_ADC_BITS.ADC_BITS_12) && (sample > INA219_ADC_SAMPLE.ADC_SAMPLE_1)) return;
      
    if(bits < INA219_ADC_BITS.ADC_BITS_12) {
        value = bits;
    } else {
        value = 0x80 | sample;
    }

    conf = await this.readInaRegister(INA219_REGISTER.CONFIG);
    conf &= ~(0x0f << 7);
    conf |= value << 7;
    return this.writeRegister(INA219_REGISTER.CONFIG, conf);
  }


  /**
   * Set the Shunt ADC
   * @param bits 
   * @param sample 
   */
  public setShuntADC = async (bits: AN_INA219_ADC_BITS, sample: AN_INA219_ADC_SAMPLE): Promise<void> => {
    if (!this.initialised) throw new Error('Cannot call `setShuntADC` prior to initialisation.');

    let conf = 0;
    let value = 0;

    if((bits < INA219_ADC_BITS.ADC_BITS_12) && (sample > INA219_ADC_SAMPLE.ADC_SAMPLE_1)) return;
      
    if(bits < INA219_ADC_BITS.ADC_BITS_12) {
        value = bits;
    } else {
        value = 0x80 | sample;
    }

    conf = await this.readInaRegister(INA219_REGISTER.CONFIG);
    conf &= ~(0x0f << 3);
    conf |= value << 3;
    return this.writeRegister(INA219_REGISTER.CONFIG, conf);
  }


  /**
   * Set the Mode
   * @param value 
   */
  public setMode = async (mode: AN_INA219_MODE): Promise<void> => {
    if (!this.initialised) throw new Error('Cannot call `setMode` prior to initialisation.');

    let conf = 0;
    conf = await this.readInaRegister(INA219_REGISTER.CONFIG);
    conf &= ~0x07;
    conf |= mode;
    return this.writeRegister(INA219_REGISTER.CONFIG, conf);
  }


  /**
   * Calibrate the readings
   * @param ina219Reading_mA the milliamp value reported by the ina219
   * @param extMeterReading_mA the milliamp value recorded by an external multimeter
   */
  public linearCal = async (ina219Reading_mA: number, extMeterReading_mA: number): Promise<void> => {
    this.calValue = Math.floor((extMeterReading_mA / ina219Reading_mA) * this.calValue) & 0xFFFE;
    return this.writeRegister(INA219_REGISTER.CALIBRATION, this.calValue);
  }


  /**
   * Write a register value to the INA219
   * @param register 
   * @param value 
   */
  private writeRegister = async (register: AN_INA219_REGISTER, value: number) => {
    if (!this.initialised) throw new Error('Cannot call `writeRegister` prior to initialisation.');

    const bytes = Buffer.alloc(2);
  	bytes[0] = (value >> 8) & 0xFF;
  	bytes[1] = value & 0xFF;

  	await this.i2cBus.writeI2cBlock(this.address, register, 2, bytes);
  };


  // /**
  //  * Read a register from the I2C device
  //  * @param register 
  //  */
  // private readRegister = async (register: AN_INA219_REGISTER) => {
  //   if (!this.initialised) throw new Error('Cannot call `readRegister` prior to initialisation.');

  //   const result = Buffer.alloc(2);
  // 	await this.i2cBus.readI2cBlock(this.address, register, 2, result);
  // 	return result.readInt16BE();
  // };


  /**
   * Read and handle a register value from the INA219
   * @param register 
   */
  private readInaRegister = async (register: AN_INA219_REGISTER) => {
    if (!this.initialised) throw new Error('Cannot call `readInaRegister` prior to initialisation.');

    const result = Buffer.alloc(2);
  	await this.i2cBus.readI2cBlock(this.address, register, 2, result);

    if (result[0] & 0x80) {
      return - 0x10000 + ((result[0] << 8) | (result[1]));
    } else {
      return ((result[0] << 8) | (result[1]));
    }
  }

  /**
   * The address used to communicate with the INA219
   */
  get address(): AN_INA219_I2C_ADDRESS { return this._address; }

  /**
   * Whether the ina219 has been initialised yet
   */
  get initialised(): boolean { return this._initialised; }

  /**
   * The known state of the I2C Hardware
   */
  get i2cHardwareState(): A_HARDWARE_AVAILABILITY_STATE { return this._i2cHardwareState; }

  /**
   * The known state of the ina219 Hardware
   */
  get ina219HardwareState(): A_HARDWARE_AVAILABILITY_STATE { return this._ina219HardwareState; }

  /**
   * Whether the I2C and the INA219 have both initialised and are working
   */
  get hardwareAvailable(): boolean { return (
    this.i2cHardwareState === HARDWARE_AVAILABILITY_STATE.AVAILABLE
    && this.ina219HardwareState === HARDWARE_AVAILABILITY_STATE.AVAILABLE
  ); }
}
