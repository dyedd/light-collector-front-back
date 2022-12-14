const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
const jwt = require('jsonwebtoken');
router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username == null || username.trim() == '' || password == null || password.trim() == '') {
        res.json({
            code: 500,
            msg: '用户名密码不能为空'
        })
        return
    }
    let [err, data] = await wrap(userController.login({
        "username": username,
        "password": password
    }))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
    } else {
        data.then(item => {
            console.log(item);
            if (item.length == 0) {
                res.json({
                    code: 200,
                    msg: "账号密码错误",
                })
            } else {
                let secretOrPrivateKey = "dyedd";
                // console.log(item[0]['_id']);
                let token = jwt.sign({
                    id: item[0]['_id']
                }, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 * 7 // 一周过期
                });
                res.cookie("uid", item[0]['_id'], {
                    maxAge: 60 * 60 * 24 * 7 * 1000,
                });
                res.json({
                    code: 200,
                    msg: "登录成功",
                    token
                })
            }

        })
    }
});
module.exports = router;