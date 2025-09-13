const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Путь к файлу для хранения корзин
const DATA_FILE = path.join(__dirname, 'carts.json');

// Проверяем, есть ли файл, если нет — создаём пустой массив
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Роут для приёма корзины
app.post('/submit', (req, res) => {
  const { order, frontendBalance, backendBalance } = req.body;

  if (!order || order.length === 0) {
    return res.status(400).send({ error: 'Cart is empty' });
  }

  // Читаем существующие данные
  let carts = JSON.parse(fs.readFileSync(DATA_FILE));

  // Добавляем новую корзину
  const newEntry = {
    timestamp: new Date().toISOString(),
    order,
    frontendBalance,
    backendBalance
  };
  carts.push(newEntry);

  // Сохраняем обратно
  fs.writeFileSync(DATA_FILE, JSON.stringify(carts, null, 2));

  res.send({ status: 'success', message: 'Cart saved to file' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
