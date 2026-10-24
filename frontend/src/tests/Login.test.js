import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import authService from '../services/authService';

jest.mock('../services/authService');

describe('Login Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  it('renders login form with email, password inputs and submit button', () => {
    render(<Login />);

    expect(screen.getByRole('heading', { name: /Welcome/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('validates empty inputs and shows required error message', async () => {
    render(<Login />);

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('All fields are required.')).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('calls authService.login and stores token on successful authentication', async () => {
    authService.login.mockResolvedValue({
      token: 'jwt.token.abc',
      user: { role: 'Admin', fullName: 'Super Admin' },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'admin@gearguard.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'AdminSecret123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin@gearguard.com', 'AdminSecret123!');
      expect(localStorage.getItem('token')).toBe('jwt.token.abc');
      expect(localStorage.getItem('role')).toBe('Admin');
      expect(window.location.href).toBe('/dashboard');
    });
  });

  it('displays error message when login fails with invalid credentials', async () => {
    authService.login.mockRejectedValue(new Error('Invalid email or password'));

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});
