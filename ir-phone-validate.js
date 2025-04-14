const IR_NUMBER_REGEX = new RegExp("(^(\\+98|0)9[0-9]{9}$)|(^(\\+\\u{669}\\u{668}|\\u{660})\\u{669}[\\u{660}-\\u{669}]{9}$)|^(\\+\\u{6F9}\\u{6F8}|\\u{6F0})\\u{6F9}[\\u{6F0}-\\u{6F9}]{9}$", "u")

const assert = (condition, message) => {
	if (!condition) {
		throw message || "Phone Validation Failed";
	}
}

const NumberUtils = {
	convert_a_to_d: (value)=> {
		const arr = value.split("").map( (i) => {
			return i.charCodeAt(0);
		});

		return String.fromCharCode(...arr.map( (i) => {
			if( 0x6EF < i && 0x6FA > i ) {
				return i - 0x6C0;
			}
			return i;
		}));
	},
	convert_d_to_a: (value)=> {
		const arr = value.split("").map( (i) => {
			return i.charCodeAt(0);
		});

		return String.fromCharCode(...arr.map( (i) => {
			if( 0x2F < i && 0x3A > i ) {
				return i + 0x6C0;
			}
			return i;
		}));
	},
	is_number: (value, index) => {
		const char = value.charCodeAt(index);
		if( (0x2F < char && 0x3A > char) || (0x6EF < char && 0x6FA > char) || (0x6EF < char && 0x6FA > char) ) {
			return true;
		}

		return false;
	},
}

export default class IrPhoneValidator {
	constructor(value, use_regex) {
		assert( typeof value == "string", "Phone number should be string." );
		this.value = value;
		this.number = 0;
		if( (undefined !== use_regex) && (typeof use_regex == "boolean") ) {
			this.use_regex = use_regex;
		} else {
			this.use_regex = false;
		}
	}

	validate() {
		let index = 0;
		let char = this.value.charAt(index);
		const advance = ()=> {
			index++;
			char = this.value.charAt(index);
		}

		if( char == '+' ) {
			advance();
			if( char == '9' || char == '\u0669' || char == '\u06F9' ) {
				advance();
			} else {
				return false;
			}

			if( char == '8' || char == '\u0668' || char == '\u06F8') {
				advance();
			} else {
				return false;
			}
		} else if ( char == "0" || char == '\u0660' || char == '\u06F0' ) {
			advance();
		} else {
			return false;
		}

		if( char == '9' || char == '\u0669' || char == '\u06F9' ) {
			advance();
		} else {
			return false;
		}

		const startIndex = index;
		const v = ['9'];
		while( 9 > (index - startIndex) ) {
			if( !NumberUtils.is_number(this.value, index) ) {
				return false;
			}
			v.push(this.value.charAt(index));
			index++;
		}

		this.number = parseInt( NumberUtils.convert_a_to_d(v.join("")) );
		return true;
	}
}
