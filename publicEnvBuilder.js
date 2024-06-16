require('dotenv').config({ path: '.env' });  
const fs = require('fs');

fs.writeFileSync(
  './public/publicEnv.js',
  `
 const process = {
          env: {
            REACT_APP_FIREBASE_CONFIG_API_KEY: '${process.env.REACT_APP_FIREBASE_CONFIG_API_KEY}',
            REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN: '${process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN}',
            REACT_APP_FIREBASE_PROJECT_ID: '${process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID}',
            REACT_APP_FIREBASE_CONFIG_PROJECT_ID: '${process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET}',
            REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID: '${process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID}',
            REACT_APP_FIREBASE_CONFIG_APP_ID: '${process.env.REACT_APP_FIREBASE_CONFIG_APP_ID}',
            REACT_APP_FIREBASE_CONFIG_MEASUREMENT_ID: '${process.env.REACT_APP_FIREBASE_CONFIG_MEASUREMENT_ID}'
  }
 }`
);