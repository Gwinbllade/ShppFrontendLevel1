async function DataTable(config) {
    const response = await fetch(config.apiUrl);
    const dataJSON = await response.json();
    const data = dataJSON.data;


    const parent = document.querySelectorAll(config.parent)[0];
    parent.innerHTML = "";

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
    headRow.innerHTML += `<th>Дії</th>`;
    tableHead.appendChild(headRow);


    // Create table body and filling it entries
    let entryNumber = 0;
    for (let entryIndex in data) {
        let entry = data[entryIndex];

        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `<td>${entryNumber + 1}</td>`;

        tableHeadColumns.forEach(column => {
            let cellValue;
            if (typeof (column.value) === "function") {
                cellValue = column.value(entry);
            }
            else {
                cellValue = entry[column.value];
            }
            tableRow.innerHTML += `<td>${cellValue}</td>`;
        });

        //Create action button
        tableRow.innerHTML += `<td><button data-id="${entryIndex}" class="delete-button">Видалити</button></td>`;

        tableBody.appendChild(tableRow);

        entryNumber += 1;
    }
    addEventListenersToActionButtons(config);

}




function addEventListenersToActionButtons(config) {
    const buttons = document.querySelectorAll(`${config.parent} button`);
    for (button of buttons) {
        button.addEventListener("click", async (event) => {
            await deleteItem(event.target.getAttribute("data-id"), config.apiUrl);
            await DataTable(config);
        })
    }

}

async function deleteItem(itemID, apiUrl) {
    await fetch(`${apiUrl}/${itemID}`, {
        method: "DELETE"
    })
}


function getAge(userBirtday) {
    const diffMiliseconds = Date.now() - new Date(userBirtday);
    const ageDt = new Date(diffMiliseconds);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

function getColorLabel(color) {
    const colorRect = `<div style="background-color: ${color};width: 80%; height: 20px;"></div>`;
    return colorRect;
}







const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Ім’я', value: 'name' },
        { title: 'Прізвище', value: 'surname' },
        { title: 'Вік', value: (user) => getAge(user.birthday) },
        { title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>` }
    ],
    apiUrl: "https://mock-api.shpp.me/ibichkoskyi/users"
};

const config2 = {
    parent: '#productsTable',
    columns: [
        { title: 'Назва', value: 'title' },
        { title: 'Ціна', value: (product) => `${product.price} ${product.currency}` },
        { title: 'Колір', value: (product) => getColorLabel(product.color) },
    ],
    apiUrl: "https://mock-api.shpp.me/ibichkoskyi/products"
};

DataTable(config2);
DataTable(config1);