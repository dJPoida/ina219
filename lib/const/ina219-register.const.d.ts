export declare const INA219_REGISTER: {
    readonly CONFIG: 0;
    readonly SHUNTVOLTAGE: 1;
    readonly BUSVOLTAGE: 2;
    readonly POWER: 3;
    readonly CURRENT: 4;
    readonly CALIBRATION: 5;
};
export declare type INA219_REGISTER = typeof INA219_REGISTER;
export declare type AN_INA219_REGISTER = INA219_REGISTER[keyof INA219_REGISTER];
