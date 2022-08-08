import express from 'express';
const router = express.Router();
import MaillogEntry from  "../../models/MaillogEntry";
import authenticated from "../../middleware/authenticated";

router.get('/', authenticated(async (req, res) => {
    const { page, size } = req.query;

    // const mail_id = typeof req?.query?.mail_id !== "undefined" ? req.query.mail_id : null;

    const getPagination = (page, size) => {
        const limit = size ? +size : 20;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    };

    const { limit, offset } = getPagination(page, size);

    // const page = typeof query.page !== "undefined" ? query.page : 1;
    const sort = { updatedAt: -1 };

    MaillogEntry.paginate({}, {
        sort,
        offset,
        limit,
    }, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });
}));

router.get('/sum', async(req, res) => {
    const { mail_id } = req.query;
    if (typeof mail_id === "undefined") {
        res.status(400).json({ "message": "Missing mail_id" });
    } else {
        // const filter = { mail_id: +mail_id };
        const filter = { mail_id: { $eq: +mail_id } };
        // const filter = {};
        try {
            MaillogEntry.aggregate(
                [
                    { $match: filter },
                    {
                        $group: {
                            _id: "$mail_id",
                            sum: { $sum: '$antal_open' }
                        }
                    }
                ],
                (err, result) => {
                    // console.log("result", result);
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(result);
                    }
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ "error": JSON.stringify(error) });
        }
    }
});

router.get('/unikke', async(req, res) => {
    const { mail_id } = req.query;
    if (typeof mail_id === "undefined") {
        res.status(400).json({ "message": "Missing mail_id" });
    } else {
        const filter = { mail_id: { $eq: +mail_id } };
        try {
            MaillogEntry.aggregate(
                [
                    { $match: filter },
                    { "$count": "antal" }
                ],
                (err, result) => {
                    // console.log("result", result);
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(result);
                    }
                }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ "error": JSON.stringify(error) });
        }
    }
});

router.get('/increment', async (req, res) => {
    const { mail_id = 0, email = null } = req.query;
    if (!mail_id || +mail_id === 0 || !email || email.indexOf('@') === -1) {
        res.status(202).json({error: "mail_id eller email mangler"}).end();
    } else {
        const image_string = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==';
        const im = image_string.split(",")[1];
        const img = Buffer.from(im, 'base64');
        try {
            await MaillogEntry.findOneAndUpdate(
                {
                    mail_id,
                    email
                }, 
                {
                    $inc: {
                        antal_open: 1
                    }
                },
                {
                    upsert: true,
                    useFindAndModify: false
                }
            );
            res.writeHead(200, {
                'Content-Type': 'image/gif',
                'Content-Length': img.length
             });
             
            res.end(img);
        } catch (err) {
            console.log("get error....");
            res.status(400).json({ message: err.message });
        }
    }
});

router.post('/', authenticated(async (req, res) => {
    const { mail_id, email } = req.body;
    if (!mail_id || +mail_id === 0 || !email || email.indexOf('@') === -1) {
        res.status(202).json({error: "mail_id eller email mangler"}).end();
    } else {
        try {
            const result = await MaillogEntry.findOneAndUpdate(
                {
                    mail_id,
                    email
                }, 
                {
                    $inc: {
                        antal_open: 1
                    }
                },
                {
                    upsert: true,
                    useFindAndModify: false
                }
            );
            if (result) {
                res.status(200).json(result._id);
            } else {
                res.status(201).json({message: "New entry created"});
            }
        } catch (err) {
            console.log("post error....");
            res.status(400).json({ message: err.message });
        }
    }
}));

export default router;