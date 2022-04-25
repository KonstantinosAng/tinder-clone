module.exports = {
	env: {
		browser: true,
		es2021: true,
		es6: true,
	},
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	extends: ["plugin:react/recommended", "prettier"],
	plugins: ["react"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": [
			1,
			{
				extensions: [".js", ".jsx"],
			},
		],
		"no-console": 0,
		"react/prop-types": "off",
		quotes: [2, "double"],
	},
}
