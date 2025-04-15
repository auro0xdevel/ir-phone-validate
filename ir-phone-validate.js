import WasmWrapperValidator from "./wasm-wrapper-validator.js";

const IR_NUMBER_REGEX = new RegExp("(^(\\+98|0)9[0-9]{9}$)|(^(\\+\\u{669}\\u{668}|\\u{660})\\u{669}[\\u{660}-\\u{669}]{9}$)|^(\\+\\u{6F9}\\u{6F8}|\\u{6F0})\\u{6F9}[\\u{6F0}-\\u{6F9}]{9}$", "u")

const assert = (condition, message) => {
	if (!condition) {
		throw message || "Phone Validation Failed";
	}
}

const NumberUtils = {
	convert_a_to_d: (value) => {
		const arr = value.split("").map((i) => {
			return i.charCodeAt(0);
		});

		return String.fromCharCode(...arr.map((i) => {
			if (0x6EF < i && 0x6FA > i) {
				return i - 0x6C0;
			}
			return i;
		}));
	},
	convert_d_to_a: (value) => {
		const arr = value.split("").map((i) => {
			return i.charCodeAt(0);
		});

		return String.fromCharCode(...arr.map((i) => {
			if (0x2F < i && 0x3A > i) {
				return i + 0x6C0;
			}
			return i;
		}));
	},
	is_number: (value, index) => {
		const char = value.charCodeAt(index);
		if ((0x2F < char && 0x3A > char) || (0x6EF < char && 0x6FA > char) || (0x6EF < char && 0x6FA > char)) {
			return true;
		}

		return false;
	},
}

export default class IrPhoneValidator {
	constructor(value, use_regex, use_wasm) {
		assert(typeof value == "string", "Phone number should be string.");
		this.value = value;
		this.number = undefined;
		this.wasm_wrapper = undefined;
		if ((undefined !== use_wasm) && (typeof use_wasm == "boolean")) {
			try {
				new WasmWrapperValidator("")
				this.use_wasm = use_wasm;
			} catch {
				this.use_wasm = false;
			}
		} else {
			this.use_wasm = false;
		}
		if ((undefined !== use_regex) && (typeof use_regex == "boolean")) {
			this.use_regex = this.use_wasm ? false : use_regex;
		} else {
			this.use_regex = false;
		}
	}

	get() {
		let index = 0;
		let char = this.value.charAt(index);
		const advance = () => {
			index++;
			char = this.value.charAt(index);
		}

		if (this.use_wasm) {
			return new WasmWrapperValidator(this.value).number;
		} else if (this.use_regex) {
			const match = IR_NUMBER_REGEX.test(this.value);
			if (!match) {
				return Promise.resolve(0);
			}

			return Promise.resolve(true);
		}

		if (char == '+') {
			advance();
			if (char == '9' || char == '\u0669' || char == '\u06F9') {
				advance();
			} else {
				return Promise.resolve(0);
			}

			if (char == '8' || char == '\u0668' || char == '\u06F8') {
				advance();
			} else {
				return Promise.resolve(0);
			}
		} else if (char == "0" || char == '\u0660' || char == '\u06F0') {
			advance();
		} else {
			return Promise.resolve(0);
		}

		if (char == '9' || char == '\u0669' || char == '\u06F9') {
			advance();
		} else {
			return Promise.resolve(0);
		}

		const startIndex = index;
		const v = ['9'];
		while (9 > (index - startIndex)) {
			if (!NumberUtils.is_number(this.value, index)) {
				return Promise.resolve(0);
			}
			v.push(this.value.charAt(index));
			index++;
		}

		return Promise.resolve(parseInt(NumberUtils.convert_a_to_d(v.join(""))));
	}
}
