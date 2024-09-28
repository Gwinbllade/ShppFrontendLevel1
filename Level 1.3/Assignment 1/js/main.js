function DataTable(config, data) {
    const parent = document.querySelectorAll(config.parent)[0];
    const tableHeadColumns = config.columns;
    const tableRow = document.createElement("tr");


    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    parent.appendChild(table);
    table.appendChild(tableHead);
    table.appendChild(tableBody);



    // filtering input data by table value from config
    const valueList = config.columns.map(column => column.value);
    const filteredData = data.map(entry => {
        const validData = {};
        for (const key of valueList) {
            if (key in entry) {
                validData[key] = entry[key];
            }
        }
        return validData;
    });

    // Create table head
    tableRow.innerHTML += `<th>№</th>`;
    tableHeadColumns.forEach(element => {
        tableRow.innerHTML += `<th>${element.title}</th>`;
    });
    tableHead.innerHTML = `<tr> ${tableRow.innerHTML}</tr>`;

    //Create table body    
    filteredData.forEach((data, index) => {
        tableRow.innerHTML = `<td>${index + 1}</td>`;
        Object.values(data).forEach(entry => {
            tableRow.innerHTML += `<td>${entry}</td>`;
        });
        tableBody.innerHTML += `<tr> ${tableRow.innerHTML}</tr>`;
    })
}

const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Ім’я', value: 'name' },
        { title: 'Прізвище', value: 'surname' },
        { title: 'Вік', value: 'age' },
        { title: 'Стать', value: 'sex' }


    ]
};

const users1 = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12, sex: "Ч" },
    { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15, sex: "Ч" },
    { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15, sex: "Ч" },
    { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15, sex: "Ч" },
    { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15, sex: "Ч" },

];


const config2 = {
    parent: '#usersTable',
    columns: [
        { title: 'Ім’я', value: 'name' },
        { title: 'Прізвище', value: 'surname' },
        { title: 'Вік', value: 'age' },
    ]
};

const users2 = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15 },
];




DataTable(config1, users1);