#include <js_native_api.h>
#include <limits.h>  // INT_MAX
#include <stdlib.h>
#include <string.h>
#include "../common.h"
#include "../entry_point.h"
#include "test_null.h"
#include "test_string_helpers.h"

static napi_value TestLatin1(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         napi_create_string_latin1,
                         actual_length);
}

static napi_value TestUtf8(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_utf8,
                         napi_create_string_utf8,
                         actual_length);
}

static napi_value TestUtf16(napi_env env, napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         napi_create_string_utf16,
                         actual_length);
}

static napi_value TestLatin1AutoLength(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         napi_create_string_latin1,
                         auto_length);
}

static napi_value TestUtf8AutoLength(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_utf8,
                         napi_create_string_utf8,
                         auto_length);
}

static napi_value TestUtf16AutoLength(napi_env env, napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         napi_create_string_utf16,
                         auto_length);
}

static napi_value TestLatin1Insufficient(napi_env env,
                                         napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  char buffer[4];
  size_t buffer_size = 4;
  size_t copied;

  NODE_API_CALL(
      env,
      napi_get_value_string_latin1(env, args[0], buffer, buffer_size, &copied));

  napi_value output;
  NODE_API_CALL(env, napi_create_string_latin1(env, buffer, copied, &output));

  return output;
}

static napi_value TestUtf8Insufficient(napi_env env, napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  char buffer[4];
  size_t buffer_size = 4;
  size_t copied;

  NODE_API_CALL(
      env,
      napi_get_value_string_utf8(env, args[0], buffer, buffer_size, &copied));

  napi_value output;
  NODE_API_CALL(env, napi_create_string_utf8(env, buffer, copied, &output));

  return output;
}

static napi_value TestUtf16Insufficient(napi_env env, napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  char16_t buffer[4];
  size_t buffer_size = 4;
  size_t copied;

  NODE_API_CALL(
      env,
      napi_get_value_string_utf16(env, args[0], buffer, buffer_size, &copied));

  napi_value output;
  NODE_API_CALL(env, napi_create_string_utf16(env, buffer, copied, &output));

  return output;
}

static napi_value Latin1Length(napi_env env, napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  size_t length;
  NODE_API_CALL(env,
                napi_get_value_string_latin1(env, args[0], NULL, 0, &length));

  napi_value output;
  NODE_API_CALL(env, napi_create_uint32(env, (uint32_t)length, &output));

  return output;
}

static napi_value Utf16Length(napi_env env, napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  size_t length;
  NODE_API_CALL(env,
                napi_get_value_string_utf16(env, args[0], NULL, 0, &length));

  napi_value output;
  NODE_API_CALL(env, napi_create_uint32(env, (uint32_t)length, &output));

  return output;
}

static napi_value Utf8Length(napi_env env, napi_callback_info info) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  size_t length;
  NODE_API_CALL(env,
                napi_get_value_string_utf8(env, args[0], NULL, 0, &length));

  napi_value output;
  NODE_API_CALL(env, napi_create_uint32(env, (uint32_t)length, &output));

  return output;
}

static napi_value TestLargeUtf8(napi_env env, napi_callback_info info) {
  napi_value output;
  if (SIZE_MAX > INT_MAX) {
    NODE_API_CALL(
        env, napi_create_string_utf8(env, "", ((size_t)INT_MAX) + 1, &output));
  } else {
    // just throw the expected error as there is nothing to test
    // in this case since we can't overflow
    NODE_API_CALL(env, napi_throw_error(env, NULL, "Invalid argument"));
  }

  return output;
}

static napi_value TestLargeLatin1(napi_env env, napi_callback_info info) {
  napi_value output;
  if (SIZE_MAX > INT_MAX) {
    NODE_API_CALL(
        env,
        napi_create_string_latin1(env, "", ((size_t)INT_MAX) + 1, &output));
  } else {
    // just throw the expected error as there is nothing to test
    // in this case since we can't overflow
    NODE_API_CALL(env, napi_throw_error(env, NULL, "Invalid argument"));
  }

  return output;
}

static napi_value TestLargeUtf16(napi_env env, napi_callback_info info) {
  napi_value output;
  if (SIZE_MAX > INT_MAX) {
    NODE_API_CALL(
        env,
        napi_create_string_utf16(
            env, ((const char16_t*)""), ((size_t)INT_MAX) + 1, &output));
  } else {
    // just throw the expected error as there is nothing to test
    // in this case since we can't overflow
    NODE_API_CALL(env, napi_throw_error(env, NULL, "Invalid argument"));
  }

  return output;
}

static napi_value TestMemoryCorruption(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  NODE_API_ASSERT(env, argc == 1, "Wrong number of arguments");

  char buf[10] = {0};
  NODE_API_CALL(env, napi_get_value_string_utf8(env, args[0], buf, 0, NULL));

  char zero[10] = {0};
  if (memcmp(buf, zero, sizeof(buf)) != 0) {
    NODE_API_CALL(env, napi_throw_error(env, NULL, "Buffer overwritten"));
  }

  return NULL;
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor properties[] = {
      DECLARE_NODE_API_PROPERTY("TestLatin1", TestLatin1),
      DECLARE_NODE_API_PROPERTY("TestLatin1AutoLength", TestLatin1AutoLength),
      DECLARE_NODE_API_PROPERTY("TestLatin1Insufficient",
                                TestLatin1Insufficient),
      DECLARE_NODE_API_PROPERTY("TestUtf8", TestUtf8),
      DECLARE_NODE_API_PROPERTY("TestUtf8AutoLength", TestUtf8AutoLength),
      DECLARE_NODE_API_PROPERTY("TestUtf8Insufficient", TestUtf8Insufficient),
      DECLARE_NODE_API_PROPERTY("TestUtf16", TestUtf16),
      DECLARE_NODE_API_PROPERTY("TestUtf16AutoLength", TestUtf16AutoLength),
      DECLARE_NODE_API_PROPERTY("TestUtf16Insufficient", TestUtf16Insufficient),
      DECLARE_NODE_API_PROPERTY("Latin1Length", Latin1Length),
      DECLARE_NODE_API_PROPERTY("Utf16Length", Utf16Length),
      DECLARE_NODE_API_PROPERTY("Utf8Length", Utf8Length),
      DECLARE_NODE_API_PROPERTY("TestLargeUtf8", TestLargeUtf8),
      DECLARE_NODE_API_PROPERTY("TestLargeLatin1", TestLargeLatin1),
      DECLARE_NODE_API_PROPERTY("TestLargeUtf16", TestLargeUtf16),
      DECLARE_NODE_API_PROPERTY("TestMemoryCorruption", TestMemoryCorruption),
  };

  init_test_null(env, exports);

  NODE_API_CALL(
      env,
      napi_define_properties(
          env, exports, sizeof(properties) / sizeof(*properties), properties));

  return exports;
}
EXTERN_C_END
