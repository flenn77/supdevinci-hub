const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SupDeVinci Travel Hub – API en JS prête !' });
});

app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});
