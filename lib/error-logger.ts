// Error Logging Utility
export interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: string;
  userId?: string;
  url?: string;
  userAgent?: string;
  severity: "low" | "medium" | "high" | "critical";
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  /**
   * Log an error
   */
  log(
    error: Error | string,
    context?: string,
    severity: ErrorLog["severity"] = "medium"
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message:
        typeof error === "string" ? error : error.message,
      stack: typeof error === "string" ? undefined : error.stack,
      context,
      severity,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined"
          ? navigator.userAgent
          : undefined,
    };

    this.logs.push(errorLog);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${severity.toUpperCase()}]`, errorLog);
    }

    // Send to error tracking service (optional)
    this.sendToServer(errorLog);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: string): void {
    this.log(message, context, "low");
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: string): void {
    this.log(message, context, "medium");
  }

  /**
   * Log a critical error
   */
  critical(message: string, context?: string): void {
    this.log(message, context, "critical");
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Send error to server for logging
   * Replace this with your actual error tracking service
   * (e.g., Sentry, LogRocket, Rollbar, etc.)
   */
  private sendToServer(errorLog: ErrorLog): void {
    // Example: Send to your backend
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog)
    // }).catch(console.error);

    // For now, just log to console
    console.debug("[ErrorLogger] Would send to server:", errorLog);
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Hook for logging errors in React components
 */
export function useErrorLogger() {
  return {
    log: errorLogger.log.bind(errorLogger),
    info: errorLogger.info.bind(errorLogger),
    warn: errorLogger.warn.bind(errorLogger),
    critical: errorLogger.critical.bind(errorLogger),
  };
}
