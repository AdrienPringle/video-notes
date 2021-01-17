// runs in popup
var createNote = document.querySelector("#create");
var clearNotes = document.querySelector("#clear");
var deleteNotes = document.querySelector("#delete");
const getData = () => ({
	notesField: document.querySelector("#note-value").value,
	startField: document.querySelector("#startField").value,
	endField: document.querySelector("#endField").value,
});

getUrl = async () => {
	return new Promise(function (resolve, reject) {
		chrome.tabs.query({ active: true }, (tabs) => {
			chrome.windows.getCurrent.bind(tabs)(({ id }) => {
				// console.log(tabs.filter((t) => t.windowId === id)[0].url);
				resolve(tabs.filter((t) => t.windowId === id)[0]);
			});
		});
	});
};

getUrl().then(({ url, id: tabId }) => {
	chrome.storage.sync.get(null, (dataObj) => {
		let notesList = document.getElementById("notes");
		const keys = Object.keys(dataObj);
		console.log(dataObj);
		//chrome.extension.getBackgroundPage().console.log(dataObj["https://www.youtube.com/watch?v=w4rPQ2AJRSI&t=2319s&ab_channel=HacktheNorth"].notes[0].content);     GETS CONTENT VALUE
		//chrome.extension.getBackgroundPage().console.log(dataObj["https://www.youtube.com/watch?v=w4rPQ2AJRSI&t=2319s&ab_channel=HacktheNorth"].notes.length);         GETS HOW MANY NOTES
		//chrome.extension.getBackgroundPage().console.log("dataObj:",dataObj);                                                                                          GETS HOW MANY URLS

		for (j in dataObj) {
			//iterates through urls
			var url2 = keys[j]; //sets index of notes to urls
			//chrome.extension.getBackgroundPage().console.log("j",j)
			//chrome.extension.getBackgroundPage().console.log("dataObj[j].notes",dataObj[j].notes)

			var li = document.createElement("li");
			var b = document.createElement("b");
			b.appendChild(li.appendChild(document.createTextNode([j])));
			notesList.appendChild(b);

			for (k in dataObj[j].notes) {
				chrome.extension.getBackgroundPage().console.log("k", k);
				var ul = document.createElement("ul");
				var li = document.createElement("li");
				ul.appendChild(
					li.appendChild(document.createTextNode(dataObj[j].notes[k].content))
				);
				notesList.appendChild(ul);
			}
		}
	});

	// notesField.focus();

	// 	// Clear Page Notes
	// 	clearNotes.onclick = function () {
	// 		chrome.storage.sync.get(url, (notes) => {
	// 			notes[url] = [];
	// 			chrome.storage.sync.set(notes);
	// 			chrome.tabs.sendMessage(
	// 				tabs[0].id,
	// 				{ notes: notes[url], action: "clear" },
	// 				(_) => {
	// 					console.log("Cleared page");
	// 					location.reload();
	// 				}
	// 			);
	// 		});
	// 	};

	// 	// Delete All Notes
	// 	deleteNotes.onclick = function () {
	// 		chrome.storage.sync.get(url, (notes) => {
	// 			const keys = Object.keys(notes);
	// 			notes[url] = [];
	// 			chrome.storage.sync.clear();

	// 			// for(var j = 0; j < keys.length; j++){
	// 			//   let url = tabs[j].url;
	// 			//   chrome.extension.getBackgroundPage().console.log("notes",notes);
	// 			//   notes = []
	// 			// }
	// 			//chrome.storage.sync.set(notes);
	// 			chrome.tabs.sendMessage(
	// 				tabs[0].id,
	// 				{ notes: notes[url], action: "clear" },
	// 				(_) => {
	// 					console.log("Cleared page");
	// 					location.reload();
	// 				}
	// 			);
	// 		});
	// 	};

	// Save Note
	createNote.onclick = function () {
		//let note = {startTime: startField.value, endTime: endField.value, content: notesField.value};

		chrome.storage.sync.get((data) => {
			const { notesField, startField, endField } = getData();
			// let newNote = format
			console.log("yes");
			let dataObj = { ...data };
			const id = (dataObj[url] && dataObj[url].iterator) || 0;
			const content = notesField;
			const startTime = parseFloat(startField);
			const endTime = parseFloat(endField);
			const position = { x: Math.random(), y: Math.random() };
			const newNote = { id, content, startTime, endTime, position };
			const isValid = startTime >= 0 && endTime > startTime && content;
			if (!isValid) {
				console.log("invalid inputs", startTime, endTime, content);
				return;
			}

			dataObj[url].notes = [...dataObj[url].notes, newNote];
			dataObj[url].iterator = id + 1;

			console.log(newNote);
			console.log(dataObj);

			/*
      id,
      content,
      startTime,
      endTime: endTime || startTime + 5,
      position,*/

			chrome.storage.sync.set(dataObj, function () {
				if (!chrome.runtime.lastError) {
					console.log("Saved", url, data);
					chrome.tabs.sendMessage(tabId, { url: url, action: "add" }, (_) => {
						console.log("Added Note at url: '" + url);
						location.reload();
					});
				}
			});

			// location.reload();
		});
	};
});
