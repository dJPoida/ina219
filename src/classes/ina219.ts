import { PromisifiedBus } from 'i2c-bus';
import { openPromisified } from './i2c.mock';
import { AN_INA219_I2C_ADDRESS, INA219_I2C_ADDRESS } from '../const/ina219-i2c-address.const';
import { AN_I2C_HARDWARE_STATE, I2C_HARDWARE_STATE } from '../const/i2c-hardware-state.const';
import { AN_INA219_REGISTER, INA219_REGISTER } from '../const/ina219-register.const';
import { INA219_CONFIG_RESET } from '../const/ina219-config.const';

/*
const _INA219_READ = 0x01;

const bus_vol_range_16V = 0;
const bus_vol_range_32V = 1;

const PGA_bits_1 = 0;
const PGA_bits_2 = 1;
const PGA_bits_4 = 2;
const PGA_bits_8 = 3;
    
const adc_bits_9 = 0;
const adc_bits_10 = 1;
const adc_bits_11 = 2;
const adc_bits_12 = 3;
    
const adc_sample_1 = 0;
const adc_sample_2 = 1;
const adc_sample_4 = 2;
const adc_sample_8 = 3;
const adc_sample_16 = 4;
const adc_sample_32 = 5;
const adc_sample_64 = 6;
const adc_sample_128 = 7;
    
const power_down = 0;
const shunt_vol_trig = 1;
const bus_vol_trig = 2;
const shunt_and_bus_vol_trig = 3;
const adc_off = 4;
const shunt_vol_con = 5;
const bus_vol_con = 6;
const shunt_and_bus_vol_con = 7;

*/

// const begin = (self) => {
        
//   self.cal_value = 4096;
//   self.set_bus_RNG(self.bus_vol_range_32V);
//   self.set_PGA(self.PGA_bits_8);
//   self.set_bus_ADC(self.adc_bits_12, self.adc_sample_8);
//   self.set_shunt_ADC(self.adc_bits_12, self.adc_sample_8);
//   self.set_mode(self.shunt_and_bus_vol_con);
//   return true;
// }

// const linear_cal = (self, ina219_reading_mA, ext_meter_reading_mA) => {
//   ina219_reading_mA = float(ina219_reading_mA);
//   ext_meter_reading_mA = float(ext_meter_reading_mA);
//   self.cal_value = int((ext_meter_reading_mA / ina219_reading_mA) * self.cal_value) & 0xFFFE;
//   self._write_register(self._INA219_REG_CALIBRATION, self.cal_value);
// }



//     def set_bus_RNG(self, value):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x01 << 13)
//         conf |= value << 13
//         self._write_register(self._INA219_REG_CONFIG, conf)

//     def set_PGA(self, bits):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x03 << 11)
//         conf |= bits << 11
//         self._write_register(self._INA219_REG_CONFIG, conf)
    
//     def set_bus_ADC(self, bits, sample):
//         conf = 0
//         value = 0
//         if(bits < adc_bits_12 and sample > adc_sample_1):
//             return
//         if(bits < adc_bits_12):
//             value = bits
//         else:
//             value = 0x80 | sample
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x0f << 7)
//         conf |= value << 7
//         self._write_register(self._INA219_REG_CONFIG, conf)
    
//     def set_shunt_ADC(self, bits, sample):
//         conf = 0
//         value = 0
//         if(bits < adc_bits_12 and sample > adc_sample_1):
//             return
//         if(bits < adc_bits_12):
//             value = bits
//         else:
//             value = 0x80 | sample
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x0f << 3)
//         conf |= value << 3
//         self._write_register(self._INA219_REG_CONFIG, conf)
    
//     def set_mode(self, mode):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~0x07
//         conf |= mode
//         self._write_register(self._INA219_REG_CONFIG, conf)




export class Ina219 {

  private _initialised = false;

  private _i2cHardwareState: AN_I2C_HARDWARE_STATE = I2C_HARDWARE_STATE.UNKNOWN;

  private i2cBus: PromisifiedBus;

  private _address: AN_INA219_I2C_ADDRESS = INA219_I2C_ADDRESS[4];


  /**
   * Initialise the connection to the ina219 over i2c
   * @param busNumber (default = 1) the i2c bus number to use
   * @param address (default = INA219_I2C_ADDRESS.4 (0x45)) the i2c address of the INA219
   * 
   * @returns true | Error true if initialisation was successful, string .
   */
  public init = async (busNumber = 1, address: AN_INA219_I2C_ADDRESS = INA219_I2C_ADDRESS[4]): Promise<true | Error> => {
    try {
      // Attempt to open the I2C Bus. This will return false if the hardware is not available.
      const newI2cBus = await openPromisified(busNumber);

      // If false is returned from the i2c safety wrapper, don't continue the initialisation.
      if (!newI2cBus) {
        throw new Error('Failed to open I2C Bus. Perhaps this device is not capable? Or you may not have installed the "i2c-bus" library. Try running an "npm install" first.');
      }

      this.i2cBus = newI2cBus;

      // Attempt to locate the device
      const scanResult = await this.i2cBus.scan(address);
      if (!scanResult.includes(address)) {
        throw new Error(`I2C was unable to reach the INA219 device at address '0x${address.toString(16)}'.`);
      }

      // Record the config
      this._address = address;
      this._i2cHardwareState = I2C_HARDWARE_STATE.AVAILABLE;
      this._initialised = true;
      
      // Bind listeners for future event handling
      this.bindEvents();
    } catch (err) {
      // If the I2C Bus was connected but the address couldn't be reached, shut it down again
      if (this.i2cBus) {
        try {
          await this.i2cBus.close();
        } catch {
          // sink. Don't care
        }
      }

      this._i2cHardwareState = I2C_HARDWARE_STATE.UNAVAILABLE;
      this._initialised = false;

      return err;
    }

    return true;
  }


  /**
   * Reset the config on the ina219 to the default firmware values
   */
  public reset = async ():Promise<void> => {
    await this.writeRegister(INA219_REGISTER.CONFIG, INA219_CONFIG_RESET);
  }


  /**
   * Get the Bus voltage
   */
  public getBusVoltage = async(): Promise<number> => {
    return (await this.readInaRegister(INA219_REGISTER.BUSVOLTAGE) >> 1) * 0.001;
  }


  /**
   * Get the Shunt Voltage in millivolts (mV)
   */
  public getShuntVoltage_mV = async(): Promise<number> => {
    return await this.readInaRegister(INA219_REGISTER.SHUNTVOLTAGE);
  }


  /**
   * Get the Current in milliamps (mA)
   */
  public getCurrent_mA = async(): Promise<number> => {
    return await this.readInaRegister(INA219_REGISTER.CURRENT);
  }


  /**
   * Get the Power in milliwatts (mW)
   */
  public getPower_mW = async(): Promise<number> => {
    return (await this.readInaRegister(INA219_REGISTER.POWER) * 20);
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


  /**
   * Read a register from the I2C device
   * @param register 
   */
  // @ts-ignore
  private readRegister = async (register: AN_INA219_REGISTER) => {
    if (!this.initialised) throw new Error('Cannot call `readRegister` prior to initialisation.');

    const result = Buffer.alloc(2);
  	await this.i2cBus.readI2cBlock(this.address, register, 2, result);
  	return result.readInt16BE();
  };


  /**
   * Read and handle a register value from the INA219
   * @param register 
   */
  private readInaRegister = async (register: AN_INA219_REGISTER) => {
    if (!this.initialised) throw new Error('Cannot call `readInaRegister` prior to initialisation.');

    const result = Buffer.alloc(2);
  	await this.i2cBus.readI2cBlock(this.address, register, 2, result);

    console.log('debug:', result, result[0]);

    if (result[0] & 0x80) {
      return - 0x10000 + ((result[0] << 8) | (result[1]));
    } else {
      return ((result[0] << 8) | (result[1]));
    }
  }


  /**
   * Bind internal event listeners after initialisation
   */
  private bindEvents = ():void => {
    /**
     * Catch the termination of the application and close the i2c connection (if required)
     */
    process.on('SIGINT', async () => {
      if (this.i2cBus && this.initialised) {
        await this.i2cBus.close();
      }
    });
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
  get i2cHardwareState(): AN_I2C_HARDWARE_STATE { return this._i2cHardwareState; }

  /**
   * Whether the I2C and the INA219 have both initialised and are working
   */
  get hardwareAvailable(): boolean { return this._i2cHardwareState === I2C_HARDWARE_STATE.AVAILABLE; }
}
