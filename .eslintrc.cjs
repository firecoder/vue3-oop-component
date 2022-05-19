module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-duplicate-imports": ["off"],                                         // to allow separate type import
        "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 0, maxBOF: 0 }],
        "import/no-duplicates": ["off"],                                         // to allow separate type import
        "padded-blocks": ["off"],
        "quotes": ["error", "double", { "allowTemplateLiterals": true }],
        "quote-props": ["error", "consistent-as-needed"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],
    },
    overrides: [
        {
            files: [
                ".eslintrc.cjs",
            ],
            rules: {
                "@typescript-eslint/no-var-requires": ["off"],
            },
        },
        {
            "files": [
                "cypress/integration/**.spec.{js,ts,jsx,tsx}"
            ],
            "extends": [
                "plugin:cypress/recommended"
            ]
        }
    ],
};
