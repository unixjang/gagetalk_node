/**
 * Created by hyochan on 6/28/15.
 */

module.exports = {
    convertUTFDateToLocalDate : function(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    },
    isNumeric : function(num){
        return !isNaN(parseFloat(num)) && isFinite(num);
    }
}