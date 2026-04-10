import classNames from "classnames";

import styles from "./Button.module.scss";
import type {ButtonProps} from "./types";

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isLoading && styles.loading,
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
};
