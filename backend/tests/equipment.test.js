const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

jest.mock('../models/Equipment');
jest.mock('../models/User');

describe('Equipment Management API (/api/equipment)', () => {
  const testSecret = 'gearguard-test-jwt-secret-xyz987';
  let authToken;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = jwt.sign({ id: 'user123', role: 'Manager' }, testSecret, { expiresIn: '1h' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: 'user123', fullName: 'Manager User', role: 'Manager' }),
    });
  });

  describe('GET /api/equipment', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/equipment');
      expect(res.status).toBe(401);
    });

    it('should return list of equipment when authenticated', async () => {
      const mockItems = [
        { _id: 'eq1', equipmentName: 'Forklift A', serialNumber: 'FL-001', category: 'Vehicle', status: 'Active' },
        { _id: 'eq2', equipmentName: 'CNC Machine', serialNumber: 'CNC-002', category: 'Machine', status: 'Under Maintenance' },
      ];

      Equipment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockItems),
      });

      const res = await request(app)
        .get('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockItems);
      expect(Equipment.find).toHaveBeenCalledWith({});
    });

    it('should pass query filters (category, status, department) to find', async () => {
      Equipment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      });

      await request(app)
        .get('/api/equipment?category=Machine&status=Active&department=Production')
        .set('Authorization', `Bearer ${authToken}`);

      expect(Equipment.find).toHaveBeenCalledWith({
        category: 'Machine',
        status: 'Active',
        department: 'Production',
      });
    });
  });

  describe('GET /api/equipment/:id', () => {
    it('should return single equipment by id', async () => {
      const mockItem = {
        _id: 'eq123',
        equipmentName: '3D Printer',
        serialNumber: 'PR-3D-01',
      };

      Equipment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockItem),
      });

      const res = await request(app)
        .get('/api/equipment/eq123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockItem);
    });

    it('should return 404 when equipment is not found', async () => {
      Equipment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .get('/api/equipment/not-found-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Equipment not found' });
    });
  });

  describe('POST /api/equipment', () => {
    it('should create new equipment and return 201', async () => {
      const newEquipmentData = {
        equipmentName: 'Air Compressor',
        serialNumber: 'AC-990',
        category: 'Machine',
        department: 'Maintenance',
      };

      Equipment.create.mockResolvedValue({
        _id: 'eq990',
        ...newEquipmentData,
        status: 'Active',
      });

      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEquipmentData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id', 'eq990');
      expect(res.body.equipmentName).toBe('Air Compressor');
      expect(Equipment.create).toHaveBeenCalledWith(newEquipmentData);
    });

    it('should return 500 when creation fails due to duplicate serial number or validation', async () => {
      Equipment.create.mockRejectedValue(new Error('E11000 duplicate key error collection'));

      const res = await request(app)
        .post('/api/equipment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          equipmentName: 'Duplicate Item',
          serialNumber: 'AC-990',
        });

      expect(res.status).toBe(500);
      expect(res.body.message).toContain('duplicate key');
    });
  });

  describe('PUT /api/equipment/:id', () => {
    it('should update equipment successfully', async () => {
      const updatedItem = {
        _id: 'eq123',
        equipmentName: 'Updated Name',
        status: 'Under Maintenance',
      };
      Equipment.findByIdAndUpdate.mockResolvedValue(updatedItem);

      const res = await request(app)
        .put('/api/equipment/eq123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ equipmentName: 'Updated Name', status: 'Under Maintenance' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedItem);
      expect(Equipment.findByIdAndUpdate).toHaveBeenCalledWith('eq123', expect.any(Object), { new: true });
    });

    it('should return 404 when updating non-existent equipment', async () => {
      Equipment.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/equipment/missing-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Scrapped' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Equipment not found' });
    });
  });

  describe('DELETE /api/equipment/:id', () => {
    it('should delete equipment and return success message', async () => {
      Equipment.findByIdAndDelete.mockResolvedValue({ _id: 'eq123' });

      const res = await request(app)
        .delete('/api/equipment/eq123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Equipment deleted' });
      expect(Equipment.findByIdAndDelete).toHaveBeenCalledWith('eq123');
    });

    it('should return 404 when deleting non-existent equipment', async () => {
      Equipment.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/equipment/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Equipment not found' });
    });
  });
});
