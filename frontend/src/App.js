import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import EquipmentList from './pages/Equipment/EquipmentList';
import EquipmentForm from './pages/Equipment/EquipmentForm';
import EquipmentDetails from './pages/Equipment/EquipmentDetails';

import TeamList from './pages/Teams/TeamList';
import TeamForm from './pages/Teams/TeamForm';
import TeamDetails from './pages/Teams/TeamDetails';

import RequestList from './pages/Requests/RequestList';
import RequestForm from './pages/Requests/RequestForm';
import RequestDetails from './pages/Requests/RequestDetails';
import KanbanBoard from './pages/Requests/KanbanBoard';
import CalendarView from './pages/Requests/CalendarView';

import ReportsPage from './pages/Reports/ReportsPage';
import CreateUser from './pages/user/createUser';
import UserList from './pages/user/UserList';
import { RoleProtectedRoute } from './components/ProtectedRoute';

import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD (ALL LOGGED USERS) */}
        <Route path="/dashboard" element={<RoleProtectedRoute element={<Dashboard />} allowedRoles={['Admin','Manager','Technician','User']} />} />

        {/* EQUIPMENT (ADMIN / MANAGER ONLY) */}
        <Route path="/equipment" element={<RoleProtectedRoute element={<EquipmentList />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/equipment/new" element={<RoleProtectedRoute element={<EquipmentForm />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/equipment/edit/:id" element={<RoleProtectedRoute element={<EquipmentForm />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/equipment/:id" element={<RoleProtectedRoute element={<EquipmentDetails />} allowedRoles={['Admin','Manager']} />} />

        {/* TEAMS (ADMIN / MANAGER ONLY) */}
        <Route path="/teams" element={<RoleProtectedRoute element={<TeamList />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/teams/new" element={<RoleProtectedRoute element={<TeamForm />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/teams/edit/:id" element={<RoleProtectedRoute element={<TeamForm />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/teams/:id" element={<RoleProtectedRoute element={<TeamDetails />} allowedRoles={['Admin','Manager']} />} />

        {/* REQUESTS (ALL USERS) */}
        <Route path="/requests" element={<RoleProtectedRoute element={<RequestList />} allowedRoles={['Admin','Manager','Technician','User']} />} />
        <Route path="/requests/new" element={<RoleProtectedRoute element={<RequestForm />} allowedRoles={['Admin','Manager','Technician','User']} />} />
        <Route path="/requests/edit/:id" element={<RoleProtectedRoute element={<RequestForm />} allowedRoles={['Admin','Manager','Technician','User']} />} />
        <Route path="/requests/kanban" element={<RoleProtectedRoute element={<KanbanBoard />} allowedRoles={['Admin','Manager']} />} />
        <Route path="/requests/:id" element={<RoleProtectedRoute element={<RequestDetails />} allowedRoles={['Admin','Manager','Technician','User']} />} />

        {/* CALENDAR (ALL USERS) */}
        <Route path="/calendar" element={<RoleProtectedRoute element={<CalendarView />} allowedRoles={['Admin','Manager','Technician','User']} />} />

        {/* REPORTS (ADMIN ONLY) */}
        <Route path="/reports" element={<RoleProtectedRoute element={<ReportsPage />} allowedRoles={['Admin']} />} />

        {/* USERS (ADMIN / MANAGER ONLY) */}
        <Route path="/users" element={<RoleProtectedRoute element={<UserList />} allowedRoles={['Admin']} />} />
        <Route path="/users/new" element={<RoleProtectedRoute element={<CreateUser />} allowedRoles={['Admin']} />} />

        {/* 404 CATCH-ALL */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
