import styles from "./styles.module.scss";
import infoIcon from "../../assets/Icon/Info-Square.svg";
import successIcon from "../../assets/Icon/success-icon.svg";
import warningIcon from "../../assets/Icon/warningIcon.svg";
import errorIcon from "../../assets/Icon/error.svg";
import dismissIcon from "../../assets/Icon/dismiss-icon.svg";
import { memo, useEffect, useState } from "react";
import { IToastMessage } from "../../types/toasters";

interface IToastProps extends IToastMessage {
  onDismiss?: () => any;
}

function Toast({ title, message, type, onDismiss }: Readonly<IToastProps>) {
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [dismissTimer, setDismissTimer] = useState<NodeJS.Timeout>();
  const [isPaused, setIsPaused] = useState(false);

  function handleDismiss() {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
    }
    setVisibility("hidden");
    onDismiss?.();
  }

  function getIcon() {
    switch (type) {
      case "info":
        return infoIcon;
      case "success":
        return successIcon;
      case "warning":
        return warningIcon;
      case "error":
        return errorIcon;
    }
  }

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        setVisibility("hidden");
        onDismiss?.();
      }, 3000);
      setDismissTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isPaused]);

  return (
    <div
      className={`${styles["toast-wrapper"]} ${styles[`type-${type}`]} ${styles[visibility]}`}
      onMouseEnter={() => {
        setIsPaused(true);
        if (dismissTimer) {
          clearTimeout(dismissTimer);
        }
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      <button data-testid="dismiss" onClick={handleDismiss}>
        <img alt="dismiss-icon" className={styles["dismiss-icon"]} src={dismissIcon} />
      </button>
      <div className={styles["title-wrapper"]}>
        <img alt="icon" className={styles["icon"]} src={getIcon()} />
        <h1 className={styles["title-text"]}>{title}</h1>
      </div>
      {message && (
        <div className={styles["message-wrapper"]}>
          <p className={styles["msg-text"]}>{message}</p>
        </div>
      )}
    </div>
  );
}
export default memo(Toast, (prevProps, nextProps) => {
  if (
    prevProps.type != nextProps.type ||
    prevProps.message != nextProps.message ||
    prevProps.title != nextProps.title
  )
    return false;
  return true;
});
