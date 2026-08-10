// node_api_set_prototype is experimental, so this addon is built separately
// from test_general.c: a runtime that lacks the symbol can still load the
// stable test_general addon.
#include <js_native_api.h>
#include "../common.h"
#include "../entry_point.h"

static napi_value testSetPrototype(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  NODE_API_CALL(env, node_api_set_prototype(env, args[0], args[1]));

  return NULL;
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor descriptors[] = {
      DECLARE_NODE_API_PROPERTY("testSetPrototype", testSetPrototype)};

  NODE_API_CALL(env,
                napi_define_properties(env,
                                       exports,
                                       sizeof(descriptors) /
                                           sizeof(*descriptors),
                                       descriptors));

  return exports;
}
EXTERN_C_END
