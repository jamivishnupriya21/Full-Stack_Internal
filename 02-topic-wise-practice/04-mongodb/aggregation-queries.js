// Run in mongosh or via Mongoose: Order.aggregate([...])

// 1. Total sales per category
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  { $sort: { total: -1 } },
]);

// 2. Average order value per customer, top 5
db.orders.aggregate([
  { $group: { _id: "$customerId", avgOrder: { $avg: "$amount" } } },
  { $sort: { avgOrder: -1 } },
  { $limit: 5 },
]);

// 3. Join orders with customers
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer",
    },
  },
  { $unwind: "$customer" },
  { $project: { amount: 1, "customer.name": 1 } },
]);
