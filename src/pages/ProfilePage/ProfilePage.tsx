import {useState} from "react";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

import {useAuth} from "@/features/auth/model/useAuth";
import {useHabits} from "@/features/habits/model/useHabits";
import {calculateBestStreak} from "@/features/habits/utils/habitStats";
import {supabase} from "@/lib/supabaseClient";
import {ConfirmModal} from "@/components/ConfirmModal";
import styles from "./ProfilePage.module.scss";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const {habits} = useHabits();
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;

  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => calculateBestStreak(h.logs))) : 0;

  const avgCompletion =
    habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => {
            const createdDate = new Date(h.createdAt);
            createdDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysSinceCreation =
              Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const completedDays = h.logs.filter((l) => l.completed).length;
            const rate = (completedDays / daysSinceCreation) * 100;
            return sum + rate;
          }, 0) / habits.length,
        )
      : 0;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const handleExport = () => {
    const data = {
      user: {
        email: user?.email,
        name: user?.user_metadata?.full_name,
      },
      habits: habits.map((h) => ({
        id: h.id,
        title: h.title,
        createdAt: h.createdAt,
        logs: h.logs,
      })),
      exportedAt: new Date().toLocaleString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habits-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleDeleteAllData = async () => {
    setIsLoading(true);
    try {
      const {error} = await supabase.from("habits").delete().eq("user_id", user?.id);
      if (error) throw error;

      toast.success("All data deleted");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete data");
    } finally {
      setIsLoading(false);
      setIsDeleteDataModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account and data</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.avatarSection}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.avatarInitial}>{firstName[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{firstName}</h2>
              <p className={styles.userEmail}>{email}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{habits.length}</div>
              <div className={styles.statLabel}>Total Habits</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{bestStreak}</div>
              <div className={styles.statLabel}>Best Streak</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{avgCompletion}%</div>
              <div className={styles.statLabel}>Avg Completion</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Data Management</h3>
          <div className={styles.actions}>
            <button onClick={handleExport} className={styles.exportButton}>
              Export Data (JSON)
            </button>
            <button onClick={() => setIsDeleteDataModalOpen(true)} className={styles.deleteButton}>
              Delete All Data
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <div className={styles.actions}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={isDeleteDataModalOpen}
        title="Delete all data?"
        description="This action cannot be undone. All your habits and logs will be permanently deleted. Your account will remain active."
        confirmText="Delete Data"
        cancelText="Cancel"
        isLoading={isLoading}
        onConfirm={handleDeleteAllData}
        onCancel={() => setIsDeleteDataModalOpen(false)}
      />
    </div>
  );
};
