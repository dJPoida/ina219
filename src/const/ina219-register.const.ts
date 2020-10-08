export const INA219_REGISTER = {
  CONFIG: 0x00,
  SHUNTVOLTAGE: 0x01,
  BUSVOLTAGE: 0x02,
  POWER: 0x03,
  CURRENT: 0x04,
  CALIBRATION: 0x05,
} as const;
export type INA219_REGISTER = typeof INA219_REGISTER;
export type AN_INA219_REGISTER = INA219_REGISTER[keyof INA219_REGISTER];