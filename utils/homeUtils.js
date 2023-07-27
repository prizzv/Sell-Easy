function stringDate(date, time) {
    let str = date.split("-");
    str = `${str[1]} ${str[2]}, ${str[0]} ${time}`;

    return str;
}

module.exports = { stringDate };