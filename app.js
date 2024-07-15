const addbtnSubject = document.getElementById("addBtn");
const btnText = addbtnSubject.innerText;
const addInputVlaue = document.getElementById("subject");
const tableDataDisplay = document.getElementById("tableData");
const radios = document.getElementsByName("type");
const dueDate = document.getElementById("due-date");
let selectedValue;
let subjectList = [];
let edit_list = null;

let objstr = localStorage.getItem("list_subject");

if (objstr != null) {
  subjectList = JSON.parse(objstr);
  console.log(subjectList);
}

DisplayInfo();
addbtnSubject.onclick = () => {
  const name = addInputVlaue.value;
  const date = dueDate.value;

  for (const radio of radios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }

  if (edit_list != null) {
    //edit
    subjectList.splice(edit_list, 1, {
      name: name,
      selectedValue: selectedValue,
      date: date,
    });
    edit_list = null;
  } else {
    //insert
    subjectList.push({ name: name, selectedValue: selectedValue, date: date });
  }
  SaveInfo(subjectList);
  addInputVlaue.value = "";
  addbtnSubject.innerText = btnText;
};
function SaveInfo(arrlist) {
  let strlist = JSON.stringify(arrlist);
  localStorage.setItem("list_subject", strlist);
  DisplayInfo();
}
function DisplayInfo() {
  let statement = "";
  subjectList.forEach((subject, i) => {
    statement += ` <tr>
                  <th scope="row">${i + 1}</th>
                  <td>${subject.name}</td>
                  <td>${subject.selectedValue}</td>
                  <td>${subject.date}</td>
                  <td>
                    <i class="btn text-white fa fa-edit btn-info mx-2" onclick="EditInfo(${i})"></i>
                    &nbsp;&nbsp;
                    <i class="btn btn-danger text-white fa fa-trash" onclick="DeleteInfo(${i})"></i>
                  </td>
                </tr>`;
  });
  tableDataDisplay.innerHTML = statement;
}
function EditInfo(id) {
  edit_list = id;
  addInputVlaue.value = subjectList[id].name;
  addbtnSubject.innerText = "Save Changes";
}
function DeleteInfo(id) {
  subjectList.splice(id, 1);
  SaveInfo(subjectList);
}
