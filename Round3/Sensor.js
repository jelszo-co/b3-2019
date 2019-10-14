$(async () => {
  let ctx = document.getElementById("canvas").getContext("2d");
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  let sensors = [];
  const toRad = deg => {
    return deg * (Math.PI / 180);
  };
  await axios
    .post("http://bitkozpont.mik.uni-pannon.hu/Vigyazz3SensorData.php", { request: "sensors" })
    .then(res => {
      sensors = res.data.data;
    })
    .catch(err => {
      console.error(err);
    });
  console.log(sensors);
  for (let i = 0; i < sensors.length; i++) {
    const { posx, posy, angle } = sensors[i];
    ctx.beginPath();
    ctx.moveTo(posx, posy);
    ctx.arc(posx, posy, 10, 0, toRad(360));
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(posx, posy);
    ctx.arc(posx, posy, 200, toRad(angle - 45), toRad(angle + 45));
    ctx.lineTo(posx, posy);
    ctx.stroke();
  }
});
