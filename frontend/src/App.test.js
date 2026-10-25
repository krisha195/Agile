import authService from './services/authService';

describe('Frontend AuthService & Storage Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getStoredUser returns null when no user is stored', () => {
    expect(authService.getStoredUser()).toBeNull();
  });

  test('getStoredUser returns parsed object when valid JSON user is in localStorage', () => {
    const mockUser = { id: 'u1', fullName: 'Test User', role: 'Manager' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(authService.getStoredUser()).toEqual(mockUser);
  });

  test('isLoggedIn returns false when no token exists', () => {
    expect(authService.isLoggedIn()).toBe(false);
  });

  test('isLoggedIn returns false when token is invalid or malformed', () => {
    localStorage.setItem('token', 'not-a-valid-jwt');
    expect(authService.isLoggedIn()).toBe(false);
  });

  test('logout removes token and user from localStorage', () => {
    localStorage.setItem('token', 'sample-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Admin' }));
    authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
