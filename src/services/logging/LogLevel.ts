export enum LogLevel {
	TRACE = 0,
	DEBUG = 1,
	INFO = 2,
	WARN = 3,
	ERROR = 4,
}

export type LogLevelName = keyof typeof LogLevel
