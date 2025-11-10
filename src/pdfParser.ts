import fs from "fs";
import axios from "axios";
import pdfParse from "pdf-parse";

export async function parseResume(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const dataBuffer = Buffer.from(response.data);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
}
