const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');

jest.mock('../models/User');

describe('Auth & Role Authorization API (/api/auth)', () => {
  const testSecret = 'gearguard-test-jwt-secret-xyz987';

  const generateTestToken = (userId, role = 'User') => {
    return jwt.sign({ id: userId, role }, testSecret, { expiresIn: '1h' });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with 201 status', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'user123',
        fullName: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        role: 'User',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          password: 'Password123!',
          department: 'Maintenance',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({
        id: 'user123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'User',
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: 'jane@example.com' });
      expect(User.create).toHaveBeenCalled();
    });

    it('should reject registration if email already exists with 400 status', async () => {
      User.findOne.mockResolvedValue({ _id: 'existing123', email: 'existing@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate User',
          username: 'duplicate',
          email: 'existing@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email already exists' });
      expect(User.create).not.toHaveBeenCalled();
    });

    it('should return 500 when database fails during registration', async () => {
      User.findOne.mockRejectedValue(new Error('Database connectivity error'));

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Error User',
          username: 'erroruser',
          email: 'error@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(500);
      expect(res.body.message).toContain('Database connectivity error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials and return 200 + token', async () => {
      const mockUser = {
        _id: 'user456',
        fullName: 'John Smith',
        email: 'john@example.com',
        role: 'Manager',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'CorrectPassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({
        id: 'user456',
        fullName: 'John Smith',
        email: 'john@example.com',
        role: 'Manager',
      });
      expect(mockUser.matchPassword).toHaveBeenCalledWith('CorrectPassword123');
    });

    it('should return 401 when email is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'Password123',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid email or password' });
    });

    it('should return 401 when password does not match', async () => {
      const mockUser = {
        _id: 'user789',
        email: 'user@example.com',
        matchPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid email or password' });
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Not authorized' });
    });

    it('should return 401 when token is invalid or expired', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.value');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Token invalid or expired' });
    });

    it('should return current user profile when valid token is supplied', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'User',
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const token = generateTestToken('user123', 'User');

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user._id).toBe('user123');
    });
  });

  describe('GET /api/auth/users (Role Authorization: Admin/Manager)', () => {
    it('should return 403 Forbidden when regular User accesses /api/auth/users', async () => {
      const regularUser = { _id: 'u1', role: 'User' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(regularUser),
      });

      const token = generateTestToken('u1', 'User');

      const res = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: 'Not authorized' });
    });

    it('should allow Admin to fetch all users', async () => {
      const adminUser = { _id: 'admin1', role: 'Admin' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      const mockUsersList = [
        { fullName: 'Alice Tech', email: 'alice@test.com', role: 'Technician' },
        { fullName: 'Bob Manager', email: 'bob@test.com', role: 'Manager' },
      ];

      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUsersList),
        }),
      });

      const token = generateTestToken('admin1', 'Admin');

      const res = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should allow Manager to fetch users filtered by role', async () => {
      const managerUser = { _id: 'mgr1', role: 'Manager' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(managerUser),
      });

      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ fullName: 'Tech Only', role: 'Technician' }]),
        }),
      });

      const token = generateTestToken('mgr1', 'Manager');

      const res = await request(app)
        .get('/api/auth/users?role=Technician')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data[0].role).toBe('Technician');
      expect(User.find).toHaveBeenCalledWith({ role: 'Technician' });
    });
  });

  describe('POST /api/auth/create-user (Admin Only)', () => {
    it('should reject request from non-admin role with 403', async () => {
      const managerUser = { _id: 'mgr1', role: 'Manager' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(managerUser),
      });

      const token = generateTestToken('mgr1', 'Manager');

      const res = await request(app)
        .post('/api/auth/create-user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'New Tech',
          username: 'newtech',
          email: 'tech@example.com',
          password: 'Pass',
          role: 'Technician',
        });

      expect(res.status).toBe(403);
    });

    it('should reject invalid role selection with 400', async () => {
      const adminUser = { _id: 'admin1', role: 'Admin' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      const token = generateTestToken('admin1', 'Admin');

      const res = await request(app)
        .post('/api/auth/create-user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Invalid Role User',
          username: 'invalidrole',
          email: 'invalid@example.com',
          password: 'Pass',
          role: 'SuperAdmin',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Role must be User, Manager, or Technician');
    });

    it('should create user when admin provides valid details', async () => {
      const adminUser = { _id: 'admin1', role: 'Admin' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(adminUser),
      });

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'tech101',
        fullName: 'Alex Technician',
        email: 'alex@example.com',
        role: 'Technician',
      });

      const token = generateTestToken('admin1', 'Admin');

      const res = await request(app)
        .post('/api/auth/create-user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Alex Technician',
          username: 'alextech',
          email: 'alex@example.com',
          password: 'Password123!',
          role: 'Technician',
          department: 'Electrical',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual({
        id: 'tech101',
        fullName: 'Alex Technician',
        email: 'alex@example.com',
        role: 'Technician',
      });
    });
  });
});
