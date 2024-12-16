let summedData;

function sumElementsByDayAndRecipe(data, insumos) {
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const result = {};

  data.forEach((entry) => {
    const date = formatDate(entry.timestamp);
    const receita = entry.receita;

    if (!result[date]) {
      result[date] = { receitas: {}, numEvents: 0 }; // numEvents para contar os eventos
      insumos.forEach((insumo) => {
        result[date][insumo.key] = 0;
      });
    }

    if (!result[date].receitas[receita]) {
      result[date].receitas[receita] = {};
      insumos.forEach((insumo) => {
        result[date].receitas[receita][insumo.key] = 0;
      });
    }

    // Soma os valores para cada insumo e conta o número de eventos
    insumos.forEach((insumo) => {
      if (entry[insumo.key] !== undefined) {
        result[date].receitas[receita][insumo.key] += entry[insumo.key];
        result[date][insumo.key] += entry[insumo.key];
      }
    });

    // Incrementa a contagem de eventos para aquela data
    result[date].numEvents += 1;
  });

  return result;
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "1");
    url.searchParams.set("pagesize", "999999");
    const response = await fetch(url.href, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Erro na requisição");
    }
    const data = await response.json();

    const payload = data.map((item) => item.payload);

    summedData = sumElementsByDayAndRecipe(payload, insumos);

    // Prepara os dados para o Google Charts
    const array = [
      ["Dia", ...insumos.map((insumo) => insumo.label), "Bateladas"],
    ];

    for (const key in summedData) {
      if (Object.hasOwnProperty.call(summedData, key)) {
        const row = [key];
        insumos.forEach((insumo) => {
          row.push(summedData[key][insumo.key] || 0);
        });
        row.push(summedData[key].numEvents || 0); // Mantém o número de eventos
        array.push(row);
      }
    }

    const array_ = JSON.parse(JSON.stringify(array))
    array_.forEach((row) => row.pop()); // Exclui a coluna "Eventos"

    const backgroundColor = window.getComputedStyle(
      document.body
    ).backgroundColor;
    const recipe = "- " + document.getElementById("bt-select-recipe").innerText;
    const dataInicial = document.getElementById("data-inicial").value;
    const dataFinal = document.getElementById("data-final").value;

    document.getElementById("titulo-grafico").innerText =
      "Gráfico Diário " + recipe;
    if (dataInicial) {
      document.getElementById("p-inicial").innerText =
        "Data Inicial: " + dataInicial;
    }
    if (dataFinal) {
      document.getElementById("p-final").innerText = "Data Final: " + dataFinal;
    }

    google.charts.load("current", { packages: ["bar"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = google.visualization.arrayToDataTable(array_);
      const options = {
        backgroundColor: { fill: backgroundColor },
        chartArea: { backgroundColor: { fill: backgroundColor } },
        hAxis: { title: "Dia", titleTextStyle: { color: backgroundColor } },
        vAxis: { minValue: 0 },
        legend: { position: "bottom" },
        series: {
          ...Array.from({ length: array_[0].length - 1 }).reduce(
            (obj, _, index) => {
              obj[index] = {
                color: `rgb(${27 + index * 30}, ${59 + index * 30}, 152)`,
              }; // Cálculo de cores em degradê
              return obj;
            },
            {}
          ),
        },
      };

      const chart = new google.charts.Bar(
        document.getElementById("columnchart_material")
      );
      chart.draw(data, google.charts.Bar.convertOptions(options));

      // Criação da tabela
      createTable(array, "div-table");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
});
