//const fetch = require('node-fetch');
//import dotenv from 'dotenv';
//dotenv.config();

export default async function randomHexString() {
  const url = "https://api.random.org/json-rpc/2/invoke";
  const body = {
    jsonrpc: "2.0",
    method: "generateBlobs",
    params: {
      apiKey: process.env.RANDOM_ORG_API_KEY,
      n: 1,
      size: 512,
      format: "hex",
    },
    id: 42,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result.random.data[0];
  } catch (error) {
    console.error("Error fetching random hex string:", error);
  }
}
