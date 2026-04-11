#ifndef TEST_JS_NATIVE_API_TEST_STRING_TEST_STRING_HELPERS_H_
#define TEST_JS_NATIVE_API_TEST_STRING_TEST_STRING_HELPERS_H_

#include <js_native_api.h>
#include "../common.h"

enum length_type { actual_length, auto_length };

// These help us factor out code that is common between the bindings.
typedef napi_status (*OneByteCreateAPI)(napi_env,
                                        const char*,
                                        size_t,
                                        napi_value*);
typedef napi_status (*OneByteGetAPI)(
    napi_env, napi_value, char*, size_t, size_t*);
typedef napi_status (*TwoByteCreateAPI)(napi_env,
                                        const char16_t*,
                                        size_t,
                                        napi_value*);
typedef napi_status (*TwoByteGetAPI)(
    napi_env, napi_value, char16_t*, size_t, size_t*);

static napi_status validate_and_retrieve_single_string_arg(
    napi_env env, napi_callback_info info, napi_value* arg) {
  size_t argc = 1;
  NODE_API_CHECK_STATUS(napi_get_cb_info(env, info, &argc, arg, NULL, NULL));

  NODE_API_ASSERT_STATUS(env, argc >= 1, "Wrong number of arguments");

  napi_valuetype valuetype;
  NODE_API_CHECK_STATUS(napi_typeof(env, *arg, &valuetype));

  NODE_API_ASSERT_STATUS(env,
                         valuetype == napi_string,
                         "Wrong type of argument. Expects a string.");

  return napi_ok;
}

// Test passing back the one-byte string we got from JS.
static napi_value TestOneByteImpl(napi_env env,
                                  napi_callback_info info,
                                  OneByteGetAPI get_api,
                                  OneByteCreateAPI create_api,
                                  enum length_type length_mode) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  char buffer[128];
  size_t buffer_size = 128;
  size_t copied;

  NODE_API_CALL(env, get_api(env, args[0], buffer, buffer_size, &copied));

  napi_value output;
  if (length_mode == auto_length) {
    copied = NAPI_AUTO_LENGTH;
  }
  NODE_API_CALL(env, create_api(env, buffer, copied, &output));

  return output;
}

// Test passing back the two-byte string we got from JS.
static napi_value TestTwoByteImpl(napi_env env,
                                  napi_callback_info info,
                                  TwoByteGetAPI get_api,
                                  TwoByteCreateAPI create_api,
                                  enum length_type length_mode) {
  napi_value args[1];
  NODE_API_CALL(env, validate_and_retrieve_single_string_arg(env, info, args));

  char16_t buffer[128];
  size_t buffer_size = 128;
  size_t copied;

  NODE_API_CALL(env, get_api(env, args[0], buffer, buffer_size, &copied));

  napi_value output;
  if (length_mode == auto_length) {
    copied = NAPI_AUTO_LENGTH;
  }
  NODE_API_CALL(env, create_api(env, buffer, copied, &output));

  return output;
}

#endif  // TEST_JS_NATIVE_API_TEST_STRING_TEST_STRING_HELPERS_H_
