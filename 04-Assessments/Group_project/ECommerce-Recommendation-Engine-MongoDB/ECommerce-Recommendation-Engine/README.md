# RecoAI – E-Commerce Recommendation Engine (Association Rules)

Stack: **React + TypeScript (Vite)** · **Flask** · **MongoDB** · **Apriori (mlxtend)**

## How it works
1. Transactions are stored in the MongoDB `transactions` collection (seeded from `backend/transactions.csv` on first start).
2. On startup, Flask loads them, runs Apriori (min support 5%) and builds association rules (min confidence 20%).
3. React calls the API to show popular products, recommendations (support / confidence / lift), cart, orders and the admin dashboard.

MongoDB collections: `users` (unique email, hashed password), `orders`, `transactions`.

## Run it

### 1. MongoDB
```bash
docker compose up -d          # or use a MongoDB Atlas URI
```
Optional: set `MONGO_URI` / `MONGO_DB_NAME` (see `backend/.env.example`). Defaults: `mongodb://localhost:27017`, db `recoai`.

### 2. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py                                         # http://127.0.0.1:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                                           # http://localhost:5173
```

## Notes
- User and order IDs are now MongoDB ObjectId strings (previously SQLite integers). If you were logged in before, log out / log in again (and register again – the old `users.db` is no longer used).
- To add more transactions, insert documents `{TransactionID, Products: "A|B|C"}` into the `transactions` collection and restart the backend.
