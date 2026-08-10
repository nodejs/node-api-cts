add_node_api_cts_addon(test_object test_object.c)

# node_api_create_object_with_properties is gated behind NAPI_EXPERIMENTAL, so
# it builds as a separate addon that only runtimes exporting it need to load.
add_node_api_cts_experimental_addon(test_object_create_with_properties test_object_create_with_properties.c)
