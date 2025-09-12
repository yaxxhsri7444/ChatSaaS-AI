const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now },
  chunkCount: { type: Number, default: 0 },
  externalId: String // optional: id in vector store
});

const BusinessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  subscriptionPlan: { type: String, default: 'free' },
  tenantId: { type: String }, // duplicated id for quick filtering
  documents: [DocumentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
