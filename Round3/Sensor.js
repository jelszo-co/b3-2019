$(async () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let sensors = [];

  const toRad = deg => {
    return deg * (Math.PI / 180);
  };

  // Get sensors
  await axios
    .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", { request: "sensors" })
    .then(res => {
      console.log(res.data);
      sensors = res.data.data;
    })
    .catch(err => {
      console.error(err);
    });

  // Draw the sensor outlines
  const refreshSensors = () => {
    // Clear board before drawing
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
      ctx.lineWidth = 3;
      ctx.setLineDash([30, 15]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };
  refreshSensors();

  const makeMesh = (x, y) => {
    ctx.beginPath();
    for (let i = 100; i < 500; i += 100) {
      ctx.moveTo(0, i);
      ctx.lineTo(500, i);
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 500);
    }
    for (let j = 100; j < 500; j += 100) {}
    ctx.strokeStyle = "#f5f51b";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(x * 100, y * 100, 100, 100);
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
  $("#toggle-areas").click(() => {
    toggleAreas();
  });

  var timer = null;
  canvas.addEventListener("mousemove", e => {
    localStorage.setItem("isMoving", true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem("isMoving", false);
    }, 50);
    localStorage.setItem("cursorX", e.offsetX);
    localStorage.setItem("cursorY", e.offsetY);
  });

  canvas.addEventListener("mouseover", e => {
    var requestInterval = setInterval(() => {
      let x = localStorage.getItem("cursorX");
      let y = localStorage.getItem("cursorY");
      if (localStorage.getItem("isMoving") === "true") {
        axios
          .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", {
            request: "sensordata",
            version: 1,
            posx: x,
            posy: y
          })
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
                ctx.fillStyle = "#ff0000";
                ctx.fill();
              }
            }
          })
          .catch(err => console.error(err));
      }
    }, 33.4);
    canvas.addEventListener("mouseleave", e => {
      clearInterval(requestInterval);
      ctx.clearRect(0, 0, 500, 500);
      refreshSensors();
    });
  });

  getRndSensors = () => {
    axios
      .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", {
        request: "sensordata",
        version: 2
      })
      .then(res => {
        refreshSensors();
        makeMesh(2, 3);
        console.log("It works");
        console.log(res.data.data);

        // Active sensors
        let as = [];
        for (let i = 0; i < sensors.length; i++) {
          // Current Sensor
          let cs = res.data.data[i];
          if (cs.signal === true) {
            as[as.length] = cs;
          }
          if (cs.id === sensors[i].ID && cs.signal === true) {
            let { posx, posy, angle } = sensors[i];

            ctx.beginPath();
            ctx.moveTo(posx, posy);
            ctx.arc(posx, posy, 400, toRad(sensors[i].angle + cs.angle - 1), toRad(angle + cs.angle + 1));
            ctx.lineTo(posx, posy);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
          }
        }
        if (as.length >= 2) {
          let datas = {
            // Angles
            a: sensors[as[0].id].angle + as[0].angle,
            b: sensors[as[1].id].angle + as[1].angle,
            // Sensors
            f: sensors[as[0].id].posx,
            g: sensors[as[0].id].posy,
            h: sensors[as[1].id].posx,
            i: sensors[as[1].id].posy
          };
          console.log(as);
          console.log(datas);
          let exp = "tan(a)*(x-f)+g==tan(b)*(x-h)+i";
          let result = math.evaluate(exp, datas);
          console.log(result);
          //  tgalfa(x-x0)+y0=tgbéta(x-x1)+y1
        }
      })
      .catch(err => console.error(err));
  };
  $("#rnd").click(() => {
    getRndSensors();
  });
});
