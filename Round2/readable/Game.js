"use strict";

const e = React.createElement;

class CubeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return <span>{this.props.text}</span>;
	}
}

// export default CubeComponent

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameStarted: false,
			formRows: "",
			formCols: "",
			minValue: 5,
			maxValue: 20
		};
	}

	render() {
		const { gameStarted, formRows, formCols, minValue, maxValue } = this.state;
		const onSubmit = (e) => {
			e.preventDefault();
			if (
				formRows < minValue ||
				formRows > maxValue ||
				formCols < minValue ||
				formCols > maxValue
			) {
				alert(
					`Hopsz! Az értékeknek ${minValue} és ${maxValue} között kell lenniük.`
				);
			} else {
				this.setState({ gameStarted: true });
			}
			console.log("submitted");
		};

		const onChange = (e) => {
			this.setState({ [e.target.name]: e.target.value });
		};
		if (gameStarted) {
			let table = [],
				row = [];
			for (let j = 0; j < formCols; j++) {
				row.push(<CubeComponent text="asdf " />);
			}
			row.push(<br />);
			for (let i = 0; i < formRows; i++) {
				table.push(row);
			}
			console.log(table);
			return <div>{table}</div>;
		} else {
			return (
				<div>
					<h2>Tábla generálása</h2>
					<p>
						Minimum <b>{minValue + "x" + minValue}</b>, maximum{" "}
						<b>{maxValue + "x" + maxValue}</b> négyzet
					</p>
					<form onSubmit={onSubmit}>
						<input
							type="number"
							name="formRows"
							placeholder="Sorok"
							value={formRows}
							onChange={onChange}
							autoFocus={true}
							required
						/>
						<input
							type="number"
							name="formCols"
							placeholder="Oszlopok"
							value={formCols}
							onChange={onChange}
							required
						/>
						<input type="submit" value="Generálás!" />
					</form>
				</div>
			);
		}
	}
}

const domContainer = document.querySelector("#game");
ReactDOM.render(e(Game), domContainer);
