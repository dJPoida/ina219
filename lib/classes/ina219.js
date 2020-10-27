"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ina219 = void 0;
var i2c_mock_1 = require("./i2c.mock");
var ina219_i2c_address_const_1 = require("../const/ina219-i2c-address.const");
var hardware_availability_state_const_1 = require("../const/hardware-availability-state.const");
var ina219_register_const_1 = require("../const/ina219-register.const");
var ina219_bus_voltage_range_const_1 = require("../const/ina219-bus-voltage-range.const");
var ina219_mode_const_1 = require("../const/ina219-mode.const");
var ina219_pga_bits_const_1 = require("../const/ina219-pga-bits.const");
var ina219_adc_bits_const_1 = require("../const/ina219-adc-bits.const");
var ina219_adc_sample_const_1 = require("../const/ina219-adc-sample.const");
var INA219_CONFIG_RESET = 0x8000;
/**
 * @class Ina219
 * This class is ported from DFRobot's own Python / Raspberry pi library ans *SHOULD* behave identically
 *
 * @see https://github.com/DFRobot/DFRobot_INA219/blob/master/Python/RespberryPi/DFRobot_INA219.py
 */
var Ina219 = /** @class */ (function () {
    function Ina219() {
        var _this = this;
        this._initialised = false;
        this._i2cHardwareState = hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.UNKNOWN;
        this._ina219HardwareState = hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.UNKNOWN;
        this._address = ina219_i2c_address_const_1.INA219_I2C_ADDRESS.ADDRESS_4;
        this.calValue = 4096;
        /**
         * Initialise the connection to the ina219 over i2c
         * @param busNumber (default = 1) the i2c bus number to use
         * @param address (default = INA219_I2C_ADDRESS.ADDRESS_4 (0x45)) the i2c address of the INA219
         *
         * @returns true | Error true if initialisation was successful, an Error object if not.
         */
        this.init = function (busNumber, address) {
            if (busNumber === void 0) { busNumber = 1; }
            if (address === void 0) { address = ina219_i2c_address_const_1.INA219_I2C_ADDRESS.ADDRESS_4; }
            return __awaiter(_this, void 0, void 0, function () {
                var newI2cBus, scanResult, err_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 8, , 13]);
                            return [4 /*yield*/, i2c_mock_1.openPromisified(busNumber)];
                        case 1:
                            newI2cBus = _b.sent();
                            // If false is returned from the i2c safety wrapper, don't continue the initialisation.
                            if (!newI2cBus) {
                                throw new Error('Failed to open I2C Bus. Perhaps this device is not capable? Or you may not have installed the "i2c-bus" library. Try running an "npm install" first.');
                            }
                            this.i2cBus = newI2cBus;
                            this._i2cHardwareState = hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.AVAILABLE;
                            return [4 /*yield*/, this.i2cBus.scan(address)];
                        case 2:
                            scanResult = _b.sent();
                            if (!scanResult.includes(address)) {
                                throw new Error("I2C was unable to reach the INA219 device at address '0x" + address.toString(16) + "'.");
                            }
                            // Record the config
                            this._address = address;
                            this._ina219HardwareState = hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.AVAILABLE;
                            this._initialised = true;
                            // Set the default config
                            this.calValue = 4096;
                            return [4 /*yield*/, this.setBusRNG(ina219_bus_voltage_range_const_1.INA219_BUS_VOLTAGE_RANGE.RANGE_32V)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this.setPGA(ina219_pga_bits_const_1.INA219_PGA_BITS.PGA_BITS_8)];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.setBusADC(ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12, ina219_adc_sample_const_1.INA219_ADC_SAMPLE.ADC_SAMPLE_8)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, this.setShuntADC(ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12, ina219_adc_sample_const_1.INA219_ADC_SAMPLE.ADC_SAMPLE_8)];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, this.setMode(ina219_mode_const_1.INA219_MODE.SHUNT_AND_BUS_VOL_CON)];
                        case 7:
                            _b.sent();
                            // Bind listeners for future event handling
                            this.bindEvents();
                            return [3 /*break*/, 13];
                        case 8:
                            err_1 = _b.sent();
                            if (!this.i2cBus) return [3 /*break*/, 12];
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.i2cBus.close()];
                        case 10:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            _a = _b.sent();
                            return [3 /*break*/, 12];
                        case 12:
                            this._initialised = false;
                            return [2 /*return*/, err_1];
                        case 13: return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Close the connection to the ina219 and release the I2C Resources
         */
        this.close = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.initialised) return [3 /*break*/, 6];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        // Reset the ina219
                        return [4 /*yield*/, this.reset()];
                    case 2:
                        // Reset the ina219
                        _b.sent();
                        // Close the I2C Bus
                        return [4 /*yield*/, this.i2cBus.close()];
                    case 3:
                        // Close the I2C Bus
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        this._initialised = false;
                        this._ina219HardwareState = hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.UNKNOWN;
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Reset the config on the ina219 to the default firmware values
         */
        this.reset = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, INA219_CONFIG_RESET)];
            });
        }); };
        /**
         * Get the Bus Voltage (V)
         */
        this.getBusVoltage_V = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.BUSVOLTAGE)];
                    case 1: return [2 /*return*/, ((_a.sent()) >> 1) * 0.001];
                }
            });
        }); };
        /**
         * Get the Shunt Voltage in millivolts (mV)
         */
        this.getShuntVoltage_mV = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.SHUNTVOLTAGE)];
            });
        }); };
        /**
         * Get the Current in milliamps (mA)
         */
        this.getCurrent_mA = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CURRENT)];
            });
        }); };
        /**
         * Get the Power in milliwatts (mW)
         */
        this.getPower_mW = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.POWER)];
                    case 1: return [2 /*return*/, ((_a.sent()) * 20)];
                }
            });
        }); };
        /**
         * Set the Bus Voltage Range (16v or 32v)
         * @param value
         */
        this.setBusRNG = function (value) { return __awaiter(_this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `setBusRNG` prior to initialisation.');
                        conf = 0;
                        return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CONFIG)];
                    case 1:
                        conf = _a.sent();
                        conf &= ~(0x01 << 13);
                        conf |= value << 13;
                        return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, conf)];
                }
            });
        }); };
        /**
         * Set the Programmable Gain Amplifier
         * @param bits
         */
        this.setPGA = function (bits) { return __awaiter(_this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `setPGA` prior to initialisation.');
                        conf = 0;
                        return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CONFIG)];
                    case 1:
                        conf = _a.sent();
                        conf &= ~(0x03 << 11);
                        conf |= bits << 11;
                        return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, conf)];
                }
            });
        }); };
        /**
         * Set the Bus ADC
         * @param bits
         * @param sample
         */
        this.setBusADC = function (bits, sample) { return __awaiter(_this, void 0, void 0, function () {
            var conf, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `setBusADC` prior to initialisation.');
                        conf = 0;
                        value = 0;
                        if ((bits < ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12) && (sample > ina219_adc_sample_const_1.INA219_ADC_SAMPLE.ADC_SAMPLE_1))
                            return [2 /*return*/];
                        if (bits < ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12) {
                            value = bits;
                        }
                        else {
                            value = 0x80 | sample;
                        }
                        return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CONFIG)];
                    case 1:
                        conf = _a.sent();
                        conf &= ~(0x0f << 7);
                        conf |= value << 7;
                        return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, conf)];
                }
            });
        }); };
        /**
         * Set the Shunt ADC
         * @param bits
         * @param sample
         */
        this.setShuntADC = function (bits, sample) { return __awaiter(_this, void 0, void 0, function () {
            var conf, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `setShuntADC` prior to initialisation.');
                        conf = 0;
                        value = 0;
                        if ((bits < ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12) && (sample > ina219_adc_sample_const_1.INA219_ADC_SAMPLE.ADC_SAMPLE_1))
                            return [2 /*return*/];
                        if (bits < ina219_adc_bits_const_1.INA219_ADC_BITS.ADC_BITS_12) {
                            value = bits;
                        }
                        else {
                            value = 0x80 | sample;
                        }
                        return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CONFIG)];
                    case 1:
                        conf = _a.sent();
                        conf &= ~(0x0f << 3);
                        conf |= value << 3;
                        return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, conf)];
                }
            });
        }); };
        /**
         * Set the Mode
         * @param value
         */
        this.setMode = function (mode) { return __awaiter(_this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `setMode` prior to initialisation.');
                        conf = 0;
                        return [4 /*yield*/, this.readInaRegister(ina219_register_const_1.INA219_REGISTER.CONFIG)];
                    case 1:
                        conf = _a.sent();
                        conf &= ~0x07;
                        conf |= mode;
                        return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CONFIG, conf)];
                }
            });
        }); };
        /**
         * Calibrate the readings
         * @param ina219Reading_mA the milliamp value reported by the ina219
         * @param extMeterReading_mA the milliamp value recorded by an external multimeter
         */
        this.linearCal = function (ina219Reading_mA, extMeterReading_mA) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.calValue = Math.floor((extMeterReading_mA / ina219Reading_mA) * this.calValue) & 0xFFFE;
                return [2 /*return*/, this.writeRegister(ina219_register_const_1.INA219_REGISTER.CALIBRATION, this.calValue)];
            });
        }); };
        /**
         * Write a register value to the INA219
         * @param register
         * @param value
         */
        this.writeRegister = function (register, value) { return __awaiter(_this, void 0, void 0, function () {
            var bytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `writeRegister` prior to initialisation.');
                        bytes = Buffer.alloc(2);
                        bytes[0] = (value >> 8) & 0xFF;
                        bytes[1] = value & 0xFF;
                        return [4 /*yield*/, this.i2cBus.writeI2cBlock(this.address, register, 2, bytes)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        // /**
        //  * Read a register from the I2C device
        //  * @param register 
        //  */
        // private readRegister = async (register: AN_INA219_REGISTER) => {
        //   if (!this.initialised) throw new Error('Cannot call `readRegister` prior to initialisation.');
        //   const result = Buffer.alloc(2);
        // 	await this.i2cBus.readI2cBlock(this.address, register, 2, result);
        // 	return result.readInt16BE();
        // };
        /**
         * Read and handle a register value from the INA219
         * @param register
         */
        this.readInaRegister = function (register) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialised)
                            throw new Error('Cannot call `readInaRegister` prior to initialisation.');
                        result = Buffer.alloc(2);
                        return [4 /*yield*/, this.i2cBus.readI2cBlock(this.address, register, 2, result)];
                    case 1:
                        _a.sent();
                        if (result[0] & 0x80) {
                            return [2 /*return*/, -0x10000 + ((result[0] << 8) | (result[1]))];
                        }
                        else {
                            return [2 /*return*/, ((result[0] << 8) | (result[1]))];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Bind internal event listeners after initialisation
         */
        this.bindEvents = function () {
            /**
             * Catch the termination of the application and close the i2c connection (if required)
             */
            process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.initialised && this.i2cBus)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.i2cBus.close()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        };
    }
    Object.defineProperty(Ina219.prototype, "address", {
        /**
         * The address used to communicate with the INA219
         */
        get: function () { return this._address; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ina219.prototype, "initialised", {
        /**
         * Whether the ina219 has been initialised yet
         */
        get: function () { return this._initialised; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ina219.prototype, "i2cHardwareState", {
        /**
         * The known state of the I2C Hardware
         */
        get: function () { return this._i2cHardwareState; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ina219.prototype, "ina219HardwareState", {
        /**
         * The known state of the ina219 Hardware
         */
        get: function () { return this._ina219HardwareState; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ina219.prototype, "hardwareAvailable", {
        /**
         * Whether the I2C and the INA219 have both initialised and are working
         */
        get: function () {
            return (this.i2cHardwareState === hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.AVAILABLE
                && this.ina219HardwareState === hardware_availability_state_const_1.HARDWARE_AVAILABILITY_STATE.AVAILABLE);
        },
        enumerable: false,
        configurable: true
    });
    return Ina219;
}());
exports.Ina219 = Ina219;
//# sourceMappingURL=ina219.js.map