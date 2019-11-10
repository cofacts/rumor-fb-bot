module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-json-strings",
    [
      'ttag', {resolve: {translations: `i18n/${process.env.LOCALE || 'en_US'}.po`}}
    ],
  ]
}
