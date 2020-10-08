import { AN_INA219_I2C_ADDRESS } from '../const/ina219-i2c-address.const';
import { AN_I2C_HARDWARE_STATE } from '../const/i2c-hardware-state.const';
export declare class Ina219 {
    private _initialised;
    private _i2cHardwareState;
    private i2cBus;
    private _address;
    /**
     * Initialise the connection to the ina219 over i2c
     * @param busNumber (default = 1) the i2c bus number to use
     * @param address (default = INA219_I2C_ADDRESS.4 (0x45)) the i2c address of the INA219
     *
     * @returns true | Error true if initialisation was successful, string .
     */
    init: (busNumber?: number, address?: AN_INA219_I2C_ADDRESS) => Promise<true | Error>;
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
    get i2cHardwareState(): AN_I2C_HARDWARE_STATE;
    /**
     * Whether the I2C and the INA219 have both initialised and are working
     */
    get hardwareAvailable(): boolean;
}
