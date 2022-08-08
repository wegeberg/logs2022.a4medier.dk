import express from 'express';
const router = express.Router();
import BrugerlogEntry from  "../../models/BrugerlogEntry";
// import authenticated from "../../middleware/authenticated";
import { ikke } from '../../helpers/functions';
import escapeStringRegexp from 'escape-string-regexp';

router.get('/count', async (req, res) => {
    BrugerlogEntry.countDocuments({},
    (err, result) => {
        res.status(200).json({number: result});
    });
});

// Filtrér alle entries - pagineret
// Parameters (optional): page, size, ip, ip_slut, site_id, email, id_token
router.get('/', async (req, res) => {
    const { page, size, ip = 0, ip_slut = 0, site_id = 0, email = null, id_token = null, path = null } = req.query;
    const getPagination = (page, size) => {
        const limit = size ? +size : 20;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    };

    const filter = {};
    if (+ip > 0) {
        filter.ip = +ip_slut > 0
            ? { $gte: +ip, $lte: +ip_slut }
            : { $eq: +ip };
    }
    if (+site_id > 0) {
        filter.site_id = { $eq: +site_id };
    }
    if (email) {
        filter.email = { $eq: email };
    }
    if (id_token) {
        filter.id_token = { $eq: id_token };
    }
    if (id_token) {
        filter.id_token = { $eq: id_token };
    }
    if (path) {
        const $regex = escapeStringRegexp(path);
        filter.path = { $regex  }
    }

    const { limit, offset } = getPagination(page, size);

    const sort = { updatedAt: -1 };

    BrugerlogEntry.paginate(
        filter, 
        {
            sort,
            offset,
            limit,
        }, 
        (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(result);
            }
        }
    );
});

// Find alle entries fra email
router.get('/bruger', async (req, res) => {
    const { email } = req.query;
    if(ikke(email)) {
        res.status(400).json({ "message": "Missing email" });
    } else {
        const filter = { email: { $eq: email } };
        try {
            BrugerlogEntry.aggregate(
                [
                    { $match: filter },
                    {
                        $sort: {
                            createdAt: -1
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

// Find alle entries fra IP (eller IP range) og evt. startdato
router.get('/ip', async (req, res) => {
    const { ip = 0, slut = 0, startDate = null } = req.query;
    if(ikke(ip)) {
        res.status(400).json({ "message": "Missing ip" });
    } else {
        // const filter = { ip: { $eq: +ip } };
        const filter = slut > ip 
            ? { ip: { $gte: +ip, $lte: +slut } } 
            : { ip: { $eq: +ip } };
        if (startDate) {
            filter.createdAt = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0))
            };
        }
        try {
            BrugerlogEntry.aggregate(
                [
                    { $match: filter },
                    {
                        $sort: {
                            createdAt: -1
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

// Find alle page visits fra IP range
router.get('/ip/count', async (req, res) => {
    const { ip = 0, slut = 0, startDate = null } = req.query;
    if(ikke(ip)) {
        res.status(400).json({ "message": "Missing ip" });
    } else {
        // const filter = { ip: { $eq: +ip } };
        const filter = slut > ip 
            ? { ip: { $gte: +ip, $lte: +slut } } 
            : { ip: { $eq: +ip } };
        if (startDate) {
            filter.createdAt = {
                $gte: new Date(new Date(startDate).setHours(0, 0, 0))
            };
        }
        try {
            BrugerlogEntry.countDocuments(
                filter,
                (err, result) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json({number: result});
                    }
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ "error": JSON.stringify(error) });
        }
    }
});

// Find alle entries fra id_token
router.get('/token', async (req, res) => {
    const { id_token } = req.query;
    if(ikke(id_token)) {
        res.status(400).json({ "message": "Missing id_token" });
    } else {
        const filter = { id_token: { $eq: id_token } };
        try {
            BrugerlogEntry.aggregate(
                [
                    { $match: filter },
                    {
                        $sort: {
                            createdAt: -1
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

// Find alle en brugers id_tokens
router.get('/brugertokens', async (req, res) => {
    const { email } = req.query;
    if(ikke(email)) {
        res.status(400).json({ "message": "Missing email" });
    } else {
        const filter = { email: { $eq: email } };
        try {
            BrugerlogEntry.distinct(
                "id_token",
                filter,
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

// Tiløj entry
router.post('/', async (req, res) => {
    const {email, id_token, ip } = req.body;

    if (ikke(email) && ikke(id_token) && ikke(ip)) {
        res.status(202).json({error: "Enten email, IP eller id_token skal angives"}).end();
    } else {
        BrugerlogEntry.create({ ...req.body }, (err, result) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                // console.log("create-result", result);
                res.status(201).json(result._id)
            }
        });
    }
});

export default router;