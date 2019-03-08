module.exports = {
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/src/lib/$1"
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
