import { Navigate, Outlet } from 'react-router-dom';
import {AuthService} from "../services/auth.service.ts";

export const PrivateRoute = () => {
    return !!AuthService.token ? <Outlet /> : <Navigate to="/login" replace />;
};