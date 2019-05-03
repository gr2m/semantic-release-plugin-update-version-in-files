# semantic-release-plugin-update-version-in-files

> Replace version placeholders with calculated version in any files before publishing

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
