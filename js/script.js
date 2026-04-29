//variables del estado del juego
let defaultGameState = { 
    player: {
        name: "Ilia",
        health: 60,
        strength: 5,
        defense: 10,
        currentRoom: 1,
        gold: 50,
        potions: 2,
        currentEnemy: null,
        bonusStrength: 0,
        bonusDefense: 0
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
                img: "gopnik.png" 
            },
            { 
                name: "Cliente enfadado",
                isBoss: false,
                description: "Grita mucho.",
                health: 55,
                strength: 10,
                img: "cliente.png" 
            },
            { 
                name: "Bandido",
                isBoss: true,
                description: "El jefe final.",
                health: 120,
                strength: 18,
                img: "bandido.png"
            }
        ]
    }
};

//la funcción para mandar el texto a la textarea
function escribirTexto(texto) {
    let textarea = document.getElementById("texto-juego"); //llamamos la textarea 
    textarea.value += texto + "\n"; //separamos un poco el texto
    textarea.scrollTop = textarea.scrollHeight;
}

//la funcción para limpiar la textarea
function limpiarTexto() {
    let textarea = document.getElementById("texto-juego");
    document.getElementById("texto-juego").value = "";
    textarea.scrollTop = 0;
}

//la funcción para obtener la sala actual
function obtenerSalaActual() {
    return defaultGameState.map.rooms.find(function(room) {
        return room.id === defaultGameState.player.currentRoom;
    });
}

//la función para buscar oro
function buscarOro() {
    let room = obtenerSalaActual();

    if (room.monsterProb <= 0) { //solo se puede buscar oro si hay probabilidad de enemigos
        document.getElementById("texto-juego").value += "\n\nAquí no hay nada interesante.";
        return;
    }

    let goldFound = Math.floor(Math.random() * 11); //generamos oro aleatorio entre 0 y 10

    defaultGameState.player.gold += goldFound; //sumamos oro encontrado

    document.getElementById("texto-juego").value += "\n\nHas encontrado " + goldFound + " monedas de oro."; //informamos, si el jugador encuentra oro

    mostrarHeroe(); //actualizamos la ficha del héroe
}

//la función para el botón de sonido
document.getElementById("btn-sound").addEventListener("click", function () {
    this.classList.toggle("active");
});


//la función para mostrar datos de héroe
function mostrarHeroe() {
    let heroInfo = document.getElementById("hero-info");
    heroInfo.innerHTML = ""; //limpiamos ficha anterior

    let template = document.getElementById("hero-template");
    let clone = template.content.cloneNode(true);

    let player = defaultGameState.player; //damos al jugador la información por defecto

    clone.querySelector(".hero-name").textContent = player.name; //su nombre
    clone.querySelector(".hero-health").textContent = player.health; //su vida
    clone.querySelector(".hero-strength").textContent = player.strength; //su fuerza
    clone.querySelector(".hero-defense").textContent = player.defense; //su defensa
    clone.querySelector(".hero-gold").textContent = player.gold; //su oro
    clone.querySelector(".hero-potions").textContent = player.potions; //sus pociones

    heroInfo.appendChild(clone);
}

//funci'on para recargar los datos de usuario
function resetPlayer() {
    let player = defaultGameState.player;

    player.health = 120;
    player.gold = 0;
    player.potions = 0;
    player.bonusStrength = 0;
    player.bonusDefense = 0;
    player.currentRoom = 1;

    document.getElementById("enemy-info").innerHTML = "";
    document.querySelector(".monster").style.display = "none";
    defaultGameState.player.currentEnemy = null;

    limpiarTexto();
    escribirTexto("Has vuelto al inicio...");

    mostrarHeroe();
    mostrarSala();
}

//la función para actualizar y mostrar la sala actual
function mostrarSala() {
    let room = obtenerSalaActual();

    document.getElementById("locacion").textContent = room.name; //mostramos el nombre de la habitación actual
    document.getElementById("imagen").src = "img/" + room.img; //mostramos la imagen de la habitación actual
    document.getElementById("map").src = "img/" + room.map; //mostramos la mapa de la habitación actual
    
    let salidas = "Salidas:"; //comprobamos, que salidas existen
    if (room.north > 0) salidas += " Norte";
    if (room.south > 0) salidas += " Sur";
    if (room.east > 0) salidas += " Este";
    if (room.west > 0) salidas += " Oeste";

    escribirTexto("Has entrado a... " + room.name + "\n"); //mostramos el nombre de la habitación
    escribirTexto(room.description); //mostramos su descripción
    escribirTexto(salidas); //mostramos las salidas
}

//la funcion para mover (cambiar la sala)
function move(direction) {
    let room = obtenerSalaActual();

    let nextRoomId = room[direction]; //propiedades del objeto room

    if (nextRoomId > 0) {
        defaultGameState.player.currentRoom = nextRoomId;
        
        defaultGameState.player.currentEnemy = null; //recargamos el enemigo
        limpiarTexto(); // limpiamos la textarea
        document.getElementById("enemy-info").innerHTML = "";
        document.querySelector(".monster").style.display = "none";        
        mostrarSala(); //mostramos la sala de nuevo
        intentarEnemigo(); //cargamos el enemigo, si existe
    } else {
        escribirTexto("\nNo puedes ir por ahí."); //si no hay salida aqu'i, informamos el usuario
    }
}

//intentamos generar un enemigo en la sala actual
function intentarEnemigo() {
    let room = obtenerSalaActual();

    if (room.monsterProb <= 0) {
        return; //si en la sala no pueden aparecer enemigos, salimos
    }

    let randomValue = Math.random(); //creamos un número aleatorio entre 0 y 1
    let enemies = defaultGameState.map.enemies;

    if (randomValue < 0.02) {
    let boss = enemies.find(function(enemy) {
        return enemy.isBoss === true;
    });

    defaultGameState.player.currentEnemy = { ...boss };
    mostrarEnemigo(boss);
    } else if (randomValue < room.monsterProb) {
    let normalEnemies = enemies.filter(function(enemy) {
        return enemy.isBoss === false;
    });

    let randomEnemy = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];

    defaultGameState.player.currentEnemy = { ...randomEnemy };
    mostrarEnemigo(randomEnemy);
    }

    if (defaultGameState.player.currentEnemy) {
        combatLoop(); 
    }
}

//mostramos todo de enemigo
function mostrarEnemigo(enemy) {
    let monsterImg = document.querySelector(".monster");
    monsterImg.src = "img/" + enemy.img;
    monsterImg.style.display = "block";

    escribirTexto("Ha aparecido un enemigo!");
    escribirTexto(enemy.name); //mostramos el nombre de enemigo
    escribirTexto(enemy.description); //mostramos la descripción del enmigo

    if (enemy.isBoss) {
        escribirTexto("Es el jefe final"); //si es un jefe, informamos
    }

}

// La funci'on para el combate
function combatLoop() {
    let player = defaultGameState.player;
    let enemy = player.currentEnemy;

    if (!enemy) return;

    function turno() {

        //La ataque de monstruo
        let damagMonster = enemy.strength + Math.floor(Math.random() * 10 + 1) - player.defense - player.bonusDefense;
        damagMonster = Math.max(0, damagMonster);

        player.health -= damagMonster;
        escribirTexto("El enemigo ataca y hace " + damagMonster + " daño");

        if (player.health <= 0) {
            escribirTexto("Has sido derrotado por el enemigo..."); //si el jugador muere, informamos
            resetPlayer();
            return;
        }

        //La ataque de heroe
        let damagHero = player.strength + player.bonusStrength + Math.floor(Math.random() * 10 + 1);
        damagHero = Math.max(0, damagHero);

        enemy.health -= damagHero;
        escribirTexto("Has atacado y has aplicado " + damagHero + " daño");

        if (enemy.health <= 0) {
            escribirTexto("Has derrotado al enemigo!");
            dropObjeto();
            player.currentEnemy = null;
            mostrarHeroe();
            document.getElementById("enemy-info").innerHTML = "";
            document.querySelector(".monster").style.display = "none";
            defaultGameState.player.currentEnemy = null;
            return;
        }

        mostrarHeroe();
        setTimeout(turno, 800);
    }

    setTimeout(turno, 800);
}

//funcion para el drop de objetos
function dropObjeto() {
    let player = defaultGameState.player;

    //40% de probabilidad de encontrar un objeto
    if (Math.random() <= 0.4) {
        let esEspada = Math.random() < 0.5;
        let bonus = Math.floor(Math.random() * 10) + 1;

        if (esEspada) {
            escribirTexto("Has encontrado una espada +" + bonus);

            //si el bonus del escudo es mejor que el actual, lo equipamos
            if (bonus > player.bonusStrength) {
                player.bonusStrength = bonus;
                escribirTexto("La equipas!");
            } else {
                escribirTexto("Es peor que la actual.");
            }
        } else {
            escribirTexto("Has encontrado un escudo +" + bonus);
            
            //si el bonus del escudo es mejor que el actual, lo equipamos
            if (bonus > player.bonusDefense) {
                player.bonusDefense = bonus;
                escribirTexto("Lo equipas!");
            } else {
                escribirTexto("Es peor que el actual.");
            }
        }
    }
}

//funcion para comprar pociones
function comprarPocion() {
    let player = defaultGameState.player;
    let room = obtenerSalaActual();

    if (room.id !== 3) {
        escribirTexto("No estás en la tienda.");
        return;
    }

    //Restamos oro, sumamos pociones y mostramos el resultado
    if (player.gold >= 5) {
        player.gold -= 5;
        player.potions += 1;
        escribirTexto("Has comprado una poción.");
    } else {
        escribirTexto("No tienes suficiente oro.");
    }

    mostrarHeroe();
}

//funcion para usar poci'on
function usarPocion() {
    let player = defaultGameState.player;

    //Restamos pociones, sumamos vida y mostramos el resultado
    if (player.potions > 0) {
        player.potions--;
        player.health += 10;
        escribirTexto("Has usado una poción (+10 vida)");
    } else {
        escribirTexto("No tienes pociones.");
    }

    mostrarHeroe();
}

//la funcion lanza una vez el sitio web esté cargado
document.addEventListener("DOMContentLoaded", function() {
    mostrarHeroe(); //cargamos los datos iniciales del jugador
    mostrarSala(); //cargamos la sala inicial

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

    document.getElementById("boton2").addEventListener("click", function () {
        comprarPocion();
    });

    document.getElementById("boton3").addEventListener("click", function () {
        usarPocion();
    });
});