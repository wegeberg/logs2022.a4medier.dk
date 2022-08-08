import { verify } from 'jsonwebtoken';
import constants from "../helpers/constants";
const { SECRET } = constants;

const authenticated = fn => async (req, res) => {
    const auth = req.header('Authorization') ?? null;
    verify(auth, SECRET, async (err, decoded) => {
        if(!err && decoded) {
            if (process.env.NODE_ENV === 'development') {
                console.log("authenticated");
            }
            return await fn(req, res);
        }
        return res.status(401).json({message: "Sorry, you are not authenticated"});
    });
    // return await fn(req, res);
};
export default authenticated;
