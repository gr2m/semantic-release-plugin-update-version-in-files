const { join } = require("path");
const debug = require("debug")("semantic-release:update-version-in-files");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  prepare(
    {
      files = ["version.js"],
      placeholder = "0.0.0-development",
      // Add fs/glob options for testing only
      fs = require("fs"),
      glob = require("glob"),
    },
    { cwd, nextRelease: { version }, lastRelease },
  ) {
    debug("config %o", { files, placeholder });
    debug("nextRelease.version %s", version);
    debug("lastRelease.version %s", lastRelease?.version);

    // Search for placeholder and, when available, the previous release version
    const searchRegex = new RegExp(
      [placeholder, lastRelease?.version]
        .filter(Boolean)
        .map(escapeRegExp)
        .join("|"),
      "g",
    );

    // Normalize files parameter and prefix with root path
    const filesNormalized = Array.isArray(files) ? files : [files];

    // Turn files into flat array of matche file paths
    const existingFilePaths = []
      .concat(...filesNormalized.map((path) => glob.sync(join(cwd, path))))
      .filter((path) => fs.statSync(path).isFile());

    debug("Existing files found: %o", existingFilePaths);

    if (existingFilePaths.length === 0) {
      throw new Error(`No file matches for ${JSON.stringify(files)}`);
    }

    existingFilePaths.forEach((path) => {
      try {
        const content = fs.readFileSync(path, "utf8");

        if (!searchRegex.test(content)) {
          debug("No match found in %s", path);
          return;
        }

        debug("Match found in %s", path);
        fs.writeFileSync(path, content.replace(searchRegex, version));
        /* c8 ignore start: fatal error, that should not happen */
      } catch (error) {
        throw new Error(`Could not update "${path}": ${error.message}`);
      }
      /* c8 ignore stop */
    });
  },
};
