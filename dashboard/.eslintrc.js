module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        //"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        "linebreak-style": [
            process.env.NODE_ENV === "production" ? "error" : "off",
            "windows"
        ],
        quotes: ["error", "double"],
        semi: ["error", "always"]
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)"
            ],
            env: {
                mocha: true
            }
        }
    ]
};
