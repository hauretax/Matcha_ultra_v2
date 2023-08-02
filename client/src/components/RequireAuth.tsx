import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { buildErrorString, fetchLocation, isProfileIncomplete } from "../utils";
import { useSnackbar } from "../context/SnackBar";
import { useEffect } from "react";
import apiProvider from "../services/apiProvider";


function RequireAuth() {
  let auth = useAuth();
  let location = useLocation();
  let snackbar = useSnackbar();

  //INFO: since snackbar cannot be called outside of a component and since each api calls needs to be encapsulated, fetchLocation should not be in utils.ts but here ?
  useEffect(() => {

    if (auth.user?.customLocation === false) {
      fetchLocation((err: any) => snackbar(buildErrorString(err, "Position failed to update"), "error"));
    }
  }, [location]);

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }



  if (location.pathname !== '/profile') {
    if (isProfileIncomplete(auth.user)) {
      return <Navigate to="/profile" state={{ profileIncomplete: true }} />;
    }
  }

  return <Outlet />;
}

export default RequireAuth
