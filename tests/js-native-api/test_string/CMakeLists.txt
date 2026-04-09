add_node_api_cts_addon(test_string test_string.c test_null.c)

# APIs like node_api_create_external_string_latin1 and
# node_api_create_property_key_utf8 are available from NAPI_VERSION >= 10
add_node_api_cts_addon(test_string_v10 test_string_v10.c)
target_compile_definitions(test_string_v10 PRIVATE NAPI_VERSION=10)
