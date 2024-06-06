import { AccessTokenGuard } from './access-token.guard';

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new AccessTokenGuard()).toBeDefined();
  });
});
