import { render, screen } from '@testing-library/react';
import ProtectedRoute, { RoleProtectedRoute } from '../components/ProtectedRoute';
import authService from '../services/authService';

jest.mock('../services/authService');

describe('ProtectedRoute Component and Role Enforcement', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('<ProtectedRoute />', () => {
    it('redirects to /login when user is not logged in', () => {
      authService.isLoggedIn.mockReturnValue(false);

      render(<ProtectedRoute element={<div>Protected Dashboard Content</div>} />);

      const redirect = screen.getByTestId('navigate-redirect');
      expect(redirect).toBeInTheDocument();
      expect(redirect).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Protected Dashboard Content')).not.toBeInTheDocument();
    });

    it('renders the protected element when user is logged in', () => {
      authService.isLoggedIn.mockReturnValue(true);

      render(<ProtectedRoute element={<div>Protected Dashboard Content</div>} />);

      expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-redirect')).not.toBeInTheDocument();
    });
  });

  describe('<RoleProtectedRoute />', () => {
    it('redirects unauthenticated user to /login', () => {
      authService.isLoggedIn.mockReturnValue(false);

      render(
        <RoleProtectedRoute
          element={<div>Admin Content</div>}
          allowedRoles={['Admin']}
        />
      );

      const redirect = screen.getByTestId('navigate-redirect');
      expect(redirect).toBeInTheDocument();
      expect(redirect).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('redirects user with unauthorized role to /unauthorized', () => {
      authService.isLoggedIn.mockReturnValue(true);
      localStorage.setItem('role', 'User');

      render(
        <RoleProtectedRoute
          element={<div>Admin Content</div>}
          allowedRoles={['Admin', 'Manager']}
        />
      );

      const redirect = screen.getByTestId('navigate-redirect');
      expect(redirect).toBeInTheDocument();
      expect(redirect).toHaveAttribute('data-to', '/unauthorized');
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders element when user possesses an allowed role', () => {
      authService.isLoggedIn.mockReturnValue(true);
      localStorage.setItem('role', 'Manager');

      render(
        <RoleProtectedRoute
          element={<div>Admin Content</div>}
          allowedRoles={['Admin', 'Manager']}
        />
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-redirect')).not.toBeInTheDocument();
    });
  });
});
