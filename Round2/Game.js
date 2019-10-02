"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			formRows: "",
			formCols: "",
			minValue: 5,
			maxValue: 15,
			gameStarted: false
		};
		return _this;
	}

	_createClass(App, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var _state = this.state,
			    gameStarted = _state.gameStarted,
			    formRows = _state.formRows,
			    formCols = _state.formCols,
			    minValue = _state.minValue,
			    maxValue = _state.maxValue;

			var onSubmit = function onSubmit(e) {
				e.preventDefault();
				if (formRows < minValue || formRows > maxValue || formCols < minValue || formCols > maxValue) {
					alert("Hopsz! Az \xE9rt\xE9keknek " + minValue + " \xE9s " + maxValue + " k\xF6z\xF6tt kell lenni\xFCk.");
				} else {
					_this2.setState({ gameStarted: true });
				}
			};
			var onChange = function onChange(e) {
				_this2.setState(_defineProperty({}, e.target.name, e.target.value));
			};
			if (gameStarted) {
				return React.createElement(Game, { rows: formRows, cols: formCols });
			} else {
				return React.createElement(
					"div",
					{ className: "input" },
					React.createElement(
						"h2",
						null,
						"T\xE1bla gener\xE1l\xE1sa"
					),
					React.createElement(
						"p",
						null,
						"Minimum ",
						React.createElement(
							"b",
							null,
							minValue + "x" + minValue
						),
						", maximum",
						" ",
						React.createElement(
							"b",
							null,
							maxValue + "x" + maxValue
						),
						" n\xE9gyzet."
					),
					React.createElement(
						"form",
						{ onSubmit: onSubmit },
						React.createElement("input", {
							type: "number",
							name: "formRows",
							placeholder: "Sorok",
							value: formRows,
							onChange: onChange,
							autoFocus: true,
							required: true
						}),
						React.createElement("input", {
							type: "number",
							name: "formCols",
							placeholder: "Oszlopok",
							value: formCols,
							onChange: onChange,
							required: true
						}),
						React.createElement("input", { type: "submit", value: "Gener\xE1l\xE1s!" })
					)
				);
			}
		}
	}]);

	return App;
}(React.Component);

var Game = function (_React$Component2) {
	_inherits(Game, _React$Component2);

	function Game(props) {
		_classCallCheck(this, Game);

		var _this3 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

		_this3.state = {
			table: [],
			currentStep: 2,
			startCube: true,
			clock: {
				passing: false,
				s: 0,
				m: 0,
				sDisp: "00",
				mDisp: "00"
			}
		};
		return _this3;
	}

	_createClass(Game, [{
		key: "UNSAFE_componentWillMount",
		value: function UNSAFE_componentWillMount() {
			var initTable = [];
			for (var i = 0; i < this.props.rows; i++) {
				initTable[i] = [];
				for (var j = 0; j < this.props.cols; j++) {
					initTable[i][j] = {
						row: i,
						col: j,
						avail: false,
						occup: false,
						text: "x"
					};
				}
			}
			this.setState({ table: initTable });
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var _state2 = this.state,
			    startCube = _state2.startCube,
			    currentStep = _state2.currentStep,
			    table = _state2.table,
			    clock = _state2.clock;
			var _props = this.props,
			    rows = _props.rows,
			    cols = _props.cols;


			var toggleStart = function toggleStart(row, col) {
				console.log("startCube clicked:" + row + ":" + col);
				var newTable = _this4.state.table;
				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						if (i !== row || j !== col) {
							newTable[i][j].text = "";
						}
						if (i === row && j === col) {
							newTable[i][j].text = "1";
							newTable[i][j].occup = true;
						}
						if (
						// horzontal steps
						i === row + 1 && j === col + 2 || i === row - 1 && j === col + 2 || i === row + 1 && j === col - 2 || i === row - 1 && j === col - 2 ||
						// vertical steps
						i === row + 2 && j === col + 1 || i === row - 2 && j === col + 1 || i === row + 2 && j === col - 1 || i === row - 2 && j === col - 1) {
							if (newTable[i][j].occup === false) {
								newTable[i][j].avail = true;
							}
						}
					}
				}
				_this4.setState({
					table: newTable,
					startCube: false,
					clock: Object.assign({}, _this4.state.clock, { passing: true })
				});
				setInterval(function () {
					if (_this4.state.clock.passing === true) {
						if (_this4.state.clock.s === 59) {
							if (_this4.state.clock.m < 9) {
								_this4.setState({
									clock: Object.assign({}, _this4.state.clock, {
										m: _this4.state.clock.m + 1,
										mDisp: "0" + (_this4.state.clock.m + 1),
										s: 0,
										sDisp: "00"
									})
								});
							} else {
								_this4.setState({
									clock: Object.assign({}, _this4.state.clock, {
										m: _this4.state.clock.m + 1,
										mDisp: "" + (_this4.state.clock.m + 1),
										s: 0,
										sDisp: "00"
									})
								});
							}
						} else {
							if (_this4.state.clock.s < 9) {
								_this4.setState({
									clock: Object.assign({}, _this4.state.clock, {
										s: _this4.state.clock.s + 1,
										sDisp: "0" + (_this4.state.clock.s + 1)
									})
								});
							} else {
								_this4.setState({
									clock: Object.assign({}, _this4.state.clock, {
										s: _this4.state.clock.s + 1,
										sDisp: "" + (_this4.state.clock.s + 1)
									})
								});
							}
						}
					}
				}, 1000);
			};
			var clickCube = function clickCube(row, col) {
				var newTable = _this4.state.table;
				var eventCount = void 0;
				eventCount = 0;
				console.log("GameCube clicked: " + row + ";" + col);
				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						newTable[i][j].avail = false;
					}
				}
				for (var _i = 0; _i < rows; _i++) {
					for (var _j = 0; _j < cols; _j++) {
						if (_i === row && _j === col) {
							newTable[_i][_j].occup = true;
							_this4.setState({ currentStep: currentStep + 1 });
							newTable[_i][_j].text = currentStep;
						}
						if (
						// horzontal steps
						_i === row + 1 && _j === col + 2 || _i === row - 1 && _j === col + 2 || _i === row + 1 && _j === col - 2 || _i === row - 1 && _j === col - 2 ||
						// vertical steps
						_i === row + 2 && _j === col + 1 || _i === row - 2 && _j === col + 1 || _i === row + 2 && _j === col - 1 || _i === row - 2 && _j === col - 1) {
							if (newTable[_i][_j].occup === false) {
								newTable[_i][_j].avail = true;
								eventCount++;
							}
						}
					}
				}
				if (eventCount === 0) {
					var freeCubeCount = 0;
					for (var _i2 = 0; _i2 < rows; _i2++) {
						for (var _j2 = 0; _j2 < cols; _j2++) {
							if (newTable[_i2][_j2].occup === false) {
								freeCubeCount++;
							}
						}
					}
					if (freeCubeCount === 0) {
						console.log("win!");
					} else {
						console.log("fucked.");
					}
					_this4.setState({ clock: Object.assign({}, _this4.state.clock, { passing: false }) });
				}
			};
			return React.createElement(
				"div",
				{ className: "game" },
				React.createElement(
					"div",
					{ className: "game-container" },
					table.map(function (row) {
						return React.createElement(
							"div",
							{ className: "row" },
							row.map(function (cube) {
								return React.createElement(CubeComponent, {
									key: cube.row * rows + cube.col,
									text: cube.text,
									avail: cube.avail,
									startCube: startCube,
									clickCube: clickCube.bind(_this4, cube.row, cube.col),
									toggleStart: toggleStart.bind(_this4, cube.row, cube.col)
								});
							})
						);
					})
				),
				React.createElement(
					"p",
					{ id: "clock" },
					clock.mDisp,
					":",
					clock.sDisp
				),
				React.createElement("p", { id: "result-text" })
			);
		}
	}]);

	return Game;
}(React.Component);

var CubeComponent = function (_React$Component3) {
	_inherits(CubeComponent, _React$Component3);

	function CubeComponent(props) {
		_classCallCheck(this, CubeComponent);

		var _this5 = _possibleConstructorReturn(this, (CubeComponent.__proto__ || Object.getPrototypeOf(CubeComponent)).call(this, props));

		_this5.state = {};
		return _this5;
	}

	_createClass(CubeComponent, [{
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    text = _props2.text,
			    avail = _props2.avail,
			    startCube = _props2.startCube,
			    toggleStart = _props2.toggleStart,
			    clickCube = _props2.clickCube;

			return React.createElement(
				"div",
				{
					className: "cube " + (avail ? "cube-avail" : ""),
					onClick: startCube ? toggleStart : avail ? clickCube : null
				},
				React.createElement(
					"span",
					{ className: "" + (startCube ? "cube-x" : "cube-num") },
					text
				)
			);
		}
	}]);

	return CubeComponent;
}(React.Component);

var domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);