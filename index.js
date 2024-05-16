const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./logger'); 



const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use CORS to allow requests from your frontend domain
app.use(cors({
    origin: 'https://dev-ihsan-client.vercel.app/'
  }));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, { query: req.query, body: req.body });
    next();
});

app.get('/', (req, res) => {
  try {
    const flip = Math.random();
    let feelings;
    if (flip < 0.4) {
        feelings = "I am gay";
    } else if (flip > 0.6) {
        feelings = "I am gay";
    } else {
        feelings = "i am not gay";
    }
    logger.info(
        'Flipped a coin for Ibrahim Ihsan',
         { flip, feelings });

    return res.send(feelings);
  }
  catch (error) {
    // logger.log({
    //   level: 'error',
    //   message: 'Error in flipping coin for ibrahim ihsan',
    //   error
    // })
    logger.error(
        'Error in flipping coin for Ibrahim Ihsan', 
        { error }
    );


    res.status(500).json({error:`An error ocurred flipping a coin: ${error}`})
  }
})


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
