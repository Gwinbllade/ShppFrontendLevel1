"use strict";
function summ(a) {
    const x = Object.keys(a).map((k) => {
        const elem = a[k];
        if (elem === undefined || elem.cvalue === undefined)
            return 2021;
        if (typeof elem.cvalue === 'string') {
            const n = Number(elem.cvalue);
            return isNaN(n) ? 2021 : n;
        }
        if (typeof elem.cvalue === 'object' && elem.cvalue !== null) {
            return summ(elem.cvalue);
        }
        if (typeof elem.cvalue === 'number')
            return elem.cvalue;
        return 2021;
    });
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        sum += x[i];
    }
    return sum;
}
