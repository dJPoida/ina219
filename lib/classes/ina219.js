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
var i2c_hardware_state_const_1 = require("../const/i2c-hardware-state.const");
/*
const _INA219_READ = 0x01;

const INA219_I2C_ADDRESS1 = 0x40;
const INA219_I2C_ADDRESS2 = 0x41;
const INA219_I2C_ADDRESS3 = 0x44;
const INA219_I2C_ADDRESS4 = 0x45;

const INA219_CONFIG_RESET = 0x8000;
const _INA219_REG_CONFIG = 0x00;

const bus_vol_range_16V = 0;
const bus_vol_range_32V = 1;

const PGA_bits_1 = 0;
const PGA_bits_2 = 1;
const PGA_bits_4 = 2;
const PGA_bits_8 = 3;
    
const adc_bits_9 = 0;
const adc_bits_10 = 1;
const adc_bits_11 = 2;
const adc_bits_12 = 3;
    
const adc_sample_1 = 0;
const adc_sample_2 = 1;
const adc_sample_4 = 2;
const adc_sample_8 = 3;
const adc_sample_16 = 4;
const adc_sample_32 = 5;
const adc_sample_64 = 6;
const adc_sample_128 = 7;
    
const power_down = 0;
const shunt_vol_trig = 1;
const bus_vol_trig = 2;
const shunt_and_bus_vol_trig = 3;
const adc_off = 4;
const shunt_vol_con = 5;
const bus_vol_con = 6;
const shunt_and_bus_vol_con = 7;

const _INA219_REG_SHUNTVOLTAGE = 0x01;

const _INA219_REG_BUSVOLTAGE = 0x02;

const _INA219_REG_POWER = 0x03;

const _INA219_REG_CURRENT = 0x04;

const _INA219_REG_CALIBRATION = 0x05;
*/
// const begin = (self) => {
//   if (!self.scan()) return false;
//   self.cal_value = 4096;
//   self.set_bus_RNG(self.bus_vol_range_32V);
//   self.set_PGA(self.PGA_bits_8);
//   self.set_bus_ADC(self.adc_bits_12, self.adc_sample_8);
//   self.set_shunt_ADC(self.adc_bits_12, self.adc_sample_8);
//   self.set_mode(self.shunt_and_bus_vol_con);
//   return true;
// }
// const linear_cal = (self, ina219_reading_mA, ext_meter_reading_mA) => {
//   ina219_reading_mA = float(ina219_reading_mA);
//   ext_meter_reading_mA = float(ext_meter_reading_mA);
//   self.cal_value = int((ext_meter_reading_mA / ina219_reading_mA) * self.cal_value) & 0xFFFE;
//   self._write_register(self._INA219_REG_CALIBRATION, self.cal_value);
// }
//   def reset(self):
//         self._write_register(self._INA219_REG_CONFIG, self._INA219_CONFIG_RESET)
//     def _write_register(self, register, value):
//         self.i2cbus.write_i2c_block_data(self.i2c_addr, register, [value >> 8, value & 0xff])
//     def _read_register(self, register):
//         return self.i2cbus.read_i2c_block_data(self.i2c_addr, register) 
//     def get_bus_voltage_V(self):
//         return float(self.read_ina_reg(self._INA219_REG_BUSVOLTAGE) >> 1) * 0.001
//     def get_shunt_voltage_mV(self):
//         return float(self.read_ina_reg(self._INA219_REG_SHUNTVOLTAGE))
//     def get_current_mA(self):
//         return float(self.read_ina_reg(self._INA219_REG_CURRENT))
//     def get_power_mW(self):
//         return float(self.read_ina_reg(self._INA219_REG_POWER)) * 20
//     def set_bus_RNG(self, value):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x01 << 13)
//         conf |= value << 13
//         self._write_register(self._INA219_REG_CONFIG, conf)
//     def set_PGA(self, bits):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x03 << 11)
//         conf |= bits << 11
//         self._write_register(self._INA219_REG_CONFIG, conf)
//     def set_bus_ADC(self, bits, sample):
//         conf = 0
//         value = 0
//         if(bits < adc_bits_12 and sample > adc_sample_1):
//             return
//         if(bits < adc_bits_12):
//             value = bits
//         else:
//             value = 0x80 | sample
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x0f << 7)
//         conf |= value << 7
//         self._write_register(self._INA219_REG_CONFIG, conf)
//     def set_shunt_ADC(self, bits, sample):
//         conf = 0
//         value = 0
//         if(bits < adc_bits_12 and sample > adc_sample_1):
//             return
//         if(bits < adc_bits_12):
//             value = bits
//         else:
//             value = 0x80 | sample
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~(0x0f << 3)
//         conf |= value << 3
//         self._write_register(self._INA219_REG_CONFIG, conf)
//     def set_mode(self, mode):
//         conf = 0
//         conf = self.read_ina_reg(self._INA219_REG_CONFIG)
//         conf &= ~0x07
//         conf |= mode
//         self._write_register(self._INA219_REG_CONFIG, conf)
//     def read_ina_reg(self, reg):
//         buf = []
//         buf = self._read_register(reg)
//         if (buf[0] & 0x80):
//             return - 0x10000 + ((buf[0] << 8) | (buf[1]))
//         else:
//             return (buf[0] << 8) | (buf[1])
var Ina219 = /** @class */ (function () {
    function Ina219() {
        var _this = this;
        this._initialised = false;
        this._i2cHardwareState = i2c_hardware_state_const_1.I2C_HARDWARE_STATE.UNKNOWN;
        this._address = ina219_i2c_address_const_1.INA219_I2C_ADDRESS[4];
        /**
         * Initialise the connection to the ina219 over i2c
         * @param busNumber (default = 1) the i2c bus number to use
         * @param address (default = INA219_I2C_ADDRESS.4 (0x45)) the i2c address of the INA219
         *
         * @returns true | Error true if initialisation was successful, string .
         */
        this.init = function (busNumber, address) {
            if (busNumber === void 0) { busNumber = 1; }
            if (address === void 0) { address = ina219_i2c_address_const_1.INA219_I2C_ADDRESS[4]; }
            return __awaiter(_this, void 0, void 0, function () {
                var newI2cBus, scanResult, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, i2c_mock_1.openPromisified(busNumber)];
                        case 1:
                            newI2cBus = _a.sent();
                            // If false is returned from the i2c safety wrapper, don't continue the initialisation.
                            if (!newI2cBus) {
                                throw new Error('Failed to open I2C Bus. Perhaps this device is not capable? Or you may not have installed the "i2c-bus" library. Try running an "npm install" first.');
                            }
                            this.i2cBus = newI2cBus;
                            this._address = address;
                            this._i2cHardwareState = i2c_hardware_state_const_1.I2C_HARDWARE_STATE.AVAILABLE;
                            this._initialised = true;
                            try {
                                scanResult = this.i2cBus.scan(address);
                                console.log('scanResult', scanResult);
                            }
                            catch (err) {
                                throw new Error("I2C was unable to reach the INA219 device at address '" + address + "'.");
                            }
                            //   self.i2c_addr = addr
                            console.log(address);
                            this.bindEvents();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            this._i2cHardwareState = i2c_hardware_state_const_1.I2C_HARDWARE_STATE.UNAVAILABLE;
                            this._initialised = false;
                            return [2 /*return*/, err_1];
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
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
                            if (!(this.i2cBus && this.initialised)) return [3 /*break*/, 2];
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
    Object.defineProperty(Ina219.prototype, "hardwareAvailable", {
        /**
         * Whether the I2C and the INA219 have both initialised and are working
         */
        get: function () { return this._i2cHardwareState === i2c_hardware_state_const_1.I2C_HARDWARE_STATE.AVAILABLE; },
        enumerable: false,
        configurable: true
    });
    return Ina219;
}());
exports.Ina219 = Ina219;
//# sourceMappingURL=ina219.js.map