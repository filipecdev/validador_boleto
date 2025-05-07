# Validador de Boleto


```bash
npm install
npm run build
npm start
```

## Estrutura da linha digitável de 47 digitos
|Posição|	Descrição/Conteúdo|
|-|-|
|1 a 3	|Número do Banco na Câmara de Compensação (001 = Banco do Brasil)|
|4 a 4	|Código da Moeda (9 = Real)|
|5 a 8	|Campo Livre|
|9 a 9	|Campo Livre|
|10 a 10	|Dígito Verificador do Campo 1|
|11 a 20	|Campo Livre|
|21 a 21	|Dígito Verificador do Campo 2|
|22 a 31	|Campo Livre|
|32 a 32	|Dígito Verificador do Campo 3|
|33 a 33	|Dígito Verificador do Código de Barras|
|34 a 37	|Fator de Vencimento (3737 = 31/12/2007)|
|38 a 47	|Valor do Documento (100 = R$1,00)|


## Estrutura do código de barras de 44 digitos
|Posição|Descrição/Conteúdo|
|-|-|
|1 a 3	|Número do Banco na Câmara de Compensação (001 = Banco do Brasil)|
|4 a 4	|Código da Moeda (9 = Real)|
|5 a 5	|Dígito Verificador do Código de Barras|
|6 a 9	|Fator de Vencimento (3737 = 31/12/2007)|
|10 a 19	|Valor do Documento (100 = R$1,00)|
|20 a 23	|Número do Convênio fornecido pelo Banco|
|24 a 30	|Complemento do Nosso Número, sem DV|
|31 a 34	|Número da Agência de Relacionamento, sem DV|
|35 a 42	|Conta Corrente de Relacionamento, sem DV|
|43 a 44	|Tipo de Carteira/Modalidade de Cobrança|