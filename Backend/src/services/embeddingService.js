const axios = require('axios');

const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_ENDPOINT =
  process.env.GEMINI_ENDPOINT ||
  'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent';

/* ===============================
   Gemini Embeddings
================================ */
async function embedWithGemini(text) {
  if (!GEMINI_KEY) {
    throw new Error('GEMINI_KEY not configured. Get one at https://aistudio.google.com/app/apikey');
  }
  
  try {
    const url = `${GEMINI_ENDPOINT}?key=${GEMINI_KEY}`;
    const resp = await axios.post(
      url,
      {
        model: 'models/embedding-001',
        content: {
          parts: [{ text }]
        }
      },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    const values =
      resp.data?.embedding?.values ||
      resp.data?.embeddings?.[0]?.values;
    
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new Error('Unexpected Gemini embedding response');
    }
    
    console.log('✅ Embedding generated, dimension:', values.length);
    return values;
    
  } catch (err) {
    console.error(
      '❌ Gemini embedding error:',
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.error?.message || err.message || 'Gemini embedding failed'
    );
  }
}

/* ===============================
   Main Embedding Function
================================ */
async function getEmbedding(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a string');
  }
  
  const cleaned = text.trim();
  if (!cleaned) {
    throw new Error('Input text cannot be empty');
  }
  
  const MAX_LEN = 8000;
  const input = cleaned.length > MAX_LEN
    ? cleaned.slice(0, MAX_LEN)
    : cleaned;
  
  console.log('🔵 Using Gemini embeddings');
  return embedWithGemini(input);
}

module.exports = { getEmbedding };