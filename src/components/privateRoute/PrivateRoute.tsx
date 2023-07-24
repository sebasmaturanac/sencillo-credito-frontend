import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ children, ...otherProps }: any) => {
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) return <Redirect to="/login" />;

  return <Route {...otherProps}>{children}</Route>;
};

export default PrivateRoute;
