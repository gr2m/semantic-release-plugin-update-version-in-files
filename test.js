const MemoryFileSystem = require("memory-fs");
const { test } = require("tap");
const { prepare } = require(".");

test("defaults", (t) => {
  const files = {
    "version.js": Buffer.from("module.exports = '0.0.0-development'"),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      fs,
      glob: {
        sync() {
          return ["/version.js"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  const newContent = fs.readFileSync("/version.js", "utf8");
  t.match(newContent, /1.2.3/, "Version updated in /version.js");
  t.end();
});

test("no file matches", (t) => {
  try {
    prepare(
      {
        files: ["DOES_NOT_EXIST.nope"],
      },
      {
        cwd: "",
        nextRelease: {
          version: "1.2.3",
        },
        logger: {
          error: (message) => t.fail(message),
          log() {},
          success() {},
        },
      }
    );
    t.fail("Should throw error");
  } catch (error) {
    t.is(error.message, 'No file matches for ["DOES_NOT_EXIST.nope"]');
  }
  t.end();
});

test("files: 'README.md'", (t) => {
  const files = {
    "README.md": Buffer.from(`# my-project

current version: 0.0.0-development`),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      files: "README.md",
      fs,
      glob: {
        sync() {
          return ["/README.md"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  const newContent = fs.readFileSync("/README.md", "utf8");
  t.match(newContent, /1.2.3/, "Version updated in README.md");
  t.end();
});

test('multiple files: ["README.md", "my-app.js"]', (t) => {
  const files = {
    "README.md": Buffer.from(`# my-project

current version: 0.0.0-development`),
    "my-app.js": Buffer.from(`module.exports.version = "0.0.0-development";`),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      files: "README.md",
      fs,
      glob: {
        sync() {
          return ["/README.md", "/my-app.js"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  t.match(
    fs.readFileSync("/README.md", "utf8"),
    /1.2.3/,
    "Version updated in README.md"
  );
  t.match(
    fs.readFileSync("/my-app.js", "utf8"),
    /1.2.3/,
    "Version updated in my-app.js"
  );
  t.end();
});

test("version not found", (t) => {
  const files = {
    "foo.js": Buffer.from(`module.exports = require("./bar");`),
    "bar.js": Buffer.from(`module.exports.version = "0.0.0-development";`),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      files: "*",
      fs,
      glob: {
        sync() {
          return ["/foo.js", "/bar.js"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  t.match(
    fs.readFileSync("/bar.js", "utf8"),
    /1.2.3/,
    "Version updated in bar.js"
  );
  t.end();
});

test("multiple matches in same file", (t) => {
  const files = {
    "app.js": Buffer.from(`module.exports.version = "0.0.0-development";

module.exports.logVersion = () => console.log("0.0.0-development");`),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      fs,
      glob: {
        sync() {
          return ["/app.js"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  const newContent = fs.readFileSync("/app.js", "utf8");
  t.equals(
    newContent,
    `module.exports.version = "1.2.3";

module.exports.logVersion = () => console.log("1.2.3");`
  );
  t.end();
});

test("custom search", (t) => {
  const files = {
    "version.js": Buffer.from("module.exports = '{{VERSION}}'"),
  };
  const fs = new MemoryFileSystem(files);

  prepare(
    {
      placeholder: "{{VERSION}}",
      fs,
      glob: {
        sync() {
          return ["/version.js"];
        },
      },
    },
    {
      cwd: "",
      nextRelease: {
        version: "1.2.3",
      },
      logger: {
        error: (message) => t.fail(message),
        log() {},
        success() {},
      },
    }
  );

  const newContent = fs.readFileSync("/version.js", "utf8");
  t.match(newContent, /1.2.3/, "Version updated in /version.js");
  t.end();
});
