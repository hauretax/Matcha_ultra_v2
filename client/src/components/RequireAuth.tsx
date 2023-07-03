import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { getLocation, isProfileIncomplete } from "../utils";

function RequireAuth() {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    getLocation();
    if (location.pathname !== '/profile') {
        if (isProfileIncomplete(auth.user)) {
          return <Navigate to="/profile" state={{ profileIncomplete: true }} />;
        }
    }

    return <Outlet />;
}

export default RequireAuth
