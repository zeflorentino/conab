async function loadMapData() {
  try {
    const DadosMilho = await d3.csv("soja.csv");

    const estados = [...new Set(DadosMilho.map((data) => data.UF))]
      .filter((estado) => estado.length === 2)
      .sort();
    const filtroEstadosSelect = document.getElementById("filtroestados");

    estados.forEach((estado) => {
      const option = document.createElement("option");
      option.value = estado;
      option.textContent = estado;
      filtroEstadosSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  document
    .getElementById("filtroestados")
    .addEventListener("change", function () {
      let estadoSelecionado = this.value;
      updateGraphs(estadoSelecionado);
    });
}

loadMapData();

async function updateGraphs(estadoSelecionado) {
  try {
    const DadosMilho = await d3.csv("soja.csv");

    DadosMilho.forEach((data) => {
      if (data.ID !== undefined) {
        data.ID = data.ID.toString();
      }
    });

    let dadoMilho = DadosMilho.find((data) => data.UF === estadoSelecionado);

    const DadosMilhoEstados = DadosMilho.filter(d=> d.UF.length == 2)

    let max_producao = d3.max(DadosMilhoEstados, d=> +d.producao_nova > +d.producao_ant ? +d.producao_nova : +d.producao_ant)
    let max_area = d3.max(DadosMilhoEstados, d=> +d.area_nova > +d.area_ant ? +d.area_nova : +d.area_ant )
    let max_rendimento = d3.max(DadosMilhoEstados, d=> +d.produtiv_nova > +d.produtiv_ant ? +d.produtiv_nova : +d.produtiv_ant )

    const barra_total = document.querySelector('#graficosestado')
 
    const largura_barratotal = +window.getComputedStyle(barra_total).width.slice(0,-2)

    if (dadoMilho) {
      let prod = (dadoMilho.producao_nova / max_producao) * 0.6 * 100;
      let prodant = (dadoMilho.producao_ant  / max_producao) * 0.6 * 100;
      
      let prodf = formata((dadoMilho.producao_nova / 1000).toFixed(2));
      let prodantf = formata((dadoMilho.producao_ant / 1000).toFixed(2));
      let prodvarf = formata(dadoMilho.producao_var);

      let GraficoProd = `
        <h4>Produção: ${prodvarf}%</h4>
          <div class="anoest">
          <div class="legendaanoest">23/24</div><div class="barraanoest" style="flex: ${prod}% 0 0;"></div><div class="valorano">${prodf}</div>
              
            </div>
            <div class="anoest">
            <div class="legendaanoest">22/23</div><div class="barraanoest" style="flex: ${prodant}% 0 0;"></div><div class="valorano">${prodantf}</div>
              
            </div>
            <div class="disclaimer2">(milhões de toneladas)</div>
    
        `;

      const prodDiv = document.getElementById("gprodest");
      prodDiv.innerHTML = GraficoProd;

      let area = (dadoMilho.area_nova / max_area) * 0.6 * 100;
      let areaant = (dadoMilho.area_ant / max_area) * 0.6 * 100;

      let areaf = formata((dadoMilho.area_nova / 1000).toFixed(2));
      let areaantf = formata((dadoMilho.area_ant / 1000).toFixed(2));
      let areavarf = formata(dadoMilho.area_var);

      let GraficoArea = `
        <h4>Área: ${areavarf}%</h4>
          <div class="anoest">
            <div class="legendaanoest">23/24</div><div class="barraanoest" style="flex: ${area}% 0 0;"></div><div class="valorano">${areaf}</div>
              
            </div>
            <div class="anoest">
            <div class="legendaanoest">22/23</div><div class="barraanoest" style="flex: ${areaant}% 0 0;"></div><div class="valorano">${areaantf}</div>
              
            </div>
            <div class="disclaimer2">(milhões de hectares)</div>
    
        `;

      const areaDiv = document.getElementById("gareaest");
      areaDiv.innerHTML = GraficoArea;

      const rend = (dadoMilho.produtiv_nova / max_rendimento) * 0.6 * 100
      const rendant = (dadoMilho.produtiv_ant / max_rendimento) * 0.6 * 100

      let rendf = formata((dadoMilho.produtiv_nova / 1000).toFixed(2));
      let rendantf = formata((dadoMilho.produtiv_ant / 1000).toFixed(2));
      let rendvarf = formata(dadoMilho.produtiv_var);

      let GraficoRend = `
        <h4>Produtividade: ${rendvarf}%</h4>
          <div class="anoest">
            <div class="legendaanoest">23/24</div><div class="barraanoest" style="flex: ${rend}% 0 0;"></div><div class="valorano">${rendf}</div>
              
            </div>
            <div class="anoest">
            <div class="legendaanoest">22/23</div><div class="barraanoest" style="flex: ${rendant}% 0 0;"></div><div class="valorano">${rendantf}</div>
              
            </div>
            <div class="disclaimer2">(toneladas por hectare)</div>
    
        `;

      
      const rendDiv = document.getElementById("grendest");
      rendDiv.innerHTML = GraficoRend;

      let estadouf = dadoMilho.UF;
      let estadoprod = formata((dadoMilho.producao_nova / 1000).toFixed(2));
      let estadoarea = formata((dadoMilho.area_nova / 1000).toFixed(2));
      let estadorend = formata((dadoMilho.produtiv_nova / 1000).toFixed(2));

      document.querySelector(
        "#descricaomapa"
      ).innerHTML = `<span class="destaqueamarelo">${estadouf}</span> deve colher <span class="destaqueamarelo">${estadoprod} milhões de toneladas</span>, com uma área de <span class="destaqueamarelo">${estadoarea} milhões de hectares</span> e um rendimento médio de <span class="destaqueamarelo">${estadorend} toneladas por hectare.</span>`;
    }
  } catch (error) {
    console.error("Erro ao carregar dados do CSV:", error);
  }
}
