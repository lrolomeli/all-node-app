function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function playBtnSound(key) {

    var path = "./sounds/";
    //if(correct)
        path += "btn"+key+".mp3";
    //else
        // path += "wrong.mp3"
    // console.log(path);
    var audio = new Audio(path);
    audio.play();
}

function animateElem(key){	
    var id = "#b"+key;
    $(id).animate({opacity:0.4}, 200);
	$(id).animate({opacity:1}, 200);
}

function playlist() {
    playing = true;
    
    // console.log(buttonlist);
    console.log("----------------------------------------------------------------");
    arrayrep = [0,0,0,0];
    lastd = [0,0,0,0];
    buttonlist.forEach((e, index) => { 
        var time;
        var shift;
        var total;
        const anim_delay = 200;
        const period = 250;

        if( index > 0 && e === buttonlist[index-1] ) {
            time = period;
            shift = 0;
            total = time + shift
        }
        else {
            time = (index * period) + period;
            shift = (index - arrayrep[e-1]) * anim_delay;
            if( arrayrep[e-1] > 0 ) total = (time+shift) - lastd[e-1];
            else total = (time+shift);
        }
        lastd[e-1] += total;
        console.log("Btn: "+e+" Counter: "+index+" Rep: "+arrayrep[e-1]+" Time: "+total);

        arrayrep[e-1]++;

        $("#b"+e).delay(total)
            .animate({opacity:0}, 100)
            .animate({opacity:1}, 100);
    });

    playing = false;
}

function playgame(elem) {
    // ya inicio el juego
    if(gamestart) {
        // la secuencia se esta reproduciendo
        if(playing){
            // no aceptes botonazos
        }
        // la reproduccion ha terminado
        else {
            // compara el boton presionado con el elemento de la lista actual
            if(elem == buttonlist[i]) {
                // incrementa el contador.
                i++;
                // el contador es mayor al numero de elementos en la lista
                if(i==buttonlist.length) {
                    // agrega otro elemento aleatorio a la lista
                    buttonlist.push(getRandomIntInclusive(1, 4));
                    // reinicia el contador a cero.
                    i = 0;
                    // reproduce la lista.
                    playlist();
                }
            }
            // el elemento no coincide
            else {
                // reinicia el contador
                i = 0;
                // elimina lista
                buttonlist = []
                // indica que ha perdido el juego
                gameover = true;
            }
        }
    }
    // no ha iniciado
    else {
        // inicia el juego
        gamestart = true;
        // reproduce animacion de inicio de juego

        // obten un aleatorio y agregalo en la lista
        buttonlist.push(getRandomIntInclusive(1, 4));
        // reproduce la lista.
        playlist();
    }
    
}

function btnPressed(elem) {
    // animateElem(elem);
    playBtnSound(elem);
    playgame(elem);
}

function btnClick() {
    btnPressed($(this).text());
}

function btnKey(e) {
    if(e.key > '0' && e.key < '5')
        btnPressed(e.key);
}

var gamestart = false;
var gameover = false;
var playing;
var counter = 0;
var i = 0;
var buttonlist = [];
var arrayrep = [0, 0, 0, 0];
var lastd = [0, 0, 0, 0];

$(".btn").on("click", btnClick);
$("body").on("keydown", btnKey);