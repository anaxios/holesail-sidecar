import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fs from "fs";
import { execSync } from "child_process";
import randomHexString from "./randomness.js";
import roll from "./random_words.js";

const filename = "/root/.pm2/logs/app-out.log";

const app = new Hono();

const connector = await createConnection("25565", process.env.HOST);

app.get("/api/v1/connector_string", (c) => {
  return c.text(connector);
});

// app.get("/api/v1/random/:count?", async (c) => {
//   const count = Math.min(Math.floor(Math.abs(c.req.param("count"))), 1000) || 6;
//   // const count = c.req.param("count") || 16;

//   return c.text(await roll(count));
// });

serve({
  fetch: app.fetch,
  port: 8787,
});

async function createConnection(port, name) {
  const res = await fetch(
    `https://random.daedalist.net/api/random/16/token/${process.env.RANDOM_ORG_API_KEY}`
  ); //roll(16); //await randomHexString(); //generateRandomString(128);
  const connector = await res.text();
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
