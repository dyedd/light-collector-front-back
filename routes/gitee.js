const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
const gitee = require('../utils/gitee')
router.get('/', async (req, res) => {
    // code=d20f674a3efaf3140840&state=a5ca5815a0389f872c06545722839546b5d80a08
    const code = req.query.code;
    // console.log(code)
    const result = await gitee.oauth(req,code);
    if(result.code == 200){
        res.redirect('http://localhost:3000/#/console/account')
    }
    // res.json({ result });
});

module.exports = router;