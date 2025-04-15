cmake_minimum_required(VERSION 3.13)
project(ir-phone-validator C)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(EMSCRIPTEN_ROOT $ENV{EMSCRIPTEN_ROOT})
set(CMAKE_C_COMPILER "${EMSCRIPTEN_ROOT}/bin/emcc")

add_executable(ir-phone-validator ir-phone-validate.c)
set_target_properties(ir-phone-validator PROPERTIES COMPILE_FLAGS "-Os -s SIDE_MODULE=1 ")
set_target_properties(ir-phone-validator PROPERTIES LINK_FLAGS
	"-Os -s EXPORTED_FUNCTIONS=['_valid','_malloc','_free'] -s MODULARIZE=1 -s EXPORT_NAME='WasmIrPhoneValidator' -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','lengthBytesUTF8'] -s EXPORT_ES6=1 --no-entry")
set_target_properties(ir-phone-validator PROPERTIES OUTPUT_NAME "wasm-ir-phone-validate")

install(TARGETS ir-phone-validator DESTINATION ${PROJECT_SOURCE_DIR})
install(FILES ${PROJECT_BINARY_DIR}/wasm-ir-phone-validate.wasm DESTINATION ${PROJECT_SOURCE_DIR})
