import WasmIrPhoneValidator from './wasm-ir-phone-validate.js'

export default class WasmWrapperValidator {
	constructor(phone) {
		this.number = WasmIrPhoneValidator().then((Module) => {
			const len = Module.lengthBytesUTF8(phone) + 1;
			const ptr = Module._malloc(len);
			Module.stringToUTF8(phone, ptr, len);
			const result = Number(Module._valid(ptr));
			Module._free(ptr);
			return result;
		});
	}
}
