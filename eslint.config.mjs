import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...next,
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...next.configs["core-web-vitals"],
    }
];

export default config;
