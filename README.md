# IrPhoneValidator
----
A library for validating Iran phone numbers, supports both NodeJS and Web Modules.  
This library parses phone number either through Regular Expressions (slower) or through
Statemachine (faster) and generates an `integer` number where `+989123456789`
will become `9123456789`.
This library also supports parsing arabic-indic unicode and arabic unicode phone numbers.
A number such as `+۹۸۹۱۲۳۴۵۶۷۸۹` is also parsed into integer.

## Using
----
To use with NodeJS either copy the source `ir-phone-validate.js` into your project or through `npm`:
```sh
npm i --save ir-phone-validate
```

And use:
```js
import IrPhoneValidator from "ir-phone-validate";

const phoneValidator = new IrPhoneValidator("+989123456789");
if( phoneValidator.validate() ) {
    console.log(phoneValidator.number);
}
```

Or save it and use in html:
```html
<script src="./example.js" type="module"></script>
```
