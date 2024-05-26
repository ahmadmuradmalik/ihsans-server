const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./logger'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const OpenAI = require('openai');


const openai = new OpenAI({
 apiKey: process.env.OPENAI_KEY,
 baseURL: "https://gateway.ai.cloudflare.com/v1/d8a573ad3dfc51cf2fc5d9fa6448f0cc/staging/openai"
});

const PORT = process.env.PORT || 5050;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use CORS to allow requests from your frontend domain
app.use(cors({
    origin: ['https://dev-ihsan-client.vercel.app','http://localhost:3000']
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
    const { userInput } = req.body;
    return res.json({ response: userInput });
});

// New route to add a conversation to the database
app.post('/addConversation', async (req, res) => {
    const { sessionId, conversation } = req.body;

    try {
        console.log("recieved, ", {conversation})
        
        const newConversation = await prisma.conversation.create({
            data: {
                sessionId: sessionId,
                conversation: conversation,
            },
        });
    

        console.log("hi")

        const chatCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0613",
          messages: [{ role: "user", content: "Tell me a joke!" }],
          max_tokens: 100,
        });

        console.log("bye")
      

        const response = chatCompletion.choices[0].message;

        console.log(response.content);
      
      
        res.status(201).json(response.content);

        // res.status(201).json(newConversation);
    } catch (error) {
        console.log(error);
        logger.error('Error adding conversation', { error });
        res.status(500).json({ error: 'An error occurred while adding the conversation' });
    }
});

app.post('/upload', async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      console.log("sending req...");
      const response = await axios.post(
        'http://127.0.0.1:8000/uploadActivities',
        { user_id },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log("Received response from FastAPI:", response);

      return res.json({
        success: true,
        message: 'Activities received from FastAPI successfully',
        data: response.data,
      });
    } catch (error) {
      console.log("Error occurred in the request to FastAPI:");
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.detail || 'Error from FastAPI',
        });
      } else {
        console.log("Error setting up request:", error.message);
        return res.status(500).json({
          success: false,
          message: 'Error sending File to FastAPI',
        });
      }
    }
  } catch (error) {
    console.log("Unexpected error:", error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
