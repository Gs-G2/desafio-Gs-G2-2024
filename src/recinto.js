class Recinto {
    constructor(numero, bioma, tamanho, animaisExistentes = {})  {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanho = tamanho;
        this.animaisExistentes = animaisExistentes;
    }    
}

export { Recinto as Recinto }