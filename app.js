// import the firebase function initialize app
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// get the firebase database || any function used must be imported e.g ref, push etc
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
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
let endorsementSection = document.querySelector("#endorsement-section");

// Add eventlistener to the publish button

publishBtn.addEventListener("click", () => {
  let endorsementFrom = fromInputBtn.value;
  let endorsementParagraph = endorsementInputValue.value;
  let endorsementTo = toInputBtn.value;

  // Create endorsementData object
  let endorsementData = {
    from: endorsementFrom,
    paragraph: endorsementParagraph,
    to: endorsementTo,
    count: 0,
  };

  // Push data to the database
  push(EndorsementListInDB, endorsementData);

  // // Append endorsement to the document
  // appendEndorsement(endorsementData);

  // Clear input fields after appending
  clearInputFields(fromInputBtn);
  clearInputFields(toInputBtn);
  clearInputFields(endorsementInputValue);
});

// fetching the data from database in realtime || using snapshot // // Get an array of endorsement objects

onValue(EndorsementListInDB, function (snapshot) {
  // snapshot.exists() to show items when there are items in the database
  // and if there are not displays the text 'No items here... yet'.
  if (snapshot.exists()) {
    let endorsementArray = Object.entries(snapshot.val());

    // clear the existing content of the endorsement container
    clearEndorsementContainer();

    // Loop through the array
    for (let i = 0; i < endorsementArray.length; i++) {
      // Access individual fields from the object
      let currentItem = endorsementArray[i];

      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      // Append item to the endorsement list element for each iteration
      appendEndorsement(currentItemValue, currentItemID);
    }
  } else {
    endorsementSection.innerHTML = `<p class ="no-item-paragraph">No items here...... yet</p>`;
  }
});

// append endorsement to the document
function appendEndorsement(item, currentItemID) {
  let endorsementFrom = item.from;
  let endorsementParagraph = item.paragraph;
  let endorsementTo = item.to;
  let like = item.count;

  let endorsementContainer = document.querySelector("#endorsement-section");

  let endorseDivEl = document.createElement("div");
  endorseDivEl.classList.add("endorsement-container");

  endorseDivEl.innerHTML = `
    <h3>${endorsementFrom}</h3>
    <p>${endorsementParagraph}</p>
    <div class="like-btn-container">
      <h3>${endorsementTo}</h3>
      <i class="fa-solid fa-heart love-icon"> <span class= "count">${like}</span></i>
    </div>
  `;

  endorseDivEl.addEventListener("dblclick", () => {
    // gets the exact location of the list before funning a function on it

    let exactLocationOfItemInDB = ref(
      database,
      `EndorsementList/${currentItemID}`
    );

    // remove function to remove the item from the database
    remove(exactLocationOfItemInDB);
  });

  endorsementContainer.appendChild(endorseDivEl);

  // Find likeIconEl and likeCount within endorseDivEl
  let likeIconEl = endorseDivEl.querySelector(".fa-heart");
  let likeCount = endorseDivEl.querySelector(".count");

  // like count eventlistener
  let count = 0;

  likeIconEl.addEventListener("click", () => {
    // Update the count locally
    count++;
    likeCount.textContent = count;
  });
}

// clear input field(clear)
function clearInputFields(clear) {
  clear.value = "";
}

function clearEndorsementContainer() {
  // let endorsementSection = document.querySelector("#endorsement-section");

  // Keep the header content inside the container
  let endorsementHeader = endorsementSection.querySelector(
    "#endorsement-header"
  );

  // Clear only the endorsements, not the additional content
  endorsementSection.innerHTML = "";

  // Restore the additional content
  if (endorsementHeader) {
    endorsementSection.appendChild(endorsementHeader);
  }
}
