import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import fs from 'fs';
import { execSync } from 'child_process';

const filename = "/root/.pm2/logs/app-out.log";

const app = new Hono();

const connector = createConnection("25565", process.env.HOST);

app.get('/api/v1/connector_string', (c) => {
  return c.text(connector);
});

serve({
  fetch: app.fetch,
  port: 8787,
});


//function loadConnection() {
//  try {
//    return fs.readFileSync(filename, "utf8");
//  } catch (err) {
//    console.error(`Error reading ${filename}: ${err}`);
//    return "";
//  }
//}
//
//function extractConnectionString() {
//  let connectionString = null;
//  fs.writeFileSync('/temp/connection_string.log', connectionString);
//}

function generateRandomString(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let connector = "";
  for (let i = 0; i < length; i++) {
    connector += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return connector;
}

function createConnection(port, name) {
  const connector = generateRandomString(128);

  // Start PM2 process for the new connection
  const pm2cmd = `pm2 start holesail --name ${name} -- --live ${port} --host ${name} --connector "${connector}"`;
  try {
    execSync(pm2cmd, { stdio: "inherit" });
    console.log(`Started '${name}' using PM2 on port ${port}.`);
    return connector; // Return the generated connector
  } catch (err) {
    console.error(`Error starting '${name}' using PM2: ${err.message}`);
    return null; // Return null if there was an error
  }
}