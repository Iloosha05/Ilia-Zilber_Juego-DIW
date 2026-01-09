/** Variables del estado del juego */
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
        /** Array de objetos para las salas */
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
                description: "Aquí puedes encontrar todo, incluso enemigos",
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
                description: "Columpios oxidados y silencio.",
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
                description: "Dentro del portal. Solo puedes salir al sur.",
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
            { name: "Gopnik", isBoss: false, description: "Agresivo con chándal.", health: 40, strength: 8, img: "gopnik.webp" },
            { name: "Cliente enfadado", isBoss: false, description: "Grita mucho.", health: 55, strength: 10, img: "cliente.webp" },
            { name: "Bandido", isBoss: true, description: "El jefe final.", health: 120, strength: 18, img: "bandido.webp" }
        ]
    }
};

/** Mostramos datos del héroe */
function mostrarHeroe() {
    document.getElementById("nombre").textContent = defaultGameState.player.name;
    document.getElementById("fuerza").textContent = defaultGameState.player.strength;
    document.getElementById("defensa").textContent = defaultGameState.player.defense;
    document.getElementById("vida").textContent = defaultGameState.player.health;
    document.getElementById("oro").textContent = defaultGameState.player.gold;
    document.getElementById("pociones").textContent = defaultGameState.player.potions;
}

/** Actualizamos la sala actual */
function mostrarSala() {
    let room = defaultGameState.map.rooms.find(function(r) {
        return r.id === defaultGameState.player.currentRoom;
    });

    document.getElementById("locacion").textContent = room.name;
    document.getElementById("imagen").src = "img/" + room.img;
    document.getElementById("map").src = "img/" + room.map;
    
    let salidas = "Salidas: ";
    if (room.north > 0) salidas += " Norte";
    if (room.south > 0) salidas += " Sur";
    if (room.east > 0) salidas += " Este";
    if (room.west > 0) salidas += " Oeste";

    document.getElementById("texto-juego").value = room.description + "\n\n" + salidas;
}

/** La logica de movimiento */
function move(direction) {
    let currentRoom = defaultGameState.map.rooms.find(function(r) {
        return r.id === defaultGameState.player.currentRoom;
    });

    // Propiedades del objeto room
    let nextRoomId = currentRoom[direction];

    if (nextRoomId > 0) {
        defaultGameState.player.currentRoom = nextRoomId;
        
        // Recargamos el enemigo
        defaultGameState.player.currentEnemy = null;
        document.getElementById("enemy-info").innerHTML = "";
        document.querySelector(".monster").style.display = "none";
        
        mostrarSala();
        intentarEnemigo();
    } else {
        document.getElementById("texto-juego").value += "\n\nNo puedes ir por ahí.";
    }
}

/** Probabilidad de enemigo */
function intentarEnemigo() {
    let room = defaultGameState.map.rooms.find(function(r) {
        return r.id === defaultGameState.player.currentRoom;
    });

    // Llamamos la funcion que genera un enemigo randomo
    if (room.monsterProb > 0 && Math.random() < room.monsterProb) {
        generarEnemigo();
    }
}

/** Aqu'i creamos un enemigo randomo */
function generarEnemigo() {
    let enemigos = defaultGameState.map.enemies;
    let enemigo;
    if (defaultGameState.player.currentRoom === 6) {
        enemigo = enemigos.find(function(e) { return e.isBoss; });
        document.getElementById("texto-juego").value += `\n\nHAS ENCONTRADO AL JEFE FINAL!`;
    } else {
        let bossRoll = Math.random();
        if (bossRoll <= 0.02) {
            enemigo = enemigos.find(function(e) { return e.isBoss; });
        } else {
            let normales = enemigos.filter(function(e) { return !e.isBoss; });
            enemigo = normales[Math.floor(Math.random() * normales.length)];
        }
    }

    defaultGameState.player.currentEnemy = enemigo;

    let template = document.getElementById("enemy-template");
    let clone = template.content.cloneNode(true);
    
    clone.querySelector(".enemy-name").textContent = enemigo.name;
    clone.querySelector(".enemy-desc").textContent = enemigo.description;
    
    document.getElementById("enemy-info").appendChild(clone);

    // Mostrar imagen monstruo
    let monsterImg = document.querySelector(".monster");
    monsterImg.src = "img/" + enemigo.img;
    monsterImg.style.display = "block";
    
    document.getElementById("texto-juego").value += `\n\nCuidado! Un ${enemigo.name} ha aparecido.`;
}

/** Funcion para buscar oro */
function buscarOro() {
    let room = defaultGameState.map.rooms.find(function(r) {
        return r.id === defaultGameState.player.currentRoom;
    });

    if (room.monsterProb > 0) {
        let oro = Math.floor(Math.random() * 11);
        defaultGameState.player.gold += oro;
        document.getElementById("oro").textContent = defaultGameState.player.gold;
        document.getElementById("texto-juego").value += `\nHas encontrado ${oro} monedas de oro.`;
    } else {
        document.getElementById("texto-juego").value += "\nAquí no hay oro.";
    }
}

// Eventos
document.addEventListener("DOMContentLoaded", function() {
    mostrarHeroe();
    mostrarSala();
    
    document.getElementById("boton1").textContent = "Buscar Oro";
    document.getElementById("boton2").textContent = "Poción";

    // Eventos de botones de navegación
    document.getElementById("btn-norte").addEventListener("click", function() { move('north'); });
    document.getElementById("btn-sur").addEventListener("click", function() { move('south'); });
    document.getElementById("btn-este").addEventListener("click", function() { move('east'); });
    document.getElementById("btn-oeste").addEventListener("click", function() { move('west'); });
    
    document.getElementById("boton1").addEventListener("click", buscarOro);
});


