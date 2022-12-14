const axios = require('axios')
const getToken = require('../utils/getToken')
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const wrap = require('../utils/wrap')
const client_id = '4cd5a5790c693f92e09d13b79a7553409a7549107ebe67d40e32e68fc12ba009';
const client_secret = 'd4425cde591f58834ae1632018bb86ad2a85ee1665e1454a8be77fd548eee19a';
const redirect_uri = 'http://localhost:5000/api/oauth/gitee';
class github {
  async oauth(req, code) {
    const res = await axios.post(
      `https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}`,
    );
    // console.log(res)

    const {
      access_token,
      refresh_token
    } = res.data;
    if (access_token) {
      const user = await axios({
          url: 'https://gitee.com/api/v5/user',
          method: 'get',
          headers: {
            Authorization: `bearer ${access_token}`
          }
        }

      )
      // console.log(user)
      const git_id = user.data.id;
      const token = getToken(git_id, '1d');
      const res = await axios({
        url: 'https://gitee.com/api/v5/user/starred',
        method: 'get',
        params: {
          access_token: access_token,
          sort: "last_push",
          per_page: 100
        },
      });
      // const starRepos = res.data.map((item, index) => ({
      //   full_name: item.full_name,
      //   index
      // }));
      const starRepos = res.data.map((item) => ({
        full_name: item.full_name,
      }));
      // console.log(starRepos);
      // 先查自己有多少个
      let [_, num] = await wrap(categoryController.listOne({
        "uid": req.cookies['uid']
      }))
      const number = await num;
      let len = 0
      if(number.length==0){
        let [_all, all] = await wrap(categoryController.listAll())
        const numberALL = await all;
        len = numberALL[numberALL.length-1]['_id']
      }else{
        len = number[number.length-1]['_id']+1
      }
      // console.log(number);
      let [err, data] = await wrap(categoryController.save({
        name: '未分类',
        repos: starRepos,
        "uid": req.cookies['uid'],
        cid:  len
      }))
      if (err) {
        return {
          code: 500,
          msg: err
        }
      }
      data.then(async (uncategorized) => {
        // console.log(uncategorized);
        let [_, num] = await wrap(userController.findOne({
          "_id": req.cookies['uid'],
        }))
        const number = await num;
        let [err, data] = await wrap(userController.update({
          gitee_id: git_id,
          categories: number[0]['categories']+1,
          gitee_token: access_token,
          gitee_refresh_token: refresh_token,
          "_id": req.cookies['uid']
        },'or', 4))
        if (err) {
          return {
            code: 500,
            msg: err,
            data: uncategorized
          }
        }
      })

      return {
        code: 200,
        data: user.data,
        token: token,
      };
    } else {
      return {
        code: 403,
        msg: '授权失败',
      };
    }
  }
}
module.exports = new github();