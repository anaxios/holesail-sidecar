import { wordlist } from "./eff_large_wordlist.js";

// Not complete only converts if base is smaller
function convertBase(base, number, modifier = (x) => x) {
  let result = [];
  let intermediate = number;
  while (intermediate > 0) {
    result.push(modifier(intermediate % base));
    intermediate = Math.floor(intermediate / base);
  }
  result.reverse();
  return Number(result.join(""));
}

async function requestRoll(count) {
  const url = "https://api.random.org/json-rpc/2/invoke";
  const body = {
    jsonrpc: "2.0",
    method: "generateIntegers",
    params: {
      apiKey: process.env.RANDOM_ORG_API_KEY,
      n: count,
      min: 0, // base ten of 11111
      max: 7775, // base ten of 66666
      replacement: true,
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
    return data.result.random.data;
  } catch (error) {
    console.error("Error fetching random hex string:", error);
  }
}

export default async function roll(count = 6) {
  const numbers = await requestRoll(count);
  const convertedNumbers = numbers.map((x) => convertBase(6, x, (a) => a + 1));
  const paddedNumbers = convertedNumbers.map((x) =>
    Number(x.toString().padStart(5, "1"))
  );
  let result = [];
  for (let n of paddedNumbers) {
    for (let key in wordlist) {
      if (key == n) {
        result.push(wordlist[key]);
      }
    }
  }
  return result.join("-");
}
