// runs in popup
var createNote = document.querySelector('#create');
var clearNotes = document.querySelector('#clear');
var deleteNotes = document.querySelector('#delete')
var notesField = document.querySelector('#note-value');
var notes2 = document.querySelector('#notes2');
var vidURL = document.querySelector("#vidurl");
var start = document.querySelector("#start")
var end = document.querySelector("#end")
var startField = document.querySelector("#startField")
var endField = document.querySelector("endField")

// Populate Notes From Page

getUrl = async () => {
  return new Promise(function (resolve, reject) {
      chrome.tabs.query({ active: true }, (tabs) => {
          chrome.windows.getCurrent.bind(tabs)(({ id }) => {
              // console.log(tabs.filter((t) => t.windowId === id)[0].url);
              resolve(tabs.filter((t) => t.windowId === id)[0].url);
          });
      });
  });
};

getUrl().then((url) => {
console.log(url)

  //let url = tabs[0].url;
  let notesList = document.getElementById("notes");
  let notesList2 = document.getElementById("notes2");

  chrome.storage.sync.get(null, dataObj=> {
    const keys = Object.keys(dataObj)

     //chrome.extension.getBackgroundPage().console.log(dataObj["https://www.youtube.com/watch?v=w4rPQ2AJRSI&t=2319s&ab_channel=HacktheNorth"].notes[0].content);     GETS CONTENT VALUE
     //chrome.extension.getBackgroundPage().console.log(dataObj["https://www.youtube.com/watch?v=w4rPQ2AJRSI&t=2319s&ab_channel=HacktheNorth"].notes.length);         GETS HOW MANY NOTES
     //chrome.extension.getBackgroundPage().console.log("dataObj:",dataObj);                                                                                          GETS HOW MANY URLS

    for (j in dataObj){  //iterates through urls
        var url2 = keys[j]                  //sets index of notes to urls
        //chrome.extension.getBackgroundPage().console.log("j",j)
        //chrome.extension.getBackgroundPage().console.log("dataObj[j].notes",dataObj[j].notes)

          var li = document.createElement("li");
          var b = document.createElement("b")
              b.appendChild(li.appendChild(document.createTextNode([j])));
              notesList.appendChild(b);
        
        for (k in dataObj[j].notes){
          chrome.extension.getBackgroundPage().console.log("k",k);
          var ul = document.createElement("ul");
          var li = document.createElement("li");
          ul.appendChild(li.appendChild(document.createTextNode(dataObj[j].notes[k].content)));
          notesList.appendChild(ul)

          }
              
        }
    })

//notesField.focus();

// Clear Page Notes
clearNotes.onclick = function () {
      chrome.storage.sync.get(url, notes => {
        notes[url] = []
        chrome.storage.sync.set(notes);
        chrome.tabs.sendMessage(tabs[0].id, {notes: notes[url], action: "clear"}, _ => {
          console.log("Cleared page");
          location.reload();
        });
      });
    };

// Delete All Notes
deleteNotes.onclick = function () {
        chrome.storage.sync.get(url, notes => {
          const keys = Object.keys(notes)
          notes[url] = []
          chrome.storage.sync.clear()
          
          // for(var j = 0; j < keys.length; j++){
          //   let url = tabs[j].url;
          //   chrome.extension.getBackgroundPage().console.log("notes",notes);
          //   notes = [] 
          // }
            //chrome.storage.sync.set(notes);
            chrome.tabs.sendMessage(tabs[0].id, {notes: notes[url], action: "clear"}, _ => {
            console.log("Cleared page");
            location.reload();
        });
      });
  };

// Save Note
createNote.onclick = function () {
    //let note = {startTime: startField.value, endTime: endField.value, content: notesField.value};
    let note = notesField.value;
 
    chrome.storage.sync.get( dataObj => {
    
      if (dataObj[url])
        dataObj[url].notes.push("- " + note);
      else
        dataObj[url].notes = ["- " + note];

      chrome.tabs.sendMessage(tabs[0].id, {dataObj: [note], action: "add"}, _ => {
        console.log("Added Note: '"+ note);
      });
      chrome.storage.sync.set(dataObj);//add notes to array
      //chrome.storage.sync.set(notes2);//add notes to storage 2
      
      console.log(dataObj);
    });
  };
  location.reload();;

});