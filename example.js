import IrPhoneValidator from "./ir-phone-validate.js";

const phoneNumbers = ["+۹۸۹۱۲۳۴۵۶۷۸۹", "+989123456789", "09123456789", "۰۹۱۲۳۴۵۶۷۸۹", "invalid-phone", "12123456789"];
const validatedNumbers = phoneNumbers.map((number) => {
	const validator = new IrPhoneValidator(number);
	if (validator.validate()) {
		return validator.number;
	}
	return undefined;
});

console.log(validatedNumbers);

