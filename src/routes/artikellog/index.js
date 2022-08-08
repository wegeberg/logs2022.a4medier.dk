import express from 'express';
const router = express.Router();
import ArtikellogEntry from  "../../models/ArtikellogEntry";
import authenticated from "../../middleware/authenticated";
import { ikke } from '../../helpers/functions';

router.get('/', authenticated(async (req, res) => {
    const { page, size } = req.query;
    const getPagination = (page, size) => {
        const limit = size ? +size : 20;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    };

    const { limit, offset } = getPagination(page, size);

    // const page = typeof query.page !== "undefined" ? query.page : 1;
    const sort = { updatedAt: -1 };

    ArtikellogEntry.paginate({}, {
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

router.get('/count', async (req, res) => {
    ArtikellogEntry.countDocuments({},
    (err, result) => {
        res.status(200).json({number: result});
    });
});

// Hent artikelbesøg baseret på artiklens id
router.get('/:artikel_id', (req, res) => {
    const { artikel_id } = req.params;
    const { site_id = 0 } = req.query;
    const { page = 0, size = 25 } = req.query;
    const getPagination = (page, size) => {
        const limit = +size;
        const offset = page * limit;
        return { limit, offset };
    };
    
    const filter = { artikel_id: { $eq: +artikel_id }};

    if (+site_id > 0) {
        filter.site_id = { $eq: +site_id };
    }
    
    const { limit, offset } = getPagination(page, size);
    const sort = { createdAt: -1 };

    ArtikellogEntry.paginate(
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

router.post('/', async (req, res) => {
    const {email, artikel_id, id_token, ip } = req.body;

    if (ikke(artikel_id)) {
        res.status(202).json({error: "artikel_id mangler"}).end();
    } else if (ikke(email) && ikke(id_token) && ikke(ip)) {
        res.status(202).json({error: "Enten email eller id_token skal angives"}).end();
    } else {
        ArtikellogEntry.create({ ...req.body }, (err, result) => {
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