$(async () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let sensors = [];
  const toRad = deg => {
    return deg * (Math.PI / 180);
  };

  await axios
    .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", { request: "sensors" })
    .then(res => {
      console.log(res.data);
      sensors = res.data.data;
    })
    .catch(err => {
      console.error(err);
    });

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
        ctx.strokeStyle = "#fff";
      } else {
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
      }
      ctx.stroke();
    }
  };
  refreshSensors();

  const toggleAreas = () => {
    const storedValue = localStorage.getItem("showAreas");

    if (storedValue === "false" || storedValue === undefined) {
      localStorage.setItem("showAreas", true);
    } else {
      localStorage.setItem("showAreas", false);
    }
    refreshSensors();
  };
  $("#toggle-areas").click(() => {
    toggleAreas();
  });

  canvas.addEventListener("mousemove", e => {
    localStorage.setItem("cursorX", e.offsetX);
    localStorage.setItem("cursorY", e.offsetY);
    let x = e.offsetX,
      y = e.offsetY;
    ctx.clearRect(0, 0, 500, 500);
    refreshSensors();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 5, 0, toRad(360));
    ctx.fillStyle = "#f5f51b";
    // ctx.stroke();
    ctx.fill();
  });
  canvas.addEventListener("mouseover", e => {
    var requestInterval = setInterval(() => {
      let x = localStorage.getItem("cursorX");
      let y = localStorage.getItem("cursorY");

      axios
        .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", {
          request: "sensordata",
          version: 1,
          posx: x,
          posy: y
        })
        .then(res => {
          for (let i = 0; i < sensors.length; i++) {
            // Current Sensor
            let cs = res.data.data[i];
            console.log(cs);

            if (cs.id === sensors[i].ID && cs.signal === true) {
              // toRad(sensors[i].angle - 45 + cs.angle)
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
    }, 33.4);
    canvas.addEventListener("mouseleave", e => {
      clearInterval(requestInterval);
      ctx.clearRect(0, 0, 500, 500);
      refreshSensors();
    });
  });
});
