"use strict";

const e = React.createElement;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		return <p>Apádat</p>;
	}
}

const domContainer = document.querySelector("#game");
ReactDOM.render(e(Game), domContainer);
