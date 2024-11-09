/**
 * Check the visibility of the category dropdown.
 * If the dropdown is hidden, it opens the dropdown; otherwise, it closes it.
 */
function checkIfCategoryDropdownIsVisible() {
    if (document.getElementById("category-dropdown-list").classList.contains("d-none")) {
        showCategoryDropDown();
    } else {
        closeCategoryDropDown();
    }
}

/**
 * Displays the category dropdown and resets the selected category.
 * It also changes the dropdown arrow to indicate the open state.
 */
function showCategoryDropDown() {
    document.getElementById("category-placeholder").innerHTML = /*html*/ `Select task category`;
    document.getElementById("category-dropdown-arrow-container").innerHTML = /*html*/ `<img src="/img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("category-dropdown-list");
    dropdownList.innerHTML = templateCategoryHTMLDropdownList(categoryList);

    document.getElementById("category-dropdown-list").classList.remove("d-none");
    selectedCategory = null;

    // let categoryContainer = document.getElementById("selected-category");
    // removeBorderStyleToValueContainer(categoryContainer, "#90D1ED");
}

/**
 * Generates the HTML template for the category dropdown list.
 *
 * @param {Array} categories - The list of available categories to be displayed.
 * @returns {string} The generated HTML string for the category dropdown list.
 */
function templateCategoryHTMLDropdownList(categories) {
    let dropdownHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-category-${i}" onclick="selectCategory('${category}', ${i})">
                <span>${category}</span>
            </div>`;
    }
    return dropdownHTML;
}

/**
 * Closes the category dropdown.
 * If a category is selected, it displays the selected category in the placeholder;
 * otherwise, it resets the placeholder to the default "Select task category".
 */
function closeCategoryDropDown() {
    let categoryPlaceholder = document.getElementById("category-placeholder");

    if (selectedCategory) {
        categoryPlaceholder.innerHTML = selectedCategory;
    } else {
        categoryPlaceholder.innerHTML = /*html*/ `Select task category`;
        selectedCategory = null;
        checkIfCategoryIsSelected();
    }

    document.getElementById("category-dropdown-arrow-container").innerHTML = /*html*/ `<div id="category-dropdown-arrow-container"><img src="/img/addTask/arrow_drop_down.svg" id="dropdown-arrow"></div>`;
    document.getElementById("category-dropdown-list").classList.add("d-none");
}

/**
 * Selects a category from the dropdown.
 * Adds a border style to the category container and closes the dropdown.
 *
 * @param {string} categoryName - The name of the selected category.
 */
function selectCategory(categoryName) {
    let categoryContainer = document.getElementById("selected-category");
    let missingCategoryMessage = document.getElementById("missing-category-message");
    addBorderStyleToValueContainer(categoryContainer, "#90D1ED");
    selectedCategory = categoryName;
    closeCategoryDropDown();
    missingCategoryMessage.style.display = "none";

    // resetCategoryRequiredNotification();
}
