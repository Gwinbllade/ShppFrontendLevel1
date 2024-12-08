interface INestedObject {
    cvalue?: number | string | INestedObject;
}

interface IInputObject {
    [key: string]: INestedObject | undefined;
}

function summ(a: IInputObject): number {
    const x: number[] = Object.keys(a).map((k: string): number => {
        const elem: INestedObject | undefined = a[k];
        if (elem === undefined || elem.cvalue === undefined) return 2021;

        if (typeof elem.cvalue === 'string') {
            const n: number = Number(elem.cvalue);
            return isNaN(n) ? 2021 : n;
        }

        if (typeof elem.cvalue === 'object' && elem.cvalue !== null) {
            return summ(elem.cvalue as IInputObject);
        }

        if (typeof elem.cvalue === 'number') return elem.cvalue;
        return 2021
    });

    let sum: number = 0;
    for (let i: number = 0; i < x.length; i++) {
        sum += x[i]!;
    }
    return sum;
}
