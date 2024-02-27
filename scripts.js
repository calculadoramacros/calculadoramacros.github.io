document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calcularPesoIdeal();
});

function calcularPesoIdeal() {
    var altura = parseFloat(document.getElementById('altura').value);
    var peso = parseFloat(document.getElementById('peso').value);
    var constitucion = document.getElementById('constitucion').value;
    var genero = document.getElementById('genero').value;
    var actividad = document.getElementById('actividad').value;
    var objetivo = document.getElementById('objetivo').value;

    if (altura > 0 && peso > 0) {
        var pesoIdeal = calcularFormulaPesoIdeal(altura, peso, constitucion, genero);
        var mensaje = "Tu peso ideal es de " + pesoIdeal.toFixed(2) + " kg.";
        document.getElementById('resultado').innerText = mensaje;

        var dietaSemanal = calcularDietaSemanal(pesoIdeal, actividad, objetivo);
        var tablaDieta = generarTablaDieta(dietaSemanal);
        document.getElementById('resultadoDieta').innerHTML = tablaDieta;
    } else {
        document.getElementById('resultado').innerText = "Por favor, introduce valores válidos.";
        document.getElementById('resultadoDieta').innerHTML = "";
    }
}

function calcularFormulaPesoIdeal(altura, peso, constitucion, genero) {
    // Fórmula de peso ideal
    var alturaMetros = altura / 100; // Convertir altura a metros
    var pesoIdeal;

    if (genero === "hombre") {
        if (constitucion === "delgada") {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.9;
        } else if (constitucion === "robusta") {
            pesoIdeal = (alturaMetros * 100 - 100) * 1.1;
        } else {
            pesoIdeal = (alturaMetros * 100 - 100);
        }
    } else if (genero === "mujer") {
        if (constitucion === "delgada") {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.85;
        } else if (constitucion === "robusta") {
            pesoIdeal = (alturaMetros * 100 - 100) * 1.15;
        } else {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.9;
        }
    }
    
    return pesoIdeal;
}

function calcularDietaSemanal(pesoIdeal, actividad, objetivo) {
    // Calcular necesidades calóricas diarias
    var factorActividad = 0;
    switch (actividad) {
        case "sedentario":
            factorActividad = 1.2;
            break;
        case "ligera":
            factorActividad = 1.375;
            break;
        case "moderada":
            factorActividad = 1.55;
            break;
        case "intensa":
            factorActividad = 1.725;
            break;
        case "muyIntensa":
            factorActividad = 1.9;
            break;
        default:
            break;
    }

    var caloriasDiarias;
    if (objetivo === "perder") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad * 0.8;
    } else if (objetivo === "mantener") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad;
    } else if (objetivo === "ganar") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad * 1.2;
    }

    // Calcular distribución de macronutrientes
    var proteinas = pesoIdeal * 2.2; // 2.2g/kg de peso corporal
    var grasas = caloriasDiarias * 0.3 / 9; // 30% de calorías totales, 1g de grasa = 9 calorías
    var carbohidratos = (caloriasDiarias - (proteinas * 4) - (grasas * 9)) / 4; // 4 calorías por gramo de carbohidratos

    // Solo necesitas el consumo diario, así que simplemente devuelve los macronutrientes
    return { "Proteínas": proteinas.toFixed(2), "Grasas": grasas.toFixed(2), "Carbohidratos": carbohidratos.toFixed(2) };
}

function generarTablaDieta(dietaDiaria) {
    var tablaHTML = "<h2>Macro Diario</h2><table><tr><th></th><th>Gramos</th></tr>";
    for (var macro in dietaDiaria) {
        tablaHTML += "<tr>";
        tablaHTML += "<td>" + macro + "</td>";
        tablaHTML += "<td>" + dietaDiaria[macro] + "</td>";
        tablaHTML += "</tr>";
    }
    tablaHTML += "</table>";
    return tablaHTML;
}
