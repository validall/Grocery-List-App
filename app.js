// Wrap the entire script in an IIFE to encapsulate variables and avoid global scope pollution
(function () {
  // ****** Select Items **********
  const form = document.querySelector(".shopping-form");
  const alert = document.querySelector(".alert");
  const shopping = document.getElementById("shopping");
  const submitBtn = document.querySelector(".submit-btn");
  const container = document.querySelector(".shopping-container");
  const list = document.querySelector(".shopping-list");
  const clearBtn = document.querySelector(".clear-btn");

  // Edit option
  let editElement;
  let editFlag = false;
  let editID = "";

  // ****** Event Listeners **********

  // Submit form
  form.addEventListener("submit", addItem);

  // Clear list
  clearBtn.addEventListener("click", clearItems);

  // Display items onload
  window.addEventListener("DOMContentLoaded", setupItems);

  // ****** Functions **********

  // Add item
  function addItem(e) {
    e.preventDefault();
    const value = shopping.value.trim();
    const id = new Date().getTime().toString();

    // Check for duplicates
    const items = document.querySelectorAll(".shopping-item .title");
    const duplicate = Array.from(items).some(
      (item) => item.textContent === value
    );

    if (value !== "" && !editFlag && !duplicate) {
      const element = document.createElement("article");
      let attr = document.createAttribute("data-id");
      attr.value = id;
      element.setAttributeNode(attr);
      element.classList.add("shopping-item");
      element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">Edit</button>
              <button type="button" class="delete-btn">Delete</button>
            </div>`;

      // Add event listeners to both buttons
      const deleteBtn = element.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", deleteItem);
      const editBtn = element.querySelector(".edit-btn");
      editBtn.addEventListener("click", editItem);

      // Append child
      list.appendChild(element);

      // Display alert
      displayAlert("Item added to the list", "success");

      // Show container and clear button
      container.classList.add("show-container");
      clearBtn.style.display = "block";

      // Set local storage
      addToLocalStorage(id, value);

      // Reset form
      setBackToDefault();
    } else if (value !== "" && editFlag) {
      editElement.innerHTML = value;
      displayAlert("Value changed", "success");

      // Edit local storage
      editLocalStorage(editID, value);
      setBackToDefault();
    } else if (duplicate) {
      displayAlert("Duplicate item. Not added.", "danger");
    } else {
      displayAlert("Please enter value", "danger");
    }
  }

  // Display alert
  function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // Remove alert
    setTimeout(function () {
      alert.textContent = "";
      alert.classList.remove(`alert-${action}`);
    }, 1000);
  }

  // Clear items
  function clearItems() {
    const items = document.querySelectorAll(".shopping-item");
    if (items.length > 0) {
      items.forEach(function (item) {
        list.removeChild(item);
      });
    }
    container.classList.remove("show-container");
    clearBtn.style.display = "none"; // Hide the Clear List button
    displayAlert("Empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
  }

  // Delete item
  function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if (list.children.length === 0) {
      container.classList.remove("show-container");
      clearBtn.style.display = "none"; // Hide the Clear List button
    }
    displayAlert("Item removed", "danger");

    setBackToDefault();

    // Remove from local storage
    removeFromLocalStorage(id);
  }

  // Edit item
  function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;

    // Set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;

    // Set form value
    shopping.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = "Edit";
  }

  // Reset form to default state
  function setBackToDefault() {
    shopping.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit";
  }

  // ****** Local Storage **********

  function addToLocalStorage(id, value) {
    const shopping = { id, value };
    let items = getLocalStorage();
    items.push(shopping);
    localStorage.setItem("list", JSON.stringify(items));
  }

  function getLocalStorage() {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  }

  function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });

    localStorage.setItem("list", JSON.stringify(items));
  }

  function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
      if (item.id === id) {
        item.value = value;
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
  }

  // ****** Setup Items ******

  function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.value);
      });
      container.classList.add("show-container");
      clearBtn.style.display = "block"; // Show button if there are elements
    } else {
      clearBtn.style.display = "none"; // Hide button if the list is empty
    }
  }

  function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("shopping-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">Edit</button>
              <button type="button" class="delete-btn">Delete</button>
            </div>`;

    // Add event listeners to both buttons
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // Append child
    list.appendChild(element);
  }
})();
