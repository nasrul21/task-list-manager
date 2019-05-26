const DateFormat = function(dates) {
    console.log(dates);
    const date = new Date(dates);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
}

export default DateFormat;