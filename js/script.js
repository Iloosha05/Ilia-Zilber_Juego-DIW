/** Variables para el posicionamiento */
let posNorth = 0;
let posSouth = 0;
let posEast = 0;
let posWest = 0;

let defaultGameState = { 
    player: {
        name: "Ilia",
        health: 120,
        strength: 15,
        strengthBonus: 3,
        defense: 10,
        defenseBonus: 2,
        currentRoom: 1,
        gold: 50,
        potions: 2 },

    map: { /** Aquí duardamos todas las listas de salas y enemigos */
        rooms: [ /** Lista de salas */
        {
            id: 1,
            monsterProb: 0,
            isShop: false,
            name: "El patio de bloque",
            description: "Un lugar caótico, rodeado de edificios altos.",
            north: 0,
            south: 0,
            east: 0,
            west: 0,
            img: "patio.jpeg"},

        {
            id: 2,
            monsterProb: 0.7,
            isShop: false,
            name: "Garajes",
            description: "Un laberinto de garajes soviéticos",
            north: 0,
            south: 1,
            east: 0,
            west: 0,
            img: "garajes.jpeg"},
            
        {
            id: 3,
            monsterProb: 0.7,
            isShop: true,
            name: "Tienda universal",
            description: "Una tienda dónde se puede encontrar todo",
            north: 1,
            south: 0,
            east: 1,
            west: 0,
            img: "tienda.jpeg"},
            
        {
            id: 4,
            monsterProb: 0.7,
            isShop: false,
            name: "Portal",
            description: "Nadie sabe que está pasando aquí",
            north: 0,
            south: 0,
            east: 0,
            west: 1,
            img: "portal.jpeg"},
            
        {
            id: 5,
            monsterProb: 0.7,
            isShop: false,
            name: "Zona infantil",
            description: "Aquí me crié.",
            north: 1,
            south: 0,
            east: 0,
            west: 0,
            img: "infantil.jpeg"},
            
        {
            id: 6,
            monsterProb: 1,
            isShop: false,
            name: "En el portal",
            description: "Nadie aquí.. o...",
            north: 0,
            south: 0,
            east: 0,
            west: 2,
            img: "en_portal.jpeg"}
        ],
        
        enemies: [ /** Lista de enemigos */
        {
            name: "Gopnik",
            isBoss: false,
            description: "Una perona deportista y agresiva.",
            health: 40,
            strength: 8,
            defence: 3,
            img: "gopnik.webp"},
            
        {
            name: "Cliente enfadado",
            isBoss: false,
            description: "Furioso y hambriento.",
            health: 55,
            strength: 10,
            defence: 5,
            img: "cliente.webp"},

        {
            name: "Bandido",
            isBoss: true,
            description: "Tiene una pistola de aire",
            health: 120,
            strength: 18,
            defence: 12,
            img: "bandido.webp"}
    ]
  }
};

function mostrarHeroe() {
    document.getElementById("nombre").textContent = defaultGameState.player.name;
    document.getElementById("fuerza").textContent = defaultGameState.player.strength;
    document.getElementById("defensa").textContent = defaultGameState.player.defense;
    document.getElementById("vida").textContent = defaultGameState.player.health;
    document.getElementById("oro").textContent = defaultGameState.player.gold;
    document.getElementById("pociones").textContent = defaultGameState.player.potions;
}

function mostrarSala() {
    let rooms = defaultGameState.map.rooms;
    let room = rooms.find(r => r.id === defaultGameState.player.currentRoom);

    document.getElementById("locacion").textContent = room.name;
    document.getElementById("imagen").src = "img/" + room.img;
    document.getElementById("texto-juego").value =
        room.description + "\nSalidas posibles: " +
        (room.north > 0 ? "Norte " : "") +
        (room.south > 0 ? "Sur " : "") +
        (room.east > 0 ? "Este " : "") +
        (room.west > 0 ? "Oeste" : "");
}

function actualizarSalaPorPosicion() {
    let index = posNorth + posEast - posSouth - posWest;
    let rooms = defaultGameState.map.rooms;

    if (index < 0) index = 0;
    if (index >= rooms.length) index = rooms.length - 1;

    if (defaultGameState.player.currentRoom !== rooms[index].id) {
        defaultGameState.player.currentRoom = rooms[index].id;
        defaultGameState.player.currentEnemy = null; // сброс врага при смене комнаты
    }

    mostrarSalaActual();
}


function mostrarSalaActual() {
    mostrarSala();
}

function moveNorth() {
    posNorth++;
    actualizarSalaPorPosicion();
}

function moveSouth() {
    posSouth++;
    actualizarSalaPorPosicion();
}

function moveEast() {
    posEast++;
    actualizarSalaPorPosicion();
}

function moveWest() {
    posWest++;
    actualizarSalaPorPosicion();
}

function generarEnemigo(room) {
    if (defaultGameState.player.currentEnemy) return; // уже есть враг

    let random = Math.random();
    if (random > room.monsterProb) return;

    let enemigos = defaultGameState.map.enemies;
    let enemigo;

    let bossRoll = Math.random();
    if (bossRoll < 0.02) {
        enemigo = enemigos.find(e => e.isBoss);
    } else {
        let normales = enemigos.filter(e => !e.isBoss);
        enemigo = normales[Math.floor(Math.random() * normales.length)];
    }

    defaultGameState.player.currentEnemy = enemigo;

    let enemigoDiv = document.getElementById("enemy-info");
    enemigoDiv.innerHTML =
        "<h3>" + enemigo.name + "</h3>" +
        "<img src='img/" + enemigo.img + "'>" +
        "<p>" + enemigo.description + "</p>";

    document.querySelector(".monster").style.display = "block";
}


function intentarEnemigo() {
    let room = defaultGameState.map.rooms.find(r => r.id === defaultGameState.player.currentRoom);
    if (room.monsterProb > 0) generarEnemigo(room);
}

function buscarOro() {
    let room = defaultGameState.map.rooms.find(r => r.id === defaultGameState.player.currentRoom);
    if (room.monsterProb <= 0) return;

    let oro = Math.floor(Math.random() * 11);
    defaultGameState.player.gold += oro;
    document.getElementById("oro").textContent = defaultGameState.player.gold;
    document.getElementById("texto-juego").value += `\nHas encontrado ${oro} monedas de oro`;
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarHeroe();
    mostrarSalaActual();

    document.querySelector(".btn.n").addEventListener("click", moveNorth);
    document.querySelector(".btn.s").addEventListener("click", moveSouth);
    document.querySelector(".btn.e").addEventListener("click", moveEast);
    document.querySelector(".btn.o").addEventListener("click", moveWest);

    document.getElementById("boton1").addEventListener("click", buscarOro);
});




