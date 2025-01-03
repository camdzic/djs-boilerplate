import { container } from "@/index";
import { type Color, bgCyan, bgRed, bgYellow } from "colorette";

type LoggerType = "info" | "warn" | "error";

type LoggerOptions = {
  type: LoggerType;
  message: unknown;
};

export class Logger {
  private readonly colors: Record<LoggerType, Color> = {
    info: bgCyan,
    warn: bgYellow,
    error: bgRed
  };

  private writeToConsole(options: LoggerOptions) {
    const { type, message } = options;

    if (typeof message !== "string" && !(message instanceof Error)) {
      container.logger.error(
        "Logger message must be a string or an instance of Error"
      );
      return;
    }

    const color = this.colors[type];

    console.log(`${color(`  ${type.toUpperCase()}  `)} ${message}`);
  }

  info(message: unknown) {
    this.writeToConsole({ type: "info", message });
  }

  warn(message: unknown) {
    this.writeToConsole({ type: "warn", message });
  }

  error(message: unknown) {
    this.writeToConsole({ type: "error", message });
  }
}
