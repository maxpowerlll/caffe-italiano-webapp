require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = path.join(__dirname, 'database', 'cafe.sqlite');
const db = new sqlite3.Database(dbFile, err => { if (err) console.error(err); });
db.run('CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY, name TEXT, phone TEXT, type TEXT, items TEXT)');

app.post('/api/order', async (req, res) => {
  const { name, phone, type, items } = req.body;
  db.run('INSERT INTO orders(name,phone,type,items) VALUES(?,?,?,?)',
    [name, phone, type, JSON.stringify(items)]);
  const total = items.reduce((s, i) => s + i.price, 0);
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.ADMIN_CHAT_ID,
      text: `Новый заказ от ${name} (${phone})\nТип: ${type}\nСумма: ${total} ₽`
    });
  } catch (e) { console.error(e); }
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
