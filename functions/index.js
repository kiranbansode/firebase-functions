const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// auth triggers (user signUp)

exports.newUserSignUp = functions
    .region('asia-south1')
    .auth.user()
    .onCreate((user) => {
        // for background trigger you must return a promise/value
        return admin.firestore().collection('users').doc(user.uid).set({
            email: user.email,
            upVoted: [],
        });
    });

// auth triggers (user delete)

exports.userDelete = functions
    .region('asia-south1')
    .auth.user()
    .onDelete((user) => {
        // for background trigger you must return a promise/value
        const userData = admin.firestore().collection('users').doc(user.uid);
        return userData.delete();
    });

// // http function 1
// exports.randomNumber = functions
//     .region('asia-south1')
//     .https.onRequest((request, response) => {
//         const number = Math.round(Math.random() * 100);
//         response.send(number.toString());
//     });

// // http function 2
// exports.toGoogle = functions
//     .region('asia-south1')
//     .https.onRequest((request, response) => {
//         response.redirect('https://www.google.com');
//     });

// // http callable functions
// exports.sayHello = functions
//     .region('asia-south1')
//     .https.onCall((data, context) => {
//         const { name } = data;
//         return `Hello, ${name} the ninja`;
//     });
