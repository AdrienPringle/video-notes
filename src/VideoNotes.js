import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./VideoNotes.css";

import Note from "./Note.js";

class VideoNotes extends Component {
	// const [notes, setNotes] = useState([]);

	constructor(props) {
		super(props);
		this.state = { notes: [], iterator: 0, videoBox: {} };
		this.refs = {};
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

		const parentBox = this.props.videoEl.getBoundingClientRect();
		const childBox = ReactDOM.findDOMNode(
			this.refs[id]
		).getBoundingClientRect();
		newNotes[i] = {
			...newNotes[i],
			...content,
			id,
			position: this.getRelativeBox(parentBox, childBox),
		};
		this.setState({ notes: newNotes });
		// setNotes(notes);
	};

	editSelfNote(id, key, value) {
		let { notes } = this.state;
		const i = notes.findIndex((e) => e.id == id);
		let newNotes = [...notes];
		newNotes[i][key] = value;
		this.setState({ notes: newNotes });
	}

	getRelativeBox(parentBox, childBox) {
		const {
			top: parentY,
			left: parentX,
			width: parentWidth,
			height: parentHeight,
		} = parentBox;
		const {
			top: childY,
			left: childX,
			width: childWidth,
			height: childHeight,
		} = childBox;
		return {
			x: this.getRelativePosition(parentX, parentWidth, childX, childWidth),
			y: this.getRelativePosition(parentY, parentHeight, childY, childHeight),
		};
	}
	getRelativePosition(parentStart, parentSize, childStart, childSize) {
		const start = childStart - parentStart;
		const size = parentSize - childSize;
		return start / size;
	}

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
						ref={(instance) => {
							this.refs[e.id] = instance;
						}}
					/>
				))}
				<button
					className="add-notes-button"
					onClick={() => console.log(notes, this.refs)}
				>
					view notes
				</button>
			</div>
		);
	}
}

export default VideoNotes;

// ReactDOM.render(<VideoNotes />, document.querySelector("#app"));
