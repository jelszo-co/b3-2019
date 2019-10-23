// jQuery document.ready async function
$(async () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let sensors = [];

  const toRad = deg => {
    return deg * (Math.PI / 180);
  };

  // Request for sensors
  var url = "http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php",
    data = { request: "sensors" };
  await axios
    .post(url, data)
    .then(res => {
      sensors = res.data.data;
      for (let i = 0; i < sensors.length; i++) {
        delete sensors[i].anglerad;
        document.getElementById(`sd${i}`).innerHTML = JSON.stringify(res.data.data[i]);
      }
    })
    .catch(err => {
      console.error(err);
    });

  // Draw the sensor outlines
  const refreshSensors = () => {
    // Clear canvas before drawing
    ctx.clearRect(0, 0, 500, 500);
    for (let i = 0; i < sensors.length; i++) {
      const { posx, posy, angle } = sensors[i];

      // draw center dots
      ctx.beginPath();
      ctx.moveTo(posx, posy);
      ctx.arc(posx, posy, 10, 0, toRad(360));
      ctx.strokeStyle = "#fff";
      ctx.fillStyle = "#fff";
      ctx.stroke();
      ctx.fill();

      // draw indicators
      ctx.beginPath();
      ctx.moveTo(posx, posy);
      ctx.arc(posx, posy, 15, toRad(angle - 35), toRad(angle + 35));
      ctx.lineTo(posx, posy);
      if (localStorage.getItem("showAreas") === "true") {
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fill();

      // draw areas
      ctx.beginPath();
      ctx.moveTo(posx, posy);
      ctx.arc(posx, posy, 400, toRad(angle - 45), toRad(angle + 45));
      ctx.lineTo(posx, posy);
      if (localStorage.getItem("showAreas") === "true") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      } else {
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
      }
      ctx.lineWidth = 2;
      ctx.setLineDash([30, 15]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };
  refreshSensors();

  // draw the mesh for version 2
  const makeMesh = (x, y) => {
    ctx.beginPath();
    for (let i = 100; i < 500; i += 100) {
      ctx.moveTo(0, i);
      ctx.lineTo(500, i);
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 500);
    }
    ctx.strokeStyle = "#f5f51b";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(x, y, 100, 100);
    ctx.fillStyle = "#f5f51b";
    ctx.fill();
  };

  // Show / hide sensor areas
  const toggleAreas = () => {
    const storedValue = localStorage.getItem("showAreas");

    if (storedValue === "false" || storedValue === undefined || storedValue === null) {
      localStorage.setItem("showAreas", true);
    } else {
      localStorage.setItem("showAreas", false);
    }
    refreshSensors();
  };

  // Bind onClick event
  $("#toggle-areas").click(() => {
    toggleAreas();
  });

  // Timer trick to detect mousemove end
  var timer = null;
  canvas.addEventListener("mousemove", e => {
    localStorage.setItem("isMoving", true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem("isMoving", false);
    }, 50);

    // Store mouse position
    localStorage.setItem("cursorX", e.offsetX);
    localStorage.setItem("cursorY", e.offsetY);
  });

  canvas.addEventListener("mouseover", e => {
    // Set request interval to make only 30 request / second
    var requestInterval = setInterval(() => {
      let x = localStorage.getItem("cursorX");
      let y = localStorage.getItem("cursorY");
      if (localStorage.getItem("isMoving") === "true") {
        // Get sensor data from server (version 1)
        let data = {
          request: "sensordata",
          version: 1,
          posx: x,
          posy: y
        };
        axios
          .post(url, data)
          .then(res => {
            refreshSensors();
            for (let i = 0; i < sensors.length; i++) {
              // Current Sensor
              let cs = res.data.data[i];
              if (cs.id === sensors[i].ID && cs.signal === true) {
                let { posx, posy, angle } = sensors[i];
                ctx.beginPath();
                ctx.moveTo(posx, posy);
                ctx.arc(posx, posy, 400, toRad(sensors[i].angle + cs.angle - 1), toRad(angle + cs.angle + 1));
                ctx.lineTo(posx, posy);
                ctx.fillStyle = "#fc033d";
                ctx.fill();
              }
            }
          })
          .catch(err => console.error(err));
      }
    }, 33.4);
    // When mouse leaves canvas, clear it
    canvas.addEventListener("mouseleave", e => {
      clearInterval(requestInterval);
      ctx.clearRect(0, 0, 500, 500);
      refreshSensors();
    });
  });

  // Random sensor generation
  getRndSensors = () => {
    // Get sensor data from server (version 2)
    let data = {
      request: "sensordata",
      version: 2
    };
    axios
      .post(url, data)
      .then(res => {
        // Hide sensor areas for better visibility
        localStorage.setItem("showAreas", false);
        refreshSensors();

        // Active sensors
        let as = [];
        for (let i = 0; i < sensors.length; i++) {
          // Current Sensor
          let cs = res.data.data[i];
          if (cs.signal === true) {
            // Store sensors with active signal in an array
            as[as.length] = cs;
          }
          if (cs.id === sensors[i].ID && cs.signal === true) {
            let { posx, posy, angle } = sensors[i];
            ctx.beginPath();
            ctx.moveTo(posx, posy);
            ctx.arc(posx, posy, 400, toRad(sensors[i].angle + cs.angle - 1), toRad(angle + cs.angle + 1));
            ctx.lineTo(posx, posy);
            ctx.fillStyle = "#fc033d";
            ctx.fill();
          }
        }
        // Calculate the union of two active sensor areas
        let unionPos;
        if (as.length >= 2) {
          /* 
          Equation:
          tan(a)*(x-f)+g=tan(b)*(x-h)+i
          */
          let // Angles
            a = (sensors[as[0].id].angle + as[0].angle) % 360,
            b = (sensors[as[1].id].angle + as[1].angle) % 360,
            // Sensors
            x1 = sensors[as[0].id].posx,
            y1 = sensors[as[0].id].posy,
            x2 = sensors[as[1].id].posx,
            y2 = sensors[as[1].id].posy;
          console.log("Base Sensors: ", sensors);
          console.log("Active Sensors data: ", res.data.data);
          console.log("as: ", as);
          console.log("Sensor 0 eq: ", sensors[as[0].id].angle, "+", as[0].angle);
          console.log("Sensor 1 eq: ", sensors[as[1].id].angle, "+", as[1].angle);

          console.log("Datas:", x1, y1, a, x2, y2, b);

          unionPos = {
            x: (x1 * Math.tan(toRad(a)) - y1 - x2 * Math.tan(toRad(b)) + y2) / (Math.tan(toRad(a)) - Math.tan(toRad(b)))
          };
          unionPos.y = Math.tan(toRad(a)) * (unionPos.x - x1) + y1;
          console.log("Computed values: ", unionPos);

          // Draw mesh from the union
          makeMesh(Math.floor(unionPos.x / 100) * 100, Math.floor(unionPos.y / 100) * 100);
        } else {
          // Draw an empty mesh if only 1 active sensor is present
          makeMesh();
        }
      })
      .catch(err => console.error(err));
  };
  // Bind onClick event
  $("#rnd").click(() => {
    getRndSensors();
  });
});
