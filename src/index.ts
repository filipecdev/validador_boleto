import { Boleto } from './Boleto';


let boleto:any = null; 

boleto = new Boleto('74891122719482620718853924481087695960000011990');
console.log("1", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('74896959600000119901122794826207185392448108');
console.log("2", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('836000000015 734101110009 001010202594 185907839061');
console.log("3", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('83600000001734101110000010102025918590783906');
console.log("4", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('34191.09008 28709.563341 44200.820007 3 10820000011990');
console.log("5", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('34193108200000119901090028709563344420082000');
console.log("6", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('836800000017 798501110000 001010202594 124213862608');
console.log("7", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('83680000001798501110000010102025912421386260');
console.log("8", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('75691434021200001236420032960013610850000000333');
console.log("9", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('75691317120103294520491224170018111390000093850');
console.log("10", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('75691113900000938501317101032945209122417001');
console.log("11", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());

boleto = new Boleto('23792373049065000566464000020004111360000322371');
console.log("12", boleto.validate(), boleto.toJsonString(), boleto.getNearestDueDate());



/*
Digitavel: 74891122719482620718853924481087695960000011990
cod barras img: 74896959600000119901122794826207185392448108
Vencimento: 15/01/2024
Data doc: 27/12/2023
Valor: 119,90
Banco: Sicred

Digitavel: 836000000015 734101110009 001010202594 185907839061
Código de Barras: 83600000001734101110000010102025918590783906
Valor: R$ 173,41

Digitavel: 34191.09008 28709.563341 44200.820007 3 10820000011990
Código de Barras: 34193108200000119901090028709563344420082000
Vencimento: 15/05/2025
Data doc: 25/04/2025
Valor: 119,90

Digitavel: 836800000017 798501110000 001010202594 124213862608
Código de barras: 83680000001798501110000010102025912421386260
Valor: R$ 179,85
*/