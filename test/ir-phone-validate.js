import assert from "assert";
import IrPhoneValidator from '../ir-phone-validate.js';
import { console } from "inspector";


describe('Simple Number Test', () => {
	const phone = new IrPhoneValidator("09123456789");
	const phoneValue = phone.get();
	it("instance should be Promise.", () => {
		assert.equal(phoneValue instanceof Promise, true);
	});

	it("phoneValue promise resolve should be 9123456789.", (done) => {
		phoneValue.then((value) => {
			assert.equal(value, 9123456789);
			done();
		});
	});
});

const getRandomArbitrary = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}

const randomPhoneNumber = () => {
	const number = getRandomArbitrary(9000000000, 9999999999);
	let randomNumber = "";
	if (Math.random() < 0.5) {
		randomNumber += "0";
	} else {
		randomNumber += "+98";
	}
	randomNumber += String(number);
	return [number, randomNumber];
}

describe('Random number validation', () => {
	const randomNumber = randomPhoneNumber();

	it(`phone number should be ${randomNumber[0]}`, (done) => {
		const validator = new IrPhoneValidator(randomNumber[1]);
		validator.get().then((value) => {
			assert.equal(value, randomNumber[0]);
			done();
		});
	});
});

describe('Random number array validation', () => {
	const numberList = {
		raw: [],
		actual: [],
		validated: [],
	};

	for (let i = 0; i < 100; i++) {
		const p = randomPhoneNumber();
		numberList.actual.push(p[1]);
		numberList.raw.push(p[0]);
	}

	numberList.validated = numberList.actual.map((num) => {
		const validator = new IrPhoneValidator(num);
		return validator.get();
	});

	Promise.all(numberList.validated).then((values) => {
		numberList.validated = values;
		it("Should validate all numbers", (done) => {
			let allValid = true;
			for( let i = 0; i < 100; i++) {
				if( numberList.raw[i] != numberList.validated[i] ) {
					allValid = false;
					break;
				}
			}
			assert.equal(allValid, true);
			done();
		});
	});
});

describe('Random number array validation with WASM', () => {
	const numberList = {
		raw: [],
		actual: [],
		validated: [],
	};

	for (let i = 0; i < 100; i++) {
		const p = randomPhoneNumber();
		numberList.actual.push(p[1]);
		numberList.raw.push(p[0]);
	}

	numberList.validated = numberList.actual.map((num) => {
		const validator = new IrPhoneValidator(num, false, true);
		return validator.get();
	});

	Promise.all(numberList.validated).then((values) => {
		numberList.validated = values;
		it("Should validate all numbers", (done) => {
			let allValid = true;
			for( let i = 0; i < 100; i++) {
				if( numberList.raw[i] != numberList.validated[i] ) {
					allValid = false;
					assert.equal(numberList.raw[i], numberList.validated[i], `Error at index ${i}`);
					done();
					return;
				}
			}
			assert.equal(allValid, true);
			done();
		});
	});
});
