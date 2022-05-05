const express = require('express')
const app = express()
const port = 5000
const path = require('path')
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, '../public')));
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const infoRouter = require('./routes/info');
const giteeRouter = require('./routes/gitee');
const categoryRouter = require('./routes/category');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate());
    },
    filename: function (req, file, cb) {
        const filenameArr = file.originalname.split('.');
        cb(null, Date.now() + '-' + filenameArr[filenameArr.length - 1]);
    }
})
const upload = multer({
    storage: storage
});
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//添加拦截器
// app.use(function (req, res, next) {
//     // 获取请求头中的Authorization认证字符
//     let authorization = req.headers['authorization'];
//     // 排除不需要授权的路由
//     if (['/api/login'].includes(req.path)) {
//         next();
//     } else if (req.path === '/api/user' && req.method.toLowerCase() === 'post') {
//         next();
//     } else if (req.path === '/api/oauth/gitee') {
//         req.user = req.cookies['uid']
//         next();
//     }
//     let secretOrPrivateKey = "dyedd";
//     if (!authorization) {
//         res.json({
//             code: 403,
//             msg: "认证无效，请重新登录。"
//         })
//         return;
//     }
//     jwt.verify(authorization.split(' ')[1], secretOrPrivateKey, function (err, decode) {
//         if (err) { //  认证出错
//             res.json({
//                 code: 403,
//                 msg: "认证无效，请重新登录。"
//             })
//         }
//         next();

//     })
// })
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/self', infoRouter);
app.use('/api/oauth/gitee', giteeRouter);
app.use('/api/category', categoryRouter);
//单个文件上传
app.post('/upload/single', upload.single('singleFile'), (req, res) => {
    console.log(req.file);
    res.json({
        code: '200',
        type: 'single',
        originalname: req.file.originalname
    })
});

//多个文件上传
app.post('/upload/multer', upload.array('multerFile'), (req, res) => {
    console.log(req.files);
    let fileList = [];
    req.files.map((elem) => {
        fileList.push({
            originalname: elem.originalname
        })
    });

    res.json({
        code: '200',
        type: 'multer',
        fileList: fileList

    });

});
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
module.exports = app;