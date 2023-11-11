import React from "react";
import { Route, Redirect } from "react-router";
import { isAuthenticated } from ".";

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(
        props // We haven't destructure props that's why we need to write props.location
      ) =>
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
