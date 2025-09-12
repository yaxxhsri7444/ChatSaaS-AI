const axioms = require('axios');

const GEMINI_KEY = process.env.GEMINI_KEY;
const EMB_MODEL = process.env.EMBEDDING_MODEL || 'all-MiniLM-L6-v2';

async function embedWithGemini(text) {
  if (!GEMINI_KEY) throw new Error('Gemini not configured');
  // NOTE: This is illustrative. Gemini's real HTTP API shape may differ — adapt per Google docs.
  const resp = await axios.post(GEMINI_ENDPOINT, { input: text }, {
    headers: { Authorization: `Bearer ${GEMINI_KEY}` }
  });
  return resp.data.embedding;
}

async function embedWithHF(text) {
  if (!HF_KEY) throw new Error('HF inference API key not set');
  const url = `https://api-inference.huggingface.co/embeddings/${EMB_MODEL}`;
  const resp = await axios.post(url, { inputs: text }, {
    headers: { Authorization: `Bearer ${HF_KEY}`, 'Content-Type': 'application/json' }
  });
  return resp.data.embedding || resp.data;
}

async function getEmbedding(text) {
  // Keep text length limited by user of chunking
  if (GEMINI_KEY ) {
    return await embedWithGemini(text);
  } else if (HF_KEY) {
    return await embedWithHF(text);
  } else {
    throw new Error('No embedding provider configured. Set GEMINI or HF keys.');
  }
}

module.exports = { getEmbedding };
