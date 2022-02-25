"use strict";

let students;
let studentArray = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  imgSrc: "",
  house: "",
};

const urlStudentList = "https://petlatkea.dk/2021/hogwarts/students.json";

//**********************SETUP**********************

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
  console.log("ready");
  loadJSON();
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

  document.querySelector("#full_student_list tbody").appendChild(clone);
}

//**********************FILTER FUNCTIONS**********************

function filterGryffindor() {}

function filterSlytherin() {}

function filterHufflepuff() {}

function filterRavenclaw() {}

function filterPrefects() {}

function filterExpelled() {}

function filterNonExpelled() {}

function filterSquad() {}

function filterBoys() {}

function filterGirls() {}

function filterPureBlood() {}

function filterHalfBlood() {}

function filterMuggle() {}

function removeFilter() {}

//**********************SORT FUNCTIONS**********************

function sortFirstName() {}

function sortLastName() {}

function sortHouse() {}

function sortPrefects() {}

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
