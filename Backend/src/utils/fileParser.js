const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

async function parsePDF(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();
  if (ext !== "pdf") {
    throw new Error("Unsupported file format. Only PDF files are supported.");
  }
  if (ext == "pdf") {
    const buf = fs.readFileSync(filePath);
    const data = await pdf(buf);
    return data.text || "";
  } else if (ext === "docx" || ext === "doc") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  } else {
    return fs.readFileSync(filePath, "utf-8");
  }
}

function chunkText(
  text,
  maxLen = parse(process.env.EMBEDDING_CHUNK_SIZE || "800", 10)
) {
  const chunks = [];
  let idx = 0;
  while (idx < text.length) {
    let slice = text.slice(idx, idx + maxLen);
    const lastNl = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
    if (lastNL > Math.floor(maxLen * 0.6)) {
      slice = text.slice(idx, idx + lastNL);
      idx = idx + lastNL;
    } else {
      idx = idx + maxLen;
    }
    chunks.push(slice.trim());
  }
  return chunks.filter(Boolean);
}

module.exports = { parsePDF, chunkText };