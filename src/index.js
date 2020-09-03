import _ from 'lodash';
import "../css/style.less";

function generateSelectComponents() {
    const uiSelectComponent = document.querySelectorAll("[data-role*='ui-select-custom']");
    uiSelectComponent.forEach((e, i) => {
        const optionsObject = generateDataForSelectionOptions(e);
        generateSelect(e, optionsObject);
    });
}

function generateDataForSelectionOptions(selectElement) {
    var optionsObject = {};
    Array.from(selectElement.options).map((e, i) => {
        optionsObject[e.innerText] = e.value;
    });
    return optionsObject;
}

function generateSelect(uiSelectComponent, optionsObject) {
    // createHtmlElement(type,id,className,innterText,innerHTML,value,placeholder,disabled)
    const uiSelectContainer = createHtmlElement('div', null, 'ui-select-container', null, null, null, null, null);
    uiSelectComponent.parentElement.replaceChild(uiSelectContainer, uiSelectComponent);
    uiSelectContainer.appendChild(uiSelectComponent);
    const findSelectComponentsDom = document.querySelectorAll(".select-component");
    const selectComponent = createHtmlElement('button', `select-component-${findSelectComponentsDom.length}`, "select-component", null, null, null, null, null);
    const textSelectComponent = createHtmlElement('span', null, 'select-text-display', "Select", null, null, null, null);
    const arrowDown = createHtmlElement('i', null, "fas fa-angle-down", null, null, null, null, null);
    const customeSelectList = createHtmlElement('ul', "select-menu", "select-menu", null, null, null, null, null);
    const liSearchElement = createHtmlElement('li', "search-menu-item", "search-menu-item", null, null, null, null, null);
    const inputSearchDom = document.querySelectorAll(".input-search");
    const inputSearch = createHtmlElement('input', `input-search-${inputSearchDom.length}`, "input-search", null, null, null, "Search", null);
    inputSearch.addEventListener("input", (event) => {
        handleSearchInput(event);
    });
    const searchIcon = createHtmlElement('i', null, "fas fa-search", null, null, null, null, null);
    const errorSearch = createHtmlElement('span', null, "error-search", "Search Not Found", null, null, null, null);
    liSearchElement.appendChild(searchIcon);
    liSearchElement.appendChild(inputSearch);
    liSearchElement.appendChild(errorSearch);
    customeSelectList.appendChild(liSearchElement);
    addOptionsToSelectionElement(optionsObject, customeSelectList, uiSelectComponent)
    selectComponent.appendChild(textSelectComponent);
    selectComponent.appendChild(arrowDown);
    selectComponent.appendChild(customeSelectList);
    selectComponent.addEventListener("click", (event) => {
        handleSelectCompnentClick(event);
    });
    uiSelectContainer.appendChild(selectComponent);
    return uiSelectContainer;
}

function addOptionsToSelectionElement(optionsObject, customSelectList, standardSelect) {
    for (const [key, value] of Object.entries(optionsObject)) {
        const newOptions = generateNewOptionItem(key, value, customSelectList.children.length - 1);
        if (customSelectList.children.length - 1 == 0) {
            newOptions.customOption.querySelector(".select-menu-item-button").classList.add("active-item");
            newOptions.option.classList.add("active-item");
        }
        standardSelect.appendChild(newOptions.option);
        customSelectList.appendChild(newOptions.customOption);
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
    const optionSelect = createHtmlElement('option', null, null, string, null, valueOption, null, null);
    liButton.appendChild(spanLabel);
    li.appendChild(liButton);
    return {
        customOption: li,
        option: optionSelect
    }
}

function handleSelectCompnentClick(event) {
    event.stopPropagation();
    var selectComponent = event.target;
    !selectComponent.id.includes("select-component") ? selectComponent = event.target.parentElement : selectComponent;
    if (selectComponent.className != "select-component") return;
    const otherActivePanel = document.querySelector(".active-select-menu");
    const selectMenu = selectComponent.querySelector(".select-menu");
    if (event.clientY == 0 && selectMenu.classList.length == 2) return;
    if (otherActivePanel && otherActivePanel != selectMenu) {
        closeActiveSelectMenuWindowClick(otherActivePanel);
    };
    openCloseSelecMenu(selectMenu, selectComponent);
}

function openCloseSelecMenu(selectMenu, selectComponent) {
    const searchInput = selectMenu.querySelector(".input-search");
    if (selectMenu.classList.length == 2) {
        selectMenu.classList.remove("active-select-menu");
        var arrow = selectComponent.querySelector(".fa-angle-up");
        arrow.className = "fa fa-angle-down";
        const selectItemLabels = selectMenu.querySelectorAll(".select-menu-item-label");
        searchInput.value = "";
        loopThroughSelectItemLabels(selectItemLabels, searchInput);
    } else {
        selectMenu.classList.add("active-select-menu");
        var arrow = selectComponent.querySelector(".fa-angle-down");
        arrow.className = "fa fa-angle-up";
        searchInput.focus();
    }
}

function handleClickSelectionItem(event) {
    event.stopPropagation();
    var selectionItem = event.target;
    !selectionItem.className.includes("select-menu-item-button") ? selectionItem = event.target.parentElement : selectionItem;
    if (selectionItem == undefined) return;
    const selectMenu = selectionItem.parentElement.parentElement;
    const selectComponent = selectMenu.parentElement;
    const uiSelectComponent = selectComponent.parentElement.querySelector("[data-role*=ui-select-custom]");
    selectMenu.querySelector(".active-item").classList.remove("active-item");
    selectionItem.classList.add("active-item");
    const labelName = selectionItem.querySelector(".select-menu-item-label").innerText;
    selectComponent.querySelector(".select-text-display").innerText = labelName;
    const indexOption = findIdexFromSelectOptionText(uiSelectComponent, labelName);
    uiSelectComponent.selectedIndex = indexOption;
    uiSelectComponent.querySelector(".active-item").classList.remove("active-item");
    uiSelectComponent.options[uiSelectComponent.selectedIndex].classList.add("active-item");
    openCloseSelecMenu(selectMenu, selectComponent);
}

function findIdexFromSelectOptionText(selectElement, txt) {
    var index;
    Array.from(selectElement.options).filter((e, i) => {
        if (e.innerText == txt) index = i;
    })
    return index;
}

function handleSearchInput(event) {
    const searchInput = event.target;
    const selectMenu = searchInput.parentElement.parentElement;
    const selectItemLabels = selectMenu.querySelectorAll(".select-menu-item-label");
    loopThroughSelectItemLabels(selectItemLabels, searchInput);
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

function closeActiveSelectMenuWindowClick(activeMenu) {
    if (activeMenu == null) return;
    var arrow = activeMenu.parentElement.querySelector(".fa-angle-up");
    arrow.className = "fa fa-angle-down";
    const searchInput = activeMenu.querySelector(".input-search");
    activeMenu.classList.remove("active-select-menu");
    const selectItemLabels = activeMenu.querySelectorAll(".select-menu-item-label");
    searchInput.value = "";
    loopThroughSelectItemLabels(selectItemLabels, searchInput);

}

function loopThroughSelectItemLabels(selectItemLabels, searchInput) {
    const filter = searchInput.value;
    var counter = 0;
    selectItemLabels.forEach((e, i) => {
        const text = e.innerText.trim() || e.innerHTML.trim();
        if (text.toLowerCase().includes(filter.toLowerCase()) && filter.length == 0) { e.parentElement.parentElement.style.display = ""; counter++; } else { e.parentElement.parentElement.style.display = "none"; counter--; }
    });
    const isVisible = (counter + selectItemLabels.length) == 0;
    const errormessage = searchInput.parentElement.querySelector(".error-search");
    seVisibilityErrorSearch(isVisible, errormessage);
}

function seVisibilityErrorSearch(isVisible, element) {
    if (isVisible) {
        element.classList.add("error");
        element.parentElement.classList.add("error");
    } else {
        element.classList.remove("error");
        element.parentElement.classList.remove("error");
    }
}

window.addEventListener("click", (event) => {
    event.stopPropagation();
    const activeMenu = document.querySelector(".active-select-menu");
    closeActiveSelectMenuWindowClick(activeMenu);
});

window.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.code == 27 || event.key == "Escape") {
        const activeMenu = document.querySelector(".active-select-menu");
        closeActiveSelectMenuWindowClick(activeMenu);
    }
});

generateSelectComponents();