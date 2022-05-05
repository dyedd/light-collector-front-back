const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: '82.156.26.99',
  user: 'navigation',
  password:"tk3zMyijD5WHYTLC",
  port: 3306,
  database: 'navigation',
});
conn.connect()
function exec(sql,params) {
  const promise = new Promise((resolve,reject)=>{
      conn.query(sql, params, (err,result) => {
          if(err){
              reject(err);
              return;
          }
          resolve(result);
      })
  });
  return promise;
}
module.exports = exec;
