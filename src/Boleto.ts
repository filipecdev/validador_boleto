export class Boleto {

  public initialCode: string;   
  public digitableLine: string;        // Linha digitável
  public barcode: string;              // Código de barras
  public documentType: string;         // Tipo: Boleto ou Convenio
  public errorMessage: string;         // Mensagem para quando der algum retorno false
  public bankCode: string;             // Código do Banco
  public bankName: string;             // Nome do Banco (Apenas os mais conhecidos)
  public currencyCode: string;         // Código da Moeda
  public dueDate: Date;                // Data de vencimento (formato ISO ou 'YYYY-MM-DD')
  public amount: number;               // Valor do boleto
  public agreementNumber: string;      // Número do Convênio fornecido pelo Banco
  public ourNumberComplement: string;  // Complemento do Nosso Número
  public agencyNumber: string;         // Número da Agência
  public accountNumber: string;        // Conta Corrente
  public billingMode: string;          // Tipo de Carteira / Modalidade de Cobrança
  public segmentCode: string;          // Convenio: Código do Segmento
  public segmentName: string;          // Convenio: Nome do Seguimento
  public companyIdentifier: string;    // Convenio: Identificação da empresa, não possui padronização :C


  constructor(initialCode: string) {
    this.initialCode = (initialCode.match(/[0-9]/g) || []).join('')      
    this.digitableLine = "";
    this.barcode = ""; 
    this.documentType = "";  
    this.errorMessage = "";
    this.bankCode = "";
    this.bankName = "";
    this.currencyCode = "";
    this.dueDate = new Date();
    this.amount = 0;
    this.agreementNumber = "";
    this.ourNumberComplement = "";
    this.agencyNumber = "";
    this.accountNumber = "";
    this.billingMode = "";
    this.segmentCode = "";
    this.segmentName = "";
    this.companyIdentifier = "";    
  }

  public validate(): boolean {
    if (this.initialCode.length == 47){          // Linha digitavel boleto
      return this.validateBoletoDigitableLine();
    } else if (this.initialCode.length == 48){   // Linha digitavel convênio
      return this.validateConvenioDigitableLine();
    } else if (this.initialCode.length == 44){ 
      if (this.initialCode.slice(0,1) == '8') {  // Código de barras de um convênio
        return this.validateConvenioBarcode(); 
      } else {                                   // Código de barras de um boleto
        return this.validateBoletoBarcode(); 
      }
    } else {
      this.errorMessage = "Tamanho do número não é compativel com nenhum documento previsto!";
      return false;
    }
  }

  private validateBoletoDigitableLine(): boolean{
    this.documentType = "Boleto";
    this.digitableLine = this.initialCode;
    this.barcode = this.generateBoletoBarcode(this.initialCode);       
    this.loadBoletoInfo();
    return this.validateBoletoDV();
  }

  private validateConvenioDigitableLine(): boolean{
    this.documentType = "Convênio";
    this.digitableLine = this.initialCode;
    this.barcode = this.generateConvenioBarcode(this.initialCode);
    this.loadConvenioInfo(); 
    return this.validateConvenioDV();
  }

  private validateBoletoBarcode(): boolean{
    this.documentType = "Boleto";
    this.barcode = this.initialCode;
    this.digitableLine = this.generateBoletoDigitableLine(this.initialCode);  
    this.loadBoletoInfo();
    return this.validateBoletoDV();
  }

  private validateConvenioBarcode(): boolean{
    this.documentType = "Convênio";
    this.barcode = this.initialCode;
    this.digitableLine = this.generateConvenioDigitableLine(this.initialCode);
    this.loadConvenioInfo();     
    return this.validateConvenioDV();
  }

  private loadBoletoInfo(): void{
    this.bankCode = this.digitableLine.slice(0,3);
    this.bankName = this.getBankName(parseInt(this.bankCode, 10))
    this.currencyCode = this.digitableLine[3];
    this.dueDate = this.getDueDateForNewFactor(parseInt(this.digitableLine.slice(33,37), 10))
    this.amount = this.getAmount(this.digitableLine.slice(37));
    this.agreementNumber = this.barcode.slice(19,23);
    this.ourNumberComplement = this.barcode.slice(23,30);
    this.agencyNumber = this.barcode.slice(30,34);
    this.accountNumber = this.barcode.slice(34,42);
    this.billingMode = this.barcode[43]; 
  }

  private loadConvenioInfo(): void{    
    this.amount = this.getAmount(this.digitableLine.slice(4,15), this.digitableLine[2]);    
    this.segmentCode = this.digitableLine[1];
    this.segmentName = this.getSegmentName(parseInt(this.segmentCode, 10));
    this.dueDate = new Date()
    this.companyIdentifier = this.digitableLine.slice(15,44);   
  }

  private validateBoletoDV(): boolean {
    const checkDigit = parseInt(this.barcode[4], 10); // DV is at position 5 (index 4)
    const barcodeWithoutDV = this.barcode.slice(0, 4) + this.barcode.slice(5);
    const calculatedDV = this.modulo11(barcodeWithoutDV);

    if (checkDigit !== calculatedDV){
      this.errorMessage = "Código de boleto inválido!";
      return false;
    }    
  
    return true;
  }

  private validateConvenioDV(): boolean{
    const valueTypeDigit = parseInt(this.digitableLine[2], 10); // 3rd digit defines the module
    const useModulo10 = valueTypeDigit === 6 || valueTypeDigit === 8;

    for (let i = 0; i < 4; i++) {
      const start = i * 12;
      const block = this.digitableLine.slice(start, start + 11);
      const providedDV = parseInt(this.digitableLine[start + 11], 10);

      const calculatedDV = useModulo10
        ? this.modulo10(block)
        : this.modulo11(block);

      if (providedDV !== calculatedDV) {
        this.errorMessage = "Código de convênio inválido!";
        return false;
      }
    }

    return true;
  }

  private getDueDateForNewFactor(dueDateFactor: number): Date {    

    if (isNaN(dueDateFactor) || dueDateFactor === 0) {
      return new Date();
    }

    let baseDate = new Date(1997, 9, 7); // 07/10/1997 -> Antigo fator Febraban

    if (dueDateFactor > 1000) {
      baseDate = new Date(2025, 1, 22); // 22/02/2025 -> Novo fator Febraban  
      dueDateFactor = dueDateFactor - 1000; // Calcula a data de vencimento, subtraindo 1000 do fator 
    }
  
    baseDate.setDate(baseDate.getDate() + dueDateFactor);      
    return baseDate;
  }

  private getAmount(amountStr: string, valueIndicator?: string): number{
    if (valueIndicator && valueIndicator !== '6' && valueIndicator !== '8') {
      return 0;     
    }
    const amount = parseInt(amountStr, 10);
    return amount / 100;
  }

  private getSegmentName(segmentCode: number): string {
    let segments = this.getCollectionSegmentMap();
    return segments.get(segmentCode) || "Código de segmento não previsto!"
  }

  private getBankName(bankCode: number): string {
    let banks = this.getBankCodesMap();
    return banks.get(bankCode) || "Código de banco não previsto!"
  }

  private modulo10(numbers: string): number {
    let sum = 0;
    let weight = 2;
  
    for (let i = numbers.length - 1; i >= 0; i--) {
      const digit = parseInt(numbers[i], 10);
      let product = digit * weight;
      if (product > 9) product -= 9;
      sum += product;
      weight = weight === 2 ? 1 : 2;
    }
  
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  }

  private modulo11(number: string): number {
    const weights = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    let weightIndex = 0;
   
    for (let i = number.length - 1; i >= 0; i--) {
        sum += parseInt(number[i]) * weights[weightIndex];
        weightIndex = (weightIndex + 1) % weights.length;
    }

    const remainder = sum % 11;
    let checkDigit = 11 - remainder;
    
    if (checkDigit === 10 || checkDigit === 11) {
        checkDigit = 0;
    }

    return checkDigit;
}

  private generateBoletoDigitableLine(barcode: string): string {
    const field1 = barcode.slice(0, 4) + barcode.slice(19, 24);
    const checkDigit1 = this.modulo10(field1).toString();  
    const field2 = barcode.slice(24, 34);
    const checkDigit2 = this.modulo10(field2).toString();  
    const field3 = barcode.slice(34, 44);
    const checkDigit3 = this.modulo10(field3).toString();  
    const field4 = barcode.slice(4, 5); 
    const field5 = barcode.slice(5, 19);   
    return field1 + checkDigit1 + field2 + checkDigit2 + field3 + checkDigit3 + field4 + field5;
  }


  private generateConvenioDigitableLine(barcode: string): string {    
    const field1 = barcode.slice(0, 11);
    const checkDigit1 = this.modulo10(field1).toString();
    const field2 = barcode.slice(11, 22);
    const checkDigit2 = this.modulo10(field2).toString();
    const field3 = barcode.slice(22, 33);
    const checkDigit3 = this.modulo10(field3).toString();
    const field4 = barcode.slice(33, 44);
    const checkDigit4 = this.modulo10(field4).toString(); 
    return field1 + checkDigit1 + field2 + checkDigit2 + field3 + checkDigit3 + field4 + checkDigit4;
  }

  private generateBoletoBarcode(digitableLine: string): string {
    const bank = digitableLine.slice(0, 3);
    const currencyCode = digitableLine[3];
    const additionalField = digitableLine.slice(4,9) + digitableLine.slice(10,20) + digitableLine.slice(21,31);
    const generalDV = digitableLine[32];
    const dueDateAndAmount = digitableLine.slice(33);
    return bank + currencyCode + generalDV + dueDateAndAmount + additionalField;
  }

  private generateConvenioBarcode(digitableLine: string): string {   
    const field1 = digitableLine.slice(0, 11);   
    const field2 = digitableLine.slice(12, 23);  
    const field3 = digitableLine.slice(24, 35);  
    const field4 = digitableLine.slice(36, 47);  
    return field1 + field2 + field3 + field4;
  }

  public toJsonString(): string {
    return JSON.stringify(this);
  }

  private getCollectionSegmentMap(): Map<number, string> {
    return new Map<number, string>([
      [1, "Prefeituras"],
      [2, "Saneamento"],
      [3, "Energia elétrica/gás"],
      [4, "Telecomunicações"],
      [5, "Órgãos governamentais"],
      [6, "Carnês e assemelhados"],
      [7, "Multas de trânsito"],
      [9, "Outros"]
    ]);
  }

  private getBankCodesMap(): Map<number, string> {
    return new Map<number, string>([
      [1, 'Banco do Brasil S.A.'],
      [33, 'Banco Santander (Brasil) S.A.'],
      [104, 'Caixa Econômica Federal'],
      [237, 'Banco Bradesco S.A.'],
      [341, 'Itaú Unibanco S.A.'],
      [260, 'Nu Pagamentos S.A.'],
      [336, 'Banco C6 S.A.'],
      [77, 'Banco Inter S.A.'],
      [332, 'Acesso Soluções de Pagamento S.A.'],
      [117, 'Advanced Corretora de Câmbio Ltda.'],
      [272, 'Agk Corretora de Câmbio S.A.'],
      [349, 'Al5 S.A. Crédito'],
      [172, 'Albatross Ccv S.A.'],
      [313, 'Amazónia Corretora de Câmbio Ltda.'],
      [188, 'Ativa Investimentos S.A.'],
      [280, 'Avista S.A. Crédito'],
      [80, 'B&T Corretora de Câmbio Ltda.'],
      [246, 'Banco ABC Brasil S.A.'],
      [75, 'Banco ABN AMRO S.A.'],
      [121, 'Banco Agibank S.A.'],
      [25, 'Banco Alfa S.A.'],
      [641, 'Banco Alvorada S.A.'],
      [65, 'Banco Andbank (Brasil) S.A.'],
      [169, 'Banco Olé Consignado S.A.'],
      [79, 'Banco Original do Agronegócio S.A.'],
      [212, 'Banco Original S.A.'],
      [712, 'Banco Ourinvest S.A.'],
      [623, 'Banco Pan S.A.'],
      [611, 'Banco Paulista S.A.'],
      [643, 'Banco Pine S.A.'],
      [747, 'Banco Rabobank International Brasil S.A.'],
      [88, 'Banco Randon S.A.'],
      [633, 'Banco Rendimento S.A.'],
      [741, 'Banco Ribeirão Preto S.A.'],
      [120, 'Banco Rodobens S.A.'],
      [422, 'Banco Safra S.A.'],
      [743, 'Banco Semear S.A.'],
      [754, 'Banco Sistema S.A.'],
      [630, 'Banco Smartbank S.A.'],
      [366, 'Banco Société Générale Brasil S.A.'],
      [637, 'Banco Sofisa S.A.'],
      [464, 'Banco Sumitomo Mitsui Brasileiro S.A.'],
      [82, 'Banco Topázio S.A.'],
      [387, 'Banco Toyota do Brasil S.A.'],
      [634, 'Banco Triângulo S.A.'],
      [18, 'Banco Tricury S.A.'],
      [393, 'Banco Volkswagen S.A.'],
      [655, 'Banco Votorantim S.A.'],
      [610, 'Banco VR S.A.'],
      [119, 'Banco Western Union do Brasil S.A.']
    ]);
  }

}
