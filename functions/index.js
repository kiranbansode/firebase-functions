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
            upvotedOn: [],
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

// http callable function adding new tutorial request
exports.addRequest = functions
    .region('asia-south1')
    .https.onCall((data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Only authenicated users can add allowed'
            );
        }
        if (data.text.length > 30) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Request must be less than 30 characters'
            );
        }
        return admin.firestore().collection('requests').add({
            text: data.text,
            upvotes: 0,
        });
    });

//  upvote callable function
exports.upvote = functions
    .region('asia-south1')
    .https.onCall(async (data, context) => {
        // check auth state
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Only authenicated users can add allowed'
            );
        }
        // get refs for user doc & request doc
        const user = admin
            .firestore()
            .collection('users')
            .doc(context.auth.uid);
        const request = admin.firestore().collection('requests').doc(data.id);

        const doc = await user.get();
        // check user hasn't already upvoted the request
        if (doc.data().upvotedOn.includes(data.id)) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'You can only upvote something once'
            );
        }
        // update user array
        await user.update({
            upvotedOn: [...doc.data().upvotedOn, data.id],
        });

        // update upvotes on request
        return request.update({
            upvotes: admin.firestore.FieldValue.increment(1),
        });
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
