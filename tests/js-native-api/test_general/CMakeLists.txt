add_node_api_cts_addon(test_general test_general.c)

# node_api_post_finalizer is gated behind NAPI_EXPERIMENTAL, so the finalizer
# cases build as a separate addon that only runtimes exporting it need to load.
add_node_api_cts_experimental_addon(test_general_finalizer test_general_finalizer.c)
