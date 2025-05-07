import { Boleto } from './Boleto';

const boleto = new Boleto('84670000001435900240200240500024384221010811');
console.log(boleto.validate(), boleto.toJsonString());

const boleto2 = new Boleto('23797404300001240200448056168623793601105800');
console.log(boleto2.validate(), boleto2.toJsonString());
