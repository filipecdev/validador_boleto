from datetime import datetime

BANCO          = "341" #Tamanho: 3
CODIGO_MOEDA   = "9" #Tamanho: 1
VALOR          = "0000011990" #Tamanho: 10

NUMERO_CONVENIO_BANCO = "1090" #Tamanho: 4
COMPLEMENTO_NUMERO    = "0287095" #Tamanho: 7
NUMERO_AGENCIA        = "6334" #Tamanho:4
CONTA_CORRENTE        = "44200820" #Tamanho:8
TIPO_CARTEIRA         = "00" #Tamanho:2

VENCIMENTO_DIA = 15
VECIMENTO_MES  = 5
VENCIMENTO_ANO = 2025

CAMPO_LIVRE_1  = NUMERO_CONVENIO_BANCO
CAMPO_LIVRE_2  = COMPLEMENTO_NUMERO[:1]
CAMPO_LIVRE_3  = COMPLEMENTO_NUMERO[1:] + NUMERO_AGENCIA
CAMPO_LIVRE_4  = CONTA_CORRENTE + TIPO_CARTEIRA


def calculaFatorVencimento():
   data_base = datetime(1997, 10, 7)
   vencimento = datetime(VENCIMENTO_ANO, VECIMENTO_MES, VENCIMENTO_DIA)
   fator_data = (vencimento - data_base).days

   if fator_data > 9999:
      fator_data -= 9000

   return str(fator_data).zfill(4)



def modulo_10(numero: str) -> int:
   """
   Calcula o dígito verificador pelo módulo 10.
   """
   soma = 0
   multiplicador = 2

   for digito in reversed(numero):
      temp = int(digito) * multiplicador
      if temp >= 10:
         temp = (temp // 10) + (temp % 10)
      soma += temp
      multiplicador = 1 if multiplicador == 2 else 2

   resto = soma % 10
   dv = (10 - resto) % 10
   return dv


def modulo_11(numero: str) -> int:
   """
   Calcula o dígito verificador pelo módulo 11.
   """
   pesos = list(range(2, 10))  # 2 a 9
   soma = 0
   peso_idx = 0

   for digito in reversed(numero):
      soma += int(digito) * pesos[peso_idx]
      peso_idx = (peso_idx + 1) % len(pesos)

   resto = soma % 11
   dv = 11 - resto

   if dv in [0, 10, 11]:
      return 1
   return dv



def calculaBarCode():
   codigo_barras_Inicial = BANCO + CODIGO_MOEDA + calculaFatorVencimento() + VALOR + CAMPO_LIVRE_1 + CAMPO_LIVRE_2 + CAMPO_LIVRE_3 + CAMPO_LIVRE_4 
   return codigo_barras_Inicial[:4] + str(modulo_11(codigo_barras_Inicial)).zfill(1)  + codigo_barras_Inicial[4:]



def gerarLinhaDigitavel():
   campo_livre = CAMPO_LIVRE_1 + CAMPO_LIVRE_2 + CAMPO_LIVRE_3 + CAMPO_LIVRE_4
   barcode = calculaBarCode()
   campo1 = BANCO + CODIGO_MOEDA + campo_livre[:5]
   campo2 = campo_livre[5:15]
   campo3 = campo_livre[15:]

   dv1 = str(modulo_10(campo1))
   dv2 = str(modulo_10(campo2))
   dv3 = str(modulo_10(campo3))     

   return BANCO + CODIGO_MOEDA + CAMPO_LIVRE_1 + CAMPO_LIVRE_2 + dv1 + CAMPO_LIVRE_3 + dv2 + CAMPO_LIVRE_4 + dv3 + barcode[4:5] + calculaFatorVencimento() + VALOR




def linha_digitavel_para_codigo_barras(linha: str) -> str:
   linha = linha.replace(".", "").replace(" ", "")

   if len(linha) != 47:
      raise ValueError("Linha digitável deve ter 47 dígitos")
  
   banco = linha[0:3]
   moeda = linha[3]
   campo_livre = linha[4:9] + linha[10:20] + linha[21:31]
   dv_geral = linha[32]
   fator_data = linha[33:37]
   valor = linha[37:47]   

   return banco + moeda + dv_geral + fator_data + valor + campo_livre



if __name__ == "__main__":
   linha_digitavel = gerarLinhaDigitavel()
   codigo_barras = linha_digitavel_para_codigo_barras(linha_digitavel)
   print("Linha digitavel: ", linha_digitavel )
   print("Codigo de barras: ", codigo_barras)
   

#Linha digitavel: 34191.09008 28709.563341 44200.820007 3 10820000011990
#Linha digitavel: 34191090082870956334144200820007310820000011990
#Barcode:         34193108200000119901090028709563344420082000

#Linha digitavel: 34191.09008 28709.563341 44200.820007 3 10820000011990
# Posição	Descrição/Conteúdo
# 341       | 1 a 3	Número do Banco na Câmara de Compensação
# 9         | 4 a 4	Código da Moeda (9 = Real)
# 1090      | 5 a 8	Campo Livre
# 0         | 9 a 9	Campo Livre
# 8         | 10 a 10	Dígito Verificador do Campo 1
# 2870956334| 11 a 20	Campo Livre
# 1         | 21 a 21	Dígito Verificador do Campo 2
# 4420082000| 22 a 31	Campo Livre
# 7         | 32 a 32	Dígito Verificador do Campo 3
# 3         | 33 a 33	Dígito Verificador do Código de Barras
# 1082      | 34 a 37	Fator de Vencimento
# 0000011990| 38 a 47	Valor do Documento

#Barcode:         34193108200000119901090028709563344420082000 
# Posição	Descrição/Conteúdo
# 341        | 1 a 3	Número do Banco na Câmara de Compensação (001 = Banco do Brasil)
# 9          | 4 a 4	Código da Moeda (9 = Real)
# 3          | 5 a 5	Dígito Verificador do Código de Barras
# 1082       | 6 a 9	Fator de Vencimento (3737 = 31/12/2007)
# 0000011990 | 10 a 19	Valor do Documento (100 = R$1,00)
# 1090       | 20 a 23	Número do Convênio fornecido pelo Banco
# 0287095    | 24 a 30	Complemento do Nosso Número, sem DV
# 6334       | 31 a 34	Número da Agência de Relacionamento, sem DV
# 44200820   | 35 a 42	Conta Corrente de Relacionamento, sem DV
# 00         | 43 a 44	Tipo de Carteira/Modalidade de Cobrança
