import { Redirect, Route } from "react-router-dom";

const PublicRoute = ({ children, ...otherProps }: any) => {
  const isLoggedIn = localStorage.getItem("token");

  if (isLoggedIn) return <Redirect to="/home" />;

  return <Route {...otherProps}>{children}</Route>;
};

export default PublicRoute;
