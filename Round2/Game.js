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
			gameStarted: false,
			hardMode: false
		};
		return _this;
	}

	_createClass(App, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var _state = this.state,
			    hardMode = _state.hardMode,
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
			var changeMode = function changeMode() {
				_this2.setState({ hardMode: !_this2.state.hardMode });
			};
			if (gameStarted) {
				return React.createElement(Game, { rows: formRows, cols: formCols, hardMode: hardMode });
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
						React.createElement(
							"div",
							{ className: "checkbox-wrapper" },
							React.createElement(
								"div",
								{
									className: "checkbox " + (hardMode ? "checkbox-hard" : ""),
									onClick: changeMode
								},
								React.createElement("span", {
									className: "checkbox__circle " + (hardMode ? "checkbox__circle-hard" : "")
								})
							),
							React.createElement(
								"p",
								null,
								"M\xF3d: ",
								React.createElement(
									"span",
									null,
									hardMode ? "Nehezített" : "Sima"
								)
							)
						),
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

		var initTable = [];
		for (var i = 0; i < props.rows; i++) {
			initTable[i] = [];
			for (var j = 0; j < props.cols; j++) {
				initTable[i][j] = {
					row: i,
					col: j,
					avail: false,
					occup: false,
					text: "x"
				};
			}
		}
		if (props.hardMode === true) {
			var sensorRow = Math.floor(Math.random() * props.rows);
			var sensorCol = Math.floor(Math.random() * props.cols);
			var sensorRow2 = Math.floor(Math.random() * props.rows);
			var sensorCol2 = Math.floor(Math.random() * props.cols);
			var genSensors = function genSensors(i, j, width, height, isCross) {
				initTable[i][j].isSensorCenter = true;
				initTable[i][j].isSensorArea = true;
				var interval = (width - width % 2) / 2 - (width - width % 2);
				for (var ii = 0; ii < height; ii++) {
					for (var jj = 0; jj < width; jj++) {
						console.group("SensorKocka");
						console.log("Sorok: i" + i + " + ii" + ii + " + interval" + interval + " = " + (i + ii + interval));
						console.log("Oszlop: j" + j + " + jj" + ii + " + interval" + interval + " = " + (j + jj + interval));
						console.groupEnd();
						if (i + ii + interval >= 0 && i + ii + interval < props.rows) {
							if (j + jj + interval >= 0 && j + jj + interval < props.cols) {
								initTable[i + ii + interval][j + jj + interval].isSensorArea = true;
							}
						}
					}
				}
			};
			for (var _i = 0; _i < props.rows; _i++) {
				for (var _j = 0; _j < props.cols; _j++) {
					if (props.rows >= 5 || props.cols >= 5) {
						if (_i === sensorRow && _j === sensorCol) {
							console.log("Sensor: " + sensorRow + " " + sensorCol);
							genSensors(_i, _j, 5, 5, true);
							// initTable[i][j].isSensorArea = true;
						}
					}
					if (initTable[_i][_j].row === sensorRow && initTable[_i][_j].col === sensorCol) {
						initTable[_i][_j].isSensorArea = true;
						initTable[_i][_j].isSensorCenter = true;
					}
				}
			}
		}
		_this3.state = {
			table: initTable,
			currentStep: 2,
			startCube: true,
			startCubePos: {
				row: 0,
				col: 0
			},
			clock: {
				passing: false,
				s: 0,
				m: 0,
				sDisp: "00",
				mDisp: "00"
			},
			result: ""
		};
		return _this3;
	}

	_createClass(Game, [{
		key: "render",
		value: function render() {
			var _this4 = this;

			var _state2 = this.state,
			    startCube = _state2.startCube,
			    startCubePos = _state2.startCubePos,
			    currentStep = _state2.currentStep,
			    table = _state2.table,
			    clock = _state2.clock,
			    result = _state2.result,
			    bonus = _state2.bonus;
			var _props = this.props,
			    rows = _props.rows,
			    cols = _props.cols;


			var toggleStart = function toggleStart(row, col) {
				console.log("startCube clicked:" + row + ":" + col);
				_this4.setState({ startCubePos: Object.assign({}, _this4.state.startCubePos, { row: row, col: col }) });
				var newTable = _this4.state.table;
				for (var i = 0; i < rows; i++) {
					for (var j = 0; j < cols; j++) {
						if (i !== row || j !== col) {
							if (newTable[i][j].isSensorCenter !== true) {
								newTable[i][j].text = "";
							}
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
				for (var _i2 = 0; _i2 < rows; _i2++) {
					for (var _j2 = 0; _j2 < cols; _j2++) {
						if (_i2 === row && _j2 === col) {
							newTable[_i2][_j2].occup = true;
							_this4.setState({ currentStep: currentStep + 1 });
							newTable[_i2][_j2].text = currentStep;
						}
						if (
						// horzontal steps
						_i2 === row + 1 && _j2 === col + 2 || _i2 === row - 1 && _j2 === col + 2 || _i2 === row + 1 && _j2 === col - 2 || _i2 === row - 1 && _j2 === col - 2 ||
						// vertical steps
						_i2 === row + 2 && _j2 === col + 1 || _i2 === row - 2 && _j2 === col + 1 || _i2 === row + 2 && _j2 === col - 1 || _i2 === row - 2 && _j2 === col - 1) {
							if (newTable[_i2][_j2].occup === false) {
								newTable[_i2][_j2].avail = true;
								eventCount++;
							}
						}
					}
				}
				if (eventCount === 0) {
					var freeCubeCount = 0;
					for (var _i3 = 0; _i3 < rows; _i3++) {
						for (var _j3 = 0; _j3 < cols; _j3++) {
							if (newTable[_i3][_j3].occup === false) {
								freeCubeCount++;
							}
						}
					}
					if (freeCubeCount === 0) {
						_this4.setState({ result: "Nyertél!" });
						for (var _i4 = 0; _i4 < rows; _i4++) {
							for (var _j4 = 0; _j4 < cols; _j4++) {
								if (
								// horzontal steps
								_i4 === row + 1 && _j4 === col + 2 || _i4 === row - 1 && _j4 === col + 2 || _i4 === row + 1 && _j4 === col - 2 || _i4 === row - 1 && _j4 === col - 2 ||
								// vertical steps
								_i4 === row + 2 && _j4 === col + 1 || _i4 === row - 2 && _j4 === col + 1 || _i4 === row + 2 && _j4 === col - 1 || _i4 === row - 2 && _j4 === col - 1) {
									if (newTable[_i4][_j4].row === startCubePos.row && newTable[_i4][_j4].col === startCubePos.col) {
										_this4.setState({ bonus: true });
									}
								}
							}
						}
					} else {
						_this4.setState({ result: "Vesztettél." });
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
									id: cube.row * rows + cube.col,
									cube: cube,
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
				React.createElement(
					"p",
					{ id: "result-text" },
					result
				),
				React.createElement(
					"p",
					{ id: "bonus-text" },
					bonus ? "Bónusz: Körútvonalat találtál!" : ""
				)
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
			    id = _props2.id,
			    startCube = _props2.startCube,
			    toggleStart = _props2.toggleStart,
			    clickCube = _props2.clickCube;
			var _props$cube = this.props.cube,
			    text = _props$cube.text,
			    avail = _props$cube.avail,
			    isSensorArea = _props$cube.isSensorArea,
			    isSensorCenter = _props$cube.isSensorCenter;

			return React.createElement(
				"div",
				{
					id: id,
					className: "cube " + (isSensorArea ? "cube-sensor" : "") + " " + (avail ? "cube-avail" : "") + " ",
					onClick: startCube ? toggleStart : avail ? clickCube : null
				},
				React.createElement(
					"span",
					{
						className: (startCube ? "cube-x" : "cube-num") + " " + (isSensorCenter ? "cube-sensor-center" : "")
					},
					text
				)
			);
		}
	}]);

	return CubeComponent;
}(React.Component);

var domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);