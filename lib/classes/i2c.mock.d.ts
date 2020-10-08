/**
 * The i2c-bus library has an auto initialisation that immediately throws on import if not
 * run on the appropriate hardware. This makes it very difficult to develop complex applications
 * in on PC or MAC where the Raspberry Pi or other ARM processor I2C hardware is not available.
 *
 * This proxy class for i2c-bus exports ensures we can still develop on other machines but know
 * when the hardware is not available.
 */
import { PromisifiedBus, OpenOptions } from 'i2c-bus';
export declare const openPromisified: (busNumber: number, options?: OpenOptions | undefined) => Promise<PromisifiedBus | false>;
