export const INA219_PGA_BITS = {
  PGA_BITS_1: 0,
  PGA_BITS_2: 1,
  PGA_BITS_4: 2,
  PGA_BITS_8: 3,
} as const;
export type INA219_PGA_BITS = typeof INA219_PGA_BITS;
export type AN_INA219_PGA_BITS = INA219_PGA_BITS[keyof INA219_PGA_BITS];
