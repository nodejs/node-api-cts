cmake_minimum_required(VERSION 3.15...3.31)
project(node-api-cts)

set(NODE_API_HEADERS_DIR ${PROJECT_SOURCE_DIR}/include)

if(MSVC)
  # Combine layered .def files into merged .def files for import library generation
  set(DEF_DIR ${NODE_API_HEADERS_DIR}/def)
  set(DEF_HEADER "NAME NODE.EXE\nEXPORTS\n")

  file(READ ${DEF_DIR}/js_native_api.def JS_NATIVE_API_SYMBOLS)
  file(READ ${DEF_DIR}/node_api.def NODE_API_SYMBOLS)
  file(READ ${DEF_DIR}/js_native_api_experimental.def JS_NATIVE_API_EXP_SYMBOLS)
  file(READ ${DEF_DIR}/node_api_experimental.def NODE_API_EXP_SYMBOLS)

  set(NODE_API_DEF ${PROJECT_BINARY_DIR}/node_api.def)
  file(WRITE ${NODE_API_DEF} ${DEF_HEADER}${JS_NATIVE_API_SYMBOLS}${NODE_API_SYMBOLS})
  set(NODE_API_LIB ${PROJECT_BINARY_DIR}/node.lib)
  execute_process(COMMAND ${CMAKE_AR} /def:${NODE_API_DEF} /out:${NODE_API_LIB} ${CMAKE_STATIC_LINKER_FLAGS})

  set(NODE_API_EXPERIMENTAL_DEF ${PROJECT_BINARY_DIR}/node_api_experimental.def)
  file(WRITE ${NODE_API_EXPERIMENTAL_DEF} ${DEF_HEADER}${JS_NATIVE_API_SYMBOLS}${NODE_API_SYMBOLS}${JS_NATIVE_API_EXP_SYMBOLS}${NODE_API_EXP_SYMBOLS})
  set(NODE_API_EXPERIMENTAL_LIB ${PROJECT_BINARY_DIR}/node_experimental.lib)
  execute_process(COMMAND ${CMAKE_AR} /def:${NODE_API_EXPERIMENTAL_DEF} /out:${NODE_API_EXPERIMENTAL_LIB} ${CMAKE_STATIC_LINKER_FLAGS})
endif()

function(add_node_api_cts_addon ADDON_NAME)
  add_library(${ADDON_NAME} SHARED ${ARGN})
  set_target_properties(${ADDON_NAME} PROPERTIES
    PREFIX ""
    SUFFIX ".node"
    # Co-locate the output binary with the source file
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    # (for MSVC)
    RUNTIME_OUTPUT_DIRECTORY_DEBUG ${CMAKE_CURRENT_SOURCE_DIR}
    RUNTIME_OUTPUT_DIRECTORY_RELEASE ${CMAKE_CURRENT_SOURCE_DIR}
  )
  if(APPLE)
    set_target_properties(${ADDON_NAME} PROPERTIES LINK_FLAGS "-undefined dynamic_lookup")
  endif()
  target_include_directories(${ADDON_NAME} PRIVATE ${NODE_API_HEADERS_DIR})
  target_link_libraries(${ADDON_NAME} PRIVATE ${NODE_API_LIB})
  target_compile_features(${ADDON_NAME} PRIVATE cxx_std_17)
  target_compile_definitions(${ADDON_NAME} PRIVATE ADDON_NAME=${ADDON_NAME})
endfunction()

function(add_node_api_cts_experimental_addon ADDON_NAME)
  cmake_parse_arguments(PARSE_ARGV 1 ARG "" "" "SOURCES")
  add_node_api_cts_addon(${ADDON_NAME} ${ARG_SOURCES})
  target_compile_definitions(${ADDON_NAME} PRIVATE NAPI_EXPERIMENTAL)
  if(MSVC)
    target_link_libraries(${ADDON_NAME} PRIVATE ${NODE_API_EXPERIMENTAL_LIB})
  endif()
endfunction()

file(GLOB_RECURSE cmake_dirs RELATIVE ${CMAKE_SOURCE_DIR} tests/*/CMakeLists.txt)

foreach(cmake_file ${cmake_dirs})
  get_filename_component(subdir ${cmake_file} DIRECTORY)
  add_subdirectory(${subdir})
endforeach()
