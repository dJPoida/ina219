export const INA219_MODE = {
  POWER_DOWN: 0,
  SHUNT_VOL_TRIG: 1,
  BUS_VOL_TRIG: 2,
  SHUNT_AND_BUS_VOL_TRIG: 3,
  ADC_OFF: 4,
  SHUNT_VOL_CON: 5,
  BUS_VOL_CON: 6,
  SHUNT_AND_BUS_VOL_CON: 7,
} as const;
export type INA219_MODE = typeof INA219_MODE;
export type AN_INA219_MODE = INA219_MODE[keyof INA219_MODE];
