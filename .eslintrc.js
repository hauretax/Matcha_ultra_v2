module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"indent": ["error", "tab"],
		"linebreak-style": ["warn", "unix"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"space-in-parens": ["error", "never"],
		"object-curly-spacing": ["error", "always"],
		"array-bracket-spacing": ["error", "never"],
		"computed-property-spacing": ["error", "never"],
		"block-spacing": ["error", "always"],
		"comma-spacing": ["error", { "before": false, "after": true }],
		"key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
		"space-infix-ops": "error"
	}
}
