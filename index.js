const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from ibrahim ihsan!');
});

app.get('/FlipCoin', (req, res) => {
    return res.json({result: 1});
});

app.post('/SpeakToIbrahim', (req, res) => {
    const {userInput} = req.body;
    return res.json({response: userInput})
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
