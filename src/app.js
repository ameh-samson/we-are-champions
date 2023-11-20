// import the firebase function initialize app
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// get the firebase database || any function used must be imported e.g ref, push etc
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// get the database url from the firebase project console
const appSettings = {
  databaseURL:
    "https://realtime-database-e6f12-default-rtdb.europe-west1.firebasedatabase.app/",
};

// setting the app variable and passing the appsettings const which links the project to firebase
const app = initializeApp(appSettings);

// creating database variable
const database = getDatabase(app);

// setting up the reference in the database for the project
const EndorsementListInDB = ref(database, "EndorsementList");

const publishBtn = document.querySelector("#publish-btn");
const fromInputBtn = document.querySelector("#from-input-value");
const toInputBtn = document.querySelector("#to-input-value");
const endorsementInputValue = document.querySelector("#text-area");

// Add eventlistener to the publish button

publishBtn.addEventListener("click", () => {
  let endorsementFrom = fromInputBtn.value;
  let endorsementParagraph = endorsementInputValue.value;
  let endorsementTo = toInputBtn.value;

  //   in order to push the object to the database in group, this is an object to represent the endorsement

  //   to push input data into the database
  push(EndorsementListInDB, endorsementFrom);
  push(EndorsementListInDB, endorsementParagraph);
  push(EndorsementListInDB, endorsementTo);

  //   calling the appendEndorsement function
  appendEndorsement(endorsementFrom, endorsementParagraph, endorsementTo);

  clearInputFields(fromInputBtn);
  clearInputFields(toInputBtn);
  clearInputFields(endorsementInputValue);
});

// fetching the data from database in realtime || using snapshot

onValue(EndorsementListInDB, function (snapshot) {
  let endorsementArray = Object.values(snapshot.val());

  // looping through the array
  for (let i = 0; i < endorsementArray.length; i++) {
    // append item to the endorsement list element for each
    // iteration passing the item array in the append endorsement function
    appendEndorsement(endorsementArray[i]);
  }
});

// append endorsement to the document
function appendEndorsement(
  endorsementFrom,
  endorsementParagraph,
  endorsementTo
) {
  let endorsementContainer = document.querySelector("#endorsement-section");

  let endorseDivEl = document.createElement("div");
  endorseDivEl.classList.add("endorsement-container");

  let endorsementFromEl = document.createElement("h3");
  endorsementFromEl.textContent = endorsementFrom;
  endorseDivEl.appendChild(endorsementFromEl);

  let endorsementParagraphEl = document.createElement("p");
  endorsementParagraphEl.textContent = endorsementParagraph;
  endorseDivEl.appendChild(endorsementParagraphEl);

  let likeBtnContainer = document.createElement("div");
  likeBtnContainer.classList.add("like-btn-container");

  let endorsementToEl = document.createElement("h3");
  endorsementToEl.textContent = endorsementTo;
  likeBtnContainer.appendChild(endorsementToEl);

  let likeIconEl = document.createElement("i");
  likeIconEl.classList.add("fa-solid", "fa-heart", "love-icon");

  let likeCount = document.createElement("span");
  likeCount.classList.add("count");
  likeIconEl.appendChild(likeCount);

  likeBtnContainer.appendChild(likeIconEl);
  endorseDivEl.appendChild(likeBtnContainer);

  endorsementContainer.appendChild(endorseDivEl);

  //   like count eventlistener
  let count = 0;

  likeIconEl.addEventListener("click", () => {
    count++;
    likeCount.textContent = count;
  });
}

// clear input field(clear)
function clearInputFields(clear) {
  clear.value = "";
}
