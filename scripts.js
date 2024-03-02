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
        var tablaDietaComidas = generarTablaDietaComidas(dietaSemanal);

        document.getElementById('resultadoDieta').innerHTML = tablaDieta;
        document.getElementById('resultadoDietaComidas').innerHTML = tablaDietaComidas;

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
function generarTablaDietaComidas(dietaDiaria) {
    // Base de datos de platos completos con valores nutricionales
    var platosCompletos = [
        // Desayunos
        { nombre: "Tostada de jamón y café", tipo: "Desayuno", proteinas: 10, grasas: 5, carbohidratos: 30 },
        { nombre: "Avena con leche y café", tipo: "Desayuno", proteinas: 10, grasas: 5, carbohidratos: 50 },
        { nombre: "Yogur con zumo y queso natural", tipo: "Desayuno", proteinas: 15, grasas: 10, carbohidratos: 25 },
        { nombre: "Huevo revuelto con espinacas", tipo: "Desayuno", proteinas: 15, grasas: 10, carbohidratos: 5 },
        { nombre: "Tostadas con aguacate", tipo: "Desayuno", proteinas: 8, grasas: 15, carbohidratos: 25 },
        { nombre: "Panqueques con miel", tipo: "Desayuno", proteinas: 10, grasas: 8, carbohidratos: 40 },
        { nombre: "Cereal con leche", tipo: "Desayuno", proteinas: 7, grasas: 4, carbohidratos: 35 },
        { nombre: "Muffin de arándanos", tipo: "Desayuno", proteinas: 5, grasas: 10, carbohidratos: 30 },
        { nombre: "Smoothie de frutas", tipo: "Desayuno", proteinas: 5, grasas: 3, carbohidratos: 40 },
        { nombre: "Croissant con mermelada", tipo: "Desayuno", proteinas: 6, grasas: 12, carbohidratos: 35 },
        // Almuerzos
        { nombre: "Hamburguesa con papas fritas", tipo: "Almuerzo", proteinas: 35, grasas: 20, carbohidratos: 60 },
        { nombre: "Ensalada de pollo", tipo: "Almuerzo", proteinas: 30, grasas: 10, carbohidratos: 20 },
        { nombre: "Sándwich de pollo", tipo: "Almuerzo", proteinas: 25, grasas: 10, carbohidratos: 35 },
        { nombre: "Pescado al horno con verduras", tipo: "Almuerzo", proteinas: 30, grasas: 15, carbohidratos: 20 },
        { nombre: "Arroz con camarones", tipo: "Almuerzo", proteinas: 25, grasas: 10, carbohidratos: 50 },
        { nombre: "Pollo asado con puré de papas", tipo: "Almuerzo", proteinas: 30, grasas: 15, carbohidratos: 40 },
        { nombre: "Tacos de carne asada", tipo: "Almuerzo", proteinas: 25, grasas: 12, carbohidratos: 30 },
        { nombre: "Pasta al pesto", tipo: "Almuerzo", proteinas: 20, grasas: 18, carbohidratos: 45 },
        { nombre: "Sopa de fideos con verduras", tipo: "Almuerzo", proteinas: 10, grasas: 5, carbohidratos: 25 },
        { nombre: "Rollitos de primavera", tipo: "Almuerzo", proteinas: 15, grasas: 8, carbohidratos: 30 },
        // Cenas
        { nombre: "Sopa de verduras", tipo: "Cena", proteinas: 10, grasas: 5, carbohidratos: 15 },
        { nombre: "Pasta con salsa de tomate", tipo: "Cena", proteinas: 20, grasas: 10, carbohidratos: 40 },
        { nombre: "Ensalada César", tipo: "Cena", proteinas: 15, grasas: 10, carbohidratos: 20 },
        { nombre: "Pizza de vegetales", tipo: "Cena", proteinas: 20, grasas: 15, carbohidratos: 35 },
        { nombre: "Salmón a la parrilla con quinoa", tipo: "Cena", proteinas: 30, grasas: 15, carbohidratos: 25 },
        { nombre: "Estofado de ternera", tipo: "Cena", proteinas: 25, grasas: 12, carbohidratos: 30 },
        { nombre: "Filete de cerdo con puré de batatas", tipo: "Cena", proteinas: 30, grasas: 18, carbohidratos: 35 },
        { nombre: "Curry de lentejas", tipo: "Cena", proteinas: 20, grasas: 10, carbohidratos: 40 },
        { nombre: "Tortilla de patatas", tipo: "Cena", proteinas: 15, grasas: 20, carbohidratos: 25 },
        { nombre: "Caldo verde", tipo: "Cena", proteinas: 10, grasas: 5, carbohidratos: 20 },
        // Snacks
        { nombre: "Frutas con yogur", tipo: "Snack", proteinas: 5, grasas: 3, carbohidratos: 20 },
        { nombre: "Batido de proteínas", tipo: "Snack", proteinas: 20, grasas: 5, carbohidratos: 10 },
        { nombre: "Yogur con frutas y nueces", tipo: "Snack", proteinas: 8, grasas: 5, carbohidratos: 25 },
        { nombre: "Batido de frutas", tipo: "Snack", proteinas: 5, grasas: 3, carbohidratos: 30 },
        { nombre: "Palitos de zanahoria con hummus", tipo: "Snack", proteinas: 3, grasas: 5, carbohidratos: 15 },
        { nombre: "Nueces mixtas", tipo: "Snack", proteinas: 7, grasas: 15, carbohidratos: 10 },
        { nombre: "Barrita de cereales", tipo: "Snack", proteinas: 3, grasas: 8, carbohidratos: 20 },
        { nombre: "Galletas integrales con queso", tipo: "Snack", proteinas: 5, grasas: 10, carbohidratos: 25 },
        { nombre: "Hummus con pan pita", tipo: "Snack", proteinas: 6, grasas: 7, carbohidratos: 30 },
        { nombre: "Popcorn casero", tipo: "Snack", proteinas: 2, grasas: 3, carbohidratos: 25 },
        { nombre: "Smoothie bowl de frutas", tipo: "Desayuno", proteinas: 8, grasas: 5, carbohidratos: 40 },
        { nombre: "Tortilla de espinacas y champiñones", tipo: "Desayuno", proteinas: 12, grasas: 8, carbohidratos: 10 },
        { nombre: "Bagel con salmón ahumado", tipo: "Desayuno", proteinas: 20, grasas: 10, carbohidratos: 30 },
        { nombre: "Pan integral con aguacate y huevo pochado", tipo: "Desayuno", proteinas: 15, grasas: 15, carbohidratos: 25 },
        { nombre: "Tarta de manzana casera", tipo: "Desayuno", proteinas: 5, grasas: 10, carbohidratos: 35 },
        { nombre: "Crepes con fresas y crema batida", tipo: "Desayuno", proteinas: 8, grasas: 12, carbohidratos: 40 },
        { nombre: "Macedonia de frutas con yogur griego", tipo: "Desayuno", proteinas: 7, grasas: 3, carbohidratos: 25 },
        { nombre: "Gachas de avena con frutos secos", tipo: "Desayuno", proteinas: 8, grasas: 10, carbohidratos: 35 },
        { nombre: "Huevos benedictinos", tipo: "Desayuno", proteinas: 20, grasas: 15, carbohidratos: 20 },
        { nombre: "Pan tostado con ricotta y miel", tipo: "Desayuno", proteinas: 10, grasas: 8, carbohidratos: 25 },

        // Almuerzos adicionales
        { nombre: "Wraps de pollo y aguacate", tipo: "Almuerzo", proteinas: 25, grasas: 15, carbohidratos: 30 },
        { nombre: "Pollo al curry con arroz integral", tipo: "Almuerzo", proteinas: 30, grasas: 12, carbohidratos: 45 },
        { nombre: "Ensalada de quinoa y vegetales asados", tipo: "Almuerzo", proteinas: 15, grasas: 8, carbohidratos: 35 },
        { nombre: "Bistec a la parrilla con espárragos", tipo: "Almuerzo", proteinas: 35, grasas: 18, carbohidratos: 20 },
        { nombre: "Risotto de champiñones", tipo: "Almuerzo", proteinas: 15, grasas: 10, carbohidratos: 50 },
        { nombre: "Tortilla de patatas y cebolla", tipo: "Almuerzo", proteinas: 20, grasas: 15, carbohidratos: 30 },
        { nombre: "Pasta con albóndigas en salsa de tomate", tipo: "Almuerzo", proteinas: 25, grasas: 12, carbohidratos: 40 },
        { nombre: "Bowl de burrito vegetariano", tipo: "Almuerzo", proteinas: 20, grasas: 10, carbohidratos: 35 },
        { nombre: "Pollo a la parrilla con ensalada de col", tipo: "Almuerzo", proteinas: 30, grasas: 10, carbohidratos: 20 },
        { nombre: "Pasta con camarones al pesto", tipo: "Almuerzo", proteinas: 25, grasas: 12, carbohidratos: 45 },

        // Cenas adicionales
        { nombre: "Tortilla española con ensalada verde", tipo: "Cena", proteinas: 20, grasas: 15, carbohidratos: 25 },
        { nombre: "Salmón al horno con espárragos", tipo: "Cena", proteinas: 30, grasas: 15, carbohidratos: 20 },
        { nombre: "Pasta con salsa de champiñones y espinacas", tipo: "Cena", proteinas: 18, grasas: 12, carbohidratos: 40 },
        { nombre: "Quiche de espinacas y queso", tipo: "Cena", proteinas: 15, grasas: 20, carbohidratos: 30 },
        { nombre: "Tacos de pescado con guacamole", tipo: "Cena", proteinas: 25, grasas: 15, carbohidratos: 30 },
        { nombre: "Lasaña de vegetales", tipo: "Cena", proteinas: 20, grasas: 12, carbohidratos: 35 },
        { nombre: "Estofado de pollo con verduras", tipo: "Cena", proteinas: 25, grasas: 10, carbohidratos: 20 },
        { nombre: "Ratatouille al horno", tipo: "Cena", proteinas: 10, grasas: 8, carbohidratos: 25 },
        { nombre: "Pavo al horno con batatas asadas", tipo: "Cena", proteinas: 30, grasas: 12, carbohidratos: 35 },
        { nombre: "Sopa de tomate casera", tipo: "Cena", proteinas: 5, grasas: 3, carbohidratos: 15 },

        // Snacks adicionales
        { nombre: "Tostadas integrales con aguacate", tipo: "Snack", proteinas: 5, grasas: 10, carbohidratos: 20 },
        { nombre: "Batido verde detox", tipo: "Snack", proteinas: 5, grasas: 3, carbohidratos: 30 },
        { nombre: "Huevos rellenos de atún", tipo: "Snack", proteinas: 15, grasas: 10, carbohidratos: 5 },
        { nombre: "Bolitas de energía de frutos secos", tipo: "Snack", proteinas: 5, grasas: 10, carbohidratos: 20 },
        { nombre: "Rodajas de pepino con hummus", tipo: "Snack", proteinas: 3, grasas: 5, carbohidratos: 10 },
        { nombre: "Smoothie de proteínas de vainilla", tipo: "Snack", proteinas: 20, grasas: 5, carbohidratos: 15 },
        { nombre: "Gazpacho casero", tipo: "Snack", proteinas: 3, grasas: 2, carbohidratos: 10 },
        { nombre: "Queso cottage con frutas", tipo: "Snack", proteinas: 10, grasas: 5, carbohidratos: 15 },
        { nombre: "Tostadas de pan integral con queso ricotta y tomate", tipo: "Snack", proteinas: 8, grasas: 10, carbohidratos: 20 },
        { nombre: "Helado de yogur casero", tipo: "Snack", proteinas: 5, grasas: 8, carbohidratos: 30 }
        // Agrega más platos completos según sea necesario
    ];
    
    var tablaHTML = "<h2>Selección de Comidas</h2><table><tr><th>Día</th><th>Comida</th><th>Plato Completo</th></tr>";
    
    // Para cada día de la semana y cada comida
    var diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    var comidas = ["Desayuno", "Almuerzo", "Cena", "Snack"];
    
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 4; j++) {
            // Seleccionar plato completo que cumpla con los requerimientos de macros y coincida con el tipo de comida
            var plato = seleccionarPlatoCompleto(dietaDiaria, platosCompletos.filter(function(item) { return item.tipo === comidas[j]; }));
            tablaHTML += "<tr>";
            tablaHTML += "<td>" + diasSemana[i] + "</td>";
            tablaHTML += "<td>" + comidas[j] + "</td>";
            tablaHTML += "<td>" + plato.nombre + "</td>";
            tablaHTML += "</tr>";
        }
    }
    
    tablaHTML += "</table>";
    return tablaHTML;
}

function seleccionarPlatoCompleto(dietaDiaria, platosCompletos) {
    var candidatos = [];

    platosCompletos.forEach(function(plato) {
        if (plato.proteinas <= dietaDiaria["Proteínas"] && plato.grasas <= dietaDiaria["Grasas"] && plato.carbohidratos <= dietaDiaria["Carbohidratos"]) {
            candidatos.push(plato);
        }
    });

    // Si no hay candidatos, seleccionar uno aleatorio
    if (candidatos.length === 0) {
        return platosCompletos[Math.floor(Math.random() * platosCompletos.length)];
    }

    // Ordenar candidatos de forma aleatoria y seleccionar el primero
    candidatos.sort(function() { return 0.5 - Math.random() });
    return candidatos[0];
}
