import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import serviceAccount from './service_account.json' assert { type:'json' };

import { authenticate } from './Middleware/auth';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => console.log("Server running on port 4000"));

app.get("/user", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userRecord = await admin.auth().getUser(uid);
        const role = req.user.role || 'user'; // Default role is 'user' if not specified

        res.json({
            uid: userRecord.uid,
            email: userRecord.email,
            role,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user data" })
    }
});

