import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import authService from '../services/authService';

jest.mock('../services/authService');

describe('Register Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders step 1 fields and validates empty submission', () => {
    render(<Register />);

    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Smith')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('johnsmith')).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a department')).toBeInTheDocument();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('navigates from Step 1 to Step 2 when personal info is valid', () => {
    const { container } = render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Sam Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johnsmith'), { target: { value: 'samsmith' } });

    const select = container.querySelector('select[name="department"]');
    fireEvent.change(select, { target: { value: 'Engineering' } });

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    expect(screen.getByRole('heading', { name: /Set Credentials/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min 8 characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat password')).toBeInTheDocument();
  });

  it('validates password mismatch on Step 2 before submitting', async () => {
    const { container } = render(<Register />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Sam Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johnsmith'), { target: { value: 'samsmith' } });
    const select = container.querySelector('select[name="department"]');
    fireEvent.change(select, { target: { value: 'Engineering' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2 with mismatched password
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'sam@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Min 8 characters'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText('Repeat password'), { target: { value: 'WrongPassword!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('completes registration successfully and shows success screen', async () => {
    authService.register.mockResolvedValue({
      token: 'registered.token.123',
      user: { fullName: 'Sam Smith', role: 'User' },
    });

    const { container } = render(<Register />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText('John Smith'), { target: { value: 'Sam Smith' } });
    fireEvent.change(screen.getByPlaceholderText('johnsmith'), { target: { value: 'samsmith' } });
    const select = container.querySelector('select[name="department"]');
    fireEvent.change(select, { target: { value: 'Engineering' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'sam@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Min 8 characters'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText('Repeat password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        fullName: 'Sam Smith',
        username: 'samsmith',
        email: 'sam@example.com',
        password: 'Password123!',
        department: 'Engineering',
      });
      expect(screen.getByText("You're In!")).toBeInTheDocument();
    });
  });
});
