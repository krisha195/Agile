import React from 'react';

const mockNavigate = jest.fn();

export const useNavigate = () => mockNavigate;
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
export const useParams = () => ({});

export const Navigate = ({ to, replace }) => (
  <div data-testid="navigate-redirect" data-to={to} data-replace={replace ? 'true' : 'false'}>
    Redirecting to {to}
  </div>
);

export const Link = ({ to, children, className, onClick, ...props }) => (
  <a href={to} className={className} onClick={onClick} {...props}>
    {children}
  </a>
);

export const NavLink = ({ to, children, className, ...props }) => (
  <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...props}>
    {children}
  </a>
);

export const BrowserRouter = ({ children }) => <div data-testid="browser-router">{children}</div>;
export const MemoryRouter = ({ children }) => <div data-testid="memory-router">{children}</div>;
export const Routes = ({ children }) => <div data-testid="routes-wrapper">{children}</div>;
export const Route = ({ element }) => <>{element}</>;
export const Outlet = () => <div data-testid="outlet" />;

export { mockNavigate };

export default {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
  Link,
  NavLink,
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  mockNavigate,
};
