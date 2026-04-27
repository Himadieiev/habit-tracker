import {Navigate} from "react-router-dom";

import {Button} from "@/components/Button/Button";
import {useAuth} from "@/features/auth/model/useAuth";
import {supabase} from "@/lib/supabaseClient";

import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  const {user, loading} = useAuth();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Habit Tracker</h1>

        <p className={styles.description}>Track your daily habits and build lasting routines</p>

        <div className={styles.buttonWrapper}>
          <Button onClick={handleLogin} size="lg">
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};
