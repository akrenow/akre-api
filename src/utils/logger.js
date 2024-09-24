const winston = require("winston");
const moment = require("moment-timezone");

// Set the desired time zone (e.g., 'Asia/Kolkata' for Indian Standard Time)
const timeZone = "Asia/Kolkata";

const logFormat = winston.format.printf((info) => {
  const formattedTimestamp = moment(info.timestamp)
    .tz(timeZone)
    .format("YYYY-MM-DD HH:mm:ss");
  return `${formattedTimestamp} ${info.level}: ${info.message}`;
});
const Logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), logFormat),

  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./logs/allLogs.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: "./logs/error.log",
    }),
  ],
  exitOnError: false,
});

module.exports = Logger;
module.exports.stream = {
  write(message) {
    Logger.info(message);
  },
};
