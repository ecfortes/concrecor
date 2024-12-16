
    function exportarTabelaParaCSV(tabelaId, filename) {
      var csv = [];
      var tabela = document.getElementById(tabelaId);
      var linhas = tabela.querySelectorAll("tr");

      for (var i = 0; i < linhas.length; i++) {
          var linha = [];
          var cols = linhas[i].querySelectorAll("td, th");

          for (var j = 0; j < cols.length; j++) {
              linha.push(cols[j].innerText);
          }

          csv.push(linha.join(","));
      }

      // Criar um arquivo CSV e baixar
      var csvArquivo = new Blob([csv.join("\n")], { type: "text/csv" });
      var url = URL.createObjectURL(csvArquivo);
      var link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }