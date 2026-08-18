add_node_api_cts_addon(test_general test_general.c)

# node_api_set_prototype is gated behind NAPI_EXPERIMENTAL, so it builds as a
# separate addon that only runtimes exporting it need to load.
add_node_api_cts_experimental_addon(test_general_set_prototype test_general_set_prototype.c)
