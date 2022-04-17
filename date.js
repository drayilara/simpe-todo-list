// jshint esversion:6

function getDay(){
    let options = {weekday:'long', day: 'numeric', month: 'long'};
    let day = new Date().toLocaleDateString('en-US', options);
    return day;
}

module.exports = {
    getDay
};




