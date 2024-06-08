require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const body_parser = require('body-parser');
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(body_parser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory storage for URLs - best practice would be to use a database
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

app.get('/api/shorturl/:shorturl', (req,res) => {
  const short_url = req.params.shorturl;
  console.log(short_url);
  const original_url = url_database[short_url]; //locating original url with short_url as key
  
  if(original_url){
    res.redirect(original_url);
  }else{
    return res.json( { error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
