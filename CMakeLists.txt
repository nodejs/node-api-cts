cmake_minimum_required(VERSION 3.15...3.31)
project(node-api-cts)

function(add_node_api_cts_addon ADDON_NAME SRC)
  add_library(${ADDON_NAME} SHARED ${SRC} ${CMAKE_JS_SRC})
  set_target_properties(${ADDON_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
  target_include_directories(${ADDON_NAME} PRIVATE ${CMAKE_JS_INC})
  target_link_libraries(${ADDON_NAME} PRIVATE ${CMAKE_JS_LIB})
  target_compile_features(${ADDON_NAME} PRIVATE cxx_std_17)
  target_compile_definitions(${ADDON_NAME} PRIVATE ADDON_NAME=${ADDON_NAME})
  set_target_properties(${ADDON_NAME} PROPERTIES LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}")
endfunction()

file(GLOB_RECURSE cmake_dirs RELATIVE ${CMAKE_SOURCE_DIR} tests/*/CMakeLists.txt)

foreach(cmake_file ${cmake_dirs})
  get_filename_component(subdir ${cmake_file} DIRECTORY)
  add_subdirectory(${subdir})
endforeach()

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
