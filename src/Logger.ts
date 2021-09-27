import winston from 'winston';

export class Logger {
    private _id: string;
    private _level: string;
    private _formatter: winston.Logform.Format;

    constructor(id: string, logLevel: 'info' | 'debug' = 'debug', format: 'classic' | 'json' = 'classic') {
        this._id = id;
        this._level = logLevel;
        this._formatter = format === 'json' ? this.getJsonFormatter() : this.getClassicalFormatter();

        this.createMainLogger();
    }

    private createMainLogger() {
        winston.loggers.add(this._id, {
            transports: [
                new winston.transports.Console({
                    level: this._level,
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        this._formatter,
                    ),
                }),
            ],
        });
    }

    getLogger(path: string) {
        return winston.loggers.get(this._id).child({
            file: path,
        });
    }

    private getClassicalFormatter() {
        return winston.format.combine(
            winston.format.printf((info) => `${info.timestamp} ${info.file} [${info.level}]: ${info.message}`),
        );
    }

    private getJsonFormatter() {
        return winston.format.combine(
            winston.format.printf((info) => JSON.stringify(info).replace(/\\n/g, '\\n').replace(/\\t/g, '\\t')),
        );
    }
}
