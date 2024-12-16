


// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", function () {

  document.getElementById('performance-bar').querySelectorAll(".bar")[0].style.width = percDisp + "%"
  document.getElementById('performance-bar').querySelectorAll(".bar")[1].style.width = 100 - percDisp + "%"

  document.getElementById('efic-bar').style.width = document.getElementById('performance-bar').querySelectorAll(".bar")[0].style.width;
  document.getElementById('efic-bar').querySelectorAll(".bar")[0].style.width = percEfic + "%"
  document.getElementById('efic-bar').querySelectorAll(".bar")[1].style.width = 100 - percEfic + "%"

  document.getElementById('qual-bar').style.width = ((percDisp / 100) * (percEfic / 100)) * 100 + "%"
  document.getElementById('qual-bar').querySelectorAll(".bar")[0].style.width = percQual + "%"
  document.getElementById('qual-bar').querySelectorAll(".bar")[1].style.width = 100 - percQual + "%"

  // Get the background color of the body
  const bodyBackgroundColor = document.getElementsByTagName('body')[0].style.backgroundColor;

  // Get all elements with the class 'gauge__cover'
  const gaugeCovers = document.getElementsByClassName('gauge__cover');

  // Use forEach to iterate through each 'gauge__cover' element
  Array.from(gaugeCovers).forEach(element => {
    element.style.backgroundColor = bodyBackgroundColor;
  });

  function setGaugeValue(gauge, value) {
    if (value < 0 || value > 1) {
      //
    }
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${value / 2}turn)`;
    gauge.querySelector(".gauge__fill").style.backgroundColor = "hsl(" + value * 100 + " 100% 40%)"

    // background-color: hsl(0 50% 50% / 1);
    gauge.querySelector(".gauge__cover").textContent = `${Math.round(value * 100)}%`;
  }

  setGaugeValue(document.getElementById('gaugeDisp'), percDisp / 100);
  setGaugeValue(document.getElementById('gaugeEfic'), percEfic / 100);
  setGaugeValue(document.getElementById('gaugeQual'), percQual / 100);
  setGaugeValue(document.getElementById('gaugeOEE'), percOEE);





})
