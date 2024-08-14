import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { execSync } from "child_process";

const filename = "/root/.pm2/logs/app-out.log";

const app = new Hono();

const connector = await createConnection("25565", process.env.HOST);

app.get("/api/v1/connector_string", (c) => {
  return c.text(connector);
});

serve({
  fetch: app.fetch,
  port: 8787,
});

async function createConnection(port, name) {
  const res = await fetch(
    `https://random.daedalist.net/api/random/16/token/${process.env.RANDOM_ORG_API_KEY}`
  );
  const connector = await res.text();

  // Start PM2 process for the new connection
  const pm2cmd = `pm2 start holesail --name ${name} -- --live ${port} --host ${name} --connector "${connector}"`;
  try {
    execSync(pm2cmd, { stdio: "inherit" });
    console.log(`Started '${name}' using PM2 on port ${port}.`);
    return connector;
  } catch (err) {
    console.error(`Error starting '${name}' using PM2: ${err.message}`);
    return null;
  }
}
