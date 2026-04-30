import {Navigate, Outlet} from "react-router-dom";

import {useAuth} from "@/features/auth/model/useAuth";
import {Navigation} from "@/components/Navigation";
import styles from "./ProtectedRoute.module.scss";

export const ProtectedRoute = () => {
  const {user, loading} = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
