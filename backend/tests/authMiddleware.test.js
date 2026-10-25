const test = require('node:test');
const assert = require('node:assert/strict');
const { protect } = require('../middleware/authMiddleware');

test('Auth Middleware - returns 401 if authorization header is missing', async () => {
  let statusCode = null;
  let responseData = null;
  const req = { headers: {} };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) { responseData = data; }
      };
    }
  };
  const next = () => { assert.fail('next() should not be called'); };

  await protect(req, res, next);

  assert.strictEqual(statusCode, 401);
  assert.strictEqual(responseData.message, 'Not authorized');
});

test('Auth Middleware - returns 401 if token is malformed or invalid', async () => {
  let statusCode = null;
  let responseData = null;
  const req = { headers: { authorization: 'Bearer invalid-token-string' } };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) { responseData = data; }
      };
    }
  };
  const next = () => { assert.fail('next() should not be called'); };

  await protect(req, res, next);

  assert.strictEqual(statusCode, 401);
  assert.strictEqual(responseData.message, 'Token invalid or expired');
});
