import { AN_INA219_I2C_ADDRESS } from '../const/ina219-i2c-address.const';
import { A_HARDWARE_AVAILABILITY_STATE } from '../const/hardware-availability-state.const';
import { AN_INA219_BUS_VOLTAGE_RANGE } from '../const/ina219-bus-voltage-range.const';
import { AN_INA219_MODE } from '../const/ina219-mode.const';
import { AN_INA219_PGA_BITS } from '../const/ina219-pga-bits.const';
import { AN_INA219_ADC_BITS } from '../const/ina219-adc-bits.const';
import { AN_INA219_ADC_SAMPLE } from '../const/ina219-adc-sample.const';
/**
 * @class Ina219
 * This class is ported from DFRobot's own Python / Raspberry pi library ans *SHOULD* behave identically
 *
 * @see https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py
 */
export declare class Ina219 {
    private _initialised;
    private _i2cHardwareState;
    private _ina219HardwareState;
    private i2cBus;
    private _address;
    private calValue;
    /**
     * Initialise the connection to the ina219 over i2c
     * @param busNumber (default = 1) the i2c bus number to use
     * @param address (default = INA219_I2C_ADDRESS.ADDRESS_4 (0x45)) the i2c address of the INA219
     *
     * @returns true | Error true if initialisation was successful, an Error object if not.
     */
    init: (busNumber?: number, address?: AN_INA219_I2C_ADDRESS) => Promise<true | Error>;
    /**
     * Close the connection to the ina219 and release the I2C Resources
     */
    close: () => Promise<void>;
    /**
     * Reset the config on the ina219 to the default firmware values
     */
    reset: () => Promise<void>;
    /**
     * Get the Bus Voltage (V)
     */
    getBusVoltage_V: () => Promise<number>;
    /**
     * Get the Shunt Voltage in millivolts (mV)
     */
    getShuntVoltage_mV: () => Promise<number>;
    /**
     * Get the Current in milliamps (mA)
     *
     * As pointed out by many other packages, sometimes a sharp load will reset the
     * INA219, which will reset the cal register, meaning CURRENT and POWER will
     * not be available. To resolve this we always set the cal value even if
     * it's an unfortunate extra step
     */
    getCurrent_mA: () => Promise<number>;
    /**
     * Get the Power in milliwatts (mW)
     */
    getPower_mW: () => Promise<number>;
    /**
     * Get the Calibration Value
     */
    getCalibration: () => Promise<number>;
    /**
     * Get all of the sensor values at once
     */
    getAll: () => Promise<{
        busVoltave_V: number;
        shuntVoltage_mV: number;
        current_mA: number;
        power_mW: number;
    }>;
    /**
     * Set the Bus Voltage Range (16v or 32v)
     * @param value
     */
    setBusRNG: (value: AN_INA219_BUS_VOLTAGE_RANGE) => Promise<void>;
    /**
     * Set the Programmable Gain Amplifier
     * @param bits
     */
    setPGA: (bits: AN_INA219_PGA_BITS) => Promise<void>;
    /**
     * Set the Bus ADC
     * @param bits
     * @param sample
     */
    setBusADC: (bits: AN_INA219_ADC_BITS, sample: AN_INA219_ADC_SAMPLE) => Promise<void>;
    /**
     * Set the Shunt ADC
     * @param bits
     * @param sample
     */
    setShuntADC: (bits: AN_INA219_ADC_BITS, sample: AN_INA219_ADC_SAMPLE) => Promise<void>;
    /**
     * Set the Mode
     * @param value
     */
    setMode: (mode: AN_INA219_MODE) => Promise<void>;
    /**
     * Calibrate the readings
     * @param ina219Reading_mA the milliamp value reported by the ina219
     * @param extMeterReading_mA the milliamp value recorded by an external multimeter
     */
    linearCal: (ina219Reading_mA: number, extMeterReading_mA: number) => Promise<void>;
    /**
     * Write a register value to the INA219
     * @param register
     * @param value
     */
    private writeRegister;
    /**
     * Read and handle a register value from the INA219
     * @param register
     */
    private readInaRegister;
    /**
     * Bind internal event listeners after initialisation
     */
    private bindEvents;
    /**
     * The address used to communicate with the INA219
     */
    get address(): AN_INA219_I2C_ADDRESS;
    /**
     * Whether the ina219 has been initialised yet
     */
    get initialised(): boolean;
    /**
     * The known state of the I2C Hardware
     */
    get i2cHardwareState(): A_HARDWARE_AVAILABILITY_STATE;
    /**
     * The known state of the ina219 Hardware
     */
    get ina219HardwareState(): A_HARDWARE_AVAILABILITY_STATE;
    /**
     * Whether the I2C and the INA219 have both initialised and are working
     */
    get hardwareAvailable(): boolean;
}
