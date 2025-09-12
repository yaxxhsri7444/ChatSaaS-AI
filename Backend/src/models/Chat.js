const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  sessionId: String,
  userMsg: String,
  botReply: String,
  intent: String,
  entities: Object,
  sourceDocs: [{ title: String, url: String }],
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
