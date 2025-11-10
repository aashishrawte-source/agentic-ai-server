import { ChromaClient } from "chromadb";

async function main() {
  const client = new ChromaClient({
    path: "http://localhost:8000",
  });

  const collection = await client.getOrCreateCollection({
    name: "candidates",
  });

  const results = await collection.get({
    include: ["documents", "metadatas", "embeddings"],
    limit: 1000,
  });

  console.log("🔎 Stored Data:", results);
}

main();
