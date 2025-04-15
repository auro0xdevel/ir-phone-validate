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
npm install @auro0xdevel/ir-phone-validate
```

And use:
```js
import IrPhoneValidator from "ir-phone-validate";

const phoneValidator = new IrPhoneValidator("+989123456789");
phoneValidator.get().then((num)=> {
    console.log(num);
})
```

Or save it and use in html:
```html
<script src="./example.js" type="module"></script>
```

## Emscripten Version
To build Emscripten version download, install and source [emsk](https://emscripten.org/docs/getting_started/downloads.html#installation-instructions-using-the-emsdk-recommended).

If you are using MacOS or any system not being able to source Emscripten library set:
`EMSCRIPTEN_ROOT` to its root.

Now create build:
```sh
emcmake cmake -B build -DEMSCRIPTEN_ROOT=$EMSCRIPTEN_ROOT
pushd build
make
make install
popd
```

And use it in project with passing use_wasm argument to `IrPhoneValidator`.

```js
import IrPhoneValidator from "ir-phone-validate";

const phoneValidator = new IrPhoneValidator("+989123456789", false, true); // third flag is use_wasm.
phoneValidator.get().then((num)=> {
    console.log(num);
})
```
