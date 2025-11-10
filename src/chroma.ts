import { ChromaClient } from "chromadb";

const client = new ChromaClient();

function flattenMetadata(metadata: Record<string, any>) {
    const flat: Record<string, string | number | boolean | null> = {};
    for (const key in metadata) {
        const value = metadata[key];
        if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            flat[key] = value;
        } else if (Array.isArray(value)) {
            flat[key] = value.join(", ");
        } else if (typeof value === "object") {
            flat[key] = JSON.stringify(value);
        } else {
            flat[key] = String(value);
        }
    }
    return flat;
}


export async function insertCandidate(
    id: string,
    text: string,
    metadata: Record<string, any>,
    embedding: number[]
) {
    // await client.deleteCollection({ name: "candidates" });
    const collection = await client.getOrCreateCollection({
        name: "candidates",
    });

    const flatMetadata = flattenMetadata(metadata);

    await collection.add({
        ids: [id],
        documents: [text],
        metadatas: [flatMetadata],
        embeddings: [embedding]
    });

    const savedData = await collection.get({
        include: ["documents", "metadatas", "embeddings"],
        limit: 10,
    });

}
