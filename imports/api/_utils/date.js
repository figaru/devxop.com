/* 
    GENERATE OR GET MONGO.COLLECTION MODAL STAMP
*/
getDocumentStamp = function (time) {

    var date = new Date(); // Thu Apr 09 2020 14:28:32 GMT+0100 (British Summer Time)

    if(time){
        data = new Date(time);
    }

    return {
        year: date.getFullYear(), // 2020
        month: date.getMonth() + 1, // 4 (note zero index: Jan = 0, Dec = 11)
        day: date.getDate(), // 9
        hour: date.getHours(), // 14
        minute: date.getMinutes(), // 28
        second: date.getSeconds(), // 32
    }
}