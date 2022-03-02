"use strict";

let students;
let studentArray = [];
let filteredStudents;

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  bloodStatus: "",
  inquisitorial: false,
  expelled: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

//********************************************START**********************

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
  console.log("ready");
  loadJSON();
  registerButtons();
}

//********************************************JSON**********************

async function loadJSON() {
  console.log("getJson");
  const url = "https://petlatkea.dk/2021/hogwarts/students.json";
  let data = await fetch(url);
  studentArray = await data.json();

  createStudents(studentArray);
}

//********************************************REGISTER BUTTONS**********************

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function createStudents(data) {
  studentArray = data.map(prepareObject);

  buildList();
}

//********************************************SORTING DATA AND CORRECTING IT**********************

function prepareObject(object) {
  const student = Object.create(Student);

  // ----- trim all the objects
  let originalName = object.fullname.trim();
  let originalHouse = object.house.trim();
  let originalGender = object.gender.trim();

  // ----- cleaning first name
  if (originalName.includes(" ")) {
    student.firstName = originalName.substring(originalName.indexOf(0), originalName.indexOf(" "));
  } else {
    student.firstName = originalName.substring(originalName.indexOf(0));
  }
  student.firstName =
    student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();

  // ----- cleaning middle name
  student.middleName = originalName.substring(
    originalName.indexOf(" ") + 1,
    originalName.lastIndexOf(" ")
  );
  student.middleName =
    student.middleName.substring(0, 1).toUpperCase() +
    student.middleName.substring(1).toLowerCase();

  //----- cleaning nickname
  if (originalName.includes('"')) {
    student.middleName = undefined;
    student.nickName = originalName.substring(
      originalName.indexOf('"') + 1,
      originalName.lastIndexOf('"')
    );
  }

  // ----- cleaning last name
  if (originalName.includes(" ")) {
    student.lastName = originalName.substring(originalName.lastIndexOf(" ") + 1);
    student.lastName =
      student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
  }

  // ----- cleaning house
  student.house = originalHouse;
  student.house =
    student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();

  // ----- cleaning gender
  student.gender = originalGender;
  student.gender =
    student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase();

  // ----- cleaning images
  let studentPicture = new Image();
  studentPicture.scr = "images/" + student.lastName + ".png";
  student.image = studentPicture.scr;

  // console.table(student);
  return student;
}

//********************************************DISPLAYING STUDENT LIST**********************

function displayList(list) {
  document.querySelector("#full_student_list tbody").innerHTML = "";
  list.forEach((student) => displayStudent(student));
}

//********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

function displayAllStudents(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=blood]").textContent = student.blood;
  clone.querySelector("[data-field=status]").textContent = student.status;

  if (student.inquisitorial === true) {
    clone.querySelector("[data-field=inquisitorial]").textContent = "🌟";
  } else {
    clone.querySelector("[data-field=inquisitorial]").textContent = "✰";
  }

  clone.querySelector("[data-field=inquisitorial]").addEventListener("click", clickInquisitorial);

  function clickInquisitorial() {
    if (student.inquisitorial === true) {
      student.inquisitorial = false;
    } else {
      student.inquisitorial = true;
    }

    buildList();
  }

  document.querySelector("#full_student_list tbody").appendChild(clone);
}

//********************************************BUILDING A NEW LIST**********************

function buildList() {
  const currentList = filterList(studentArray);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

//********************************************FILTERING**********************

function prepareData(filter) {
  filteredStudents = studentArray.filter(filter);
  return filteredStudents;
}

function filterList(filteredList) {
  // let filteredList = studentArray;

  if (settings.filterBy === "gryffindor") {
    filteredList = studentArray.filter(filterGryffindor);
  } else if (settings.filterBy === "slytherin") {
    filteredList = studentArray.filter(filterSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = studentArray.filter(filterHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = studentArray.filter(filterRavenclaw);
  } else if (settings.filterBy === "boys") {
    filteredList = studentArray.filter(filterBoys);
  } else if (settings.filterBy === "girls") {
    filteredList = studentArray.filter(filterGirls);
  } else if (settings.filterBy === "pure_blood") {
    filteredList = studentArray.filter(filterPureBlood);
  } else if (settings.filterBy === "half_blood") {
    filteredList = studentArray.filter(filterHalfBlood);
  } else if (settings.filterBy === "prefects") {
    filteredList = studentArray.filter(filterPrefects);
  } else if (settings.filterBy === "expelled") {
    filteredList = studentArray.filter(filterExpelled);
  } else if (settings.filterBy === "non_expelled") {
    filteredList = studentArray.filter(filterNonExpelled);
  } else if (settings.filterBy === "squad") {
    filteredList = studentArray.filter(filterSquad);
  }

  return filteredList;
}

function selectFilter(userEvent) {
  const filter = userEvent.target.dataset.filter;
  console.log(`I have selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
  console.log(`Chosen filter: ${filter}`);
}

//********************************************FILTER FUNCTIONS**********************

function filterGryffindor(student) {
  return student.house === "Gryffindor";
}

function filterSlytherin(student) {
  return student.house === "Slytherin";
}

function filterHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function filterRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function filterBoys(student) {
  return student.gender === "Boy";
}

function filterGirls(student) {
  return student.gender === "Girl";
}

function filterPureBlood(student) {
  return student.gender === "Pure blood";
}

function filterHalfBlood(student) {
  return student.gender === "Half blood";
}

function filterPrefects(student) {
  return student.gender === "Prefects";
}

function filterExpelled(student) {
  return student.gender === "Expelled";
}

function filterNonExpelled(student) {
  return student.gender === "Non expelled";
}

function filterSquad(student) {
  return student.gender === "Squad";
}

//**********************SORT FUNCTIONS**********************

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log("user selected ${filter}");
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  buildList();
}

function sortList(sortedList) {
  // let sortedList = studentArray;
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  // if (sortBy === "firstName") {
  // sortedList = studentArray.sort(sortFirstName);
  // } else if (sortBy === "lastName") {
  //   sortedList = studentArray.sort(sortLastName);
  // } else if (sortBy === "house") {
  //   sortedList = studentArray.sort(sortHouse);
  // } else if (sortBy === "gender") {
  //   sortedList = studentArray.sort(sortGender);
  // }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

// function sortLastName(studentA, studentB) {
//   if (studentA.lastName < studentB.lastName) {
//     return -1;
//   } else {
//     return 1;
//   }
// }

// function sortHouse(studentA, studentB) {
//   if (studentA.house < studentB.house) {
//     return -1;
//   } else {
//     return 1;
//   }
// }

// function sortGender(studentA, studentB) {
//   if (studentA.gender < studentB.gender) {
//     return -1;
//   } else {
//     return 1;
//   }
// }

// function sortBlood() {}

// function sortStatus() {}

//**********************SEARCH FUNCTIONS**********************

function search() {}

//**********************TOGGLE FUNCTIONS**********************

function makePrefect() {}

function undoPrefect() {}

function makeSquadMember() {}

//**********************NON-REVERSIBLE FUNCTIONS**********************

function expelStudent() {}

function hackSystem() {}

//**********************POP-UP FUNCTIONS**********************

function showStudentDetails() {}

function displayList(students) {
  // clear the list
  document.querySelector("#full_student_list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayAllStudents);
}
