"use strict";

let students;
let studentArray = [];

const Student = {
  firstName: "",
  lastName: "",
  house: "",
  gender: "",
  blood: "",
  status: "",
  imgSrc: "",
};

const filter = {};

const urlStudentList = "https://petlatkea.dk/2021/hogwarts/students.json";

//**********************SETUP**********************

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
  console.log("ready");
  loadJSON();
  registerButtons();
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

//**********************JSON**********************

async function loadJSON() {
  console.log("loadJSON");
  const jsonData = await fetch(urlStudentList);
  students = await jsonData.json();
  makeStudents();
}

function makeStudents() {
  console.log("makeStudents");
  students.forEach((elm) => {
    const student = Object.create(Student);

    // Variables for holding data and trim data for whitespace
    let fullName = elm.fullname.trim();
    let house = elm.house.trim();
    let gender = elm.gender.trim();

    // Firstname: take the first char and set it to upper case and set the rest to lower case.
    student.firstName =
      fullName.substring(0, 1).toUpperCase() +
      fullName.substring(1, fullName.indexOf(" ")).toLowerCase();

    // Lastname: take the first char in the lastname and make it upper case and the rest lower case.
    student.lastName =
      fullName
        .substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2)
        .toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();

    // Middlename: take the middlename and make the first char upper case and the rest lower case.
    student.middleName =
      fullName
        .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
        .trim()
        .substring(0, 1)
        .toUpperCase() +
      fullName
        .substring(fullName.indexOf(" "), fullName.lastIndexOf(" "))
        .trim()
        .substring(1)
        .toLowerCase();

    // Nickname: find the nickname with "" in a if statement.
    if (fullName.includes(`"`)) {
      student.nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
      student.middleName = "";
    }

    // Gender: first char set to upper case, rest to lower case.
    student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

    // Imgsrc: find the destation and make it all to lower case.
    student.imgSrc = `./images/${fullName.substring(0, fullName.indexOf(" ")).toLowerCase()}_.png`;
    student.imgSrc = `./images/${
      fullName
        .substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2)
        .toLowerCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase()
    }_${fullName.substring(0, 1).toUpperCase().toLowerCase()}.png`;

    // House: set the first char to upper case and the rest to lower case.
    student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

    studentArray.push(student);
  });
  displayList(studentArray);
}

function displayList(studentArray) {
  console.table(studentArray);
  // clear the list
  document.querySelector("#full_student_list  tbody").innerHTML = "";

  // build a new list
  studentArray.forEach(displayAllStudents);
}

function displayAllStudents(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=blood]").textContent = student.blood;
  clone.querySelector("[data-field=status]").textContent = student.status;

  document.querySelector("#full_student_list tbody").appendChild(clone);
}
//**********************FILTER FUNCTIONS**********************

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log("user selected ${filter}");
  filterList(filter);
}

function filterList(filterBy) {
  let filteredList = studentArray;

  if (filterBy === "Gryffindor") {
    filteredList = studentArray.filter(filterGryffindor);
  } else if (filterBy === "Slytherin") {
    filteredList = studentArray.filter(filterSlytherin);
  } else if (filterBy === "Hufflepuff") {
    filteredList = studentArray.filter(filterHufflepuff);
  } else if (filterBy === "Ravenclaw") {
    filteredList = studentArray.filter(filterRavenclaw);
  } else if (filterBy === "Boy") {
    filteredList = studentArray.filter(filterBoys);
  } else if (filterBy === "Girl") {
    filteredList = studentArray.filter(filterGirls);
  }

  displayList(filteredList);
}

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

function filterPureBlood() {}

function filterHalfBlood() {}

function filterMuggle() {}

function filterPrefects() {}

function filterExpelled() {}

function filterNonExpelled() {}

function filterSquad() {}

function removeFilter() {}

//**********************SORT FUNCTIONS**********************

function selectSort(event) {
  const sort = event.target.dataset.sort;
  console.log("user selected ${filter}");
  sortList(sort);
}

function sortList(sortBy) {
  let sortedList = studentArray;

  if (sortBy === "firstName") {
    sortedList = studentArray.sort(sortFirstName);
  } else if (sortBy === "lastName") {
    sortedList = studentArray.sort(sortLastName);
  } else if (sortBy === "house") {
    sortedList = studentArray.sort(sortHouse);
  } else if (sortBy === "gender") {
    sortedList = studentArray.sort(sortGender);
  }

  displayList(sortedList);
}

function sortFirstName(studentA, studentB) {
  if (studentA.firstName < studentB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortLastName(studentA, studentB) {
  if (studentA.lastName < studentB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortHouse(studentA, studentB) {
  if (studentA.house < studentB.house) {
    return -1;
  } else {
    return 1;
  }
}

function sortGender(studentA, studentB) {
  if (studentA.gender < studentB.gender) {
    return -1;
  } else {
    return 1;
  }
}

function sortBlood() {}

function sortStatus() {}

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
