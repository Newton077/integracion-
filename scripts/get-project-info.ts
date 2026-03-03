/**
 * Script para obtener información de tu proyecto en Wavy Node
 * Esto te ayudará a encontrar tu PROJECT_ID
 */

const API_KEY = "wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV";
const WAVYNODE_API_URL = "https://api.wavynode.com/v1";

async function getProjects() {
  console.log("🔍 Obteniendo información de proyectos...\n");

  try {
    const response = await fetch(`${WAVYNODE_API_URL}/projects`, {
      method: "GET",
      headers: {
        "x-api-key": `ApiKey ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }

    const projects = await response.json();
    
    console.log("✅ Proyectos encontrados:");
    console.log(JSON.stringify(projects, null, 2));
    
    if (Array.isArray(projects) && projects.length > 0) {
      console.log("\n📌 Tu PROJECT_ID es:", projects[0].id);
      console.log("\nAgrega esto a tu archivo .env:");
      console.log(`WAVYNODE_PROJECT_ID="${projects[0].id}"`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

getProjects();
