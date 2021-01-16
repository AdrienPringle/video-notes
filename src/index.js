import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import VideoNotes from "./VideoNotes";

// Get the element to prepend our app to. This could be any element on a specific website or even just `document.body`.
// const viewport = document.getElementById('viewport');

// Create a div to render the <App /> component to.
const app = document.createElement("div");

// Set the app element's id to `root`. This is the same as the element that create-react-app renders to by default so it will work on the local server too.
app.id = "root";

// document.querySelector("div").appendChild(app);
window.addEventListener("load", function () {
	const videos = document.querySelectorAll("video");

	// Prepend the <App /> component to the viewport element if it exists. You could also use `appendChild` depending on your needs.
	// if (viewport) viewport.prepend(app);

	// Render the <App /> component.
	const container = document.createElement("div");
	app.appendChild(container);
	videos.forEach((v) => ReactDOM.render(<VideoNotes videoEl={v} />, container));
	console.log("added videos ", videos);
});

document.body.appendChild(app);
