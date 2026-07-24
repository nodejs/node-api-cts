# The reference suite already defines a CMake target named "test_finalizer"
# (tests/js-native-api/test_reference/test_finalizer.c), and target names must
# be globally unique. Use a distinct target name here but keep the output binary
# named test_finalizer.node so loadAddon('test_finalizer') resolves in this dir.
add_node_api_cts_experimental_addon(test_finalizer_standalone test_finalizer.c)
set_target_properties(test_finalizer_standalone PROPERTIES OUTPUT_NAME test_finalizer)
