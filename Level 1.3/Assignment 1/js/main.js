function DataTable(config, data) {
    const parent = document.querySelectorAll(config.parent)[0];
    const tableHeadColumns = config.columns;
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");

    parent.appendChild(table);
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Create table head
    const headRow = document.createElement("tr");
    headRow.innerHTML = '<th>№</th>';
    tableHeadColumns.forEach(column => {
        headRow.innerHTML += `<th>${column.title}</th>`;
    });
    tableHead.appendChild(headRow);

    // Create table body
    data.forEach((item, index) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `<td>${index + 1}</td>`;

        tableHeadColumns.forEach(column => {
            const cellValue = item[column.value];
            tableRow.innerHTML += `<td>${cellValue}</td>`;
        });

        tableBody.appendChild(tableRow);
    });
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