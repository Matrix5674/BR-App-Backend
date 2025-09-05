import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";


import { authenticate } from './Middleware/auth.js';

const PORT = process.env.PORT || 4000;

dotenv.config();

const serviceAccount = JSON.parse(process.env.SERVICEACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${4000}`));

app.get("/user", authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userRecord = await admin.auth().getUser(uid);
        const role = req.user.role || 'user'; 

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

