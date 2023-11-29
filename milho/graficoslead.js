async function carregarDados(arquivo) {
  milhodata = await d3.csv(arquivo);
  atualizatexto();
}

async function inseregrafico(arquivo) {
  const milhodata = await d3.csv(arquivo);
  const linhaBrasil = milhodata.find((linha) => linha.UF === "BRASIL");

  if (linhaBrasil) {
    const prod = linhaBrasil.producao_nova;
    const prodant = linhaBrasil.producao_ant;

    let atualprod, antigaprod;

    if (prod > prodant) {
      atualprod = 50;
      antigaprod = (prodant / prod) * 50;
    } else if (prod < prodant) {
      atualprod = (prod / prodant) * 50;
      antigaprod = 50;
    } else {
      atualprod = 50;
      antigaprod = 50;
    }

    const prodf = formata((linhaBrasil.producao_nova / 1000).toFixed(2));
    const prodantf = formata((linhaBrasil.producao_ant / 1000).toFixed(2));
    const prodvarf = formata(linhaBrasil.producao_var);

    const GraficoProd = `
    <h4>Variação anual: ${prodvarf}%</h4>
      <div class="ano">
      <div class="legendaano">2023/24</div><div class="barraano" style="width: ${atualprod}%;">${prodf}</div>
          
        </div>
        <div class="ano">
        <div class="legendaano">2022/23</div><div class="barraano" style="width: ${antigaprod}%;">${prodantf}</div>
          
        </div>
        <div class="disclaimer">(milhões de toneladas)</div>

    `;

    const prodDiv = document.getElementById("graficoproducao");
    prodDiv.innerHTML = GraficoProd;

    const area = linhaBrasil.area_nova;
    const areaant = linhaBrasil.area_ant;

    let atualarea, antigaarea;

    if (area > areaant) {
      atualarea = 50;
      antigaarea = (areaant / area) * 50;
    } else if (area < areaant) {
      atualarea = (area / areaant) * 50;
      antigaarea = 50;
    } else {
      atualarea = 50;
      antigaarea = 50;
    }

    const areaf = formata((linhaBrasil.area_nova / 1000).toFixed(2));
    const areaantf = formata((linhaBrasil.area_ant / 1000).toFixed(2));
    const areavarf = formata(linhaBrasil.area_var);

    const GraficoArea = `
    <h4>Variação anual: ${areavarf}%</h4>
      <div class="ano">
        <div class="legendaano">2023/24</div><div class="barraano" style="width: ${atualarea}%;">${areaf}</div>
          
        </div>
        <div class="ano">
        <div class="legendaano">2022/23</div><div class="barraano" style="width: ${antigaarea}%;">${areaantf}</div>
          
        </div>
        <div class="disclaimer">(milhões de hectares)</div>

    `;

    const areaDiv = document.getElementById("graficoarea");
    areaDiv.innerHTML = GraficoArea;

    const rend = linhaBrasil.produtiv_nova;
    const rendant = linhaBrasil.produtiv_ant;

    let atualrend, antigarend;

    if (rend > rendant) {
      atualrend = 50;
      antigarend = (rendant / rend) * 50;
    } else if (rend < rendant) {
      atualrend = (rend / rendant) * 50;
      antigarend = 50;
    } else {
      atualrend = 50;
      antigarend = 50;
    }

    const rendf = formata((linhaBrasil.produtiv_nova / 1000).toFixed(2));
    const rendantf = formata((linhaBrasil.produtiv_ant / 1000).toFixed(2));
    const rendvarf = formata(linhaBrasil.produtiv_var);

    const GraficoRend = `
    <h4>Variação anual: ${rendvarf}%</h4>
      <div class="ano">
        <div class="legendaano">2023/24</div><div class="barraano" style="width: ${atualrend}%;">${rendf}</div>
          
        </div>
        <div class="ano">
        <div class="legendaano">2022/23</div><div class="barraano" style="width: ${antigarend}%;">${rendantf}</div>
          
        </div>
        <div class="disclaimer">(toneladas por hectare)</div>

    `;

    const rendDiv = document.getElementById("graficoprodutividade");
    rendDiv.innerHTML = GraficoRend;
  }
}

inseregrafico("milhototal.csv");

function selecionarGrafico() {
  var select = document.getElementById("filtro");
  var divProducao = document.getElementById("graficoproducao");
  var divProdutividade = document.getElementById("graficoprodutividade");
  var divArea = document.getElementById("graficoarea");

  divProducao.classList.remove("ativo");
  divProducao.classList.add("oculto");
  divProdutividade.classList.remove("ativo");
  divProdutividade.classList.add("oculto");
  divArea.classList.remove("ativo");
  divArea.classList.add("oculto");

  if (select.value === "producao") {
    divProducao.classList.remove("oculto");
    divProducao.classList.add("ativo");
  } else if (select.value === "produtividade") {
    divProdutividade.classList.remove("oculto");
    divProdutividade.classList.add("ativo");
  } else if (select.value === "area") {
    divArea.classList.remove("oculto");
    divArea.classList.add("ativo");
  }
}

var select = document.getElementById("filtro");
select.addEventListener("change", selecionarGrafico);

var select = document.querySelector(".novaselecao");
select.addEventListener("focus", function () {
  select.style.width = "auto";
});
select.addEventListener("blur", function () {
  select.style.width = "auto";
});
