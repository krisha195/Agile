const test = require('node:test');
const assert = require('node:assert/strict');
const { authorize } = require('../middleware/roleMiddleware');

test('Role Middleware - allows user with authorized role', () => {
  let nextCalled = false;
  const req = { user: { role: 'Admin' } };
  const res = {};
  const next = () => { nextCalled = true; };

  const middleware = authorize('Admin', 'Manager');
  middleware(req, res, next);

  assert.strictEqual(nextCalled, true, 'next() should have been called for Admin');
});

test('Role Middleware - blocks user with unauthorized role', () => {
  let statusCode = null;
  let responseData = null;
  const req = { user: { role: 'User' } };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) { responseData = data; }
      };
    }
  };
  const next = () => { assert.fail('next() should not be called'); };

  const middleware = authorize('Admin', 'Manager');
  middleware(req, res, next);

  assert.strictEqual(statusCode, 403, 'Expected status code 403 Forbidden');
  assert.strictEqual(responseData.message, 'Not authorized');
});

test('Role Middleware - rejects unauthenticated user without role', () => {
  let statusCode = null;
  let responseData = null;
  const req = { user: null };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) { responseData = data; }
      };
    }
  };
  const next = () => { assert.fail('next() should not be called'); };

  const middleware = authorize('Admin');
  middleware(req, res, next);

  assert.strictEqual(statusCode, 401, 'Expected status code 401 Unauthorized');
  assert.strictEqual(responseData.message, 'Not authenticated');
});
