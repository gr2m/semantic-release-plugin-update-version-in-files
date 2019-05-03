# semantic-release-plugin-update-version-in-files

> Replace version placeholders with calculated version in any files before publishing

[![@latest](https://img.shields.io/npm/v/semantic-release-plugin-update-version-in-files.svg)](https://www.npmjs.com/package/semantic-release-plugin-update-version-in-files)
[![Build Status](https://travis-ci.com/gr2m/semantic-release-plugin-update-version-in-files.svg?branch=master)](https://travis-ci.com/gr2m/semantic-release-plugin-update-version-in-files)
[![Greenkeeper](https://badges.greenkeeper.io/gr2m/semantic-release-plugin-update-version-in-files.svg)](https://greenkeeper.io/)

Example

```json
"plugins": [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/github",
  "@semantic-release/npm",
  ["semantic-release-plugin-update-version-in-files", {
    "files": [
      "version.js"
    ],
    "placeholder": "0.0.0-development"
  }]
]
```

If `"files"` is not set, it defaults to `[ "version.js" ]`. Glob patterns are supported via [glob](https://www.npmjs.com/package/glob). If `placeholder` is not set, it defaults to `"0.0.0-development"`.

See also: [semantic-release plugins configuration](https://semantic-release.gitbook.io/semantic-release/usage/plugins#plugins-configuration).

## License

[ISC](LICENSE)
