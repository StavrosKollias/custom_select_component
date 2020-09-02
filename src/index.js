import _ from 'lodash';
import "../css/style.less";
import pcImg from '../images/pc-mixer.jpg';

const optionsObject = { "option 1": "Hello", "option 2": "Stavros", "option 3": "Testing Component" }


function component(optionsObject) {
    // createHtmlElement(type,id,className,innterText,innerHTML,value,placeholder,disabled)
    const findSelectComponentsDom = document.querySelectorAll("#select-component");
    const selectComponent = createHtmlElement('button', `select-component-${findSelectComponentsDom.length}`, "select-component", null, null, null, null, null);
    const textSelectComponent = createHtmlElement('span', null, 'select-text-display', "Select", null, null, null, null);
    const arrowDown = createHtmlElement('i', null, "fas fa-angle-down", null, null, null, null, null);
    const selectMenuList = createHtmlElement('ul', "select-menu", "select-menu", null, null, null, null, null);
    const liSearchElement = createHtmlElement('li', "search-menu-item", "search-menu-item", null, null, null, null, null);
    const inputSearchDom = document.querySelectorAll("#input-search");
    const inputSearch = createHtmlElement('input', `input-search ${inputSearchDom.length}`, "input-search", null, null, null, "Search", null);
    inputSearch.addEventListener("input", (event) => {
        handleSearchInput(event);
    })
    const searchIcon = createHtmlElement('i', null, "fas fa-search", null, null, null, null, null);
    const errorSearch = createHtmlElement('span', null, "error-search", "Search Not Found", null, null, null, null);
    liSearchElement.appendChild(searchIcon);
    liSearchElement.appendChild(inputSearch);
    liSearchElement.appendChild(errorSearch);
    selectMenuList.appendChild(liSearchElement);
    addOptionsToSelectionElement(optionsObject, selectMenuList)
    selectComponent.appendChild(textSelectComponent);
    selectComponent.appendChild(arrowDown);
    selectComponent.appendChild(selectMenuList);
    selectComponent.addEventListener("click", (event) => {
        handleSelectCompnentClick(event);
    });
    return selectComponent;
}



function addOptionsToSelectionElement(optionsObject, selectionList) {
    for (const [key, value] of Object.entries(optionsObject)) {
        const newOption = generateNewOptionItem(key, value, selectionList.children.length - 1);
        if (selectionList.children.length - 1 == 0) newOption.querySelector(".select-menu-item-button").classList.add("active-item");
        selectionList.appendChild(newOption);
    }
}

function generateNewOptionItem(string, valueOption, childNumber) {
    const li = createHtmlElement("li", null, "select-menu-item", null, null, null, null, null);
    const liButton = createHtmlElement("button", null, "select-menu-item-button", null, null, null, null, null);
    liButton.dataValue = valueOption;
    liButton.addEventListener("click", (event) => {
        handleClickSelectionItem(event);
    });
    const spanLabel = createHtmlElement("span", `select-menu-item-label-${childNumber}`, "select-menu-item-label", string, null, null, null, null);

    liButton.appendChild(spanLabel);
    li.appendChild(liButton);
    return li
}

function handleSelectCompnentClick(event) {
    var selectComponent = event.target;
    !selectComponent.id.includes("select-component") ? selectComponent = event.target.parentElement : selectComponent;
    if (!selectComponent.id.includes("select-component")) return;
    const selectMenu = selectComponent.querySelector(".select-menu");
    openCloseSelecMenu(selectMenu, selectComponent);
}


function openCloseSelecMenu(selectMenu, selectComponent) {
    if (selectMenu.classList.length == 2) {
        selectMenu.classList.remove("active-select-menu");
        var arrow = selectComponent.querySelector(".fa-angle-up");
        arrow.className = "fa fa-angle-down";
    } else {
        selectMenu.classList.add("active-select-menu");
        var arrow = selectComponent.querySelector(".fa-angle-down");
        arrow.className = "fa fa-angle-up";
    }
}


function handleClickSelectionItem(event) {
    var selectionItem = event.target;
    !selectionItem.className.includes("select-menu-item-button") ? selectionItem = event.target.parentElement : selectionItem;
    if (selectionItem == undefined) return;
    console.log(selectionItem.dataValue);
    const selectMenu = selectionItem.parentElement.parentElement;
    const selectComponent = selectMenu.parentElement;
    selectMenu.querySelector(".active-item").classList.remove("active-item");
    selectionItem.classList.add("active-item");
    const labelName = selectionItem.querySelector(".select-menu-item-label").innerText;
    selectComponent.querySelector(".select-text-display").innerText = labelName;
    openCloseSelecMenu(selectMenu, selectComponent);
    //  console.log(`selectItem:${selectionItem.className}`);
}


function handleSearchInput(event) {
    const searchInput = event.target;
    const filter = searchInput.value;
    const selectMenu = searchInput.parentElement.parentElement;
    const selectMenuItemLabels = selectMenu.querySelectorAll(".select-menu-item-label");
    var counter = 0;
    selectMenuItemLabels.forEach((e, i) => {
        const text = e.innerText || e.innerHTML;
        if (text.includes(filter)) { e.parentElement.parentElement.style.display = ""; counter++; } else { e.parentElement.parentElement.style.display = "none"; counter--; }
    });
    const isVisible = (counter - selectMenuItemLabels.length) == 0;
    const errormessage = searchInput.parentElement.querySelector(".error-search");
    console.log(errormessage.className);
    console.log(isVisible);
    seVisibilityErrorSearch(isVisible, errormessage);
}

function seVisibilityErrorSearch(isVisible, element) {
    isVisible ? element.classList.add("active-error") : element.classList.remove("active-error");
}



function createHtmlElement(type, id, className, innerText, innerHTML, value, placeholder, disabled) {
    const element = document.createElement(type);
    if (id) element.id = id;
    if (className) element.className = className;
    if (innerText) element.innerText = innerText;
    if (innerHTML) element.innerHTML = innerHTML;
    if (value) element.value = value;
    if (placeholder) element.placeholder = placeholder;
    if (disabled) element.disabled = disabled;
    return element;
}

document.body.appendChild(component(optionsObject));