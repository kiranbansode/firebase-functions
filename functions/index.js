const functions = require('firebase-functions');

// http function 1
exports.randomNumber = functions
    .region('asia-south1')
    .https.onRequest((request, response) => {
        const number = Math.round(Math.random() * 100);
        response.send(number.toString());
    });

// http function 2
exports.toGoogle = functions
    .region('asia-south1')
    .https.onRequest((request, response) => {
        response.redirect('https://www.google.com');
    });
