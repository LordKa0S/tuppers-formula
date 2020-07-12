const src = $('#grid');
const wrap = $('<div id="grid-overlay"></div>');
const gsize = 7;

// these are 1 less due to counting from 0
const cols = 105; // does not really matter
const rows = 16; // matters alot.
const gridArea = (cols + 1) * (rows + 1);

/* Overlay */

const tbl = $('<table></table>');
for (let y = rows; y >= 0; y--) {
    const tr = $("<tr id='tr" + y + "'></tr>");
    for (let x = 0; x <= cols; x++) {
        const td = $("<td id='td" + x + "'></td>");
        td.css('width', gsize + 'px').css('height', gsize + 'px');
        td.addClass('unselected');
        tr.append(td);
    }
    tbl.append(tr);
}

// attach overlay
wrap.append(tbl);
src.after(wrap);

/* Formula functions */

let bitString = "";
let decimal = null;

const setBitString = function (string) {
    if (string.length > gridArea) bitError.text("Thats too big!"); else bitError.text("");
    bitString = string.replace(/0+$/g, "");
    $("#bitArea").val(bitString);
}

const setDecString = function (bigNum) {
    decimal = bigNum;

    let decString = decimal.toFixed();

    convertToWords(decString);

    if ($("#showCommas")[0].checked) {
        decString = decimal.toFormat(3).slice(0, -4)
    }

    $("#decArea").val(decString);
}

const convertToWords = function (decString) {
    $('#wordsArea').text(toWordsConverted(decString));
}

const setBitMap = function () {
    let i = 0;
    for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
            const tr = $("#tr" + y);
            const td = tr.find("#td" + x);

            const bit = bitString[i];

            if (bit === "0" || !bit) {
                td.addClass('unselected');
                td.removeClass('selected');
            }
            if (bit === "1") {
                td.addClass('selected');
                td.removeClass('unselected');                
            }
            i++;
        }
    }
}

const getDecimalFromMap = function () {
    bitString = "";
    for (let y = 0; y <= cols; y++) {
        for (let x = 0; x <= rows; x++) {
            const boolBit = $("table #tr" + x + " #td" + y).hasClass('selected') ? 1 : 0;

            bitString += boolBit;
        }
    }
    decimal = new BigNumber(bitString, 2)

    setBitString(bitString);
    setDecString(decimal.times(17));
    setPresetUrl();
}

/* Events */

$('#grid-overlay td').hover(function () {
    $(this).toggleClass('hover');
});

$('#grid-overlay td').mouseup(function () {
    getDecimalFromMap();
});

$('#grid-overlay td').mousedown(function () {
    $(this).toggleClass('selected').toggleClass('unselected');
});

const bitError = $('#bitError');
const decError = $('#decError');

$('#bitArea').keyup(function () {
    const input = $(this).val().replace(/ /g, '').replace(',', '');

    if (!/^[0-1]*$/.test(input) && input !== "") bitError.text("Not a binary number.");
    else if (input !== "") {
        bitError.text("");
        setBitString(input);
        setDecString(new BigNumber(input.padEnd(1802, "0"), 2).times(17));
        setBitMap();
        setPresetUrl();
    } 
});

$('#decArea').keyup(function () {
    const input = $(this).val()?.replace(/ /g, '').replace(',', '');

    if (!/^\d+$/.test(input) && input !== "") decError.text("Not a positive number.");
    else if (input !== "") {
        const bigInput = new BigNumber(input);
        decError.text("");
        setBitString(bigInput.dividedBy(17).integerValue(BigNumber.ROUND_FLOOR).toString(2).padStart(1802, "0"));
        setDecString(bigInput);
        setBitMap();
        setPresetUrl();
    }
});

$("#showCommas").click(function () {
    let decString = decimal.toFixed();

    if (this.checked) {
        decString = decimal.toFormat(3).slice(0, -4);
    }

    $("#decArea").val(decString);
});

$("#presets button").click(function () {
    const b = $(this);

    decError.text("");

    const big = new BigNumber(b.attr('dec'));

    setDecString(big);

    // decimal = big;
    setBitString("0".repeat(parseInt(b.attr('p'))) + big.dividedBy(17).integerValue(BigNumber.ROUND_FLOOR).toString(2));
    setBitMap();
    setPresetUrl();
});


$("#presets #netpbm").change(function (evt) {
    const input = evt.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const image = NetPBM.load(e.target.result);
            const canvas = image.getCanvas().getContext("2d");
            const data = canvas.getImageData(0, 0, cols + 1, rows + 1).data;

            bitString = "";
            for (let x = 0; x <= cols; x++) {
                const offsetX = 4 * x;
                for (let y = rows; y >= 0; y--) {
                    const offsetY = (cols + 1) * (y) * 4;
                    bitString += data[offsetY + offsetX] != 0 ? "0" : "1";
                }
            };
            bitError.text("");
            setBitString(bitString);

            decError.text("");
            setDecString(new BigNumber(bitString, 2).times(17));

            setBitMap();
            setPresetUrl();
        } catch (ex) {
            alert(ex.message);
        }
    }
    reader.readAsBinaryString(input);
});

function loadBase62Preset(base62String) {
    // Configure for digits + ASCII letters
    BigNumber.config({ ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
    try {
        const big = new BigNumber(base62String, 62).integerValue();
        decError.text("");
        setDecString(big.times(17));
        bitString = big.toString(2);
        setBitString(bitString.padStart(1802, '0'));
        setBitMap();
    } catch (error) { }
}

function setPresetUrl() {
    const url = new URL(document.location.toString());
    const params = url.searchParams;
    BigNumber.config({ ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
    const base62String = decimal.dividedBy(17).toString(62);
    if (base62String !== '0') {
        params.set('preset', base62String);
    } else {
        params.delete('preset');
    }
    window.history.replaceState({}, document.title, url.href);
}

// Shorthand for $( document ).ready()
$(function () {
    const searchParams = new URLSearchParams(window.location.search);
    const base62 = searchParams.get('preset');
    if (base62 !== null) {
        loadBase62Preset(base62);
    }
});
