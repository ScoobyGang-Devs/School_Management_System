import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


//we pass in children and that is the html elements inside of THIS components
function ProtectedRoute({ children }) {

    const [isAuthorized, setIsAuthorized] = useState(null);//isAuthorized variable for convenience

    //this useeffect says "when this component mounts , run auth() if everything goes as
    // planned no worries ..BUT if we catch an error . you set Authorized to false"
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        //get the jwt access token from the local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        //if no token ,NOT authorozed baby!
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        //if the token exists . check whether it is expired
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp; //token expiration is in seconds
        const now = Date.now() / 1000; //now is in milliseconds so we turn it into seconds

        //compare the two dates . and IF it is expired .
        //you need to activate refresh token function to get a new token
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };
    //since this is a async function there will be time lag .
    //and during that loading time you return a div
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    //if authorized we return the children components and html . if NOT Navigate to login page
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;