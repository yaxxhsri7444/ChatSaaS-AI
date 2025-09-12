const mongoose = require('mongoose');

const VectorSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  docId: String,
  chunkText: String,
  embedding: { type: Array, required: true },
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

VectorSchema.index({ businessId: 1 });

module.exports = mongoose.model('Vector', VectorSchema);
