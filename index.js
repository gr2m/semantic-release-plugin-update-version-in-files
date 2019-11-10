const { join } = require("path");

module.exports = {
  prepare(
    {
      files = ["version.js"],
      placeholder = "0.0.0-development",
      // Add fs/glob options for testing only
      fs = require("fs"),
      glob = require("glob")
    },
    { cwd, nextRelease: { version } }
  ) {
    // Turn placeholder string into regex
    const searchRegex = new RegExp(placeholder, "g");

    // Normalize files parameter and prefix with root path
    const filesNormalized = Array.isArray(files) ? files : [files];

    // Turn files into flat array of matche file paths
    const filePaths = []
      .concat(...filesNormalized.map(path => glob.sync(join(cwd, path))))
      .filter(path => fs.statSync(path).isFile());

    if (filePaths.length === 0) {
      throw new Error(`No file matches for ${JSON.stringify(files)}`);
    }

    filePaths.forEach(path => {
      try {
        const content = fs.readFileSync(path, "utf8");

        if (!searchRegex.test(content)) {
          return;
        }

        fs.writeFileSync(path, content.replace(searchRegex, version));
      } catch (error) {
        /* istanbul ignore next: fatal error, that should not happen */
        throw new Error(`Could not update "${path}": ${error.message}`);
      }
    });
  }
};
