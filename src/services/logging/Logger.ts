import { HostProvider } from "@/hosts/host-provider"
import { ErrorService } from "../error"
import * as fs from "fs/promises"
import * as path from "path"
import { LogLevel, LogLevelName } from "./LogLevel"

/**
 * Simple logging utility for the extension's backend code.
 */
export class Logger {
	public readonly channelName = "Cline Dev Logger"
	private static currentLevel: LogLevel = LogLevel.INFO
	private static logFilePath: string | null = null
	private static readonly MAX_LOG_SIZE = 5 * 1024 * 1024 // 5MB
	private static readonly MAX_LOG_FILES = 5
	private static writeQueue: Promise<void> = Promise.resolve()

	/**
	 * Sets the log level. Messages with a level lower than this will not be logged.
	 * @param level The new log level.
	 */
	static setLevel(level: LogLevelName) {
		Logger.currentLevel = LogLevel[level]
	}

	/**
	 * Initializes file logging.
	 * @param logFileName The name of the log file (e.g., "cline.log").
	 */
	static async initializeFileLogging(logFileName: string) {
		try {
			const storagePath = HostProvider.get().globalStorageFsPath
			// Ensure the directory exists
			await fs.mkdir(storagePath, { recursive: true })
			Logger.logFilePath = path.join(storagePath, logFileName)

			// Initial rotation check
			Logger.enqueueOp(() => Logger.rotateLogFileIfNeeded())
		} catch (error) {
			console.error("Failed to initialize file logging:", error)
		}
	}

	static error(message: string, error?: Error) {
		Logger.#output(LogLevel.ERROR, "ERROR", message, error)
		ErrorService.get().logMessage(message, "error")
		error && ErrorService.get().logException(error)
	}
	static warn(message: string) {
		Logger.#output(LogLevel.WARN, "WARN", message)
		ErrorService.get().logMessage(message, "warning")
	}
	static log(message: string) {
		Logger.#output(LogLevel.INFO, "LOG", message)
	}
	static debug(message: string) {
		Logger.#output(LogLevel.DEBUG, "DEBUG", message)
	}
	static info(message: string) {
		Logger.#output(LogLevel.INFO, "INFO", message)
	}
	static trace(message: string) {
		Logger.#output(LogLevel.TRACE, "TRACE", message)
	}

	static #output(level: LogLevel, levelName: string, message: string, error?: Error) {
		if (level < Logger.currentLevel) {
			return
		}

		let fullMessage = message
		if (error?.message) {
			fullMessage += ` ${error.message}`
		}

		const timestamp = new Date().toISOString()
		const formattedMessage = `[${timestamp}] [${levelName}] ${fullMessage}`

		// Log to output channel
		HostProvider.get().logToChannel(formattedMessage)
		if (error?.stack) {
			console.log(`Stack trace:\n${error.stack}`)
		}

		// Log to file
		if (Logger.logFilePath) {
			Logger.enqueueOp(() => Logger.#appendToFile(formattedMessage + "\n"))
		}
	}

	// Helper to serialize operations
	private static enqueueOp(op: () => Promise<void>) {
		Logger.writeQueue = Logger.writeQueue.then(op).catch(err => {
			console.error("Failed to write/rotate log:", err)
		})
	}

	static async #appendToFile(message: string) {
		if (!Logger.logFilePath) return
		try {
			await fs.appendFile(Logger.logFilePath, message)
			await Logger.rotateLogFileIfNeeded()
		} catch (error) {
			console.error("Failed to append to log file:", error)
		}
	}

	static async rotateLogFileIfNeeded() {
		if (!Logger.logFilePath) return

		try {
			const stats = await fs.stat(Logger.logFilePath).catch(() => null)
			if (!stats || stats.size < Logger.MAX_LOG_SIZE) {
				return
			}

			// Rotate files
			// cline.log.4 -> cline.log.5 (delete)
			// cline.log.3 -> cline.log.4
			// ...
			// cline.log -> cline.log.1

			for (let i = Logger.MAX_LOG_FILES - 1; i >= 1; i--) {
				const oldFile = `${Logger.logFilePath}.${i}`
				const newFile = `${Logger.logFilePath}.${i + 1}`
				if (await Logger.fileExists(oldFile)) {
					if (i === Logger.MAX_LOG_FILES - 1) {
						await fs.unlink(oldFile).catch(() => {})
					} else {
						await fs.rename(oldFile, newFile).catch(() => {})
					}
				}
			}

			if (await Logger.fileExists(Logger.logFilePath)) {
				await fs.rename(Logger.logFilePath, `${Logger.logFilePath}.1`)
			}

		} catch (error) {
			console.error("Failed to rotate log file:", error)
		}
	}

	static async fileExists(path: string): Promise<boolean> {
		try {
			await fs.access(path)
			return true
		} catch {
			return false
		}
	}
}
