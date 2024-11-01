const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Initialize Sendinblue client
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

// Add a log statement to check if the API key is being loaded correctly
console.log('Sendinblue API Key:', process.env.SENDINBLUE_API_KEY);

const sendinblueApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = sendinblueApiInstance;
