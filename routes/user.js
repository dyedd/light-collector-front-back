const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
router.post('/', async (req, res) => {
    const username = req.body.name;
    const password = req.body.password;
    const mail = req.body.email
    if (username == null || username.trim() == '' || password == null || password.trim() == ''|| mail == null || mail.trim() == '') {
        res.json({
            code: 500,
            msg: '信息不能为空'
        })
        return
    }
    let [err, data] = await wrap(userController.create({
        "username": username,
        "password": password,
        "email":mail
    }))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(item => {
        if (item.id >= 1) {
            res.json({
                code: 200,
                msg: '注册成功',
                data: item
            })
        } else {
            res.json({
                code: 500,
                msg: "添加失败",
                data: item
            })
        }
    })
});
router.get('/', async (req, res) => {
    let [err, data] = await wrap(userController.findAll())
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(data => {
        res.json(data)
    })
});
router.get('/:id', async (req, res) => {
    let [err, data] = await wrap(userController.findOne({
        "_id": req.params.id,
    }))
    // console.log(data)
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(data => {
        res.json(data)
    })
});
module.exports = router;