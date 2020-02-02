const path = require('path');
const soap = require('soap');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

/**
 * this is remote service defined in this file, that can be accessed by clients, who will supply args
 * response is returned to the calling client
 * our service calculates bmi by dividing weight in kilograms by square of height in metres
 */

const service = {
  Upperizer_Service: {
    Upperizer_Port: {
      upperize(args) {
        const n = args.wordLower.toLocaleUpperCase();
        return { word: n };
      }
    }
  }
};
// xml data is extracted from wsdl file created
const wsdl = path.join(__dirname, 'wsdl', 'upperizer.wsdl');
const xml = require('fs').readFileSync(wsdl, 'utf8');
//create an express server and pass it to a soap server
const server = app.listen(3030, function() {
  // const host = '127.0.0.1';
  // const port = server.address().port;
  console.log('Ruuning on port 3030');
});
soap.listen(server, '/upperizer', service, xml);
