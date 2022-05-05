function wrap(handler) {
  return new Promise(async resolve=>{
    try {
      await handler
      resolve([null,handler])
    }catch(err){
      resolve([err,null])
    }
  })
}

module.exports = wrap;
