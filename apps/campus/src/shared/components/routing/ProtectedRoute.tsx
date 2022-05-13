import { createElement } from 'react';
import { Route, useLocation, Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ component, isAuthenticated, redirectTo = 'login', ...rest }: any) => {
  const routeComponent = (props: any) => {
    if (!isAuthenticated) return <Route element={<Navigate to={redirectTo} />} />;
    else return createElement(component, props);
  };

  return <Route {...rest} element={routeComponent} />;
};

export const RequireAuth = ({ redirectTo = '/login', isAuthenticated = false }: any) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={redirectTo} state={{ from: location }} />;
  }

  return <Outlet />;
};
