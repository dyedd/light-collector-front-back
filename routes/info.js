
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
router.get('/', async (req, res) => {
    let [err, data] = await wrap(userController.findOne({
        "_id": req.cookies['uid'],
    }))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(data => {
        // console.log(data)
        res.json(data[0])
    })
});
router.patch('/', async (req, res) => {
    let [err, data] = await wrap(userController.update(req.body))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(data => {
        // console.log(data)
        res.json(data)
    })
});
module.exports = router;