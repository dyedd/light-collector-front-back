const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
router.get('/', async (req, res) => {
    let [err, data] = await wrap(categoryController.listOne({
        "uid": req.cookies['uid'],
    }))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    data.then(data => {
        for (const item of data) {
            // console.log(JSON.parse(item.repos));
            item.repos = JSON.parse(item.repos)
            let n = 0;
            for(const r of item.repos){
                r.index = n++;
            }
            // console.log(item.repos);
        }
        res.json(data)
    })
});
router.post('/', async (req, res) => {
    console.log(req.body);
    let [_, num] = await wrap(categoryController.listOne({
        "uid": req.cookies['uid']
      }))
      const number = await num;
    let [err, data] = await wrap(categoryController.save({
        cid: number[number.length-1]['_id']+1,
        ...req.body
    }))
    if (err) {
        res.json({
            code: 500,
            msg: err
        })
        return;
    }
    await wrap(userController.update({
        categories: 1,
        "_id": req.cookies['uid']
      }))
    data.then(data => {
        res.json(data)
    })

});
router.patch('/', async (req, res) => {
    if(req.query.move=='card'){
        const { moveFromId, moveFromIndex, moveToId, moveToIndex } = req.body;
        console.log({ moveFromId, moveFromIndex, moveToId, moveToIndex });
        if (moveFromId === moveToId) {
            let [err1, move] = await wrap(categoryController.listOne({
                "uid": req.cookies['uid'],
                "cid": moveFromId
            },'and'))
            arr = JSON.parse((await move)[0]['repos']);
            // console.log(arr);
            [arr[moveToIndex],arr[moveFromIndex]] = [arr[moveFromIndex],arr[moveToIndex]]
            let [err2, _] = await wrap(categoryController.update({
                "repos":JSON.stringify(arr),
                "uid": req.cookies['uid'],
                "cid": moveFromId,
            },"and", 1))
            if (err1 || err2) {
                res.json({
                    code: 500,
                    msg: err1 || err2
                })
                return;
            }
            res.json({
                code:200,
                msg:'移动成功'
            })
            return;
        }
        let [err1, moveFrom] = await wrap(categoryController.listOne({
            "uid": req.cookies['uid'],
            "cid": moveFromId
        },'and'))
        let [err2, moveTo] = await wrap(categoryController.listOne({
            "uid": req.cookies['uid'],
            "cid": moveToId
        },'and'))
        if (err1 || err2) {
            res.json({
                code: 500,
                msg: err1 || err2
            })
            return;
        }
        fromArr = await moveFrom;
        toArr = await moveTo;
        fromRepos = JSON.parse(fromArr[0]['repos'])
        toRepos = JSON.parse(toArr[0]['repos'])
        // console.log(fromRepos);
        // console.log(toRepos);
        const delRepos = fromRepos.splice(moveFromIndex,1);
        toRepos.splice(moveToIndex,0,delRepos[0])
        // console.log(22222);
        // console.log(fromRepos);
        // console.log(toRepos);
        let [err3, fromData] = await wrap(categoryController.update({
            "repos":JSON.stringify(fromRepos),
            "uid": req.cookies['uid'],
            "cid": moveFromId,
        },"and", 1))
        let [err4, toData] = await wrap(categoryController.update({
            "repos":JSON.stringify(toRepos),
            "uid": req.cookies['uid'],
            "cid": moveToId,
        },"and", 1))
        if (err3 || err4) {
            res.json({
                code: 500,
                msg: err3 || err4
            })
            return;
        }
        res.json({
            code:200,
            msg:'卡片移动成功'
        })
        return;
    }else if(req.query.move=='list'){
        const {  moveFromIndex, moveToIndex } = req.body;
        console.log({  moveFromIndex, moveToIndex });
        let [_, old] = await wrap(categoryController.listOne({
            "uid": req.cookies['uid'],
            "cid": moveFromIndex
        },'and'))
        const oldItem = (await old)[0]
        console.log(2,oldItem);
        // console.log(oldItem);
        // console.log(oldItem['_id']);
        let [_1, new2] = await wrap(categoryController.listOne({
            "uid": req.cookies['uid'],
            "cid": moveToIndex
        },'and'))
        const newItem = (await new2)[0]
        console.log(newItem);
        // console.log(newItem['_id']);
        let [err1, fromData] = await wrap(categoryController.update({
            "cid": moveToIndex,
            "uid": req.cookies['uid'],
            "_id": oldItem['_id']
        },"and", 1))
        let [err2, toData] = await wrap(categoryController.update({
            "cid": moveFromIndex,
            "uid": req.cookies['uid'],
            "_id": newItem['_id']
        },"and", 1))
        res.json({
            code:200,
            msg:'分类移动成功'
        })
        return;
    }else if(req.query.delete=='card'){
        const { moveFromId, moveFromIndex } = req.body;
        let [err, moveFrom] = await wrap(categoryController.listOne({
            "uid": req.cookies['uid'],
            "cid": moveFromId
        },'and'))
        fromArr = await moveFrom;
        fromRepos = JSON.parse(fromArr[0]['repos'])
        // console.log(fromRepos);
        // console.log(toRepos);
        fromRepos.splice(moveFromIndex,1);
        let [err2, fromData] = await wrap(categoryController.update({
            "repos":JSON.stringify(fromRepos),
            "uid": req.cookies['uid'],
            "cid": moveFromId,
        },"and", 1))
        if(err || err2){
            res.json({
                code:500
            })
            return;
        }
        res.json({
            code:200,
            msg:'卡片删除成功'
        })
    }else if(req.query.update=='card'){
        const { catename,id } = req.body;
        let [err2, toData] = await wrap(categoryController.update({
            "name": catename,
            "uid": req.cookies['uid'],
            "_id": id
        },"and", 1))
        res.json({
            code:200,
            msg:'重命名成功'
        })
    }
});
router.delete('/', async (req, res) => {
    // if(req.query.move=='list'){

    // }
    // console.log(req.body);
    let [err, data] = await wrap(categoryController.del({
        "_id": req.body['_id'],
    }))
    await wrap(userController.update({
        categories: -1,
        "_id": req.cookies['uid']
      }))
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