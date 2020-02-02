const soap = require('soap');

const url = 'http://localhost:3030/upperizer?wsdl';

exports.serviceResult = async wordLower => {
  await soap.createClient(url, (err, client) => {
    if (err) console.log(err);

    client.upperize({ wordLower }, async (error, response) => {
      if (error) console.log(error);

      return response;
    });
  });
};
