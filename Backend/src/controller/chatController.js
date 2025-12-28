// src/controllers/chatController.js
const { parseIntent } = require('../services/witService');
const { getEmbedding } = require('../services/embeddingService');
const vectorService = require('../services/vectorService');
const Chat = require('../models/Chat');

const TOP_K = 4;

async function chatQuery(req, res) {
  console.log('📨 Chat query received');
  
  try {
    const business = req.business;
    const { text, sessionId } = req.body;
    
    // Validation
    if (!business) {
      return res.status(401).json({ error: 'Business not authenticated' });
    }
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and must be non-empty' });
    }
    
    const trimmedText = text.trim();
    console.log('📝 Query text:', trimmedText.substring(0, 100));

    // 1️⃣ Intent parsing (non-critical)
    let intent = null;
    let entities = {};
    try {
      console.log('🔄 Parsing intent...');
      const nlp = await parseIntent(trimmedText);
      intent = nlp.intent;
      entities = nlp.entities || {};
      console.log('✅ Intent parsed:', intent);
    } catch (e) {
      console.warn('⚠️ Intent parse failed (non-critical):', e.message);
    }

    // 2️⃣ Generate embedding
    console.log('🔄 Generating embedding...');
    const qEmb = await getEmbedding(trimmedText);
    console.log('✅ Embedding generated, dimension:', qEmb?.length);
    
    if (!qEmb || !Array.isArray(qEmb) || qEmb.length === 0) {
      throw new Error('Failed to generate valid embedding');
    }

    // 3️⃣ Vector search
    console.log('🔍 Searching vectors...');
    const filter = {
      must: [{ 
        key: 'businessId', 
        match: { value: business._id.toString() } 
      }]
    };
    
    const searchRes = await vectorService.searchVectors(qEmb, filter, TOP_K);
    console.log('✅ Search complete, results:', searchRes?.length || 0);

    // 4️⃣ Process search results
    let contextPieces = [];
    let sourceDocs = [];
    
    if (Array.isArray(searchRes) && searchRes.length > 0) {
      for (const item of searchRes) {
        try {
          // Handle both Qdrant and MongoDB fallback structures
          const payload = item.payload || item.doc || item;
          const text = payload.text || payload.chunkText || item.chunkText;
          
          if (text && typeof text === 'string' && text.trim().length > 0) {
            contextPieces.push(text.trim());
            sourceDocs.push({
              title: payload.title || 'Document',
              url: payload.url || null,
              score: item.score || 0
            });
          }
        } catch (itemErr) {
          console.warn('⚠️ Error processing search result:', itemErr.message);
          // Continue processing other items
        }
      }
    }

    console.log('📄 Context pieces found:', contextPieces.length);

    // 5️⃣ Build reply
    let reply;
    if (contextPieces.length > 0) {
      const topContexts = contextPieces.slice(0, 3);
      reply = topContexts.join('\n\n---\n\n');
      
      // Add metadata if helpful
      if (contextPieces.length > 3) {
        reply += `\n\n(${contextPieces.length - 3} additional sources available)`;
      }
    } else {
      reply = 'No relevant data found in your documents. Try rephrasing your question or uploading relevant documents.';
    }

    // 6️⃣ Save chat history
    console.log('💾 Saving chat...');
    await Chat.create({
      businessId: business._id,
      sessionId: sessionId || 'default',
      userMsg: trimmedText,
      botReply: reply,
      intent,
      entities: Object.keys(entities).length > 0 ? entities : undefined, // Only save if not empty
      sourceDocs: sourceDocs.length > 0 ? sourceDocs : undefined // Only save if not empty
    });
    console.log('✅ Chat saved successfully');

    res.json({ 
      success: true, 
      reply, 
      sourceDocs,
      contextsFound: contextPieces.length,
      intent: intent || undefined // Don't send null
    });
    
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    console.error('Stack:', err.stack);
    
    // Provide helpful error messages
    let errorMessage = 'An error occurred processing your query';
    
    if (err.message.includes('embedding')) {
      errorMessage = 'Failed to process your query text. Please try again.';
    } else if (err.message.includes('Qdrant') || err.message.includes('search')) {
      errorMessage = 'Search service temporarily unavailable. Please try again.';
    } else if (err.message.includes('database') || err.message.includes('Chat')) {
      errorMessage = 'Failed to save chat history. Your query was processed but not saved.';
    }
    
    res.status(500).json({ 
      success: false,
      error: process.env.NODE_ENV === 'production' ? errorMessage : err.message,
      debug: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

module.exports = { chatQuery };