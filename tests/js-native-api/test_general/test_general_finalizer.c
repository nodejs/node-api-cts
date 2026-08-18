// node_api_post_finalizer is experimental, so this addon is built separately
// from test_general.c: a runtime that lacks the symbol can still load the
// stable test_general addon.
#include <js_native_api.h>
#include "../common.h"
#include "../entry_point.h"

// Runs on the main thread after GC, where calling into JS is legal again.
static void finalizer_only_callback(napi_env env, void* data, void* hint) {
  (void)hint;

  napi_ref js_cb_ref = data;
  napi_value js_cb, undefined;
  NODE_API_CALL_RETURN_VOID(env,
                            napi_get_reference_value(env, js_cb_ref, &js_cb));
  NODE_API_CALL_RETURN_VOID(env, napi_get_undefined(env, &undefined));
  NODE_API_CALL_RETURN_VOID(
      env, napi_call_function(env, undefined, js_cb, 0, NULL, NULL));
  NODE_API_CALL_RETURN_VOID(env, napi_delete_reference(env, js_cb_ref));
}

// Runs during GC, so it may only defer the JS-touching work.
static void schedule_finalizer_only_callback(node_api_basic_env env,
                                             void* data,
                                             void* hint) {
  (void)hint;

  NODE_API_BASIC_CALL_RETURN_VOID(
      env,
      node_api_post_finalizer(
          (napi_env)env, finalizer_only_callback, data, NULL));
}

static napi_value add_finalizer_only(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value argv[2];
  napi_ref js_cb_ref;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL));
  NODE_API_CALL(env, napi_create_reference(env, argv[1], 1, &js_cb_ref));
  NODE_API_CALL(env,
                napi_add_finalizer(env,
                                   argv[0],
                                   js_cb_ref,
                                   schedule_finalizer_only_callback,
                                   NULL,
                                   NULL));
  return NULL;
}

EXTERN_C_START
napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor descriptors[] = {
      DECLARE_NODE_API_PROPERTY("addFinalizerOnly", add_finalizer_only)};

  NODE_API_CALL(env,
                napi_define_properties(env,
                                       exports,
                                       sizeof(descriptors) /
                                           sizeof(*descriptors),
                                       descriptors));

  return exports;
}
EXTERN_C_END
