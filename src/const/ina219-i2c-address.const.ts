export const INA219_I2C_ADDRESS = {
  1: 0x40,
  2: 0x41,
  3: 0x44,
  4: 0x45,
} as const;
export type INA219_I2C_ADDRESS = typeof INA219_I2C_ADDRESS;
export type AN_INA219_I2C_ADDRESS = INA219_I2C_ADDRESS[keyof INA219_I2C_ADDRESS];
