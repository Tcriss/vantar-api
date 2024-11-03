import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest/";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "@swc/jest"
    },
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    preset: 'ts-jest',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    modulePaths: [compilerOptions.baseUrl],
    clearMocks: true
}

export default config;
