import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useSnackbar } from "../context/SnackBar";

function RequireAuth() {
    let snackbar = useSnackbar()
    let auth = useAuth();
    let location = useLocation();
    let u = auth.user;

    if (!u) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (location.pathname != '/profile') {
        if (u.gender === '' || u.age === 0 || u.orientation === '' || u.interests.length === 0 || u.biography == '' || u.pictures.every((pic: (string | null)) => pic === null))
        {
            snackbar("Tell us more a bit more you before meeting other people", "info")
            return <Navigate to="/profile" />;
        }
    }

    return <Outlet />;
}

export default RequireAuth
