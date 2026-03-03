#!/usr/bin/env bun

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const PROJECT_ID = "1";

console.log("🧪 Probando diferentes formatos para foreign_user_id...\n");

// Probar diferentes variaciones del campo
const tests = [
  {
    name: "Con foreign_user_id",
    body: {
      address: "0x1234567890123456789012345678901234567890",
      foreign_user_id: "test-user-001",
      description: "Test 1"
    }
  },
  {
    name: "Con foreignUserId (camelCase)",
    body: {
      address: "0x1234567890123456789012345678901234567891",
      foreignUserId: "test-user-002",
      description: "Test 2"
    }
  },
  {
    name: "Con user_id",
    body: {
      address: "0x1234567890123456789012345678901234567892",
      user_id: "test-user-003",
      description: "Test 3"
    }
  },
  {
    name: "Con userId",
    body: {
      address: "0x1234567890123456789012345678901234567893",
      userId: "test-user-004",
      description: "Test 4"
    }
  }
];

const url = `https://api.wavynode.com/v1/projects/${PROJECT_ID}/addresses`;

for (const test of tests) {
  console.log(`📤 Probando: ${test.name}`);
  console.log(`   Body:`, JSON.stringify(test.body));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `ApiKey ${API_KEY}`,
      },
      body: JSON.stringify(test.body),
    });

    const responseText = await response.text();
    
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log(`   ✅ Respuesta:`, JSON.stringify(data, null, 2));
      } catch {
        console.log(`   ✅ Respuesta:`, responseText);
      }
    } else {
      console.log(`   ❌ Error:`, responseText);
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error);
  }
  
  console.log();
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log("═".repeat(70));
console.log("Verifica cuál formato funcionó en el dashboard");
