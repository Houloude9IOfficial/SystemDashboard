const { color } = require('./colors');
let part = '●'; // ◉
let aroundtext_right = ']'
let aroundtext_left = '['
let statusColor = null

function getpart() {
    //part = part + 1;
    return part;
}

// NEW CATEGORY: null
// INFORMATION: undefined
// WARN: 'warn'
// SUCCESS: true
// FAIL: false

function getparttext(description, success = undefined) {
    if (success === null) {
    statusColor = color.magenta(`${aroundtext_left}${part}${aroundtext_right}`)
    } else if (success === undefined) {
    statusColor = color.blue(`${aroundtext_left}${part}${aroundtext_right}`)
    } else if (success === 'warn') {
    statusColor = color.orange(`${aroundtext_left}${part}${aroundtext_right}`)
    } else {
    statusColor = success ? color.green(`${aroundtext_left}${part}${aroundtext_right}`) : color.red(`${aroundtext_left}${part}${aroundtext_right}`);
    }
    return `${statusColor}: ${color.darkGray(description)}`;
}

module.exports = { getparttext };