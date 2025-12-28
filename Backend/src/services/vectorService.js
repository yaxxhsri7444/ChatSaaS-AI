const qdrant = require('../config/qdrantClient');
const VectorModel = require('../models/Vector');

const COLLECTION = 'business_docs';

async function ensureCollection() {
  try {
    const exists = await qdrant.getCollections();
    const collNames = (exists.collections || []).map(c => c.name);
    if (!collNames.includes(COLLECTION)) {
      await qdrant.createCollection({
        collection_name: COLLECTION,
        vectors: { size: 768, distance: 'Cosine' } // Updated to match Gemini embedding dimension
      });
    } else {
      // Check if vector size matches
      const collectionInfo = await qdrant.getCollection(COLLECTION);
      const currentSize = collectionInfo.config.params.vectors.size;
      if (currentSize !== 768) {
        console.log(`Recreating collection ${COLLECTION} due to size mismatch: ${currentSize} -> 768`);
        await qdrant.deleteCollection(COLLECTION);
        await qdrant.createCollection({
          collection_name: COLLECTION,
          vectors: { size: 768, distance: 'Cosine' }
        });
      }
    }
  } catch (err) {
    console.warn('Qdrant unavailable or not configured: ', err.message);
  }
}

// store a point in Qdrant
async function upsertToQdrant(point) {
  // point: { id, vector, payload }
  try {
    await qdrant.upsert(COLLECTION, { points: [point] });
  } catch (err) {
    console.error('Qdrant upsert error:', err.message);
    throw err;
  }
}

// fallback: store in Mongo
async function storeInMongo(vectorDoc) {
  const v = new VectorModel(vectorDoc);
  await v.save();
  return v;
}

// search in qdrant
async function searchVectors(vector, filter = {}, limit = 5) {
  try {
    const res = await qdrant.search(COLLECTION, { vector, limit, filter });
    return res;
  } catch (err) {
    // fallback to mongo (naive)
    console.warn('Qdrant search failed — falling back to Mongo');
    // Parse Qdrant filter to Mongo filter
    let mongoFilter = {};
    if (filter.must) {
      for (const cond of filter.must) {
        if (cond.key && cond.match) {
          mongoFilter[cond.key] = cond.match.value;
        }
      }
    }
    const docs = await VectorModel.find(mongoFilter).lean().limit(2000);
    // compute cosine locally
    function cosine(a,b){ let dot=0,na=0,nb=0; for(let i=0;i<a.length;i++){dot+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}return dot/(Math.sqrt(na)*Math.sqrt(nb)+1e-8); }
    const scored = docs.map(d=>({score:cosine(vector,d.embedding), doc:d}));
    scored.sort((x,y)=>y.score-x.score);
    return scored.slice(0,limit).map(s=>({ id: s.doc._id, payload: s.doc.metadata, vector: s.doc.embedding, chunkText: s.doc.chunkText }));
  }
}

module.exports = { ensureCollection, upsertToQdrant, storeInMongo, searchVectors };
