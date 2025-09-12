const Chat = require('../models/Chat');

export async function getAnalytics(businessId) {
  const totalChats = await Chat.countDocuments({ businessId });
  const chatsPerDay = await Chat.aggregate([
    { $match: { businessId } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  return { totalChats, chatsPerDay };
}
