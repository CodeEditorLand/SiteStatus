const CACHE_FILE = ".cache/Commit/Cache.json";
const Fn = async (Where, _Set) => {
  try {
    await (await import('fs/promises')).writeFile(
      (await import('path')).join(process.cwd(), CACHE_FILE),
      JSON.stringify(
        {
          ...await (await import('./Fn_DGHoIMgk.mjs')).default(Where),
          [Where]: { Set: _Set, TimeStamp: Date.now() }
        },
        null,
        "	"
      ),
      "utf-8"
    );
  } catch (_Error) {
    console.error("Error writing cache:", _Error);
  }
};

export { CACHE_FILE, Fn as default };
