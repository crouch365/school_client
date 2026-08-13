import { Component, type ErrorInfo, type ReactNode } from 'react';

import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Глобальный предохранитель: при любой ошибке рендера
 * показывает экран «Что-то пошло не так» с перезагрузкой.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary поймал ошибку:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.root}>
          <div className={styles.icon} aria-hidden="true">
            ⚠️
          </div>
          <h1 className={styles.title}>Что-то пошло не так</h1>
          <p className={styles.text}>
            Произошла непредвиденная ошибка. Попробуйте перезагрузить
            приложение.
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={this.handleReload}
          >
            Перезагрузить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}