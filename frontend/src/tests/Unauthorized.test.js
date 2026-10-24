import { render, screen, fireEvent } from '@testing-library/react';
import Unauthorized from '../pages/Unauthorized';
import { mockNavigate } from 'react-router-dom';

describe('Unauthorized Page Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 403 access denied heading and warning icon', () => {
    render(<Unauthorized />);

    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/You don't have permission to access this page/i)).toBeInTheDocument();
  });

  it('navigates to /dashboard when dashboard button is clicked', () => {
    render(<Unauthorized />);

    const dashboardBtn = screen.getByRole('button', { name: /Go to Dashboard/i });
    fireEvent.click(dashboardBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates backwards when back button is clicked', () => {
    render(<Unauthorized />);

    const backBtn = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
