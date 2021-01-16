import React, { Component, useState, useEffect, useCallback } from "react";
import "./VideoNotes.css";

import Note from "./Note.js";

class VideoNotes extends Component {
	// const [notes, setNotes] = useState([]);

	constructor(props) {
		super(props);
		this.state = { notes: [], iterator: 0 };
	}

	//  addNote = useCallback(() => {
	// 	setNotes([...notes, { id: iterator }]);
	// 	setIterator(iterator + 1);
	// }, [iterator, notes]);

	addNote = () => {
		const { notes, iterator } = this.state;
		const { videoEl } = this.props;
		let newNotes = [...notes, { id: iterator, startTime: videoEl.currentTime }];
		this.setState({ notes: newNotes, iterator: iterator + 1 });
	};

	removeNote = (id) => {
		this.setState({ notes: this.state.notes.filter((n) => n.id != id) });
	};

	setSelfNote = (id, content) => {
		let { notes } = this.state;
		const i = notes.findIndex((e) => e.id == id);
		let newNotes = [...notes];
		newNotes[i] = { id, ...content };
		this.setState({ notes: newNotes });
		// setNotes(notes);
	};
	render() {
		let { notes } = this.state;
		let { videoEl } = this.props;
		let { top, left, width, height } = videoEl.getBoundingClientRect();
		let style = {
			top: top + "px",
			left: left + "px",
			width: width + "px",
			height: height + "px",
		};
		return (
			<div className="video-notes-wrapper" style={style}>
				<button className="add-notes-button" onClick={this.addNote}>
					+
				</button>
				{notes.map((e) => (
					<Note
						key={e.id}
						startTime={e.startTime}
						setObj={e}
						remove={() => this.removeNote(e.id)}
						changeNote={(content) => this.setSelfNote(e.id, content)}
					/>
				))}
				<button className="add-notes-button" onClick={() => console.log(notes)}>
					view notes
				</button>
			</div>
		);
	}
}

export default VideoNotes;

// ReactDOM.render(<VideoNotes />, document.querySelector("#app"));
