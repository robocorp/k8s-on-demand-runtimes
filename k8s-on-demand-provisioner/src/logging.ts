/* eslint-disable no-console */
type LogFn = (...args) => void;

export interface Logger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  log: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
}

interface LoggerConfig {
  name: string;
  logLevel?: LogLevel;
}

export enum LogLevel {
  ALL,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF,
}

const defaultOpts = {
  logLevel: LogLevel.INFO,
};

class ConsoleLogProxy implements Logger {
  constructor(private cfg: LoggerConfig) {
    if (!cfg.logLevel) this.cfg.logLevel = defaultOpts.logLevel;
  }

  trace(...args) {
    if (this.cfg.logLevel <= LogLevel.TRACE) {
      console.trace(`[${this.cfg.name}]`, ...args);
    }
  }

  debug(...args) {
    if (this.cfg.logLevel <= LogLevel.DEBUG) {
      console.debug(`[${this.cfg.name}]`, ...args);
    }
  }

  log(...args) {
    if (this.cfg.logLevel <= LogLevel.INFO) {
      console.log(`[${this.cfg.name}]`, ...args);
    }
  }

  info(...args) {
    if (this.cfg.logLevel <= LogLevel.INFO) {
      console.info(`[${this.cfg.name}]`, ...args);
    }
  }

  warn(...args) {
    if (this.cfg.logLevel <= LogLevel.WARN) {
      console.warn(`[${this.cfg.name}]`, ...args);
    }
  }

  error(...args) {
    if (this.cfg.logLevel <= LogLevel.ERROR) {
      console.error(`[${this.cfg.name}]`, ...args);
    }
  }

  fatal(...args) {
    if (this.cfg.logLevel <= LogLevel.FATAL) {
      console.error(`[${this.cfg.name}]`, 'FATAL', ...args);
    }
  }

  setLogLevel(logLevel: LogLevel) {
    this.cfg.logLevel = logLevel;
    return this;
  }
}

export default ConsoleLogProxy;

export const buildConsoleLogProxy = (cfg: LoggerConfig) =>
  new ConsoleLogProxy(cfg);

// eslint-disable-next-line
const noop = () => {};

export const NoopLogger = {
  trace: noop,
  debug: noop,
  info: noop,
  log: noop,
  warn: noop,
  error: noop,
  fatal: noop,
} as Logger;
