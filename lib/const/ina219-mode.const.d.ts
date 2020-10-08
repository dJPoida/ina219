export declare const INA219_MODE: {
    readonly POWER_DOWN: 0;
    readonly SHUNT_VOL_TRIG: 1;
    readonly BUS_VOL_TRIG: 2;
    readonly SHUNT_AND_BUS_VOL_TRIG: 3;
    readonly ADC_OFF: 4;
    readonly SHUNT_VOL_CON: 5;
    readonly BUS_VOL_CON: 6;
    readonly SHUNT_AND_BUS_VOL_CON: 7;
};
export declare type INA219_MODE = typeof INA219_MODE;
export declare type AN_INA219_MODE = INA219_MODE[keyof INA219_MODE];
