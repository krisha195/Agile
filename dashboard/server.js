const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

let equipment = [];
let teams = [];
let requests = [];

app.get('/api/equipment', (req, res) => {
  res.json(equipment);
});

app.post('/api/equipment', (req, res) => {
  const newEquipment = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  equipment.push(newEquipment);
  res.status(201).json(newEquipment);
});

app.get('/api/equipment/:id', (req, res) => {
  const item = equipment.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Equipment not found' });
  res.json(item);
});

app.put('/api/equipment/:id', (req, res) => {
  const index = equipment.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Equipment not found' });

  equipment[index] = { ...equipment[index], ...req.body };
  res.json(equipment[index]);
});

app.delete('/api/equipment/:id', (req, res) => {
  const index = equipment.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Equipment not found' });

  equipment.splice(index, 1);
  res.json({ message: 'Equipment deleted successfully' });
});

app.get('/api/teams', (req, res) => {
  res.json(teams);
});

app.post('/api/teams', (req, res) => {
  const newTeam = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  teams.push(newTeam);
  res.status(201).json(newTeam);
});

app.get('/api/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json(team);
});

app.get('/api/requests', (req, res) => {
  res.json(requests);
});

app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: Date.now().toString(),
    stage: 'New',
    ...req.body,
    createdAt: new Date().toISOString()
  };

  if (req.body.equipmentId) {
    const equipmentItem = equipment.find(e => e.id === req.body.equipmentId);
    if (equipmentItem) {
      newRequest.category = equipmentItem.category;
      newRequest.teamId = equipmentItem.teamId;
    }
  }

  requests.push(newRequest);
  res.status(201).json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
  const index = requests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  requests[index] = { ...requests[index], ...req.body };
  res.json(requests[index]);
});

app.get('/api/equipment/:id/requests', (req, res) => {
  const equipmentRequests = requests.filter(r => r.equipmentId === req.params.id);
  res.json(equipmentRequests);
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalEquipment: equipment.length,
    totalTeams: teams.length,
    totalRequests: requests.length,
    requestsByStage: {
      new: requests.filter(r => r.stage === 'New').length,
      inProgress: requests.filter(r => r.stage === 'In Progress').length,
      repaired: requests.filter(r => r.stage === 'Repaired').length,
      scrap: requests.filter(r => r.stage === 'Scrap').length
    }
  };
  res.json(stats);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('\nGearGuard Server Started Successfully!\n');
  console.log('Server running on: http://localhost:' + PORT);
});
