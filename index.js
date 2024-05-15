const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from ibrahim ihsan!');
});

app.get('/FlipCoin', (req, res) => {
    return res.json({result: 1});
});

app.post('/SpeakToIbrahim', (req, res) => {
    const {userInput} = req.body.userInput;
    return res.json({response: userInput})
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
