"use strict";
/**
 * The i2c-bus library has an auto initialisation that immediately throws on import if not
 * run on the appropriate hardware. This makes it very difficult to develop complex applications
 * in on PC or MAC where the Raspberry Pi or other ARM processor I2C hardware is not available.
 *
 * This proxy class for i2c-bus exports ensures we can still develop on other machines but know
 * when the hardware is not available.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPromisified = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var findOrFailOpenPromisified = function (busNumber, options) {
    return new Promise(function (resolve) {
        resolve(false);
    });
};
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var realOpenPromisified = require('i2c-bus').openPromisified;
    findOrFailOpenPromisified = realOpenPromisified;
}
catch (_a) {
    // This ultimately results in the result returning false.
}
exports.openPromisified = findOrFailOpenPromisified;
//# sourceMappingURL=i2c.mock.js.map