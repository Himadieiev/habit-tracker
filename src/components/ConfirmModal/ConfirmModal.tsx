import {useEffect} from "react";
import {createPortal} from "react-dom";

import type {ConfirmModalProps} from "./types";
import styles from "./ConfirmModal.module.scss";

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </button>

          <button className={styles.confirm} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
