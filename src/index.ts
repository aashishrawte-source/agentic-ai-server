import dotenv from "dotenv";
dotenv.config();
import { fetchCandidates } from "./teamtailer";
import { parseResume } from "./pdfParser";
import { generateEmbedding } from "./embeddings";
import { insertCandidate } from "./chroma";

async function main() {
    const candidates = await fetchCandidates();

    for (const candidate of candidates) {
        let resumeText = "";

        if (candidate.resumeUrl) {
            try {
                resumeText = await parseResume(candidate.resumeUrl);
            } catch (err) {
                console.error(`Failed to parse PDF for ${candidate.name}:`, err);
            }
        }

        const textForEmbedding = resumeText || "No resume text available";
        const embedding = await generateEmbedding(textForEmbedding);

        await insertCandidate(candidate.id, textForEmbedding, {
            name: candidate.name,
            email: candidate.email,
            skills: candidate.skills
        }, embedding);

        console.log(`✅ Saved candidate: ${candidate.name} \n ${JSON.stringify(candidate)}`);
    }
}

main().catch(console.error);

