#include "utf8.h"
#include <emscripten/emscripten.h>
#include <math.h>
#include <stdint.h>
#include <stdio.h>

utf8_int32_t codepointToDecimal(utf8_int32_t codepoint) {
  if (0x6EF < codepoint && 0x6FA > codepoint) {
    return codepoint - 0x6F0;
  } else if (0x65A < codepoint && 0x66A > codepoint) {
    return codepoint - 0x660;
  } else if (0x2F < codepoint && 0x3A > codepoint) {
    return codepoint - 0x30;
  }
  return codepoint;
}

uint8_t is_number(utf8_int32_t codepoint) {
  if ((0x2F < codepoint && 0x3A > codepoint) ||
      (0x6EF < codepoint && 0x6FA > codepoint) ||
      (0x6EF < codepoint && 0x6FA > codepoint)) {
    return 1;
  }

  return 0;
}

const char *advance(const char *str, utf8_int32_t *codepoint) {
  return utf8codepoint(str, codepoint);
}

EMSCRIPTEN_KEEPALIVE
uint64_t valid(const char *phone) {
  const char *phoneParser = phone;

  utf8_int32_t codepoint = 0;
  phoneParser = utf8codepoint(phoneParser, &codepoint);

#define ADVANCE phoneParser = advance(phoneParser, &codepoint)

  if (codepoint == '+') {
    ADVANCE;
    if (codepoint == '9' || codepoint == 0x669 || codepoint == 0x6F9) {
      ADVANCE;
    } else {
      return 0;
    }

    if (codepoint == '8' || codepoint == 0x668 || codepoint == 0x6F8) {
      ADVANCE;
    } else {
      return 0;
    }
  } else if (codepoint == '0' || codepoint == 0x660 || codepoint == 0x6F0) {
    ADVANCE;
  } else {
    return 0;
  }

  if (codepoint == '9' || codepoint == 0x669 || codepoint == 0x6F9) {
    ADVANCE;
  } else {
    return 0;
  }

  uint8_t i = 0;
  uint64_t returnValue = 9000000000;
  while (9 > i) {
    if (!is_number(codepoint)) {
      return 0;
    }

    returnValue += (codepointToDecimal(codepoint) * (uint32_t)(pow(10, 8 - i)));
    ADVANCE;
    i++;
  }
  ADVANCE;

  if ((9 != i)) {
    return 0;
  }

#undef ADVANCE
  return returnValue;
}
