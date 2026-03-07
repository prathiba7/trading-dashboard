import { AuthService } from '../services/auth';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('login', () => {
    it('should return user with token for valid credentials', () => {
      const result = authService.login('admin', 'admin123');
      
      expect(result).not.toBeNull();
      expect(result?.username).toBe('admin');
      expect(result?.token).toContain('token_admin_');
    });

    it('should return null for invalid username', () => {
      const result = authService.login('invalid', 'password');
      expect(result).toBeNull();
    });

    it('should return null for invalid password', () => {
      const result = authService.login('admin', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should work for all demo users', () => {
      const users = [
        { username: 'admin', password: 'admin123' },
        { username: 'trader', password: 'trader123' },
        { username: 'demo', password: 'demo' }
      ];

      users.forEach(({ username, password }) => {
        const result = authService.login(username, password);
        expect(result).not.toBeNull();
        expect(result?.username).toBe(username);
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token after login', () => {
      const user = authService.login('admin', 'admin123');
      const username = authService.validateToken(user!.token);
      
      expect(username).toBe('admin');
    });

    it('should return null for invalid token', () => {
      const username = authService.validateToken('invalid_token');
      expect(username).toBeNull();
    });
  });

  describe('logout', () => {
    it('should invalidate token after logout', () => {
      const user = authService.login('admin', 'admin123');
      authService.logout(user!.token);
      
      const username = authService.validateToken(user!.token);
      expect(username).toBeNull();
    });
  });
});
