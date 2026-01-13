document.addEventListener("DOMContentLoaded", function() {
    mostrarHeroe(); //cargamos los datos iniciales del jugador
    mostrarSala(); //cargamos la sala inicial
});

//variables del estado del juego
let defaultGameState = { 
    player: {
        name: "Ilia",
        health: 120,
        strength: 15,
        defense: 10,
        currentRoom: 1,
        gold: 50,
        potions: 2,
        currentEnemy: null 
    },

    map: { 
        //array de objetos para las salas
        rooms: [
            {
                id: 1,
                name: "Patio",
                description: "El centro del barrio. Conexiones a todos lados.",
                monsterProb: 0,
                north: 5,
                south: 2,
                east: 4,
                west: 3,
                img: "patio.jpeg",
                map: "map_patio.jpg"
            },
            {
                id: 2,
                name: "Garajes",
                description: "Garajes oscuros y fríos.",
                monsterProb: 0.7,
                north: 1,
                south: 0,
                east: 0,
                west: 0,
                img: "garajes.jpeg",
                map: "map_garajes.jpg"
            },
            {
                id: 3,
                name: "Tienda",
                description: "Aquí puedes encontrar todo, incluso enemigos.",
                monsterProb: 0.7,
                north: 0,
                south: 0,
                east: 1,
                west: 0,
                img: "tienda.jpeg",
                map: "map_tienda.jpg"
            },
            {
                id: 4,
                name: "Portal",
                description: "Entrada al edificio principal.",
                monsterProb: 0.5,
                north: 6,
                south: 0,
                east: 0,
                west: 1,
                img: "portal.jpeg",
                map: "map_portal.jpg"
            },
            {
                id: 5,
                name: "Zona Infantil",
                description: "Silencio.",
                monsterProb: 0.7,
                north: 0,
                south: 1,
                east: 0,
                west: 0,
                img: "infantil.jpeg",
                map: "map_infantil.jpg"
            },
            {
                id: 6,
                name: "En el portal",
                description: "Que oscuro...",
                monsterProb: 1.0,
                north: 0,
                south: 4,
                east: 0,
                west: 0,
                img: "en_portal.jpeg",
                map: "map_enportal.jpg"
            }
        ],
        
        //la lista de enemigos
        enemies: [ 
            { 
                name: "Gopnik",
                isBoss: false,
                description: "Agresivo con chándal.",
                health: 40,
                strength: 8,
                img: "gopnik.webp" 
            },
            { 
                name: "Cliente enfadado",
                isBoss: false,
                description: "Grita mucho.",
                health: 55,
                strength: 10,
                img: "cliente.webp" 
            },
            { 
                name: "Bandido",
                isBoss: true,
                description: "El jefe final.",
                health: 120,
                strength: 18,
                img: "bandido.webp"
            }
        ]
    }
};

//mostramos datos del héroe
function mostrarHeroe() {
    let { name, strength, defense, health, gold, potions } = defaultGameState.player;
    document.getElementById("nombre").textContent = name; //su nombre 
    document.getElementById("fuerza").textContent = strength; //su fuerza
    document.getElementById("defensa").textContent = defense; //su defensa
    document.getElementById("vida").textContent = health; //su vida
    document.getElementById("oro").textContent = gold; //su oro
    document.getElementById("pociones").textContent = potions; //sus pociones
}

//actualizamos la sala actual
function mostrarSala() {
    let room = defaultGameState.map.rooms.find(function(room) { //extraemos datos de cada habitación room
        return room.id === defaultGameState.player.currentRoom; //buscamos, dónde la id coincide con la id de habitación actual
    });

    document.getElementById("locacion").textContent = room.name; //mostramos el nombre de la habitación actual
    document.getElementById("imagen").src = "img/" + room.img; //mostramos la imagen de la habitación actual
    document.getElementById("map").src = "img/" + room.map; //mostramos la mapa de la habitación actual
    
    let salidas = "Salidas: "; //salidas posibles
    if (room.north > 0) salidas += " Norte";
    if (room.south > 0) salidas += " Sur";
    if (room.east > 0) salidas += " Este";
    if (room.west > 0) salidas += " Oeste";

    document.getElementById("texto-juego").value = room.description + "\n\n" + salidas; //añadimos la descripción de la abitación y salidas posibles al textarea
}

//la logica de movimiento
function move(direction) {
    let currentRoom = defaultGameState.map.rooms.find(function(room) {
        return room.id === defaultGameState.player.currentRoom; //recogemos la información de la habitación, dóonde estámos
    });

    let nextRoomId = currentRoom[direction]; //propiedades del objeto room

    if (nextRoomId > 0) {
        defaultGameState.player.currentRoom = nextRoomId;
        
        defaultGameState.player.currentEnemy = null; //recargamos el enemigo
        document.getElementById("enemy-info").innerHTML = "";
        document.querySelector(".monster").style.display = "none";        
        mostrarSala(); //mostramos la sala de nuevo
        intentarEnemigo(); //cargamos el enemigo, si existe
    } else {
        document.getElementById("texto-juego").value += "\n\nNo puedes ir por ahí."; //si no hay salida aqu'i, informamos el usuario
    }
}

//intentamos generar un enemigo en la sala actual
function intentarEnemigo() {
    let room = defaultGameState.map.rooms.find(function(room) {
        return room.id === defaultGameState.player.currentRoom; //recogemos la informaci'on de la habitaci'on, d'onde est'amos
    });

    if (room.monsterProb <= 0) {
        return; //si en la sala no pueden aparecer enemigos, salimos
    }

    let randomValue = Math.random(); //creamos un número aleatorio entre 0 y 1
    let enemies = defaultGameState.map.enemies;

    if (randomValue < 0.02) { //comprobamos, si aparece el jefe
        let boss = enemies.find(function(enemy) {
            return enemy.isBoss === true; //buscamos el array de enemy, que tiene isBoss = trfue
        });

        defaultGameState.player.currentEnemy = boss;
        mostrarEnemigo(boss); //mostramos el jefe
        return;
    }

    if (randomValue < room.monsterProb) { //si no es jefe, comprobamos enemigo normal

        let normalEnemies = enemies.filter(function(enemy) {
            return enemy.isBoss === false; //buscamos el array de enemy, que tiene isBoss = false
        });

        let randomEnemy = normalEnemies[Math.floor(Math.random() * normalEnemies.length)]; //buscamos un enemigo normal randomo

        defaultGameState.player.currentEnemy = randomEnemy;
        mostrarEnemigo(randomEnemy); //mostramos el enemigo habitual
    }
}


function mostrarEnemigo(enemy) {

    document.getElementById("enemy-info").innerHTML = "";

    let template = document.getElementById("enemy-template");
    let clone = template.content.cloneNode(true);

    clone.querySelector(".enemy-name").textContent = enemy.name;
    clone.querySelector(".enemy-desc").textContent = enemy.description;

    document.getElementById("enemy-info").appendChild(clone);

    let monsterImg = document.querySelector(".monster");
    monsterImg.src = "img/" + enemy.img;
    monsterImg.style.display = "block";

    document.getElementById("texto-juego").value +=
        "\n\n¡Ha aparecido un enemigo!\n" +
        enemy.name + "\n" +
        enemy.description +
        (enemy.isBoss ? "\n(Es el jefe final)" : "");
}


//función para buscar oro
function buscarOro() {
    let room = defaultGameState.map.rooms.find(function(room) {
        return room.id === defaultGameState.player.currentRoom; //recogemos la información de la habitación, dóonde estáamos
    });

    if (room.monsterProb <= 0) { //solo se puede buscar oro si hay probabilidad de enemigos
        document.getElementById("texto-juego").value += "\n\nAquí no hay nada interesante.";
        return;
    }

    let goldFound = Math.floor(Math.random() * 11); //generamos oro aleatorio entre 0 y 10

    defaultGameState.player.gold += goldFound; //sumamos oro encontrado

    document.getElementById("texto-juego").value += "\n\nHas encontrado " + goldFound + " monedas de oro."; //informamos, si el jugador encuentra oro

    mostrarHeroe(); //actualizamos la ficha del héroe
}

//el evento del bot'on buscar oro
document.getElementById("boton1").addEventListener("click", function () {
    buscarOro();
});

//eventos de los botones de movimiento
document.getElementById("btn-norte").addEventListener("click", function () {
    move("north");
});

document.getElementById("btn-sur").addEventListener("click", function () {
    move("south");
});

document.getElementById("btn-este").addEventListener("click", function () {
    move("east");
});

document.getElementById("btn-oeste").addEventListener("click", function () {
    move("west");
});



