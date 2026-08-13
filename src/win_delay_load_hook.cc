/*
 * When this file is linked to a DLL, it sets up a delay-load hook that
 * intervenes when the DLL is trying to load 'node.exe' dynamically. Instead
 * of trying to locate the .exe file it'll just return a handle to the
 * process image.
 *
 * This allows the test addons to load into any Node-API host executable,
 * regardless of its file name. Same approach as node-gyp's
 * win_delay_load_hook.cc.
 */

#ifdef _MSC_VER

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#include <windows.h>

#include <delayimp.h>
#include <string.h>

static FARPROC WINAPI load_exe_hook(unsigned int event, DelayLoadInfo* info) {
  HMODULE m;
  if (event != dliNotePreLoadLibrary)
    return NULL;

  if (_stricmp(info->szDll, "node.exe") != 0)
    return NULL;

  // Prefer libnode.dll to support a Node.js built as a shared library.
  m = GetModuleHandle(TEXT("libnode.dll"));
  if (m == NULL) m = GetModuleHandle(NULL);
  return (FARPROC) m;
}

decltype(__pfnDliNotifyHook2) __pfnDliNotifyHook2 = load_exe_hook;

#endif
