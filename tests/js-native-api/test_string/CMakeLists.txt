add_node_api_cts_addon(test_string test_string.c test_null.c)
# API like node_api_create_external_string_latin1 are available from NAPI_VERSION >= 10
target_compile_definitions(test_string PRIVATE NAPI_VERSION=10)
