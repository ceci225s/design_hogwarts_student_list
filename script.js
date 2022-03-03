"use strict";

let students;
let studentArray = [];
let studentArrayBlood = [];
let filteredStudents;
let halfBloodArray = [];
let pureBloodArray = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  blood: "",
  inquisitorial: false,
  expelled: false,
  prefect: false,
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
  const urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
  let dataStudent = await fetch(urlStudents);
  studentArray = await dataStudent.json();

  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";
  let dataBlood = await fetch(urlBlood);
  studentArrayBlood = await dataBlood.json();

  createStudents(studentArray, studentArrayBlood);
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
  studentArrayBlood = data.map(prepareObject);

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

  // BLOOD STATUS
  halfBloodArray = studentArrayBlood.half;
  pureBloodArray = studentArrayBlood.pure;

  const halfBloodType = halfBloodArray.some((halfBlood) => {
    return halfBlood === student.lastName;
  });

  const pureBloodType = pureBloodArray.some((pureBlood) => {
    return pureBlood === student.lastName;
  });

  if (halfBloodType === true) {
    student.blood = "Halfblood";
  } else if (pureBloodType === true) {
    student.blood = "Pureblood";
  } else {
    student.blood = "Muggle scum";
  }

  // console.table(student);
  return student;
}

// function prepareData(students) {
//   students.forEach((jsonObject) => {
//     let student = Object.create(Student);

//     // FULL NAME
//     let fullName = jsonObject.fullname.trim();
//     fullName = fullName.toLowerCase();

//     // FIRST NAME
//     let firstChar = fullName.substring(0, 1);
//     firstChar = firstChar.toUpperCase();

//     student.firstName = fullName.substring(1, fullName.indexOf(" "));
//     student.firstName = firstChar + student.firstName;

//     // LAST NAME
//     student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

//     let firstCharLastName = student.lastName.substring(0, 1);
//     firstCharLastName = firstCharLastName.toUpperCase();
//     student.lastName =
//       firstCharLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

//     if (student.lastName.includes("-")) {
//       let firstLastName = student.lastName.substring(0, student.lastName.indexOf("-"));
//       let secondLastName = student.lastName.substring(student.lastName.indexOf("-") + 1);
//       let firstCharSecondLastName = secondLastName.substring(0, 1);
//       firstCharSecondLastName = firstCharSecondLastName.toUpperCase();
//       secondLastName =
//         firstCharSecondLastName + student.lastName.substring(student.lastName.indexOf("-") + 2);

//       student.lastName = firstLastName + "-" + secondLastName;
//     }
//     // MIDDLE NAME
//     student.middleName = fullName.substring(
//       student.firstName.length + 1,
//       fullName.lastIndexOf(" ")
//     );

//     let firstCharMiddle = student.middleName.substring(0, 1);
//     firstCharMiddle = firstCharMiddle.toUpperCase();

//     if (student.middleName == " ") {
//       student.middleName = undefined;
//     } else if (student.middleName.includes('"')) {
//       firstCharMiddle = student.middleName.substring(1, 2);
//       firstCharMiddle = firstCharMiddle.toUpperCase();
//       student.nickName =
//         firstCharMiddle +
//         fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
//       student.middleName = undefined;
//     } else {
//       student.middleName =
//         firstCharMiddle +
//         fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
//     }

//     if (fullName.includes(" ") == false) {
//       student.firstName = fullName.substring(1);
//       student.firstName = firstChar + student.firstName;

//       student.middleName = undefined;
//       student.lastName = undefined;
//     }
//     // PHOTO
//     photoFirstChar = firstChar.toLowerCase();
//     student.photo = "images/" + student.lastName + "_" + photoFirstChar + ".png";

//     // GENDER

//     genderFirstChar = jsonObject.gender.substring(0, 1);
//     genderFirstChar = genderFirstChar.toUpperCase();
//     student.genderName = jsonObject.gender.substring(1);
//     student.gender = genderFirstChar + student.genderName;

//     // BLOOD STATUS
//     halfBloodArray = bloodArray.half;
//     pureBloodArray = bloodArray.pure;

//     const halfBloodType = halfBloodArray.some((halfBlood) => {
//       return halfBlood === student.lastName;
//     });

//     const pureBloodType = pureBloodArray.some((pureBlood) => {
//       return pureBlood === student.lastName;
//     });

//     if (halfBloodType === true) {
//       student.blood = "Halfblood";
//     } else if (pureBloodType === true) {
//       student.blood = "Pureblood";
//     } else {
//       student.blood = "Muggle scum";
//     }

//     // HOUSE

//     let houseName = jsonObject.house.trim();
//     houseName = houseName.toLowerCase();
//     let houseNameFirstChar = houseName.substring(0, 1);
//     houseNameFirstChar = houseNameFirstChar.toUpperCase();

//     student.house = houseNameFirstChar + houseName.substring(1, houseName.length);

//     allStudents.push(student);
//   });

//   displayList(allStudents);
// }

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

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

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

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

  if (student.expelled === true) {
    clone.querySelector("[data-field=expelled]").textContent = "❌";
  } else {
    clone.querySelector("[data-field=expelled]").textContent = " ";
  }

  clone.querySelector("[data-field=expelled]").addEventListener("click", clickExpelled);

  function clickExpelled() {
    if (student.expelled === true) {
      student.expelled = false;
    } else {
      tryToMakeExpelledStudent(student);
      // student.expelled = true;
    }
    buildList();
  }

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "❌";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = " ";
  }

  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefectStudent(student);
      // student.expelled = true;
    }
    buildList();
  }

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

  document.querySelector("#full_student_list tbody").appendChild(clone);
}

function tryToMakeExpelledStudent(selectedStudent) {
  const allExpelledStudents = studentArray.filter((student) => student.expelled);

  const numberOfExpelledStudent = allExpelledStudents.length;
  const other = allExpelledStudents
    .filter((student) => student.gender === selectedStudent.gender)
    .shift();

  if (other !== undefined) {
    console.log("There can only be one expelled of each gender!");
    removeOther(other);
  } else if (numberOfExpelledStudent >= 2) {
    console.log("There can only be two expelled");
    removeAorB(student[0], student[1]);
  } else {
    makeExpelledStudent(selectedStudent);
  }

  function removeOther(other) {
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .close_button").addEventListener("click", closeDialog);

    document.querySelector("#removeother");

    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
    }

    removeExpelledStudent(other);
    makeExpelledStudent(selectedStudent);
  }

  function removeAorB(expelledA, expelledB) {
    removeExpelledStudent(expelledA);
    makeExpelledStudent(selectedStudent);
    removeExpelledStudent(expelledB);
    makeExpelledStudent(selectedStudent);
  }

  function removeExpelledStudent(expelledStudent) {
    expelledStudent.expelled = false;
  }

  function makeExpelledStudent(student) {
    student.expelled = true;
  }
}

function tryToMakePrefectStudent(selectedStudent) {
  const allPrefectStudents = studentArray.filter((student) => student.prefect);

  const numberOfPrefectStudent = allPrefectStudents.length;
  const other = allPrefectStudents
    .filter((student) => student.gender === selectedStudent.gender)
    .shift();

  if (other !== undefined) {
    console.log("There can only be one prefect of each gender!");
    removeOther(other);
  } else if (numberOfPrefectStudent >= 2) {
    console.log("There can only be two prefects");
    removeAorB(student[0], student[1]);
  } else {
    makePrefectStudent(selectedStudent);
  }

  function removeOther(other) {
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .close_button").addEventListener("click", closeDialog);

    removePrefectStudent(other);
    makePrefectStudent(selectedStudent);
  }

  function closeDialog() {
    document.querySelector("#remove_other").classList.add("hide");
  }

  function removeAorB(prefectA, prefectB) {
    removePrefectStudent(prefectA);
    makePrefectStudent(selectedStudent);
    removePrefectStudent(prefectB);
    makePrefectStudent(selectedStudent);
  }

  function removePrefectStudent(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefectStudent(student) {
    student.prefect = true;
  }
}

//********************************************BUILDING A NEW LIST**********************

function buildList() {
  const currentList = filterList(studentArray);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

//********************************************FILTERING**********************

function prepareData(filter) {
  filteredStudents = studentArray + studentArrayBlood.filter(filter);
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
  } else if (settings.filterBy === "muggle") {
    filteredList = studentArray.filter(filterMuggle);
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
  return student.blood === "Pure blood";
}

function filterHalfBlood(student) {
  return student.blood === "Half blood";
}

function filterMuggle(student) {
  return student.blood === "Muggle";
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

//*******************************************POP-UP FUNCTIONS**********************

// document.querySelector("#popup button").addEventListener("click", closePopup);

// function closePopup() {
//   document.querySelector("#popup").style.display = "none";
// }

// function showDetails(details) {
//   const popup = document.querySelector("#popup");
//   popup.style.display = "block";
//   // popup.querySelector("#popup img").src = "images/" + details.picture + "-md.jpg";
//   popup.querySelector(".firstname").textContent = details.firstName;
//   popup.querySelector(".lastname").textContent = details.lastName;
//   // popup.querySelector(".pris").textContent = details.pris;
//   console.log(details);
// }
