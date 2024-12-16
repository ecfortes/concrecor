function createTable(data, div) {
  var tableContainer = document.getElementById(div);
  if (!tableContainer) {
      console.error("Contêiner não encontrado: " + div);
      return;
  }

  var table = document.createElement("table");
  table.classList.add("wgTable");
  table.style.width = "100%";

  // Cria o cabeçalho da tabela
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  for (var i = 0; i < data[0].length; i++) {
      var th = document.createElement("th");
      th.textContent = data[0][i];
      headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Cria o corpo da tabela
  var tbody = document.createElement("tbody");
  for (var i = 1; i < data.length; i++) {
      var row = document.createElement("tr");
      for (var j = 0; j < data[i].length; j++) {
          var cell = document.createElement("td");
          cell.textContent = (j != 0) ? Number(data[i][j]).toFixed(0) : data[i][j];
          row.appendChild(cell);
      }
      tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Adiciona a tabela ao contêiner
  tableContainer.appendChild(table);
}
