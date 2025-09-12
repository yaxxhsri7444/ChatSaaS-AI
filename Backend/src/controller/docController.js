const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractText, chunkText } = require('../utils/fileParser');
const { getEmbedding } = require('../services/embeddingService');
const vectorService = require('../services/vectorService');
const Business = require('../models/Business');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// POST /api/docs/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const business = req.business; // ensure this route is protected in route mounting
    const filePath = req.file.path;
    const text = await extractText(filePath);
    if (!text || text.trim().length === 0) return res.status(400).json({ error: 'No extractable text' });

    // chunk
    const chunks = chunkText(text);

    // process chunks: embed + upsert to vector store
    const docId = uuidv4();
    const points = [];
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      try {
        const emb = await getEmbedding(c);
        const pointId = `${business._id.toString()}_${docId}_${i}`;
        // upsert to qdrant
        await vectorService.upsertToQdrant({ id: pointId, vector: emb, payload: { businessId: business._id.toString(), docId, title: req.file.originalname, chunkIndex: i } });
        // fallback store in mongo as well (optional)
        await vectorService.storeInMongo({ businessId: business._id, docId, chunkText: c, embedding: emb, metadata: { title: req.file.originalname, url: `/uploads/${path.basename(filePath)}`, chunkIndex: i } });
      } catch (err) {
        console.warn('Embedding/upsert failed for chunk', i, err.message);
      }
    }

    // register document in business
    business.documents.push({ title: req.file.originalname, url: `/uploads/${path.basename(filePath)}`, chunkCount: chunks.length, externalId: docId });
    await business.save();

    res.json({ message: 'Uploaded and processed', doc: { title: req.file.originalname, url: `/uploads/${path.basename(filePath)}`, chunkCount: chunks.length } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
