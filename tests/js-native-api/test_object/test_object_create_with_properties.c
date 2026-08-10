// node_api_create_object_with_properties is experimental, so this addon is
// built separately from test_object.c: a runtime that lacks the symbol can
// still load the stable test_object addon.
#include <js_native_api.h>
#include "../common.h"
#include "../entry_point.h"

static napi_value TestCreateObjectWithProperties(napi_env env,
                                                 napi_callback_info info) {
  napi_value names[3];
  napi_value values[3];
  napi_value result;

  NODE_API_CALL(
      env, napi_create_string_utf8(env, "name", NAPI_AUTO_LENGTH, &names[0]));
  NODE_API_CALL(
      env, napi_create_string_utf8(env, "Foo", NAPI_AUTO_LENGTH, &values[0]));

  NODE_API_CALL(
      env, napi_create_string_utf8(env, "age", NAPI_AUTO_LENGTH, &names[1]));
  NODE_API_CALL(env, napi_create_int32(env, 42, &values[1]));

  NODE_API_CALL(
      env, napi_create_string_utf8(env, "active", NAPI_AUTO_LENGTH, &names[2]));
  NODE_API_CALL(env, napi_get_boolean(env, true, &values[2]));

  napi_value null_prototype;
  NODE_API_CALL(env, napi_get_null(env, &null_prototype));
  NODE_API_CALL(env,
                node_api_create_object_with_properties(
                    env, null_prototype, names, values, 3, &result));

  return result;
}

static napi_value TestCreateObjectWithPropertiesEmpty(napi_env env,
                                                      napi_callback_info info) {
  napi_value result;

  NODE_API_CALL(
      env,
      node_api_create_object_with_properties(env, NULL, NULL, NULL, 0, &result));

  return result;
}

static napi_value TestCreateObjectWithCustomPrototype(napi_env env,
                                                      napi_callback_info info) {
  napi_value prototype;
  napi_value method_name;
  napi_value method_func;
  napi_value names[1];
  napi_value values[1];
  napi_value result;

  NODE_API_CALL(env, napi_create_object(env, &prototype));
  NODE_API_CALL(
      env,
      napi_create_string_utf8(env, "test", NAPI_AUTO_LENGTH, &method_name));
  NODE_API_CALL(env,
                napi_create_function(env,
                                     "test",
                                     NAPI_AUTO_LENGTH,
                                     TestCreateObjectWithProperties,
                                     NULL,
                                     &method_func));
  NODE_API_CALL(env, napi_set_property(env, prototype, method_name, method_func));

  NODE_API_CALL(
      env, napi_create_string_utf8(env, "value", NAPI_AUTO_LENGTH, &names[0]));
  NODE_API_CALL(env, napi_create_int32(env, 42, &values[0]));

  NODE_API_CALL(env,
                node_api_create_object_with_properties(
                    env, prototype, names, values, 1, &result));

  return result;
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor descriptors[] = {
      DECLARE_NODE_API_PROPERTY("TestCreateObjectWithProperties",
                                TestCreateObjectWithProperties),
      DECLARE_NODE_API_PROPERTY("TestCreateObjectWithPropertiesEmpty",
                                TestCreateObjectWithPropertiesEmpty),
      DECLARE_NODE_API_PROPERTY("TestCreateObjectWithCustomPrototype",
                                TestCreateObjectWithCustomPrototype),
  };

  NODE_API_CALL(env,
                napi_define_properties(env,
                                       exports,
                                       sizeof(descriptors) /
                                           sizeof(*descriptors),
                                       descriptors));

  return exports;
}
EXTERN_C_END
