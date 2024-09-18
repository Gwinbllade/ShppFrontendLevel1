// Assignment 1
function hideRect1() {
    let rect = document.getElementById("black-rect-1");
    rect.style.display = "none";
}

function hideRect2() {
    let rect = document.getElementById("black-rect-2");
    rect.remove();
}

function hideRect3() {
    let rect = document.getElementById("black-rect-3");
    rect.classList.add("hidden");
}


// Assignment 2
function subAssignment2() {
    let rect = document.getElementById("black-rect-2-1");
    let rectCSSClass = rect.classList;
    if (rectCSSClass.contains("hidden")) {
        rect.classList.remove("hidden");
    }
    else {
        rect.classList.add("hidden")
    }
}

// Assignment 3
function assignment3() {
    let rectangels = document.querySelectorAll("#assignment5 .black-rect");
    for (let rect of rectangels) {
        let rectCSSClass = rect.classList;
        if (rectCSSClass.contains("hidden")) {
            rect.classList.remove("hidden");
        }
        else {
            rect.classList.add("hidden")
        }
    }
}


// Assignment 4
function assignment4() {
    let selector = document.getElementById("input-css-selector").value;
    let elements = document.querySelectorAll(selector);
    for (let element of elements) {
        element.classList.add("hidden")
    }
}

// Assignment 5
function assignment5_1() {
    alert("Привіт");
    let yellowRect = document.getElementById("yellow-rect");
    yellowRect.onclick = function () { this.remove() };
}

// Assignment 6
let redRect = document.getElementById("red-rect");
let buttonVisibilityRedRect = document.getElementById("button-visibility-red-rect");
buttonVisibilityRedRect.addEventListener("mouseover", () => { redRect.style.visibility = "unset" });
buttonVisibilityRedRect.addEventListener("mouseout", () => { redRect.style.visibility = "hidden" });

// Assignment 7
let greenRect = document.getElementById("green-rect");
let inputForVisibleGreenRect = document.getElementById("input-hide-green-rect");
inputForVisibleGreenRect.addEventListener("focus", () => { greenRect.style.visibility = "visible" });
inputForVisibleGreenRect.addEventListener("input", () => { greenRect.style.visibility = "hidden" });

//Assignment 8
function addImg() {
    let imgUrlInput = document.getElementById("input-img-url");
    let imgContainer = document.getElementById("img-container");
    let imgPath = imgUrlInput.value;
    let newImg = document.createElement("img");
    newImg.src = imgPath;
    imgContainer.appendChild(newImg);
}

//Assignment 9
function addImgs() {
    let imgsUrlsInput = document.getElementById("input-imgs-url");
    let imgsContainer = document.getElementById("imgs-container");
    let imgPaths = imgsUrlsInput.value;

    if (imgPaths != "") {
        imgPaths = imgPaths.split("\n")
        for (let i = 0; i < imgPaths.length; i++) {
            let newImg = document.createElement("img");
            newImg.src = imgPaths[i];
            imgsContainer.appendChild(newImg);
        }
    }
}


//Assignment 10
document.body.addEventListener("mousemove", (event) => {
    displayMouseCoord(event);
});

function displayMouseCoord(event) {
    let textFild = document.getElementById("mouse-coord-container");
    let x = event.clientX;
    let y = event.clientY;
    textFild.innerHTML = `X: ${x}, Y: ${y}`;
}

//Assignment 11
let brauserLangTextFild = document.getElementById("brauser-langueage-container");
brauserLangTextFild.innerHTML = `Language: ${navigator.language}`;

//Assignment 12
navigator.geolocation
navigator.geolocation.getCurrentPosition(showPosition);
function showPosition(position) {
    let latitudeLongitudeTextFild = document.getElementById("latitude-longitude-container");
    latitudeLongitudeTextFild.innerHTML = `Ш: ${position.coords.latitude}, Д:${position.coords.longitude}`
}

//Assignment 13

//Local Storeg
function saveDateInLocalStoreg(element) {
    window.localStorage.setItem("localStorage", element.innerHTML);
}

function loadDataFromLocalStoreg() {
    if (localStorage.getItem("localStorage") !== undefined) {
        return localStorage.getItem("localStorage");
    }
}

//Cookies
function saveDataInCookies(element) {
    document.cookie = (`cookiesStorage=${element.innerHTML}`);
}

function loadDataFromCookies() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; cookiesStorage=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift() ?? "";
    }
    else {
        return "";
    }
}

//Session storage
function saveDataInSessionStorage(element) {
    sessionStorage.setItem("sessionStorage", element.innerHTML);
}

function loadDataFromSessionStorage() {
    if (sessionStorage.getItem("sessionStorage") !== undefined) {
        return sessionStorage.getItem("sessionStorage");
    }
}



//init arrays with load and save functions
const loadFunctions = [loadDataFromLocalStoreg, loadDataFromCookies, loadDataFromSessionStorage];
const saveFunctions = [saveDateInLocalStoreg, saveDataInCookies, saveDataInSessionStorage];


//make custom inputs
let customInputs = document.getElementsByClassName("custom-input");
for (let i = 0; i < customInputs.length; i++) {
    customInputs[i].contentEditable = true;
    customInputs[i].addEventListener("input", () => { saveFunctions[i](customInputs[i]) })
}


window.addEventListener("load", () => {
    for (let i = 0; i < customInputs.length; i++) {
        customInputs[i].innerHTML = loadFunctions[i]();
    }
});

//Assignment 14

const goToTopButton = document.getElementsByClassName("scroll-to-top-button")[0];


window.addEventListener("scroll", checkHeight);
function checkHeight() {
    if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 100) {
        goToTopButton.style.display = "block";
    }
    else {
        goToTopButton.style.display = "none";
    }
}

goToTopButton.addEventListener("click", () => {
    window.scroll({
        top: 0,
        behavior: "smooth"
    })
})

//Assignment 15

const parentContainer = document.getElementsByClassName("parent-container")[0];
const subContainer = document.getElementsByClassName("sub-container")[0];

parentContainer.addEventListener("click", () => { alert("Parent container") });
subContainer.addEventListener("click", (event) => { alert("Sub container"); event.stopPropagation() });

//Assignment 16
function addGrayRect() {
    const grayRect = document.createElement("div");
    grayRect.classList.add("grayRect");
    document.body.appendChild(grayRect);
    disableScroll()
    grayRect.addEventListener("click", () => {
        enableScroll();
        grayRect.remove();
    });
}

function disableScroll() {
    document.body.classList.add("remove-scrolling");
}

function enableScroll() {
    document.body.classList.remove("remove-scrolling");
}

//Assignment 17
document.getElementById("form").addEventListener("submit", (event) => {
    alert("Form submit successful");
    event.preventDefault();
});



//Assignment 18
const dropForm = document.querySelector(".drop-form");
const fileInput = document.querySelector(".file-input");
const progresArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

dropForm.addEventListener("click", () => {
    fileInput.click()
})


document.addEventListener("dragover", (event) => {
    event.preventDefault();
})

document.addEventListener("drop", (event) => {
    event.preventDefault();
})


dropForm.addEventListener("dragenter", (event) => {
    event.preventDefault();
    dropForm.style.border = "2px dashed green";
})

dropForm.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropForm.style.border = "2px dashed green";
})

dropForm.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dropForm.style.border = "2px dashed #6990f2";
})

dropForm.addEventListener("drop", (event) => {
    event.preventDefault();
    dropForm.style.border = "2px dashed #6990f2";

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        const file = files[0];
        uploadFile(file.name);
    }
});

fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        uploadFile(fileName);
    }
}


fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        uploadFile(fileName);
    }
}

function uploadFile(name) {
    let newProgressArea = `
            <li class="row">
                    <i class="fas fa-file-alt"></i>
                    <div class="content">
                        <div class="details">
                            <span class="name">${name}</span>
                        </div>
                    </div>
                    <i class="fas fa-check"></i>
                </li>
    `
    uploadedArea.innerHTML += newProgressArea;
}