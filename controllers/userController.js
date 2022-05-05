const exec = require('../db/mysql')
const md5 = require('blueimp-md5');
const {
    insertDb,
    selectDb,
    updateDb
} = require('../utils/db');
const create = async (req) => {
    req['password'] = md5(req['password'])
    const custom = insertDb(req)
    // console.log(custom);
    const sql = `insert into user(${custom['key']}) values(${custom['value']})`
    const params = custom['params']
    const insert = await exec(sql, params);
    return {
        id: insert.insertId
    };
}
const findOne = async (req) => {
    const custom = selectDb(req, 'or')
    // console.log(custom);
    const sql = `select * from user where ${custom['key']}`
    console.log(sql);
    const params = custom['params']
    // const sql = "select * from user where _id=? or username=? or gitee_id=?"
    // const params = [res['_id'], res['username'], res['gitee_id']]
    const data = await exec(sql, params);
    return data;
}
const findAll = async () => {
    const sql = "select * from user"
    const data = await exec(sql);
    return data;
}

const update = async (req) => {
    // if(Object.hasOwnProperty.call(req, 'categories')){
    //     const selectSql = 'SELECT JSON_PRETTY(categories) as categories from user where _id=?';
    //     const selectData = await exec(selectSql, [req['_id']]);
    //     const tmp = req.categories;
    //     // console.log(selectData[0]['categories']);
    //     // console.log([...JSON.parse(selectData[0]['categories'])]);
    //     let categories = selectData[0]['categories'] != null ? [...JSON.parse(selectData[0]['categories']), tmp] : [tmp];
    //     // console.log(categories);
    //     // console.log(categories.map(item => item.toString()));
    //     categories = categories.map(item => item.toString())
    //     req['categories'] = JSON.stringify(categories)
    // }
    if(Object.hasOwnProperty.call(req, 'categories')){
        const selectSql = 'SELECT categories from user where _id=?';
        const selectData = await exec(selectSql, [req['_id']]);
        const tmp = req.categories;
        let categories = selectData[0]['categories'] != 0 ? selectData[0]['categories']+tmp : tmp;
        req['categories'] = categories
    }
    if (Object.hasOwnProperty.call(req, 'gitee_id')) {
        req['gitee_id'] = req['gitee_id'].toString()
    }
    // console.log(req);
    const custom = updateDb(req)
    // console.log(custom);
    const sql = `update user set ${custom['key']} where ${custom['where']}`;
    // console.log(sql);
    let params = custom['value'];
    // console.log(params);
    const data = await exec(sql, params);
    // console.log(sql);
    // console.log(data);
    // console.log(daya,sql);
    return {
        row: data.affectedRows
    };
}
const del = async (id) => {
    const sql = "delete from stu where sid=?"
    const params = [id]
    const data = await exec(sql, params);
    return {
        row: data.affectedRows
    };
}
const login = async (res) => {
    const sql = "select * from user where username=? AND password=?"
    const params = [res.username, md5(res.password)]
    const data = await exec(sql, params);
    return data;
}
module.exports = {
    create,
    findOne,
    findAll,
    update,
    del,
    login
}