"use strict";
/////////////////////////////////////////////////
//page logic
//Elements
const date = document.getElementById("date");
const content = document.getElementById("content");

//Consts
const daysDate = new Date();
const formattedDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(daysDate);
const dayEndVersions = {};

//////////////////////////////////////////////////////////////////////
//Keep the data there all day
// Load saved content when the page loads
window.addEventListener("load", () => {
  const savedText = localStorage.getItem("autosaveText");
  if (savedText) {
    content.value = savedText;
  }
});

// Save content to localStorage on every input change
content.addEventListener("input", () => {
  localStorage.setItem("autosaveText", content.value);
});

// Optional: Save content one last time before the page is unloaded
window.addEventListener("beforeunload", () => {
  localStorage.setItem("autosaveText", content.value);
});

////////////////////////////////////////////////////////////////

//Populate Date on page
date.innerHTML = formattedDate;

function formatContent(pageContent) {
  const parts = pageContent.split("z");
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] == "") {
      parts.splice(i, 1);
    }
  }
  let formattedContent = {};

  for (let j = 0; j < parts.length; j++) {
    const string = parts[j];
    let key;

    if (string[0] == "q") {
      key = "Quote";
    } else if (string[0] == "m") {
      key = "Media";
    } else if (string[0] == "l") {
      key = "Link";
    } else if (string[0] == "t") {
      key = "Thought";
    } else if (string[0] == "p") {
      key = "Person";
    }
    formattedContent[key] = parts[j];
  }
  console.log(formattedContent);
  return formattedContent;
}

function endOfDay() {
  const formattedContent = formatContent(content.value);
  console.log(dayEndVersions);
  dayEndVersions[formattedDate] = formattedContent;
  console.log(dayEndVersions);
  return formattedContent;
}

///////////////////////////////////////////////////////////////
//have the server call the endOfDay function

//add a second page that allows you to sort and veiw the data

//Connecting to the backend
const sendObjectToBackend = async (myObject) => {
  try {
    const response = await fetch("http://localhost:3000/api/save-object", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myObject), // Convert object to JSON string
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Response from backend:", data);
    } else {
      console.error("Failed to send object:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending object:", error);
  }
};

// Call the function (e.g., on button click or page load)

//Save the current page
button.addEventListener("click", function () {
  const myObject = endOfDay();
  sendObjectToBackend(myObject);
});
