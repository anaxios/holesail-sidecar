import { execSync } from "child_process";
import  { run } from "node:test";
import { fileURLToPath } from "url";

const CYAN = "\x1b[1;96m";
const RED = "\x1b[0;91m";
const GREEN = "\x1b[0;92m";
const RESET = "\x1b[0m";

const print = (color, message) => {
  console.log(`${color}${message}${RESET}`);
};

const info = (message) => {
  print(CYAN, message);
};

const error = (message) => {
  print(RED, message);
};

const success = (message) => {
  print(GREEN, message);
};

const cmdArgumentBuilder = () => {
  let args = '';
  switch (process.env.MODE) {
    case "client":
      if (process.env.PORT) args += ` --port ${process.env.PORT}`;
      if (process.env.HOST) args += ` --host ${process.env.HOST}`;
      if (process.env.CONNECTOR) args += ` ${process.env.CONNECTOR}`;
      break;
    case "server":
      if (process.env.PORT) args += ` --live ${process.env.PORT}`;
      if (process.env.HOST) args += ` --host ${process.env.HOST}`;
      if (process.env.PUBLIC === "true") args += ` --public`;
      if (process.env.FORCE === "true") args += ` --force`;
      if (process.env.CONNECTOR) args += ` --connector ${process.env.CONNECTOR}`;
      break;
    case "filemanager":
      args += ` --filemanager`;
      if (process.env.FORCE === "true") args += ` --force`;
      if (process.env.PUBLIC === "true") args += ` --public`;
      if (process.env.HOST) args += ` --host ${process.env.HOST}`;
      if (process.env.USERNAME) args += ` --username ${process.env.USERNAME}`;
      if (process.env.PASSWORD) args += ` --password ${process.env.PASSWORD}`;
      if (process.env.ROLE === "admin") args += ` --role admin`;
      if (process.env.ROLE === "user") args += ` --role user`;
      if (process.env.CONNECTOR) args += ` --connector ${process.env.CONNECTOR}`;
      break;
    default:
      return '';
  }
  return args;
};

const args = cmdArgumentBuilder();

if (!args) {
  error("Invalid Mode.");
  process.exit(1);
}

const start = (args) => {
    const pm2cmd = `holesail ${args}`;
    try {
      execSync(pm2cmd, { stdio: "inherit" });
      success(`started '${args}'`);
    } catch (err) {
      error(`${err.message}`);
    }
};

start(args);