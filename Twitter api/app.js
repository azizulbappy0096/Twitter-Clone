const express = require('express');
const app = express();
const port = 3000;

const Twitter = require('./helper/twitter');
const twitter = new Twitter;

require('dotenv').config();

var cors = require('cors');

app.use(cors());

app.get('/tweets', (req, res) => {
    const query = req.query.q;
    const count = req.query.count;
    const max_id = req.query.max_id;

    twitter.get(query, count, max_id).then(jsonResponse => {
        res.status(200).send(jsonResponse.data);
    })
    .catch(error => {
        res.status(400).send(error);
    })
  
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});