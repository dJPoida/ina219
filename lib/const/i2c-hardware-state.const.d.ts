export declare const I2C_HARDWARE_STATE: {
    readonly UNKNOWN: "UNKNOWN";
    readonly AVAILABLE: "AVAILABLE";
    readonly UNAVAILABLE: "UNAVAILABLE";
};
export declare type I2C_HARDWARE_STATE = typeof I2C_HARDWARE_STATE;
export declare type AN_I2C_HARDWARE_STATE = I2C_HARDWARE_STATE[keyof I2C_HARDWARE_STATE];
