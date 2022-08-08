/* root-router */
import { verify } from 'jsonwebtoken';
import constants from "../helpers/constants";
import express from 'express';

const { SECRET } = constants;
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Velkommen til logs.a4medier.dk' });
});
router.get('/jwt', async (req, res) => {
    const auth = req.header('Authorization') ?? null;
    if (!auth ) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        verify(auth, SECRET, async (err, decoded) => {
            if(!err && decoded) {
                console.log("authenticated");
                res.status(200).json({ 
                    message: "Authorized"
                });
                // return await fn(req, res);
            } else {
                res.status(401).json({ 
                    message: 'Unauthorized',
                    auth: auth
                });
            }  
        });
    }
});

export default router;