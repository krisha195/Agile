import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

test('renders 404 Page Not Found correctly', () => {
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );
  expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  expect(screen.getByText(/404/i)).toBeInTheDocument();
  expect(screen.getByText(/Go to Dashboard/i)).toBeInTheDocument();
});

test('renders Unauthorized access page correctly', () => {
  render(
    <BrowserRouter>
      <Unauthorized />
    </BrowserRouter>
  );
  expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
});
