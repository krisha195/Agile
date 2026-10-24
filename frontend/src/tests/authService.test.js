import authService from '../services/authService';

describe('Frontend authService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('isLoggedIn()', () => {
    it('returns false when no token exists in localStorage', () => {
      expect(authService.isLoggedIn()).toBe(false);
    });

    it('returns true when a valid non-expired JWT token exists', () => {
      // Future expiration time (1 hour in future)
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const payload = btoa(JSON.stringify({ id: 'u123', exp: futureExp }));
      const validToken = `header.${payload}.signature`;

      localStorage.setItem('token', validToken);

      expect(authService.isLoggedIn()).toBe(true);
    });

    it('returns false and clears localStorage when token is expired', () => {
      // Past expiration time (1 hour in past)
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const payload = btoa(JSON.stringify({ id: 'u123', exp: pastExp }));
      const expiredToken = `header.${payload}.signature`;

      localStorage.setItem('token', expiredToken);
      localStorage.setItem('role', 'Admin');

      expect(authService.isLoggedIn()).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('returns false when token is malformed', () => {
      localStorage.setItem('token', 'not-a-valid-jwt');

      expect(authService.isLoggedIn()).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('login()', () => {
    it('successfully logs in and persists token and user', async () => {
      const mockResponse = {
        token: 'valid.token.here',
        user: { id: 'u1', fullName: 'Alice Tester', role: 'Manager' },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      });

      const result = await authService.login('alice@example.com', 'secret123');

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('valid.token.here');
      expect(localStorage.getItem('role')).toBe('Manager');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.user);
    });

    it('throws error when login API returns 401', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'Invalid credentials' })),
      });

      await expect(authService.login('bad@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout()', () => {
    it('clears token and user from localStorage', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));

      // Mock window.location
      delete window.location;
      window.location = { href: '' };

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.href).toBe('/login');
    });
  });

  describe('getStoredUser()', () => {
    it('returns parsed user from localStorage', () => {
      const user = { id: '1', fullName: 'Tester' };
      localStorage.setItem('user', JSON.stringify(user));

      expect(authService.getStoredUser()).toEqual(user);
    });

    it('returns null if no user is saved or JSON is invalid', () => {
      expect(authService.getStoredUser()).toBeNull();

      localStorage.setItem('user', '{broken json');
      expect(authService.getStoredUser()).toBeNull();
    });
  });
});
