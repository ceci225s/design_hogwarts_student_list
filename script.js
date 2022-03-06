"use strict";

let students;
let studentArray = [];
let studentArrayBlood = [];
let expelledStudent = [];
let filteredStudents;

const melody = document.querySelector("#backgound_sound");

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  bloodType: "",
  inquisitorial: false,
  expelled: false,
  prefect: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

//********************************************LOADING PAGE**********************

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
  console.log("ready");
  loadStudents();
  loadBlood();
  registerButtons();
  melody.play();
  melody.volume = 0.1;
  document.querySelector("#popup_student").classList.add("hide");
  document.querySelector("#popup_inquisitorial").classList.add("hide");
  document.querySelector("#popup_prefect").classList.add("hide");
}

//********************************************LOADING STUDENTS JSON**********************

async function loadStudents() {
  const urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
  const dataStudents = await fetch(urlStudents);
  const student = await dataStudents.json();

  // when loaded, prepare data objects
  createStudents(student);
}

//********************************************LOADING FAMILIES JSON**********************

async function loadBlood() {
  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";
  const dataBlood = await fetch(urlBlood);
  const bloodtype = await dataBlood.json();
  studentArrayBlood = bloodtype;
}

//********************************************REGISTER BUTTONS**********************

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#search").addEventListener("input", searchFieldInput);
}

//********************************************CREATING ALL THE STUDENTS AND CLEANING ERRORS IN THE ARRAY**********************

function createStudents(data) {
  studentArray = data.map(prepareStudent);
  // studentArrayBlood = data.map(prepareObject);

  buildList();
}

function prepareStudent(object) {
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

  // ----- clling blood function

  student.bloodType = whichBloodType(student);

  return student;
}

function whichBloodType(student) {
  if (studentArrayBlood.pure.indexOf(student.lastName) > -1) {
    return "pure";
  } else if (studentArrayBlood.half.indexOf(student.lastName) > -1) {
    return "halfblood";
  } else {
    return "muggle";
  }
}

function searchFieldInput(evt) {
  // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
  displayList(
    studentArray.filter((elm) => {
      // comparing in uppercase so that m is the same as M
      return (
        elm.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) ||
        elm.lastName.toUpperCase().includes(evt.target.value.toUpperCase())
      );
    })
  );
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

  let search = document.getElementById("search");
  let el = document.querySelectorAll(".grid");

  search.addEventListener("keyup", function () {
    el.forEach((student) => {
      if (
        student
          .querySelector(".name")
          .textContent.toLowerCase()
          .includes(search.value.toLowerCase())
      ) {
        student.style.display = "block";
      } else {
        student.style.display = "none";
      }
    });
  });
}

//********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

function displayAllStudents(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector(".info").addEventListener("click", () => studentPopup(student));

  if (student.inquisitorial === true) {
    clone.querySelector("[data-field=inquisitorial]").textContent = "🌟";
  } else {
    clone.querySelector("[data-field=inquisitorial]").textContent = "☆";
  }

  clone.querySelector("[data-field=inquisitorial]").addEventListener("click", clickInquisitorial);

  function clickInquisitorial() {
    if (student.bloodType === "pure" || student.house === "slytherin") {
      if (student.inquisitorial === true) {
        student.inquisitorial = false;
      } else {
        student.inquisitorial = true;
      }
      buildList();
    } else {
      inquisitorialPopup();
    }
  }

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "🌟";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "☆";
  }

  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefectStudent(student);
    }
    buildList();
  }

  //********************************************DEFINE AND APPEND THE STUDENT-OBJECTS**********************

  document.querySelector("#full_student_list tbody").appendChild(clone);
}

//********************************************BUILDING A NEW LIST**********************

function buildList() {
  const currentList = filterList(studentArray);
  const sortedList = sortList(currentList);

  displayList(sortedList);
  listInformation();
}

//********************************************MAKING THE FILTERING**********************

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
  } else if (settings.filterBy === "squad") {
    filteredList = expelledStudent.filter(filterSquad);
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

//********************************************FILTER FUNCTIONS FOR EACH BUTTON**********************

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
  return student.bloodType === "Pure";
}

function filterHalfBlood(student) {
  return student.bloodType === "Half";
}

function filterMuggle(student) {
  return student.bloodType === "Muggle";
}

function filterPrefects(student) {
  return student.gender === "Prefects";
}

function filterExpelled(student) {
  return student.expelled === "Expelled";
}

function filterSquad(student) {
  return student.gender === "Squad";
}

//**********************MAKINF THE SORTING**********************

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

//**********************SEARCH FUNCTIONS**********************

function tryToMakePrefectStudent(selectedStudent) {
  const prefects = studentArray.filter(
    (student) => student.prefect && student.house === selectedStudent.house
  );
  const numberOfPrefects = prefects.length;

  if (numberOfPrefects >= 2) {
    console.log("WARNING! there can only be two prefects from each house");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    document.querySelector("#popup_prefect").classList.remove("hide");
    document
      .querySelector("#popup_prefect .close_button_prefect")
      .addEventListener("click", closeDialog);
    document.querySelector("#popup_prefect #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#popup_prefect #removeb").addEventListener("click", clickRemoveB);

    document.querySelector("#popup_prefect [data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("#popup_prefect [data-field=prefectB]").textContent = prefectB.firstName;

    // if ignore - do nothing
    function closeDialog() {
      document.querySelector("#popup_prefect").classList.add("hide");
      document
        .querySelector("#popup_prefect .close_button_prefect")
        .removeEventListener("click", closeDialog);
      document.querySelector("#popup_prefect #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#popup_prefect #removeb").removeEventListener("click", clickRemoveB);
    }

    // if removeA:
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    // if removeB:
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(student) {
    student.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

//**********************POPUP STUDENTINFORMATIONS**********************

function studentPopup(studentDetails) {
  console.log("details");
  document.querySelector("#popup_student").classList.remove("hide");
  document.querySelector("#popup_student button").addEventListener("click", closeStudentPopup);
  document.querySelector("#popup_student .firstname").textContent =
    "Firstname: " + studentDetails.firstName;
  document.querySelector("#popup_student .nickname").textContent =
    "Nickname: " + studentDetails.nickName;
  document.querySelector("#popup_student .middlename").textContent =
    "Middlename: " + studentDetails.middleName;
  document.querySelector("#popup_student .lastname").textContent =
    "Lastname: " + studentDetails.lastName;
  document.querySelector("#popup_student .house").textContent = "House: " + studentDetails.house;
  document.querySelector("#popup_student .bloodstatus").textContent =
    "Bloodtype: " + studentDetails.bloodType;
  document.querySelector("#popup_student .prefect").textContent =
    "Prefect: " + studentDetails.prefect;
  document.querySelector(".houseCrest").src = `images/crest/${studentDetails.house}.png`;
  document.querySelector(
    ".studentImage"
  ).src = `images/${studentDetails.lastName}_${studentDetails.firstName[0]}.png`;
  if (studentDetails.lastName === "Patil") {
    document.querySelector(
      ".studentImage"
    ).src = `images/${studentDetails.lastName.toLowerCase()}_${studentDetails.firstName.toLowerCase()}.png`;
  } else {
    document.querySelector(".studentImage").src = `images/${studentDetails.lastName
      .substring(studentDetails.lastName.lastIndexOf(""), studentDetails.lastName.indexOf("-") + 1)
      .toLowerCase()}_${studentDetails.firstName.substring(0, 1).toLowerCase()}.png`;
  }

  //__________EXPELLING A STUDENT

  document.querySelector(".expel").addEventListener("click", expelStudent);

  function expelStudent() {
    document.querySelector(".expel").removeEventListener("click", expelledStudent);
    const expelSplice = studentArray.splice(studentArray.indexOf(studentDetails), 1)[0];
    expelSplice.expelled = true;
    expelledStudent.push(expelSplice);
    buildList();
    closeStudentPopup();
  }
}

function closeStudentPopup() {
  console.log("Click");
  document.querySelector("#popup_student").classList.add("hide");
}

//**********************POPUP PREFECT**********************

function inquisitorialPopup() {
  document.querySelector("#popup_inquisitorial").classList.remove("hide");
  document
    .querySelector(".close_button_inquisitorial")
    .addEventListener("click", closenInquisitorialPopup);
}

function closenInquisitorialPopup() {
  console.log("Click");
  document.querySelector("#popup_inquisitorial").classList.add("hide");
}

//*******************************************POP-UP FUNCTIONS**********************

function listInformation() {
  console.log("displayListInformation");
  // THE DISPLAY INFORMATION ON NUMBER OF STUDENT
  document.querySelector(".gryff_number").textContent = `Gryffindor: ${
    studentArray.filter((student) => student.house === "Gryffindor").length
  }`;
  document.querySelector(".slyth_number").textContent = `Slytherin: ${
    studentArray.filter((student) => student.house === "Slytherin").length
  }`;
  document.querySelector(".huff_number").textContent = `Hufflepuff: ${
    studentArray.filter((student) => student.house === "Hufflepuff").length
  }`;
  document.querySelector(".raven_number").textContent = `Ravenclaw: ${
    studentArray.filter((student) => student.house === "Ravenclaw").length
  }`;
  document.querySelector(".nonexpelled_number").textContent = `Nonexpelled: ${studentArray.length}`;
}

//**********************NON-REVERSIBLE FUNCTIONS**********************

function displayList(students) {
  // clear the list
  document.querySelector("#full_student_list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayAllStudents);
}

function hackSystem() {}
