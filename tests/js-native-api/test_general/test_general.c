#include <js_native_api.h>
#include <stdint.h>
#include "../common.h"
#include "../entry_point.h"

static napi_value testStrictEquals(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  bool bool_result;
  napi_value result;
  NODE_API_CALL(env, napi_strict_equals(env, args[0], args[1], &bool_result));
  NODE_API_CALL(env, napi_get_boolean(env, bool_result, &result));

  return result;
}

static napi_value testGetPrototype(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  napi_value result;
  NODE_API_CALL(env, napi_get_prototype(env, args[0], &result));

  return result;
}

static napi_value testGetVersion(napi_env env, napi_callback_info info) {
  uint32_t version;
  napi_value result;
  NODE_API_CALL(env, napi_get_version(env, &version));
  NODE_API_CALL(env, napi_create_uint32(env, version, &result));
  return result;
}

static napi_value doInstanceOf(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  bool is_instance;
  NODE_API_CALL(env, napi_instanceof(env, args[0], args[1], &is_instance));

  napi_value result;
  NODE_API_CALL(env, napi_get_boolean(env, is_instance, &result));

  return result;
}

static napi_value getNull(napi_env env, napi_callback_info info) {
  napi_value result;
  NODE_API_CALL(env, napi_get_null(env, &result));
  return result;
}

static napi_value getUndefined(napi_env env, napi_callback_info info) {
  napi_value result;
  NODE_API_CALL(env, napi_get_undefined(env, &result));
  return result;
}

static napi_value createNapiError(napi_env env, napi_callback_info info) {
  napi_value value;
  NODE_API_CALL(env, napi_create_string_utf8(env, "xyz", 3, &value));

  double double_value;
  napi_status status = napi_get_value_double(env, value, &double_value);

  NODE_API_ASSERT(env, status != napi_ok, "Failed to produce error condition");

  const napi_extended_error_info* error_info = 0;
  NODE_API_CALL(env, napi_get_last_error_info(env, &error_info));

  NODE_API_ASSERT(env,
                  error_info->error_code == status,
                  "Last error info code should match last status");
  NODE_API_ASSERT(env,
                  error_info->error_message,
                  "Last error info message should not be null");

  return NULL;
}

static napi_value testNapiErrorCleanup(napi_env env, napi_callback_info info) {
  const napi_extended_error_info* error_info = 0;
  NODE_API_CALL(env, napi_get_last_error_info(env, &error_info));

  napi_value result;
  bool is_ok = error_info->error_code == napi_ok;
  NODE_API_CALL(env, napi_get_boolean(env, is_ok, &result));

  return result;
}

static napi_value testNapiTypeof(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  napi_valuetype argument_type;
  NODE_API_CALL(env, napi_typeof(env, args[0], &argument_type));

  const char* name = NULL;
  switch (argument_type) {
    case napi_number: name = "number"; break;
    case napi_string: name = "string"; break;
    case napi_function: name = "function"; break;
    case napi_object: name = "object"; break;
    case napi_boolean: name = "boolean"; break;
    case napi_undefined: name = "undefined"; break;
    case napi_symbol: name = "symbol"; break;
    case napi_null: name = "null"; break;
    default: return NULL;
  }

  napi_value result;
  NODE_API_CALL(
      env, napi_create_string_utf8(env, name, NAPI_AUTO_LENGTH, &result));
  return result;
}

static bool deref_item_called = false;

static void deref_item(node_api_basic_env env, void* data, void* hint) {
  (void)hint;

  NODE_API_BASIC_ASSERT_RETURN_VOID(
      data == &deref_item_called,
      "Finalize callback was called with the correct pointer");

  deref_item_called = true;
}

static napi_value deref_item_was_called(napi_env env, napi_callback_info info) {
  napi_value it_was_called;

  NODE_API_CALL(env, napi_get_boolean(env, deref_item_called, &it_was_called));

  return it_was_called;
}

static napi_value wrap_first_arg(napi_env env,
                                 napi_callback_info info,
                                 node_api_basic_finalize finalizer,
                                 void* data) {
  size_t argc = 1;
  napi_value to_wrap;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, &to_wrap, NULL, NULL));
  NODE_API_CALL(env, napi_wrap(env, to_wrap, data, finalizer, NULL, NULL));

  return to_wrap;
}

static napi_value wrap(napi_env env, napi_callback_info info) {
  deref_item_called = false;
  return wrap_first_arg(env, info, deref_item, &deref_item_called);
}

static napi_value remove_wrap(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value wrapped;
  void* data;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, &wrapped, NULL, NULL));
  NODE_API_CALL(env, napi_remove_wrap(env, wrapped, &data));

  return NULL;
}

static bool finalize_called = false;

static void test_finalize(node_api_basic_env env, void* data, void* hint) {
  (void)env;
  (void)data;
  (void)hint;

  finalize_called = true;
}

static napi_value test_finalize_wrap(napi_env env, napi_callback_info info) {
  return wrap_first_arg(env, info, test_finalize, NULL);
}

static napi_value finalize_was_called(napi_env env, napi_callback_info info) {
  napi_value it_was_called;

  NODE_API_CALL(env, napi_get_boolean(env, finalize_called, &it_was_called));

  return it_was_called;
}

static napi_value testAdjustExternalMemory(napi_env env,
                                           napi_callback_info info) {
  napi_value result;
  int64_t adjustedValue;

  NODE_API_CALL(env, napi_adjust_external_memory(env, 1, &adjustedValue));
  NODE_API_CALL(env, napi_create_double(env, (double)adjustedValue, &result));

  return result;
}

static napi_value testNapiRun(napi_env env, napi_callback_info info) {
  napi_value script, result;
  size_t argc = 1;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, &script, NULL, NULL));
  NODE_API_CALL(env, napi_run_script(env, script, &result));

  return result;
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor descriptors[] = {
      DECLARE_NODE_API_PROPERTY("testStrictEquals", testStrictEquals),
      DECLARE_NODE_API_PROPERTY("testGetPrototype", testGetPrototype),
      DECLARE_NODE_API_PROPERTY("testGetVersion", testGetVersion),
      DECLARE_NODE_API_PROPERTY("testNapiRun", testNapiRun),
      DECLARE_NODE_API_PROPERTY("doInstanceOf", doInstanceOf),
      DECLARE_NODE_API_PROPERTY("getUndefined", getUndefined),
      DECLARE_NODE_API_PROPERTY("getNull", getNull),
      DECLARE_NODE_API_PROPERTY("createNapiError", createNapiError),
      DECLARE_NODE_API_PROPERTY("testNapiErrorCleanup", testNapiErrorCleanup),
      DECLARE_NODE_API_PROPERTY("testNapiTypeof", testNapiTypeof),
      DECLARE_NODE_API_PROPERTY("wrap", wrap),
      DECLARE_NODE_API_PROPERTY("removeWrap", remove_wrap),
      DECLARE_NODE_API_PROPERTY("testFinalizeWrap", test_finalize_wrap),
      DECLARE_NODE_API_PROPERTY("finalizeWasCalled", finalize_was_called),
      DECLARE_NODE_API_PROPERTY("derefItemWasCalled", deref_item_was_called),
      DECLARE_NODE_API_PROPERTY("testAdjustExternalMemory",
                                testAdjustExternalMemory)};

  NODE_API_CALL(
      env,
      napi_define_properties(
          env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));

  return exports;
}
EXTERN_C_END
