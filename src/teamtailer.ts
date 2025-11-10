import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TEAMTAILER_API = "https://api.teamtailor.com/v1/candidates";

export interface Candidate {
    id: string;
    name: string;
    email: string;
    skills: string[];
    resumeUrl?: string;
    [key: string]: any;
}

export async function fetchCandidates(): Promise<Candidate[]> {
    if (!process.env.TEAMTAILOR_API_KEY) {
        throw new Error("TEAMTAILOR_API_KEY is not set in your .env file!");
    }

    let candidates: Candidate[] = [];
    let url: string | null = TEAMTAILER_API;

    const headers = {
        Authorization: `Bearer ${process.env.TEAMTAILOR_API_KEY}`,
        "X-Api-Version": "20240404",
        Accept: "application/vnd.api+json",
    };

    try {
        const res = await axios.get(TEAMTAILER_API, {
            headers: {
                Authorization: `Bearer ${process.env.TEAMTAILOR_API_KEY}`,
                "X-Api-Version": "20240404",
                Accept: "application/vnd.api+json",
            },
        });

        console.log("🔎 Raw fetched data:", res.data);

        const candidates: Candidate[] = res.data.data.map((c: any) => ({
            id: c.id,
            name: `${c.attributes["first-name"] ?? ""} ${c.attributes["last-name"] ?? ""}`.trim(),
            email: c.attributes.email,
            skills: c.attributes.skills || [],
            resumeUrl: c.attributes.resume || c.attributes["original-resume"],
        }));

        return candidates;




        // while (url) {
        //     const res = await axios.get(url, { headers }) as any;

        //     if (res.data?.data && Array.isArray(res.data.data)) {
        //         const pageCandidates: Candidate[] = res.data.data.map((c: any) => ({
        //             id: c.id,
        //             name: `${c.attributes["first-name"] ?? ""} ${c.attributes["last-name"] ?? ""}`.trim(),
        //             email: c.attributes.email,
        //             skills: c.attributes.skills || [],
        //             resumeUrl: c.attributes.resume || c.attributes["original-resume"],
        //         }));

        //         candidates = candidates.concat(pageCandidates);
        //     }


        //     url = res.data.links?.next ?? null;
        // }

        // console.log(`✅ Fetched total ${candidates.length} candidates.`);
        // return candidates;

    } catch (err: any) {
        console.error("❌ Error fetching candidates:", err.response?.status, err.response?.data || err.message);
        throw err;
    }
}
