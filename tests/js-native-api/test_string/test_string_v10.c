#include <js_native_api.h>
#include <stdlib.h>
#include <string.h>
#include "../common.h"
#include "../entry_point.h"
#include "test_string_helpers.h"

static void free_string(node_api_basic_env env, void* data, void* hint) {
  free(data);
}

static napi_status create_external_latin1(napi_env env,
                                          const char* string,
                                          size_t length,
                                          napi_value* result) {
  napi_status status;
  // Initialize to true, because that is the value we don't want.
  bool copied = true;
  char* string_copy;
  const size_t actual_length =
      (length == NAPI_AUTO_LENGTH ? strlen(string) : length);
  const size_t length_bytes = (actual_length + 1) * sizeof(*string_copy);
  string_copy = malloc(length_bytes);
  memcpy(string_copy, string, length_bytes);
  string_copy[actual_length] = 0;

  status = node_api_create_external_string_latin1(
      env, string_copy, length, free_string, NULL, result, &copied);
  // We do not want the string to be copied.
  if (copied) {
    return napi_generic_failure;
  }
  if (status != napi_ok) {
    free(string_copy);
    return status;
  }
  return napi_ok;
}

// strlen for char16_t. Needed in case we're copying a string of length
// NAPI_AUTO_LENGTH.
static size_t strlen16(const char16_t* string) {
  for (const char16_t* iter = string;; iter++) {
    if (*iter == 0) {
      return iter - string;
    }
  }
  // We should never get here.
  abort();
}

static napi_status create_external_utf16(napi_env env,
                                         const char16_t* string,
                                         size_t length,
                                         napi_value* result) {
  napi_status status;
  // Initialize to true, because that is the value we don't want.
  bool copied = true;
  char16_t* string_copy;
  const size_t actual_length =
      (length == NAPI_AUTO_LENGTH ? strlen16(string) : length);
  const size_t length_bytes = (actual_length + 1) * sizeof(*string_copy);
  string_copy = malloc(length_bytes);
  memcpy(string_copy, string, length_bytes);
  string_copy[actual_length] = 0;

  status = node_api_create_external_string_utf16(
      env, string_copy, length, free_string, NULL, result, &copied);
  if (status != napi_ok) {
    free(string_copy);
    return status;
  }

  return napi_ok;
}

static napi_value TestLatin1External(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         create_external_latin1,
                         actual_length);
}

static napi_value TestUtf16External(napi_env env, napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         create_external_utf16,
                         actual_length);
}

static napi_value TestLatin1ExternalAutoLength(napi_env env,
                                               napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         create_external_latin1,
                         auto_length);
}

static napi_value TestUtf16ExternalAutoLength(napi_env env,
                                              napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         create_external_utf16,
                         auto_length);
}

static napi_value TestPropertyKeyLatin1(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         node_api_create_property_key_latin1,
                         actual_length);
}

static napi_value TestPropertyKeyLatin1AutoLength(napi_env env,
                                                  napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_latin1,
                         node_api_create_property_key_latin1,
                         auto_length);
}

static napi_value TestPropertyKeyUtf8(napi_env env, napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_utf8,
                         node_api_create_property_key_utf8,
                         actual_length);
}

static napi_value TestPropertyKeyUtf8AutoLength(napi_env env,
                                                napi_callback_info info) {
  return TestOneByteImpl(env,
                         info,
                         napi_get_value_string_utf8,
                         node_api_create_property_key_utf8,
                         auto_length);
}

static napi_value TestPropertyKeyUtf16(napi_env env, napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         node_api_create_property_key_utf16,
                         actual_length);
}

static napi_value TestPropertyKeyUtf16AutoLength(napi_env env,
                                                 napi_callback_info info) {
  return TestTwoByteImpl(env,
                         info,
                         napi_get_value_string_utf16,
                         node_api_create_property_key_utf16,
                         auto_length);
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor properties[] = {
      DECLARE_NODE_API_PROPERTY("TestLatin1External", TestLatin1External),
      DECLARE_NODE_API_PROPERTY("TestLatin1ExternalAutoLength",
                                TestLatin1ExternalAutoLength),
      DECLARE_NODE_API_PROPERTY("TestUtf16External", TestUtf16External),
      DECLARE_NODE_API_PROPERTY("TestUtf16ExternalAutoLength",
                                TestUtf16ExternalAutoLength),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyLatin1", TestPropertyKeyLatin1),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyLatin1AutoLength",
                                TestPropertyKeyLatin1AutoLength),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyUtf8", TestPropertyKeyUtf8),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyUtf8AutoLength",
                                TestPropertyKeyUtf8AutoLength),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyUtf16", TestPropertyKeyUtf16),
      DECLARE_NODE_API_PROPERTY("TestPropertyKeyUtf16AutoLength",
                                TestPropertyKeyUtf16AutoLength),
  };

  NODE_API_CALL(
      env,
      napi_define_properties(
          env, exports, sizeof(properties) / sizeof(*properties), properties));

  return exports;
}
EXTERN_C_END
