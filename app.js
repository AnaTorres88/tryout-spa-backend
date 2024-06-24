import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

const port = 3000;
const app = express();
app.use(cors()); 

app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(errorHandler);

// This will return just mocks, however I decided to implement error handling anyway

/*
In a real case, each one of these would have their own middleware to handle exceptions and services.
Since this is a tryout with few actions I'm leaving them here.
*/

app.get('/users', async (req, res) => {
    try {
        const file = await fs.readFile('./data/users-mock.json', 'utf-8');
        if(!file) {
            throw new Error("File not found!!");
        }
        const users = JSON.parse(file);
        res.status(200).send({ users });
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.put('/users/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const fileDirectory = './data/users-mock.json'
    try {
        const file = await fs.readFile(fileDirectory, 'utf-8');
        if(!file) {
            throw new Error("File not found!!");
        }

        let users = JSON.parse(file);
        const index = users.data.findIndex(user => user.id === userId);

        if (index === -1) { 
            res.status(404).json({ error: `User with ID ${userId} not found` });
        }
        const usersCopy = {...users};
        usersCopy.data.splice(index, 1);
        res.status(204).json({users}); 
    
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.get('/news', async (req, res) => {
    try {
        const file = await fs.readFile('./data/news-mock.json', 'utf-8');
        if(!file) {
            throw new Error("File not found!!");
        }
        const news = JSON.parse(file);
        res.status(200).json({ news });
    } catch (err) {
        res.status(404).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
