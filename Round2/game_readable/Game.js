"use strict";

const e = React.createElement;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		if (this.state.liked) {
			return "You liked this.";
		}

		return (
			<button onClick={() => this.setState({ liked: true })}>Likes</button>
		);
	}
}

const domContainer = document.querySelector("#game");
ReactDOM.render(e(Game), domContainer);
