import styles from "./Avatar.module.scss";

type AvatarProps = {
  email: string;
  onClick?: () => void;
};

export const Avatar = ({email, onClick}: AvatarProps) => {
  const initial = email?.[0]?.toUpperCase() || "?";

  return (
    <button className={styles.avatar} onClick={onClick}>
      <span className={styles.initial}>{initial}</span>
    </button>
  );
};
