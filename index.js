let week;
var wordsArray=["N/A"];

async function fetchData() {
    try {
      const response = await fetch('week.json'); // Replace 'data.json' with the actual path to your JSON file
      const jsonData = await response.json();
      // Do something with jsonData
      week = jsonData;
      //console.log(week)
      wordsArray = week[currentDay][timeBlocks[starting_time_dropdown.selectedIndex]]
      searchFunction()
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }
  
  // Call the function to fetch data
  fetchData();

let defaultTimeIndex;


const currentDate = new Date();
const currentTime = String(currentDate.getHours())+":"+String(currentDate.getMinutes());
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const currentDay = weekday[currentDate.getDay()];

let starting_time_dropdown = document.getElementById("starting-time");
let ending_time_dropdown = document.getElementById("ending-time")

const timeBlocks = [
    "08:20",
    "09:40",
    "11:00",
    "12:20",
    "14:50",
    "16:10",
    "17:30",
    "18:50"
];

const timeBlocksSpecial = [
    "Auto",
    "08:20",
    "09:40",
    "11:00",
    "12:20",
    "14:50",
    "16:10",
    "17:30",
    "18:50"
];

let timeBlocksEnabled = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
];

if (currentTime >= "08:20"){
    for (let i = 0; i < timeBlocks.length; i++){
        if (currentTime <= timeBlocks[i]){
            /*if (parseInt(currentTime.slice(3,5))+10 > parseInt(timeBlocks[i].slice(3,5)) && parseInt(currentTime.slice(0,2))===parseInt(timeBlocks[i].slice(0,2))) {
                timeBlocksEnabled[i-1] = false;
                defaultTimeIndex = i;
            }
            else {
                timeBlocksEnabled[i-1] = true;
                defaultTimeIndex = i-1;
                                                        WILL FIX THIS QUIRK AT SOME POINT
            }*/   
            timeBlocksEnabled[i-1] = true;
            defaultTimeIndex = i-1;
            break;
        }
        else {
            timeBlocksEnabled[i] = false;
        }
    }
}
else {
    defaultTimeIndex = 0;
}

// Display the current local time
function updateTime() {
    document.getElementById("current-time").textContent = String(currentDay)+", "+String(currentTime);
    
}
updateTime()

timeBlocks.forEach(function(time, index) {
    var option = document.createElement("option");
    option.text = time;

    /*if (timeBlocksEnabled[index] === false){
        //option.disabled = true;
        //option.className = "blur";
    }*/
    starting_time_dropdown.add(option);
});

timeBlocksSpecial.forEach(function(time, index) {
  var option = document.createElement("option");
  option.text = time;
  if (index > 0) {
    if (timeBlocksEnabled[index-1] === false){
      option.disabled = true;
      option.className = "blur";
      }}
  ending_time_dropdown.add(option);
});

ending_time_dropdown.selectedIndex = 0;
starting_time_dropdown.selectedIndex = defaultTimeIndex;

function getCommonElements(lists, startIndex, endIndex) {
    if (startIndex < 0 || endIndex >= lists.length) {
      throw new Error("Invalid start or end index");
    }
  
    // Get the sublists from the specified range
    const sublists = Object.values(lists).slice(startIndex, endIndex);
    // Find the common elements in the sublists
    return sublists.reduce((commonElements, currentList) => {
        return commonElements.filter((element) => currentList.includes(element));
      });
  }


function searchLogic(){
    if (ending_time_dropdown.selectedIndex === 0){
        return week[currentDay][timeBlocks[starting_time_dropdown.selectedIndex]]
    }
    else if (starting_time_dropdown.selectedIndex === ending_time_dropdown.selectedIndex-1){
        return week[currentDay][timeBlocks[starting_time_dropdown.selectedIndex]]
    }
    else {
        const commonElements = getCommonElements(week[currentDay], starting_time_dropdown.selectedIndex, ending_time_dropdown.selectedIndex);
        console.log("Common elements:", commonElements);
        return commonElements;
    }
}

export function searchFunction() {
    updateTableWithNewWords(searchLogic())
};

document.addEventListener('DOMContentLoaded', () => {
    // Get the button element by its id
    const button = document.getElementById('myButton');

    // Add a click event listener to the button and call the exported function
    button.addEventListener('click', () => {
        // Call the exported function
        searchFunction();
    });
});



export function generateTable() {
    
    const table = document.querySelector("#wordsTable");
    const chunkSize = 15; // Number of words per row

    // Clear the existing table content
    table.innerHTML = "";

    // Create a new row for every chunk of words
    for (let i = 0; i < wordsArray.length; i += chunkSize) {
        const row = document.createElement("tr");
        table.appendChild(row);

        // Create cells for each word in the chunk
        for (let j = i; j < i + chunkSize && j < wordsArray.length; j++) {
            const cell = document.createElement("td");
            cell.textContent = wordsArray[j];
            row.appendChild(cell);
        }
    }
}

function updateTableWithNewWords(newWordsArray) {
    wordsArray = newWordsArray;
    generateTable();
}

//week[currentDay][timeBlocks[starting_time_dropdown.selectedIndex]]
