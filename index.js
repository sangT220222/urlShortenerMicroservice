require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory storage for URLs - best practice would be use a database
let url_database = {};
let url_count = 1;

app.post('/api/shorturl', (req,res) => {
  const original_url = req.body.url;
  try{
    new URL(original_url);
  }catch(e){
    return res.json( { error: 'invalid url' });
  }
  const short_url = url_count++;
  url_database[short_url] = original_url;
  res.json({ original_url : original_url, short_url : short_url});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
