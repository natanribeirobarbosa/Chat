const env = process.env.NODE_ENV || 'development'
const credentials = require(`./.credentials.${env}`);
const products = require('./products.json');
module.exports = { credentials, products }