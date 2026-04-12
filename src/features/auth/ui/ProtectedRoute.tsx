import {Navigate} from "react-router-dom";

import {useAuth} from "@/features/auth/model/useAuth";

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {user, loading} = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
