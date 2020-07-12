const units = new Array("one", "two", "three", "four", "five", "six", "seven", "eight", "nine");
const teens = new Array("ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen ", "nineteen");
const tens = new Array("twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety");
const illions = new Array('m', 'b', 'tr', 'quadr', 'quint', 'sext', 'sept', 'oct', 'non', // 10^6 - 10^30
'dec', 'undec', 'duodec', 'tredec', 'quattuordec', 'quindec', 'sexdec', 'septendec', 'octodec', 'novemdec', // 10^33 - 10^60
'vigint', 'unvigint', 'duovigint', 'trevigint', 'quattuorvigint', 'quinvigint', 'sexvigint', 'septenvigint', 'octovigint', 'novemvigint', // 10^63 - 10^90
'trigint', 'untrigint', 'duotrigint', 'tretrigint', 'quattuortrigint', 'quintrigint', 'sextrigint', 'septentrigint', 'octotrigint', 'novemtrigint', // 10^93 - 10^120
'quadragint', 'unquadragint', 'duoquadragint', 'trequadragint', 'quattuorquadragint', 'quinquadragint', 'sexquadragint', 'septenquadragint', 'octoquadragint', 'novemquadragint', // 10^123 - 10^150
'quinquagint', 'unquinquagint', 'duoquinquagint', 'trequinquagint', 'quattuorquinquagint', 'quinquinquagint', 'sexquinquagint', 'septenquinquagint', 'octoquinquagint', 'novemquinquagint', // 10^153 - 10^180
'sexagint', 'unsexagint', 'duosexagint', 'tresexagint', 'quattuorsexagint', 'quinsexagint', 'sexsexagint', 'septsexagint', 'octosexagint', 'novemsexagint', // 10^183 - 10^210
'septuagint', 'unseptuagint', 'duoseptuagint', 'treseptuagint', 'quattuorseptuagint', 'quinseptuagint', 'sexseptuagint', 'septseptuagint', 'octoseptuagint', 'novemseptuagint', // 10^213 - 10^240
'octogint', 'unoctogint', 'duooctogint', 'treoctogint', 'quattuoroctogint', 'quinoctogint', 'sexoctogint', 'septoctogint', 'octooctogint', 'novemoctogint', // 10^243 - 10^270
'nonagint', 'unnonagint', 'duononagint', 'trenonagint', 'duattuornonagint', 'quinnonagint', 'sexnonagint', 'septnonagint', 'octononagint', 'novemnonagint', // 10^273 - 10^300
'cent', 'cenunt', 'duocent', 'centret', 'quattuorcent', 'quinquacent', 'sexcent', 'septencent', 'octocent', 'novemcent', // 10^303 - 10^330
'decicent', 'undecicent', 'duodecicent', 'tredecicent', 'quattuordecicent', 'quindecicent', 'sexdecicent', 'septendecicent', 'octodecicent', 'novemdecicent', // 10^333 - 10^360
'viginticent', 'unviginticent', 'duoviginticent', 'treviginticent', 'quattuorviginticent', 'quinviginticent', 'sexviginticent', 'septenviginticent', 'octoviginticent', 'novemviginticent', // 10^363 - 10^390
'trigintacent', 'untrigintacent', 'duotrigintacent', 'tretrigintacent', 'quattuortrigintacent', 'quintrigintacent', 'sextrigintacent', 'septentrigintacent', 'octotrigintacent', 'novemtrigintacent', // 10^393 - 10^420
'quadragintacent', 'unquadragintacent', 'duoquadragintacent', 'trequadragintacent', 'quattuorquadragintacent', 'quinquadragintacent', 'sexquadragintacent', 'septenquadragintacent', 'octoquadragintacent', 'novemquadragintacent', // 10^423 - 10^450
'quinquagintacent', 'unquinquagintacent', 'duoquinquagintacent', 'trequinquagintacent', 'quattuorquinquagintacent', 'quinquinquagintacent', 'sexquinquagintacent', 'sexquinquagintacent', 'septenquinquagintacent', 'octoquinquagintacent', 'novemquinquagintacent', // 10^453 - 10^480
'sexagintacent', 'unsexagintacent', 'duosexagintacent', 'tresexagintacent', 'quattuorsexagintacent', 'quinsexagintacent', 'sexsexagintacent', 'septensexagintacent', 'octosexagintacent', 'novemsexagintacent', // 10^483 - 10^510
'septuagintacent', 'unseptuagintacent', 'duoseptuagintacent', 'treseptuagintacent', 'quattorseptuagintacent', 'quinseptuagintacent', 'septenseptuagintacent', 'octoseptuagintacent', 'novemseptuagintacent', // 10^513 - 10^540
'octogintacent'); // We don't need numbers bigger than that: 17 * 2^1802, being an upper bound, is approximately 4,9 * 10^543.

function smallNum(num) {
    const a = parseInt(num.charAt(0));
    const b = parseInt(num.charAt(1));
    const c = parseInt(num.charAt(2));
    let s = "";
    if (a !== 0) {
        s += units[a - 1] + " hundred";
        if (b === 0 && c === 0) return s;
        else s += " and ";
    }
    if (b === 0) {
        if (c === 0) return "";
        return s + units[c - 1];
    }
    if (b === 1) {
        return s + teens[c];
    }
    if (b > 1) {
        s += tens[b - 2];
        if (c > 0) s += "-" + units[c - 1];
        return s;
    }
}

// returns the value
function toWordsConverted(s) {
    let r = "";
    let temp = "";
    while (s.length % 3 > 0) s = "0" + s;
    let max = Math.ceil(s.length / 3);
    for (let i = 0; i < max; i++) {
        temp = smallNum(s.substr(i * 3, 3));
        if (temp !== "") {
            if (max - i === 1 && r !== "" && parseInt(s.substr(i * 3, 3)) < 100) r += " and ";
            else if (r != "") r += ", ";
            if (max - i == 2) temp += " thousand";
            if (max - i > 2) temp += " " + illions[max - i - 3] + "illion";
        }
        r += temp;
    }
    if (parseInt(s) === 0) r = "zero";
    r = r.charAt(0).toUpperCase() + r.substring(1, r.length) + ".";
    return r;
}