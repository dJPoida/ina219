export const INA219_ADC_BITS = {
  ADC_BITS_9: 0,
  ADC_BITS_10: 1,
  ADC_BITS_11: 2,
  ADC_BITS_12: 3,
} as const;
export type INA219_ADC_BITS = typeof INA219_ADC_BITS;
export type AN_INA219_ADC_BITS = INA219_ADC_BITS[keyof INA219_ADC_BITS];
