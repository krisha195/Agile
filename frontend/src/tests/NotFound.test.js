import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../pages/NotFound';
import { mockNavigate } from 'react-router-dom';

describe('NotFound Page Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 404 code, error title and description', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for doesn't exist/i)).toBeInTheDocument();
  });

  it('navigates to dashboard when "Go to Dashboard" button is clicked', () => {
    render(<NotFound />);

    const dashboardBtn = screen.getByRole('button', { name: /Go to Dashboard/i });
    fireEvent.click(dashboardBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates back when "Go Back" button is clicked', () => {
    render(<NotFound />);

    const backBtn = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
