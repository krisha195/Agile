const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Team = require('../models/Team');
const User = require('../models/User');

jest.mock('../models/Team');
jest.mock('../models/User');

describe('Teams Management API (/api/teams)', () => {
  const testSecret = 'gearguard-test-jwt-secret-xyz987';
  let authToken;

  beforeEach(() => {
    jest.clearAllMocks();
    authToken = jwt.sign({ id: 'userAdmin', role: 'Admin' }, testSecret, { expiresIn: '1h' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: 'userAdmin', role: 'Admin' }),
    });
  });

  describe('GET /api/teams', () => {
    it('should return all teams with populated members', async () => {
      const mockTeams = [
        { _id: 'team1', teamName: 'Electrical Team', specialization: 'Electrical', members: [] },
      ];
      Team.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeams),
      });

      const res = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockTeams);
    });
  });

  describe('POST /api/teams', () => {
    it('should create a new team successfully', async () => {
      const teamData = {
        teamName: 'Mechanical Crew',
        specialization: 'Mechanical',
        description: 'Handles turbines and engines',
      };
      Team.create.mockResolvedValue({ _id: 'team2', ...teamData });

      const res = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${authToken}`)
        .send(teamData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.teamName).toBe('Mechanical Crew');
      expect(Team.create).toHaveBeenCalledWith(teamData);
    });

    it('should return 400 when teamName or specialization is missing', async () => {
      Team.create.mockRejectedValue(new Error('Team name is required'));

      const res = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Team name is required');
    });
  });

  describe('GET /api/teams/:id', () => {
    it('should return team details for existing ID', async () => {
      const mockTeam = { _id: 'team123', teamName: 'HVAC Squad' };
      Team.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeam),
      });

      const res = await request(app)
        .get('/api/teams/team123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockTeam);
    });

    it('should return 404 when team does not exist', async () => {
      Team.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .get('/api/teams/missingTeam')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Team not found');
    });
  });

  describe('DELETE /api/teams/:id', () => {
    it('should delete existing team', async () => {
      Team.findByIdAndDelete.mockResolvedValue({ _id: 'team123' });

      const res = await request(app)
        .delete('/api/teams/team123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: 'Team deleted successfully' });
    });

    it('should return 404 when team to delete is not found', async () => {
      Team.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/teams/missing')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Team not found' });
    });
  });

  describe('POST /api/teams/:id/members', () => {
    it('should add member to team successfully', async () => {
      const mockTeam = {
        _id: 'team1',
        members: [],
        save: jest.fn().mockResolvedValue(true),
      };
      const mockTargetUser = {
        _id: 'user99',
        fullName: 'Bob Tech',
        save: jest.fn().mockResolvedValue(true),
      };

      Team.findById
        .mockResolvedValueOnce(mockTeam) // for initial find
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue({ ...mockTeam, members: [mockTargetUser] }) }); // for return populated find

      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ _id: 'userAdmin', role: 'Admin' }) }) // auth protect
        .mockResolvedValueOnce(mockTargetUser); // user find to add

      const res = await request(app)
        .post('/api/teams/team1/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'user99' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockTeam.save).toHaveBeenCalled();
    });

    it('should reject adding a member that is already in the team with 400', async () => {
      const mockTeam = {
        _id: 'team1',
        members: ['user99'],
      };
      const mockTargetUser = { _id: 'user99' };

      Team.findById.mockResolvedValueOnce(mockTeam);
      User.findById
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ _id: 'userAdmin', role: 'Admin' }) })
        .mockResolvedValueOnce(mockTargetUser);

      const res = await request(app)
        .post('/api/teams/team1/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'user99' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ success: false, message: 'User already in team' });
    });
  });
});
