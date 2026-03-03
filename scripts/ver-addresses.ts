#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";

console.log("🔍 Consultando direcciones registradas...\n");

const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;

const response = await fetch(url, {
  method: "GET",
  headers: {
    "x-api-key": `ApiKey ${API_KEY}`,
  },
});

console.log("Status:", response.status);
const data = await response.text();
console.log("\nRespuesta:");
console.log(data);

try {
  const json = JSON.parse(data);
  console.log("\nJSON parseado:");
  console.log(JSON.stringify(json, null, 2));
} catch (e) {
  console.log("\nNo es JSON válido");
}
