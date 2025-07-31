import { pad, padEnd, padStart } from "lodash";

export class Formatar {

    static padStart(texto: string, tamanho: number, caractere: string) {
        return padStart(texto, tamanho, caractere)
    }

    static padEnd(texto: string, tamanho: number, caractere: string) {
        return padEnd(texto, tamanho, caractere)
    }

    static padBoth(texto: string, tamanho: number, caractere: string){
        return pad(texto, tamanho, caractere)
    }

    static numero(valor: any, casasDecimais = 2, separadorCasasDecimais = ',', separadorMilhar = '.') {

        if (valor == null || !isFinite(valor)) {
            throw new TypeError("number is not valid");
        }

        if (!casasDecimais) {
            var len = valor.toString().split('.').length;
            casasDecimais = len > 1 ? len : 0;
        }

        if (!separadorCasasDecimais) {
            separadorCasasDecimais = '.';
        }

        if (!separadorMilhar) {
            separadorMilhar = ',';
        }

        valor = parseFloat(valor).toFixed(casasDecimais);

        valor = valor.replace(".", separadorCasasDecimais);

        var splitNum = valor.split(separadorCasasDecimais);
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, separadorMilhar);
        valor = splitNum.join(separadorCasasDecimais);

        return valor;
    }

}