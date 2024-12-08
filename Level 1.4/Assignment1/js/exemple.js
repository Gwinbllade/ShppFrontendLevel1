// Constants for common strings and configurations
const MODAL_CLASSES = {
    CONTAINER: 'modal-window-container',
    WINDOW: 'modal-window',
    CLOSE: 'close'
};

const ACTION_BUTTONS = {
    DELETE: 'delete-button',
    EDIT: 'edit-button',
    ADD: 'add-button',
    SUBMIT: 'submit-button'
};

/**
 * Creates and renders a data table with CRUD operations
 * @param {Object} config - Configuration object for the table
 * @param {string} config.parent - CSS selector for parent element
 * @param {Array} config.columns - Column configurations
 * @param {string} config.apiUrl - API endpoint URL
 */
async function DataTable(config) {
    const data = await fetchData(`${config.apiUrl}`);
    const parent = document.querySelector(config.parent);
    if (!parent) return;

    parent.innerHTML = '';

    // Add "New Entry" button
    const addButton = createButton('Додати', ACTION_BUTTONS.ADD,
        () => document.body.appendChild(createForm(config)));
    parent.appendChild(addButton);

    // Create table structure
    const table = createTableStructure(config, data);
    parent.appendChild(table);

    // Add event listeners to action buttons
    addEventListenersToActionButtons(config);
}

/**
 * Creates basic table structure with headers and body
 * @param {Object} config - Table configuration
 * @param {Array} data - Table data
 * @returns {HTMLTableElement}
 */
function createTableStructure(config, data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row
    const headRow = document.createElement('tr');
    headRow.innerHTML = '<th>№</th>' +
        config.columns.map(column => `<th>${column.title}</th>`).join('') +
        '<th>Дії</th>';
    thead.appendChild(headRow);

    // Create body rows
    data.forEach((entry, index) => {
        tbody.appendChild(createTableRow(entry, index, config));
    });

    table.append(thead, tbody);
    return table;
}

/**
 * Creates a single table row
 * @param {Object} entry - Row data
 * @param {number} index - Row index
 * @param {Object} config - Table configuration
 * @returns {HTMLTableRowElement}
 */
function createTableRow(entry, index, config) {
    const row = document.createElement('tr');

    // Add index cell
    const cells = [`<td>${index + 1}</td>`];

    // Add data cells
    config.columns.forEach(column => {
        const value = typeof column.value === 'function'
            ? column.value(entry)
            : entry[column.value];
        cells.push(`<td>${value}</td>`);
    });

    // Add action buttons
    cells.push(`
        <td>
            <button data-id="${index}" class="${ACTION_BUTTONS.DELETE}">Видалити</button>
            <button data-id="${index}" class="${ACTION_BUTTONS.EDIT}">Редагувати</button>
        </td>
    `);

    row.innerHTML = cells.join('');
    return row;
}

/**
 * Creates a modal form for adding or editing entries
 * @param {Object} config - Table configuration
 * @param {string} [entryID] - Entry ID for editing (optional)
 * @returns {HTMLElement} Modal container
 */
async function createForm(config, entryID = null) {
    const isEditing = entryID !== null;
    const entryData = isEditing ? await fetchData(`${config.apiUrl}/${entryID}`) : {};

    const form = document.createElement('form');
    const modalContainer = createModalContainer();

    // Create form inputs
    config.columns.forEach(column => {
        const inputs = Array.isArray(column.input) ? column.input : [column.input];
        inputs.forEach(inputConfig => {
            const { label, input } = createFormInput(inputConfig, entryData);
            form.append(label, input, document.createElement('br'));
        });
    });

    // Add submit button
    const submitButton = createButton(
        'Зберегти',
        ACTION_BUTTONS.SUBMIT,
        async (e) => {
            e.preventDefault();
            if (!validateForm(form)) return;

            try {
                await submitFormData(form, config.apiUrl, entryID);
                document.body.removeChild(modalContainer);
                DataTable(config);
            } catch (error) {
                alert('Помилка при відправці даних');
            }
        }
    );

    form.appendChild(submitButton);
    modalContainer.querySelector(`.${MODAL_CLASSES.WINDOW}`).appendChild(form);

    return modalContainer;
}

/**
 * Creates form input element based on configuration
 * @param {Object} inputConfig - Input configuration
 * @param {Object} entryData - Existing entry data for editing
 * @returns {Object} Object containing label and input elements
 */
function createFormInput(inputConfig, entryData) {
    const label = document.createElement('label');
    label.textContent = inputConfig.label;
    label.setAttribute('for', inputConfig.name);

    let input;
    if (inputConfig.type === 'select') {
        input = createSelect(inputConfig);
    } else {
        input = document.createElement('input');
        input.type = inputConfig.type;
    }

    input.name = inputConfig.name;
    input.required = inputConfig.required !== false;

    // Set input value for editing
    if (entryData[inputConfig.name]) {
        input.value = inputConfig.name === 'birthday'
            ? entryData[inputConfig.name].split('T')[0]
            : entryData[inputConfig.name];
    }

    return { label, input };
}

/**
 * Creates a select input with options
 * @param {Object} config - Select input configuration
 * @returns {HTMLSelectElement}
 */
function createSelect(config) {
    const select = document.createElement('select');
    config.options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = option.textContent = optionValue;
        select.appendChild(option);
    });
    return select;
}

/**
 * Creates a modal container with close button
 * @returns {HTMLElement}
 */
function createModalContainer() {
    const container = document.createElement('div');
    const modal = document.createElement('div');
    const closeBtn = document.createElement('span');

    container.className = MODAL_CLASSES.CONTAINER;
    modal.className = MODAL_CLASSES.WINDOW;
    closeBtn.className = MODAL_CLASSES.CLOSE;

    closeBtn.addEventListener('click', () => document.body.removeChild(container));

    modal.appendChild(closeBtn);
    container.appendChild(modal);
    return container;
}

/**
 * Validates form inputs
 * @param {HTMLFormElement} form 
 * @returns {boolean}
 */
function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, select').forEach(input => {
        const isInvalid = input.required && !input.value;
        input.classList.toggle('invalid-input', isInvalid);
        if (isInvalid) isValid = false;
    });
    return isValid;
}

/**
 * Submits form data to the API
 * @param {HTMLFormElement} form 
 * @param {string} apiUrl 
 * @param {string} [id] 
 */
async function submitFormData(form, apiUrl, id = null) {
    const formData = new FormData(form);
    const data = Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) =>
            [key, key === 'price' ? parseInt(value) : value]
        )
    );

    const url = id ? `${apiUrl}/${id}` : apiUrl;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
}

/**
 * Fetches data from the API
 * @param {string} url 
 * @returns {Promise<Object>}
 */
async function fetchData(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

/**
 * Creates a button element
 * @param {string} text 
 * @param {string} className 
 * @param {Function} onClick 
 * @returns {HTMLButtonElement}
 */
function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

/**
 * Utility function to calculate age from birthday
 * @param {string} birthday 
 * @returns {number}
 */
function getAge(birthday) {
    const diffMs = Date.now() - new Date(birthday);
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}

/**
 * Creates a color label element
 * @param {string} color 
 * @returns {string}
 */
function getColorLabel(color) {
    return `<div style="background-color: ${color}; width: 80%; height: 20px;"></div>`;
}

// Example configurations
const userTableConfig = {
    parent: '#usersTable',
    columns: [
        {
            title: `ім'я`,
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
            value: user => getAge(user.birthday),
            input: { type: "date", name: "birthday", label: "День народження" }
        },
        {
            title: 'Фото',
            value: user => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
            input: { type: "text", name: "avatar", label: "Шлях до фото" }
        }
    ],
    apiUrl: "https://mock-api.shpp.me/<nsurname>/users"
};

const productTableConfig = {
    parent: '#productsTable',
    columns: [
        {
            title: 'Назва',
            value: 'title',
            input: { type: 'text', name: "title", label: "Назва" }
        },
        {
            title: 'Ціна',
            value: product => `${product.price} ${product.currency}`,
            input: [
                { type: 'number', name: 'price', label: 'Ціна' },
                { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
            ]
        },
        {
            title: 'Колір',
            value: product => getColorLabel(product.color),
            input: { type: 'color', name: 'color', label: 'Колір' }
        }
    ],
    apiUrl: "https://mock-api.shpp.me/ibichkoskyi/products"
};

// Initialize tables
DataTable(userTableConfig);
DataTable(productTableConfig);