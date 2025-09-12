const axios = require('axios');
const WITAI_TOKEN = process.env.WITAI_TOKEN;

if (!WITAI_TOKEN) {
  console.warn('Wit.ai token not set; intent recognition will be skipped');
}

async function parseIntent(text) {
  if (!WITAI_TOKEN) return { intent: null, entities: {} };
  const url = `https://api.wit.ai/message?v=20230412&q=${encodeURIComponent(text)}`;
  try {
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${WITAI_TOKEN}` }});
    const intents = res.data.intents || [];
    const topIntent = intents[0]?.name || null;
    return { intent: topIntent, entities: res.data.entities || {} };
  } catch (err) {
    console.error('Wit.ai error:', err.message);
    return { intent: null, entities: {} };
  }
}

module.exports = { parseIntent };
