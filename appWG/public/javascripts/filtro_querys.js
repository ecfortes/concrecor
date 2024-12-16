url_actual = new URL(document.location).searchParams;
document.getElementById("data-inicial").addEventListener("change", updateURL);
document.getElementById("data-final").addEventListener("change", updateURL);
data_inicial = url_actual.get("startDate");
data_final = url_actual.get("endDate");
recipe = url_actual.get("recipe");
//console.log(data_inicial, data_final);

dates = document.getElementsByClassName("input-date");
dates[0].value = data_inicial;
dates[1].value = data_final;

if (recipe) {
  document.getElementById("bt-select-recipe").innerText = recipe;
} else if (document.getElementById("bt-select-recipe")) {
  document.getElementById("bt-select-recipe").innerText = "Todas Receitas";
}
function updateURL() {
  const dataInicial = document.getElementById("data-inicial").value;
  const dataFinal = document.getElementById("data-final").value;
  //console.log(dataInicial, dataFinal);

  // Construa a nova URL com os parâmetros de data
  const newURL = new URL(window.location.href);
  if (dataInicial) {
    newURL.searchParams.set("startDate", dataInicial);
  }
  if (dataFinal) {
    newURL.searchParams.set("endDate", dataFinal);
  }
  window.location.href = newURL;
}

function updatePageSize() {
  //console.log(document.getElementById("pagesize").value);
  params = {
    pagesize: document.getElementById("pagesize").value,
  };
  buildUrl(params);
}

function removeQueryString(param) {
  const url = new URL(window.location.href);
  if (param) {
    url.searchParams.delete(param);
  } else {
    url.search = "";
  }
  window.location.href = url.toString();
}

function buildUrl(params) {
  const url = new URL(window.location.href);
  dates = document.getElementsByClassName("input-date");
  addquery = {
    startDate: dates[0].value,
    endDate: dates[1].value,
  };

  for (const key in addquery) {
    //console.log(key);
    if (addquery.hasOwnProperty(key)) {
      const value = addquery[key];
      if (value != "") {
        url.searchParams.delete(key);
        url.searchParams.append(key, value);
        //console.log("add");
      }
    }
  }
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      url.searchParams.delete(key);
      url.searchParams.append(key, value);
    }
  }
  //console.log("Nova URL:", url.href);
  // Redirecionar para a nova URL
  window.location.href = url.href;
}
