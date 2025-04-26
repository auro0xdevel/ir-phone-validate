import IrPhoneValidator from "./ir-phone-validate.js";

const phoneNumbers = ["+۹۸۹۱۲۳۴۵۶۷۸۹", "+989123456789", "09123456789", "۰۹۱۲۳۴۵۶۷۸۹", "invalid-phone", "12123456789"];

function validateNumbers(numbers) {
	const promises = numbers.map((num) => {
		const validator = new IrPhoneValidator(num);
		return validator.get();
	})
	return Promise.all(promises);
}


validateNumbers(phoneNumbers).then((value) => {
	console.log(value);
});

function validateNumbersWasm(numbers) {
	const promises = numbers.map((num) => {
		const validator = new IrPhoneValidator(num, false, true);
		return validator.get();
	})
	return Promise.all(promises);
}

validateNumbersWasm(phoneNumbers).then((value) => {
	console.log(value);
});

