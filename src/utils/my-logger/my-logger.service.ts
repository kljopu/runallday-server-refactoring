import { Injectable, LoggerService, Inject } from '@nestjs/common';
import {
  Logger,
  transports,
  createLogger,
  format,
  LoggerOptions,
} from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
import * as os from 'os';
import { ConfigService } from 'nestjs-config';
// 로컬 ip를 저장
const ifaces = os.networkInterfaces();
let localIp: string;

@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger: Logger;
  // private readonly startProfileTime: Date;
  // private readonly endProfileTime: Date;
  private readonly prettyError = new PrettyError();
  private readonly color = chalk;
  private readonly applicationLogPrint = format.printf(info => {
    return `[${info.level}]\
 [${this.color.yellow(info.host || '-')}]\
 ${this.color.yellow(info.clusterIp || '-')}\
 [${this.color.yellow(info.timestamp)}]\
 [${info.context || '-'}]\
 ${info.message}\
 ${this.color.yellow(info.description || '-')}\
 ${info.trace || '-'}`;
  });
  private readonly addMetaInfoFormat = format((info, opt) => {
    info.host = localIp;
    info.clusterIp = process.env.pm_id;
    return info;
  });
  private readonly consoleLogCombineFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.splat(),
    this.addMetaInfoFormat(),
    this.applicationLogPrint,
  );
  private readonly fileLogCombineFormat = format.combine(
    format.timestamp(),
    format.splat(),
    this.addMetaInfoFormat(),
    format.json(),
  );
  private readonly loggerOption: LoggerOptions = {
    transports: [
      new transports.Console({
        level: this.config.get('app.logLevel'),
        format: this.consoleLogCombineFormat,
      }),
      new DailyRotateFile({
        level: this.config.get('app.logLevel'),
        dirname: './logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '5d',
        format: this.fileLogCombineFormat,
      }),
    ],
    exitOnError: false,
  };

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    // 로컬 머신의 사설 ip 확인
    for (const dev in ifaces) {
      const iface = ifaces[dev].filter(details => {
        return details.family === 'IPv4' && details.internal === false;
      });

      if (iface.length > 0) {
        localIp = iface[0].address;
      }
    }
    this.logger = createLogger(this.loggerOption);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }
  get Logger(): Logger {
    return this.logger;
  }
  log(message: any, context?: string, ...args: any) {
    const _logger: Logger = context
      ? this.logger.child({ context })
      : this.logger;
    _logger.info(message, ...args);
  }

  error(
    message: any,
    context: string,
    trace: string,
    description?: string,
    ...args: any
  ) {
    const _logger: Logger = this.logger.child({ context, description, trace });
    _logger.error(message, ...args);
    // TODO: 에러 메세지 깔끔하게 다듬기.
    // if (trace && process.env.NODE_ENV === 'develop')
    //   this.prettyError.render(trace, true);
  }
  warn(message: any, context?: string, ...args: any) {
    const _logger: Logger = context
      ? this.logger.child({ context })
      : this.logger;
    _logger.warn(message, ...args);
  }
  debug(message: any, context?: string, ...args: any) {
    const _logger: Logger = context
      ? this.logger.child({ context })
      : this.logger;
    _logger.debug(message, ...args);
  }
  verbose(message: any, context?: string, ...args: any) {
    const _logger: Logger = context
      ? this.logger.child({ context })
      : this.logger;
    _logger.verbose(message, ...args);
  }
}
