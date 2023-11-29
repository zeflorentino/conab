function formata(valor) {
  const formatado = valor.toString();
  const retornar = formatado.replace(/\./g, ",");
  return retornar;
}

function transformapositivo(numero) {
  if (numero < 0) {
    return -numero;
  } else {
    return numero;
  }
}

async function iniciar(arquivo) {
  const milhodata = await d3.csv(arquivo);

  const linhaBrasil = milhodata.find((linha) => linha.UF === "BRASIL");

  if (linhaBrasil) {
    const prod = formata((linhaBrasil.producao_nova / 1000).toFixed(2));
    const prodant = formata((linhaBrasil.producao_ant / 1000).toFixed(2));
    let prodtendencia = "";
    if (linhaBrasil.producao_var > 0) {
      prodtendencia = "maior";
    } else if (linhaBrasil.producao_var < 0) {
      prodtendencia = "menor";
    }

    const area = formata((linhaBrasil.area_nova / 1000).toFixed(2));
    const areaant = formata((linhaBrasil.area_ant / 1000).toFixed(2));
    let areatendencia = "";
    if (linhaBrasil.area_var > 0) {
      areatendencia = "crescer";
    } else if (linhaBrasil.area_var < 0) {
      areatendencia = "diminuir";
    }

    const rend = formata((linhaBrasil.produtiv_nova / 1000).toFixed(2));
    const rendant = formata((linhaBrasil.produtiv_ant / 1000).toFixed(2));
    let rendtendencia = "";
    if (linhaBrasil.produtiv_var > 0) {
      rendtendencia = "um aumento";
    } else if (linhaBrasil.produtiv_var < 0) {
      rendtendencia = "uma queda";
    }

    const textoproducao = `A produção brasileira deve alcançar <span class="destaqueamarelo">${prod} milhões de toneladas</span> em 2023/24, segundo a Companhia Nacional de Abastecimento (Conab). Caso a projeção se confirme, a safra será ${prodtendencia} do que a anterior, de <span class="destaqueamarelo">${prodant} milhões de toneladas</span>.<br><br>A área plantada deve ${areatendencia}, de <span class="destaqueamarelo">${area} milhões</span> para <span class="destaqueamarelo">${areaant} milhões de hectares.</span> <br><br>A produtividade será de <span class="destaqueamarelo">${rend} toneladas por hectare</span>, ${rendtendencia} em relação às <span class="destaqueamarelo">${rendant} toneladas por hectare</span> do ciclo anterior.`;
    const producaoDiv = document.getElementById("producao");
    producaoDiv.innerHTML = textoproducao;
  }
}

iniciar("milhototal.csv");
