export const mockAuthService = {
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logOut: jest.fn(),
    getTokens: jest.fn(),
    updateRefreshToken: jest.fn(),
    forgotPassword: jest.fn(),
    activateAccount: jest.fn(),
    resetPassword: jest.fn()
};