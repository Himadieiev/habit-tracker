import {NavLink} from "react-router-dom";
import classNames from "classnames";

import styles from "./Navigation.module.scss";

export const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({isActive}) => classNames(styles.link, {[styles.active]: isActive})}
      >
        Habits
      </NavLink>
      <NavLink
        to="/stats"
        className={({isActive}) => classNames(styles.link, {[styles.active]: isActive})}
      >
        Statistics
      </NavLink>
    </nav>
  );
};
