const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/text', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
