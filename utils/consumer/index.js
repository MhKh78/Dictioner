const express = require('express');
const soap = require('soap');

const url = 'http://localhost:3030/upperizer?wsdl';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome To Upperizer WebService Consumer');
});

app.get('/upperize/:wordLower', (req, res) => {
  const { wordLower } = req.params;

  soap.createClient(url, (err, client) => {
    if (err) console.log(err);

    client.upperize({ wordLower }, (error, response) => {
      if (error) console.log(error);

      res.json(response);
    });
  });
});
