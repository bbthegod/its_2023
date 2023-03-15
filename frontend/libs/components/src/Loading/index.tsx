/*
 *
 * Loading
 *
 */
import styles from './index.module.scss';

export function Loading() {
  return (
    <div className={styles['loading-wrapper']}>
      <div className={styles['loader']}>
        <svg viewBox="0 0 80 80">
          <circle id="test" cx="40" cy="40" r="32"></circle>
        </svg>
      </div>
    </div>
  );
}
