const express = require('express');
const { parseIntent } = require('../services/witService');
const { getEmbedding } = require('../services/embeddingService');
const vectorService = require('../services/vectorService');
const Chat = require('../models/Chat');

const router = express.Router();

const TOP_K = 4;

// POST /api/chat/query  (protected, auth middleware should set req.business)
router.post('/query', async (req, res) => {
  try {
    const business = req.business;
    const { text, sessionId } = req.body;
    if (!text) return res.status(400).json({ error: 'No text' });

    // 1) NLU
    const { intent, entities } = await parseIntent(text);

    // 2) embedding for query
    const qEmb = await getEmbedding(text);

    // 3) vector search (Qdrant preferred, with fallback)
    const searchRes = await vectorService.searchVectors(qEmb, { must: [{ key: 'businessId', match: { value: business._id.toString() } }] }, TOP_K);

    // Normalize results into text/context
    let contextPieces = [];
    let sourceDocs = [];
    if (Array.isArray(searchRes)) {
      for (const item of searchRes) {
        // qdrant returns item.payload or similar; adjust as needed
        const payload = item.payload || item;
        const textSnippet = payload.text || item.chunkText || (payload?.text);
        const title = (payload?.title) || (payload?.payload?.title) || 'document';
        contextPieces.push(`${title}: ${textSnippet}`);
        sourceDocs.push({ title, url: payload.url || payload?.payload?.url });
      }
    }

    const context = contextPieces.join('\n\n');

    // 4) Response generation:
    // Here we don't call a paid LLM — instead we build a template reply using context & intent.
    // Optionally if you wire a local LLM (Ollama / HF text-generation) you can call it here.
    let reply = "Sorry — I couldn't find an exact answer in your documents.";
    if (contextPieces.length) {
      reply = `Based on your documents:\n${contextPieces.slice(0,3).join('\n\n')}\n\nAnswer: (Use this as a base)`;
    } else if (intent) {
      reply = `Detected intent: ${intent}. I don't have doc context but here's a response based on intent.`;
    }

    // Save chat
    const chat = new Chat({
      businessId: business._id,
      sessionId,
      userMsg: text,
      botReply: reply,
      intent,
      entities,
      sourceDocs
    });
    await chat.save();

    res.json({ reply, sourceDocs, intent, entities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
