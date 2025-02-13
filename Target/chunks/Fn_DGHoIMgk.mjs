const Fn = async (Where) => {
  try {
    const _Set = JSON.parse(
      await (await import('fs/promises')).readFile(
        (await import('path')).join(
          process.cwd(),
          (await import('./Fn_DW_St3WL.mjs')).CACHE_FILE
        ),
        "utf-8"
      )
    );
    if (_Set[Where] && Date.now() - _Set[Where].TimeStamp < 30 * 60 * 1e3) {
      return _Set[Where]["Set"];
    }
  } catch (_Error) {
    console.error("Error reading cache:", _Error);
  }
  return void 0;
};

export { Fn as default };
