module.exports = {
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        '\\.(css|jpg|png)$': '<rootDir>/mocks/fileMock.js',
    },    
};