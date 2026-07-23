import pino from "pino";

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== "production";

const devTransport: pino.TransportSingleOptions | undefined = isDev
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss.l",
        ignore: "pid,hostname",
      },
    }
  : undefined;

export const logger = pino({
  level: isDev ? "debug" : "info",
  ...(devTransport ? { transport: devTransport } : {}),
  base: { service: "lector-online" },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
  },
});
