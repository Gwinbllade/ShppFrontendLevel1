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
        tableRow.innerHTML += `<td><button data-id="${entryIndex}" class="delete-button">Видалити</button> <button data-id="${entryIndex}" class="edit-button">Редагувати</td>`;


        tableBody.appendChild(tableRow);

        entryNumber += 1;


    }
    addEventListenersToActionButtons(config);

    const addNewEntryButton = document.createElement("button");
    addNewEntryButton.innerHTML = "Додати";
    addNewEntryButton.classList.add("add-button");
    addNewEntryButton.addEventListener("click", () => document.body.appendChild(createAddingForm(config)));
    parent.insertBefore(addNewEntryButton, parent.firstChild);
}


async function createEditForm(config, entryID) {
    let response = await fetch(`${config.apiUrl}/${entryID}`);
    let json = await response.json();
    let entryData = json.data;
    console.log(entryData);


    // create form
    const addingForm = document.createElement("form");
    const inputs = config.columns.map(entry => entry.input);

    inputs.forEach(inputs => {
        // check if inputs is array
        const inputSettings = Array.isArray(inputs) ? inputs : [inputs];

        // Create input
        inputSettings.forEach(inputSetting => {
            let label = document.createElement("label");
            let input;

            if (inputSetting.type === "select") {
                input = document.createElement("select");
                inputSetting.options.forEach(optionValue => {
                    const option = document.createElement("option");
                    option.value = optionValue;
                    option.textContent = optionValue;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement("input");
                input.type = inputSetting.type;
            }

            input.name = inputSetting.name;



            if (input.name === "birthday") {
                input.value = entryData[inputSetting.name].split('T')[0];
            } else {
                input.value = entryData[inputSetting.name];
            }


            label.textContent = inputSetting.label;
            label.setAttribute('for', inputSetting.name);

            if (inputSetting.required === false) {
                input.required = false;
            } else {
                input.required = true;
            }

            addingForm.appendChild(label);
            addingForm.appendChild(input);
            addingForm.appendChild(document.createElement("br"));
        });

    });

    const modalWindowContainer = document.createElement("div");
    const modalWindow = document.createElement("div");


    modalWindowContainer.classList.add("modal-window-container");
    modalWindow.classList.add("modal-window");

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Зберегти';
    submitButton.classList.add("submit-button");

    const close = document.createElement("span");

    close.classList.add("close");
    close.addEventListener("click", () => { document.body.removeChild(modalWindowContainer) });


    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await updateData(addingForm, config.apiUrl, entryID);
            document.body.removeChild(modalWindowContainer);
            DataTable(config);

        } catch (error) {
            alert('Помилка при відправці даних');
        }
    });

    addingForm.appendChild(submitButton);

    modalWindow.appendChild(close);
    modalWindow.appendChild(addingForm);
    modalWindowContainer.appendChild(modalWindow);
    return modalWindowContainer;
}


async function updateData(form, apiUrl, id) {
    checkInputsValid(form);


    // todo make json file 
    try {
        const formData = new FormData(form);
        const newEntry = {};
        formData.forEach(function (value, key) {
            if (key === "price") {
                newEntry[key] = Number.parseInt(value);
            } else {
                newEntry[key] = value;
            }
        });
        const json = JSON.stringify(newEntry);


        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: json,
        });




        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;

    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
}

function createAddingForm(config) {
    // create form
    const addingForm = document.createElement("form");
    const inputs = config.columns.map(entry => entry.input);

    inputs.forEach(inputs => {
        // check if inputs is array
        const inputSettings = Array.isArray(inputs) ? inputs : [inputs];

        // Create input
        inputSettings.forEach(inputSetting => {
            let label = document.createElement("label");
            let input;

            if (inputSetting.type === "select") {
                input = document.createElement("select");
                inputSetting.options.forEach(optionValue => {
                    const option = document.createElement("option");
                    option.value = optionValue;
                    option.textContent = optionValue;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement("input");
                input.type = inputSetting.type;
            }

            input.name = inputSetting.name;
            label.textContent = inputSetting.label;
            label.setAttribute('for', inputSetting.name);

            if (inputSetting.required === false) {
                input.required = false;
            } else {
                input.required = true;
            }

            addingForm.appendChild(label);
            addingForm.appendChild(input);
            addingForm.appendChild(document.createElement("br"));
        });

    });

    const modalWindowContainer = document.createElement("div");
    const modalWindow = document.createElement("div");


    modalWindowContainer.classList.add("modal-window-container");
    modalWindow.classList.add("modal-window");

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Зберегти';
    submitButton.classList.add("submit-button");

    const close = document.createElement("span");

    close.classList.add("close");
    close.addEventListener("click", () => { document.body.removeChild(modalWindowContainer) });


    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await sendData(addingForm, config.apiUrl);
            document.body.removeChild(modalWindowContainer);
            DataTable(config);

        } catch (error) {
            alert('Помилка при відправці даних');
        }
    });

    addingForm.appendChild(submitButton);

    modalWindow.appendChild(close);
    modalWindow.appendChild(addingForm);
    modalWindowContainer.appendChild(modalWindow);
    return modalWindowContainer;
}


function checkInputsValid(form) {
    let isValid = true;
    for (const formElement of form.children) {
        if (formElement.tagName !== "LABEL" && formElement.tagName !== "BR" && formElement.tagName !== "BUTTON") {
            if (formElement.required === true && formElement.value === "") {
                formElement.classList.add("invalid-input");
                isValid = false;
            }
            else {
                formElement.classList.remove("invalid-input");

            }
        }
    }
    return isValid;
}



async function sendData(form, apiUrl) {
    checkInputsValid(form);
    // todo make json file 
    try {
        const formData = new FormData(form);
        const newEntry = {};
        formData.forEach(function (value, key) {
            if (key === "price") {
                newEntry[key] = Number.parseInt(value);
            } else {
                newEntry[key] = value;
            }
        });
        const json = JSON.stringify(newEntry);


        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: json,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;

    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
}


function addEventListenersToActionButtons(config) {
    const buttons = document.querySelectorAll(`${config.parent} button`);
    for (button of buttons) {
        if (button.className === "delete-button") {
            button.addEventListener("click", async (event) => {
                await deleteItem(event.target.getAttribute("data-id"), config.apiUrl);
                await DataTable(config);
            })
        }
        else if (button.className === "edit-button") {
            button.addEventListener("click", async (event) => {
                document.body.appendChild(await createEditForm(config, event.target.getAttribute("data-id")));
            })
        }

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
        {
            title: 'Ім’я',
            value: 'name',
            input: { type: "text", name: "name", label: "Ім'я" }
        },
        {
            title: 'Прізвище',
            value: 'surname',
            input: { type: "text", name: "surname", label: "Прізвище" }
        },
        {
            title: 'Вік',
            value: (user) => getAge(user.birthday),
            input: { type: "date", name: "birthday", label: "Прізвище" }
        },
        {
            title: 'Фото',
            value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
            input: { type: "text", name: "avatar", label: "Шлях до фото" }
        }
    ],
    apiUrl: "https://mock-api.shpp.me/<nsurname>/users"
};




const config2 = {
    parent: '#productsTable',
    columns: [
        {
            title: 'Назва',
            value: 'title',
            input: { type: 'text', name: "title", label: "Назва" }
        },
        {
            title: 'Ціна',
            value: (product) => `${product.price} ${product.currency}`,
            input: [
                { type: 'number', name: 'price', label: 'Ціна' },
                { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
            ]
        },
        {
            title: 'Колір',
            value: (product) => getColorLabel(product.color),
            input: { type: 'color', name: 'color', label: 'Колір' }
        },
    ],
    apiUrl: "https://mock-api.shpp.me/ibichkoskyi/products"
};





DataTable(config1);
DataTable(config2);


