const admin = require("firebase-admin");
const initFS = () => {
    try {
        return admin.initializeApp({ credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
        }) }).firestore();
    } catch (_) {
        return admin.firestore();
    }
};

module.exports = { initFS };
