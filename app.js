// DOM elements
const addbtnSubject = document.getElementById("addBtn");
const addInputValue = document.getElementById("subject");
const tableDataDisplay = document.getElementById("tableData");
const radios = document.getElementsByName("type");
const dueDate = document.getElementById("due-date");

// Data storage
let data_array = [];
let edit_id = null;

// Retrieve data from localStorage on page load
let objStr = localStorage.getItem("users");
if (objStr) {
  data_array = JSON.parse(objStr);
}

// Display initial data
DisplayInfo();

// Event handler for add/edit button click
addbtnSubject.onclick = () => {
  const name = addInputValue.value;
  const date = dueDate.value;

  let selectedValue = "";
  for (const radio of radios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }

  // Validate inputs
  const isNameValid = validateName(name);
  const isDateValid = validateDate(date);
  const isRadioValid = validateRadioSelection(radios);

  if (!isNameValid || !isDateValid || !isRadioValid) {
    return; // Exit function if any validation fails
  }

  // Edit Data if edit_id is set, otherwise insert Data
  if (edit_id != null) {
    data_array.splice(edit_id, 1, {
      name: name,
      selectedValue: selectedValue,
      date: date,
    });
    edit_id = null;
  } else {
    data_array.push({
      name: name,
      selectedValue: selectedValue,
      date: date,
      completed: false,
    });
  }

  // Save data to localStorage, update display, and clear fields
  SaveInfo(data_array);
  addInputValue.value = "";
  addbtnSubject.innerText = btnText; // Reset button text
};

// Function to save data to localStorage and update display
function SaveInfo(data_array) {
  let str = JSON.stringify(data_array);
  localStorage.setItem("users", str);
  DisplayInfo(); // Update displayed data
  ClearAllFields(); // Clear input fields
}

// Function to clear all input fields
function ClearAllFields() {
  addInputValue.value = "";
  radios.forEach((radio) => (radio.checked = false));
  dueDate.value = "";
}

// Function to display data in the table
function DisplayInfo() {
  let statement = "";
  data_array.forEach((user, i) => {
    const taskCompletedClass = user.completed ? "completed-task" : "";
    statement += `<tr class="${taskCompletedClass}">
                    <th scope="row">${i + 1}</th>
                    <td>${user.name}</td>
                    <td>${user.selectedValue}</td>
                    <td>${user.date}</td>
                    <td>
                      <i class="btn text-white fa fa-edit btn-info mx-2" onclick="EditInfo(${i})"></i>
                      &nbsp;&nbsp;
                      <i class="btn btn-danger text-white fa fa-trash" onclick="DeleteInfo(${i})"></i>
                      &nbsp;&nbsp;
                      <i class="btn btn-success text-white fa fa-check" onclick="MarkCompleted(${i})"></i>
                    </td>
                  </tr>`;
  });
  tableDataDisplay.innerHTML = statement;
}

// Function to mark a task as completed
function MarkCompleted(id) {
  data_array[id].completed = true;
  SaveInfo(data_array);
}

// Function to populate fields for editing a task
function EditInfo(id) {
  edit_id = id;
  addInputValue.value = data_array[id].name;
  radios.forEach((radio) => {
    if (radio.value === data_array[id].selectedValue) {
      radio.checked = true;
    }
  });
  dueDate.value = data_array[id].date;
  addbtnSubject.innerText = "Save Changes"; // Change button text for edit mode
}

// Function to delete a task
function DeleteInfo(id) {
  data_array.splice(id, 1);
  SaveInfo(data_array);
}

// Validation function for name field
function validateName(name) {
  const errorElement = document.getElementById("nameError");
  if (name.trim() === "") {
    errorElement.innerText = "Name cannot be empty.";
    return false;
  } else {
    errorElement.innerText = "";
    return true;
  }
}

// Validation function for date field
function validateDate(date) {
  const errorElement = document.getElementById("dateError");
  if (date.trim() === "") {
    errorElement.innerText = "Please select a valid due date.";
    return false;
  } else {
    errorElement.innerText = "";
    return true;
  }
}

// Validation function for radio button selection
function validateRadioSelection(radios) {
  const errorElement = document.getElementById("typeError");
  for (const radio of radios) {
    if (radio.checked) {
      errorElement.innerText = "";
      return true;
    }
  }
  errorElement.innerText = "Please select a type.";
  return false;
}

// Event listener for filtering tasks by priority
const querySelect = document.querySelectorAll("#tableData tr");
const filterData = document.querySelector("#priority-filter");
filterData.addEventListener("input", function (e) {
  const srcData = e.target.value;
  tableDataDisplay.innerHTML = ""; // Clear current table content

  querySelect.forEach((tr) => {
    const td_data = tr.querySelectorAll("td");
    console.log(td_data);
    if (td_data[1].innerText.indexOf(srcData) > -1) {
      tableDataDisplay.appendChild(tr); // Append matching rows back to the table
    }
  });
});
