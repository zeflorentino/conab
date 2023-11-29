import pandas as pd
import requests
from bs4 import BeautifulSoup as bs
from datetime import datetime
from babel.dates import format_date

ids = [['11', 'RO'],
       ['12', 'AC'],
       ['13', 'AM'],
       ['14', 'RR'],
       ['15', 'PA'],
       ['16', 'AP'],
       ['17', 'TO'],
       ['21', 'MA'],
       ['22', 'PI'],
       ['23', 'CE'],
       ['24', 'RN'],
       ['25', 'PB'],
       ['26', 'PE'],
       ['27', 'AL'],
       ['28', 'SE'],
       ['29', 'BA'],
       ['31', 'MG'],
       ['32', 'ES'],
       ['33', 'RJ'],
       ['35', 'SP'],
       ['41', 'PR'],
       ['42', 'SC'],
       ['43', 'RS'],
       ['50', 'MS'],
       ['51', 'MT'],
       ['52', 'GO'],
       ['53', 'DF']]

df_id = pd.DataFrame(ids)

df_id.columns = ['ID', 'UF']

def pegalink(mes, ano):
  link = 'https://www.conab.gov.br/info-agro/safras/graos/boletim-da-safra-de-graos'
  response = requests.get(link)
  soup = bs(response.text, 'html.parser')
  elemento = soup.find('a', title=f"Site_PREVISAO_DE_SAFRA-POR_PRODUTO-NOV-{ano}.xlsx")
  elemento_href = elemento.get('href')
  prefixo = 'https://www.conab.gov.br'
  link_download = prefixo + elemento_href
  return link_download

def data():
  hoje = datetime.today()
  mes = format_date(hoje, "MMMM", locale="pt_BR")
  mes = mes[:3].upper()
  ano = str(hoje.year)
  return mes, ano

import os

def trata_tabela(commodity):
  download = requests.get(pegalink(data()[0], data()[1]))
  filename = download.headers['Content-Disposition'].split('filename=')[1]
  sheetname = commodity
  with open(filename, 'wb') as file:
      file.write(download.content)
  df = pd.read_excel(filename, sheet_name = sheetname, decimal=',')
  df = df.iloc[6:]
  df = df.iloc[:-2]
  df.columns = ['UF',
                'area_ant', 'area_nova', 'area_var',
                'produtiv_ant', 'produtiv_nova', 'produtiv_var',
                'producao_ant', 'producao_nova', 'producao_var']
  commodity = commodity.replace(" ", "").lower()
  df = df.merge(df_id, on="UF", how="left")

  df.to_csv(f"{commodity}.csv", index=False, mode="w")

commodities = ['Milho Total', 'Soja']

for commo in commodities:
    trata_tabela(commo)
