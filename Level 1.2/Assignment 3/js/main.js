
const csvText = `
44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоментар

#
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,
48.28,34.47,Камянське,255841,
48.31,35.08,Дніпро,1065008,
48.03,37.47,Донецьк,1016194,
50.18,28.49,Житомир,284236,
49.04,28.12,Жмеринка,37349,
47.53,35.23,Запоріжжя,815256,
45.11,33.28,Євпаторія,105915,
48.56,24.53,Івано-Франківськ,218359,
48.43,26.45,Камянець-Подільський,99610,
#45.20,36.38,Керч,157007,
50.27,30.30,Київ,2611327,
48.31,32.21,Кропивницький,254103,
49.07,33.35,Кременчук,234073,
47.54,33.33,Кривий Ріг,668980,
48.36,39.22,Луганськ,463097,
50.49,25.26,Луцьк,208816,
49.53,24.16,Львів,732818,
47.07,37.40,Маріуполь,492176,
46.53,35.25,Мелітополь,160657,
46.58,32.12,Миколаїв,514136,
48.26,22.45,Мукачеве,82346,
47.37,34.30,Нікополь,136280,
46.29,30.44,Одеса,1029049,
48.33,35.57,Павлоград,118816,
49.37,34.37,Полтава,317998,
50.39,26.26,Рівне,248813,
49.33,23.23,Самбір,36556,
44.29,33.43,Севастополь,342 451,
44.55,34.13,Сімферополь,343 644,
50.58,34.52,Суми,293141,
49.37,25.47,Тернопіль,227755,
48.40,22.30,Ужгород,117317,
50.05,30.03,Фастів,51976,
45.02,35.31,Феодосія,74669,
50.02,36.14,Харків,1470902,
46.40,32.42,Херсон,328360,
49.26,27.06,Хмельницький,253994,
48.11,23.40,Хуст,29080,
49.27,32.03,Черкаси,295414,
51.29,31.22,Чернігів,304994,
48.16,26.07,Чернівці,240621,
#44.26,34.19,Ялта,81654,
`;


function makeCityObj(entry) {
    return {
        x: Number(entry[0]),
        y: Number(entry[1]),
        name: entry[2].replace(/[^а-яА-ЯіІїЇєЄ\s\-\']/g, ''),
        population: Number(entry[3].replace(/\s+/g, ''))
    };
}


function makeGeneralObj(generalObj, entry, index) {
    generalObj[entry.name] = {
        population: entry.population,
        rating: index + 1
    };
    return generalObj;
}

function getPeopleWord(population) {
    if (population % 100 > 10 && population % 100 < 20) {
        return 'людей';
    }

    const lastDigit = population % 10;

    if (lastDigit === 1) {
        return 'людина';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        return 'люди';
    } else {
        return 'людей';
    }
}


function preparingCitiesInfoDB(csvText) {
    const citysInfoDB = csvText
        .split("\n")
        .filter(entry => !entry.match(/^#/))
        .map(entry => entry.split(","))
        .filter(entry => entry.length > 1)
        .map(makeCityObj)
        .sort((entry1, entry2) => entry2.population - entry1.population)
        .slice(0, 10)
        .reduce(makeGeneralObj, {});

    return function (text) {
        Object.keys(citysInfoDB).forEach(cityName => {
            const cityInfo = citysInfoDB[cityName];
            text = text.replaceAll(cityName, `${cityName}(${cityInfo.rating} місце в ТОП-10 найбільших міст України, населення ${cityInfo.population} ${getPeopleWord(cityInfo.population)})`);
        });
        return text;
    }
}



const inputTextArea = document.getElementById("input-text");
const enrichTextButton = document.getElementById("enrich-text-button");



enrichTextButton.addEventListener("click", () => {
    const inputText = inputTextArea.value;
    const enrichingText = preparingCitiesInfoDB(csvText);
    const enrichText = enrichingText(inputText);
    inputTextArea.value = enrichText;
})

