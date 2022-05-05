const exec = require('../db/mysql')
const userController = require('../controllers/userController');
const wrap = require('../utils/wrap')
const {
  insertDb,
  selectDb,
  updateDb
} = require('../utils/db');
const fileds = '_id,name,JSON_PRETTY(repos) as repos,uid,createAt,updateAt, cid'
const listAll = async () => {
  const sql = `select ${fileds} from category order by cid`
  const data = await exec(sql);
  return data;
}
const listOne = async (req, cz='or') => {
  const custom = selectDb(req, cz)
    const sql = `select ${fileds} from category where ${custom['key']} order by cid`
    // console.log(sql);
    const params = custom['params']
    const data = await exec(sql, params);
    return data;
}
const save = async (req)=>{
  req['uid'] = parseInt(req['uid'])
  req['repos'] = JSON.stringify(req['repos'])
  const custom = insertDb(req)
  const sql = `insert into category(${custom['key']}) values(${custom['value']})`
  const params = custom['params']
  // console.log(params);
  const insert = await exec(sql, params);
  // console.log(insert);
  return {
    id: insert.insertId,
  };
}
const update = async (req,cz='or',num=1) => {
  // console.log(req);
  // if(Object.hasOwnProperty.call(req, 'repos')){
  //     // const selectSql = 'SELECT JSON_PRETTY(repos) as reop from category where uid=? and _id=?';
  //     // const selectData = await exec(selectSql, [req['uid']], [req['_id']]);
  //     // const tmp = req.repos;
  //     // let repos = selectData[0]['repos'] != null ? [...JSON.parse(selectData[0]['repo']), tmp] : [tmp];
  //     // console.log(repos);
  //     // // repos = repos.map(item => item.toString())
  //     req['repos'] = JSON.stringify(repos)
  // }
  // console.log(req);
  // console.log(req);
  const custom = updateDb(req,cz,num)
  // console.log(custom);
  // console.log(custom);
  const sql = `update category set ${custom['key']} where ${custom['where']}`;
  // console.log(sql);
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
const del = async (req) => {
  const sql = "delete from category where _id=?"
  const params = [req['_id']]
  // console.log(params);
  const data = await exec(sql, params);
  return {
      row: data.affectedRows
  };
}
module.exports = {
  save,
  listAll,
  listOne,
  update,
  del
};