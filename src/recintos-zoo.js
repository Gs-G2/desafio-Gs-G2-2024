import { Animal } from "./animal.js";
import { Recinto } from "./recinto.js";


class RecintosZoo {
    constructor() {
        // cria um array com os objetos animais permitidos
        this.animaisPermitidos = [
            new Animal("LEAO", 3, ["savana"], "carnivoro"),
            new Animal("LEOPARDO", 2, ["savana"], "carnivoro"),
            new Animal("CROCODILO", 3, ["rio"], "carnivoro"),
            new Animal("MACACO", 1, ["savana", "floresta"], "onivoro"),
            new Animal("GAZELA", 2, ["savana"], "herbivoro"),
            new Animal("HIPOPOTAMO", 4, ["savana", "rio"], "herbivoro")
        ]

        // cria um array com os objetos recintos disponiveis
        this.recintos = [
            new Recinto(1, ["savana"], 10, {"MACACO": 3}),
            new Recinto(2, ["floresta"], 5, {}),
            new Recinto(3, ["savana", "rio"], 7, {"GAZELA": 1}),
            new Recinto(4, ["rio"], 8, {}),
            new Recinto(5, ["savana"], 9, {"LEAO": 1})
        ]
    }


    analisaRecintos(animal, quantidade) {
        if (typeof(animal) != 'string') {
            return { erro: "Animal inválido" };
        }

        // Validação da quantidade
        if (typeof(quantidade) != 'number' || quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Variavel animal se torna um objeto
        animal = this.animaisPermitidos.find(a => a.especie == animal.toUpperCase());

        // Validação do animal
        if (!animal) {
            return { erro: "Animal inválido" };
        }
    
        let recintosViaveis = this.recintos.filter(recinto => {
            // Verifica bioma compatível
            if (!this.verificaBiomas(animal, recinto)) {
                return false;
            }
    
            // Calcula espaço disponível
            let espacoOcupado = this.calculaEspacoOcupado(recinto, animal);
            let espacoDisponivel = recinto.tamanho - espacoOcupado;
    
            // Verifica se há espaço suficiente para o animal e a quantidade
            if (espacoDisponivel < animal.tamanho * quantidade) {
                return false;
            }
    
            // Regras para adicionar carnívoros
            if (animal.dieta ==  "carnivoro") {
                let carnivoroExistente = Object.keys(recinto.animaisExistentes).find(especie => {
                    let animalExistente = this.animaisPermitidos.find(a => a.especie == especie.toUpperCase());
                    return animalExistente.especie != animal.especie;
                });
                if (carnivoroExistente) {
                    return false;
                }
            }

            let carnivoroExistente = Object.keys(recinto.animaisExistentes).find(especie => {
                let animalExistente = this.animaisPermitidos.find(a => a.especie == especie.toUpperCase());
                
                return animalExistente.especie != animal.especie && animalExistente.dieta == "carnivoro";
            });
            if (carnivoroExistente) {
                return false;
            }
    
            // Regras para hipopótamos
            if (animal.especie == "HIPOPOTAMO") {
                let outroExistente = Object.keys(recinto.animaisExistentes).find(especie => {
                    let animalExistente = this.animaisPermitidos.find(a => a.especie == especie.toUpperCase());
                    console.log(animalExistente)
                    return animalExistente.especie != animal.especie;
                });
                if (outroExistente) {
                    if (!recinto.bioma.includes("rio") || !recinto.bioma.includes("savana")) {
                        return false;
                    }
                }
            }
    
            // Regras para macacos
            if (animal.especie == "MACACO") {
                if (Object.keys(recinto.animaisExistentes).length == 0 && quantidade < 2) {
                    return false;
                }
            }
    
            return true;
        });
    
        // Ordena os recintos viáveis por número
        recintosViaveis = recintosViaveis.map(recinto => {
            let espacoOcupado = this.calculaEspacoOcupado(recinto, animal);
            let espacoLivre = recinto.tamanho - espacoOcupado - (animal.tamanho * quantidade);
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        });
    
        if (recintosViaveis.length == 0) {
            return { erro: "Não há recinto viável" };
        }
    
        return { recintosViaveis };
    }


    verificaBiomas(animal, recinto) {
        return animal.bioma.some(biomaAnimal => recinto.bioma.includes(biomaAnimal));
    }


    calculaEspacoOcupado(recinto, animal) {
        let espacoOcupado = 0;


        let outroAnimal = Object.keys(recinto.animaisExistentes).find(outro => outro.toUpperCase() != animal.especie)

        if(outroAnimal) {
            espacoOcupado++;
        }

        for (let [especieAnimal, quantidade] of Object.entries(recinto.animaisExistentes)) {
            animal = this.animaisPermitidos.find(a => a.especie.toUpperCase() == especieAnimal.toUpperCase());
            if (animal) {
                espacoOcupado += quantidade * animal.tamanho;
            }
        }
        return espacoOcupado;
    }
}

export { RecintosZoo as RecintosZoo };
