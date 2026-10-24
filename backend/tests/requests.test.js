const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

jest.mock('../models/MaintenanceRequest');
jest.mock('../models/Equipment');
jest.mock('../models/User');

describe('Maintenance Requests API (/api/requests)', () => {
  const testSecret = 'gearguard-test-jwt-secret-xyz987';
  let authToken;
  const mockUser = { _id: 'user777', fullName: 'Maintenance Tech', role: 'Technician' };

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = jwt.sign({ id: 'user777', role: 'Technician' }, testSecret, { expiresIn: '1h' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
  });

  describe('GET /api/requests', () => {
    it('should return all maintenance requests with populated references', async () => {
      const mockData = [
        { _id: 'req1', subject: 'Motor overheating', priority: 'High', status: 'New' },
        { _id: 'req2', subject: 'Oil change inspection', priority: 'Low', status: 'In Progress' },
      ];

      const chain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockData),
      };
      MaintenanceRequest.find.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/requests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockData);
      expect(MaintenanceRequest.find).toHaveBeenCalledWith({});
    });

    it('should support openOnly query parameter to filter out closed statuses', async () => {
      const chain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };
      MaintenanceRequest.find.mockReturnValue(chain);

      await request(app)
        .get('/api/requests?openOnly=true')
        .set('Authorization', `Bearer ${authToken}`);

      expect(MaintenanceRequest.find).toHaveBeenCalledWith({
        status: { $nin: ['Repaired', 'Scrapped'] },
      });
    });
  });

  describe('GET /api/requests/:id', () => {
    it('should return specific request by ID with 200', async () => {
      const singleRequest = {
        _id: 'req101',
        subject: 'Hydraulic leak',
        requestType: 'Corrective',
      };

      const chain = {
        populate: jest.fn().mockReturnThis(),
      };
      // 4 populates then resolves
      let popCount = 0;
      chain.populate = jest.fn(() => {
        popCount++;
        if (popCount >= 4) {
          return Promise.resolve(singleRequest);
        }
        return chain;
      });

      MaintenanceRequest.findById.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/requests/req101')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(singleRequest);
    });

    it('should return 404 when request does not exist', async () => {
      const chain = {
        populate: jest.fn().mockReturnThis(),
      };
      let popCount = 0;
      chain.populate = jest.fn(() => {
        popCount++;
        if (popCount >= 4) {
          return Promise.resolve(null);
        }
        return chain;
      });

      MaintenanceRequest.findById.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/requests/notfound')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Request not found' });
    });
  });

  describe('POST /api/requests', () => {
    it('should create new maintenance request and inherit equipment teamId', async () => {
      Equipment.findById.mockResolvedValue({
        _id: 'eq456',
        teamId: 'teamMech',
      });

      const newRequestMock = {
        _id: 'req555',
        subject: 'Broken conveyor belt',
        requestType: 'Corrective',
        equipmentId: 'eq456',
        teamId: 'teamMech',
        priority: 'Critical',
        status: 'New',
        createdBy: 'user777',
      };
      MaintenanceRequest.create.mockResolvedValue(newRequestMock);

      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'Broken conveyor belt',
          requestType: 'Corrective',
          equipmentId: 'eq456',
          priority: 'Critical',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(newRequestMock);
      expect(MaintenanceRequest.create).toHaveBeenCalledWith(expect.objectContaining({
        subject: 'Broken conveyor belt',
        equipmentId: 'eq456',
        teamId: 'teamMech',
        createdBy: 'user777',
      }));
    });

    it('should return 400 when required fields are missing during creation', async () => {
      MaintenanceRequest.create.mockRejectedValue(new Error('Subject is required'));

      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Subject is required');
    });
  });

  describe('PATCH /api/requests/:id/status', () => {
    it('should update status to Repaired and set completedDate', async () => {
      const updatedReq = {
        _id: 'req123',
        status: 'Repaired',
        completedDate: new Date(),
      };
      MaintenanceRequest.findByIdAndUpdate.mockResolvedValue(updatedReq);

      const res = await request(app)
        .patch('/api/requests/req123/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Repaired' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Repaired');
      expect(MaintenanceRequest.findByIdAndUpdate).toHaveBeenCalledWith(
        'req123',
        expect.objectContaining({ status: 'Repaired', completedDate: expect.any(Date) }),
        { new: true }
      );
    });

    it('should return 400 for invalid status transitions', async () => {
      const res = await request(app)
        .patch('/api/requests/req123/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'InvalidStatusXYZ' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ success: false, message: 'Invalid status' });
    });
  });

  describe('DELETE /api/requests/:id', () => {
    it('should delete request successfully', async () => {
      MaintenanceRequest.findByIdAndDelete.mockResolvedValue({ _id: 'req123' });

      const res = await request(app)
        .delete('/api/requests/req123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: 'Request deleted successfully' });
    });

    it('should return 404 when deleting missing request', async () => {
      MaintenanceRequest.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/requests/req999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Request not found' });
    });
  });

  describe('GET /api/requests/calendar', () => {
    it('should return scheduled requests formatted for calendar', async () => {
      const mockCalendar = [
        {
          _id: 'cal1',
          subject: 'Weekly Boiler Maintenance',
          scheduledDate: '2026-11-01T10:00:00.000Z',
          status: 'Assigned',
        },
      ];

      MaintenanceRequest.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockCalendar),
        }),
      });

      const res = await request(app)
        .get('/api/requests/calendar')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockCalendar);
    });
  });
});
