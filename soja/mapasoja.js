let textofixo;
let graficoEstadoDiv = document.querySelector("#graficosestado");

async function loadMapData() {
  try {
    let mapaUrl =
      "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF";

    let mapaSvg = await fetch(mapaUrl);
    mapaMalha = await mapaSvg.text();

    const DadosMilho = await d3.csv("soja.csv");

    const DadosMilhoEstados = DadosMilho.filter(d=> d.UF.length == 2)

    let max_producao = d3.max(DadosMilhoEstados, d=> +d.producao_nova > +d.producao_ant ? +d.producao_nova : +d.producao_ant)
    let max_area = d3.max(DadosMilhoEstados, d=> +d.area_nova > +d.area_ant ? +d.area_nova : +d.area_ant )
    let max_rendimento = d3.max(DadosMilhoEstados, d=> +d.produtiv_nova > +d.produtiv_ant ? +d.produtiv_nova : +d.produtiv_ant )

    const barra_total = document.querySelector('#graficosestado')
     const largura_barratotal = +window.getComputedStyle(barra_total).width.slice(0,-2)

    let cor = d3.scaleLinear().domain([0, max_producao]).range(["#CBCCCD", "#2f4f2f"]);


    DadosMilho.forEach((data) => {
      if (data.ID !== undefined) {
        data.ID = data.ID.toString();
      }
    });

    let mapaConteudo = document.querySelector("#map-box");
    mapaConteudo.innerHTML = mapaMalha;

    let ufs = document.querySelectorAll("#map-box svg path");

    ufs.forEach((uf) => {
      let ufId = uf.getAttribute("id");
      let dadoMilho = DadosMilho.find((data) => data.ID === ufId);
      let producao = dadoMilho ? parseFloat(dadoMilho.producao_nova) : 0;

      uf.style.fill = cor(producao);
    });

    let brasilData = DadosMilho.find((data) => data.UF === "BRASIL");

    if (brasilData) {
      let producaoBrasil = formata(
        (brasilData.producao_nova / 1000).toFixed(2)
      );
      let areaBrasil = formata((brasilData.area_nova / 1000).toFixed(2));
      let produtividadeBrasil = formata(
        (brasilData.produtiv_nova / 1000).toFixed(2)
      );

      textofixo = `<span class="destaqueamarelo">Brasil</span> deve colher <span class="destaqueamarelo">${producaoBrasil} milhões de toneladas</span>, com uma área de <span class="destaqueamarelo">${areaBrasil} milhões de hectares</span> e um rendimento médio de <span class="destaqueamarelo">${produtividadeBrasil} toneladas</span> por hectare.`;

      document.querySelector("#descricaomapa").innerHTML = textofixo;
    } else {
    }

    ufs.forEach((uf) => {
      uf.addEventListener("mouseover", () => {
        let graficoEstadoDiv = document.querySelector("#graficosestado");
        graficoEstadoDiv.style.display = "flex";

        let ufId = uf.getAttribute("id");

        let dadoMilho2 = DadosMilho.find((data) => data.ID === ufId);

        if (dadoMilho2) {
          let prod = (dadoMilho2.producao_nova / max_producao) * 0.6 * 100;
          let prodant = (dadoMilho2.producao_ant  / max_producao) * 0.6 * 100;

          let prodf = formata((dadoMilho2.producao_nova / 1000).toFixed(2));
          let prodantf = formata((dadoMilho2.producao_ant / 1000).toFixed(2));
          let prodvarf = formata(dadoMilho2.producao_var);

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

          let area = (dadoMilho2.area_nova / max_area) * 0.6 * 100;
          let areaant = (dadoMilho2.area_ant / max_area) * 0.6 * 100;

          let areaf = formata((dadoMilho2.area_nova / 1000).toFixed(2));
          let areaantf = formata((dadoMilho2.area_ant / 1000).toFixed(2));
          let areavarf = formata(dadoMilho2.area_var);

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

          const rend = (dadoMilho2.produtiv_nova / max_rendimento) * 0.6 * 100;
          const rendant = (dadoMilho2.produtiv_ant / max_rendimento) * 0.6 * 100;

          let rendf = formata((dadoMilho2.produtiv_nova / 1000).toFixed(2));
          let rendantf = formata((dadoMilho2.produtiv_ant / 1000).toFixed(2));
          let rendvarf = formata(dadoMilho2.produtiv_var);

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
        }

        if (dadoMilho2) {
          let estadouf = dadoMilho2.UF;
          let estadoprod = formata(
            (dadoMilho2.producao_nova / 1000).toFixed(2)
          );
          let estadoarea = formata((dadoMilho2.area_nova / 1000).toFixed(2));
          let estadorend = formata(
            (dadoMilho2.produtiv_nova / 1000).toFixed(2)
          );

          document.querySelector(
            "#descricaomapa"
          ).innerHTML = `<span class="destaqueamarelo">${estadouf}</span> deve colher <span class="destaqueamarelo">${estadoprod} milhões de toneladas</span>, com uma área de <span class="destaqueamarelo">${estadoarea} milhões de hectares</span> e um rendimento médio de <span class="destaqueamarelo">${estadorend} toneladas por hectare.</span>`;
        }
      });

      uf.addEventListener("mouseout", () => {});
    });
  } catch (error) {}
}

loadMapData();
