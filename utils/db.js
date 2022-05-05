const insertDb = (data) => {
    let myArray = Object.keys(data);
    return {
        "key": myArray.join(),
        "value": myArray.map(i => '?').join(','),
        "params": Object.values(data)
    }
}
const updateDb = (data, connect = 'or', num=1) => {
    let myArray = Object.keys(data);
    return {
        "key": myArray.slice(0, num).join('=?,') + '=?',
        "value": Object.values(data),
        "where": myArray.slice(num).join(` =? ${connect} `) + '=?',
    };
}
const selectDb = (data, connect = 'or') => {
    let myArray = Object.keys(data);
    return {
        "key": myArray.join(` =? ${connect} `) + ' = ?',
        "params": Object.values(data)
    }
}
module.exports = {
    insertDb,
    selectDb,
    updateDb
}