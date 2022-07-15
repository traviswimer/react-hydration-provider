/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	collectCoverage: true,
	collectCoverageFrom: ["./src/**/*.ts"],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			lines: 100,
			functions: 100,
		},
	},
};
