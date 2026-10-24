process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'gearguard-test-jwt-secret-xyz987';
process.env.PORT = '5001';

// Suppress console.error and console.log during expected error test cases
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }
});
