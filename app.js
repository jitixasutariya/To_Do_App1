const addbtnSubject = document.getElementById("addBtn");
const btnText = addbtnSubject.innerText;
const addInputValue = document.getElementById("subject");
const tableDataDisplay = document.getElementById("tableData");
const radios = document.getElementsByName("type");
const dueDate = document.getElementById("due-date");
let data_array = [];
let edit_id = null;

let objStr = localStorage.getItem("users");
if (objStr) {
  data_array = JSON.parse(objStr);
}
DisplayInfo();

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
    return;
  }
  //Edit Data
  if (edit_id != null) {
    data_array.splice(edit_id, 1, {
      name: name,
      selectedValue: selectedValue,
      date: date,
    });
    edit_id = null;
  } else {
    //insert Data
    data_array.push({
      name: name,
      selectedValue: selectedValue,
      date: date,
      completed: false,
    });
    //data_array.push({ name: name, selectedValue: selectedValue, date: date });
  }

  SaveInfo(data_array);
  // after add data this field clear
  addInputValue.value = "";
  // change button text add and edit functionality
  addbtnSubject.innerText = btnText;
};

function SaveInfo(data_array) {
  //after add data save the data
  let str = JSON.stringify(data_array);
  localStorage.setItem("users", str);
  DisplayInfo();
  ClearAllFields();
}

function ClearAllFields() {
  //after add data this function clear data
  addInputValue.value = "";
  radios.forEach((radio) => (radio.checked = false));
  dueDate.value = "";
}
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

function MarkCompleted(id) {
  data_array[id].completed = true;
  SaveInfo(data_array);
}

function EditInfo(id) {
  // edit function
  edit_id = id;
  addInputValue.value = data_array[id].name;
  radios.forEach((radio) => {
    if (radio.value === data_array[id].selectedValue) {
      radio.checked = true;
    }
  });
  dueDate.value = data_array[id].date;
  addbtnSubject.innerText = "Save Changes";
}

function DeleteInfo(id) {
  //delete function

  data_array.splice(id, 1);
  SaveInfo(data_array);
}

function validateName(name) {
  // validation for the name field
  const errorElement = document.getElementById("nameError");
  if (name.trim() === "") {
    errorElement.innerText = "Name cannot be empty.";
    // error msg
    return false;
  } else {
    errorElement.innerText = "";
    return true;
  }
}

function validateDate(date) {
  //validation for the date field
  const errorElement = document.getElementById("dateError");
  if (date.trim() === "") {
    errorElement.innerText = "Please select a valid due date.";
    // error msg
    return false;
  } else {
    errorElement.innerText = "";
    return true;
  }
}

function validateRadioSelection(radios) {
  // validation for the radio button
  const errorElement = document.getElementById("typeError");
  for (const radio of radios) {
    if (radio.checked) {
      errorElement.innerText = "";
      return true;
    }
  }
  errorElement.innerText = "Please select a type.";
  // error msg
  return false;
}
