class Logger {
  constructor(base) {
    this.base = base || 'helong app';
  }
  generateMessage(level, message, source) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `[${this.base}]-${level}`;
    const formatted = typeof message === 'object' ? JSON.stringify(message) : message;
    if (source) {
      console.log(`${namespace} "${source}":${formatted}`);
    } else {
      console.log(`${namespace}: ${formatted}`);
    }
  }

  trace(message, source) {
    return this.generateMessage('trace', message, source);
  }

  info(message, source) {
    return this.generateMessage('info', message, source);
  }

  warn(message, source) {
    return this.generateMessage('warn', message, source);
  }

  error(message, source) {
    return this.generateMessage('error', message, source);
  }
}

export default Logger;
