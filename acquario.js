document.addEventListener("DOMContentLoaded", () => {

    const mioAudio = new Audio('/assets/audio/Caparezza_abiura_di_me.mp3');

    mioAudio.addEventListener('canplaythrough', () => {
        console.log("Audio caricato. pronto a partire non appena un giocatore interagisce con il browser.")
    });

    let isAudioStartedOnce = false;

    let ballImageReady = false;
    let ballImage = new Image();
    ballImage.src = "/assets/capa_head_no_bg.png";

    ballImage.onload = function() {

        ballImageReady = true;
    };

    const canvas = document.getElementById("canvas");
    let pointLeftStickHTML = document.getElementById("pointLfStick");
    let pointRightStickHTML = document.getElementById("pointRxStick");
    let scoreLeft = 0;
    let scoreRight = 0;
    const canvasContext = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY  = canvas.height / 2;
    const ONE_BLOCK_SIZE = 50;
    const BALL_SIZE = 45;
    const BALL_COLORS = ["cyan" , "white" , "red" , "yellow" , "green"]
    const STICK_WIDTH = 10;
    const STICK_HEIGHT = 100;
    const KEY_STATES = {};
    KEY_STATES.S = 0;
    KEY_STATES.W = 0;
    KEY_STATES.UP = 0;
    KEY_STATES.DOWN = 0;


    // Variabili di stato (esempio per vedere qualcosa muoversi)
    let xPosBall = 0;
    let yPosBall = 0;
    let VEL_X_BALL = 6;
    let VEL_Y_BALL = 6;
    let VEL_Y_STICK = 8;
    let choosenBallColor = null;

    // posizione stick left iniziale
    let leftStick_xPos = 10;
    let leftStick_yPos = centerY;

    // posizione stick right iniziale
    let rightStick_xPos = 780;
    let rightStick_yPos = centerY;

    // copia della posizione iniziale delle y dello stick Dx e Sn


    let getRandomColor = () => {
        let i = Math.floor(Math.random()* BALL_COLORS.length)
        return BALL_COLORS[i]
    }

    const m = [
        [0,0,0,0,0,0,0,0,0] ,
        [0,0,0,0,0,1,0,0,0] ,
        [0,0,0,0,0,1,0,0,0] ,
        [0,0,0,0,0,1,0,0,0] ,
        [0,0,0,0,0,0,0,0,0] ,
        [1,1,1,1,1,1,0,0,0] ,
        [0,0,0,0,0,0,0,0,0] ,
        [0,0,0,0,0,1,0,0,0] ,
        [0,0,0,0,0,1,0,0,0] ,

    ]

    let activateKey = (key) => {
      return key = 1;
    }
    let deactivateKey = (key) => {
       return key = 0;
    }

    window.addEventListener('keydown', (event) => {
       let key = event.code;
        console.log("tasto premuto tastiera -->" + key)
       // analisi tiipo di tasto premuto differenziando per tutti e quattro i tasti in modo da capire quale stick muovere
       switch (key){
           case  "KeyW"  : KEY_STATES.W = activateKey(KEY_STATES.W);
               break;
           case  "KeyS"  : KEY_STATES.S = activateKey(KEY_STATES.S);
               break;
           case "ArrowUp" : KEY_STATES.UP = activateKey(KEY_STATES.UP);
               break;
           case "ArrowDown" : KEY_STATES.DOWN = activateKey(KEY_STATES.DOWN);
       }
    });

    window.addEventListener('keyup', (event) => {
        let key = event.code;
        console.log("tasto rilasciato tastiera -->" + key)
        // analisi tiipo di tasto premuto differenziando per tutti e quattro i tasti in modo da capire quale stick muovere
        switch (key){
            case  "KeyW"  : KEY_STATES.W = deactivateKey(KEY_STATES.W)
                break;
            case  "KeyS"  : KEY_STATES.S = deactivateKey(KEY_STATES.S)
                break;
            case "ArrowUp" : KEY_STATES.UP = deactivateKey(KEY_STATES.UP)
                break;
            case "ArrowDown" : KEY_STATES.DOWN = deactivateKey(KEY_STATES.DOWN)
        }
    });



    let createRect = (x, y, width, height, color) => {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    };

    let drawImage = (source , x, y ,largh , alt) => {
        canvasContext.drawImage(source , x , y , largh , alt)
    }

    // Il Loop Principale
    let mainLoop = () => {
        console.log(KEY_STATES);
        update(); // Calcola le nuove posizioni
        draw();   // Disegna tutto
        hasPLayerInteractedWithBrowser();
        // Richiama ricorsivamente il loop per il prossimo frame
        requestAnimationFrame(mainLoop);
    };


    // controllo se uno degli stick è stato mosso cosi da far partire l audio
    let hasPLayerInteractedWithBrowser = () => {

        if (mioAudio.paused && isAudioStartedOnce) return;

        if ( (leftStick_yPos !== centerY || rightStick_yPos !== centerY) && !isAudioStartedOnce ){
            isAudioStartedOnce = true;
            mioAudio.play();
        }
    }

     // FUNZIONI PRINCIPALI

    let clearCanvas = () => {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }


    let drawBall = (color) => {
        if (color === null){
            choosenBallColor = "cyan"
        } else {
            choosenBallColor = color
        }

        if (ballImageReady){
            drawImage(ballImage ,xPosBall,yPosBall , BALL_SIZE , BALL_SIZE )
        }else {
            createRect(xPosBall , yPosBall , BALL_SIZE, BALL_SIZE, color !== null ? color : choosenBallColor);
        }
    }


    let drawWalls = () => {
        for (let i = 0; i< m.length; i++){
            for (let j = 0; j < m[0].length; j++){

                if (m[i][j] === 1){
                    createRect(
                        j * ONE_BLOCK_SIZE ,
                        i * ONE_BLOCK_SIZE ,
                        ONE_BLOCK_SIZE ,
                        ONE_BLOCK_SIZE ,
                        "white"
                    )
                }
            }
        }
    }

    // Funzione di disegno
    let draw = () => {
        clearCanvas();
        drawBall(choosenBallColor);
        drawSticks()
    };

    let drawSticks = () => {
        createRect(leftStick_xPos , leftStick_yPos , STICK_WIDTH , STICK_HEIGHT , "white")
        createRect(rightStick_xPos , rightStick_yPos , STICK_WIDTH , STICK_HEIGHT , "white")
    }

    let update = () => {
        moveBall();
        bounce();
        updateSticksPosition();
        showCurrentPoints()
    };

    // controllo valori prop oggetto che registra se tasto di spostamento stick è sttao premuto o no
    // e ridisegno sticks
    let updateSticksPosition = () => {
        // CHECK SUL  VALORE DELLE CHAIVI E SULLA posizione y dei stich che non oltrepassi i bordi della canvas
        if (KEY_STATES.W === 1 && (leftStick_yPos > 0 )){
            leftStick_yPos -= VEL_Y_STICK;
        }
        if (KEY_STATES.S === 1 && (leftStick_yPos + STICK_HEIGHT < canvas.height)){
            leftStick_yPos += VEL_Y_STICK;
        }
        if (KEY_STATES.UP === 1 && (rightStick_yPos > 0) ) {
            rightStick_yPos -= VEL_Y_STICK;
        }
        if (KEY_STATES.DOWN === 1 && (rightStick_yPos + STICK_HEIGHT < canvas.height ) ) {
            rightStick_yPos += VEL_Y_STICK;
        }
        drawSticks();
    }

    let moveBall = () => {
        xPosBall += VEL_X_BALL;
        yPosBall += VEL_Y_BALL;
    }


    let changeBallColor = () => {
        choosenBallColor = getRandomColor()
        drawBall(choosenBallColor);
        console.log(choosenBallColor)
    }


    let bounce = () => {
        // 1. GESTIONE ASSE X E COLLISIONI CON GLI STICK

        // --- COLLISIONE STICK SINISTRO ---
        // La palla tocca lo stick sinistro se:
        // - La sinistra della palla supera la destra dello stick
        // - La destra della palla è dopo la sinistra dello stick
        // - La Y della palla è all'interno dell'altezza dello stick
        if (xPosBall <= leftStick_xPos + STICK_WIDTH &&
            xPosBall + BALL_SIZE >= leftStick_xPos &&
            yPosBall + BALL_SIZE >= leftStick_yPos &&
            yPosBall <= leftStick_yPos + STICK_HEIGHT) {

            VEL_X_BALL = Math.abs(VEL_X_BALL); // Forza direzione verso destra
            changeBallColor();
        }

            // --- COLLISIONE STICK DESTRO ---
        // Stessa logica, ma per le coordinate dello stick destro
        else if (xPosBall + BALL_SIZE >= rightStick_xPos &&
            xPosBall <= rightStick_xPos + STICK_WIDTH &&
            yPosBall + BALL_SIZE >= rightStick_yPos &&
            yPosBall <= rightStick_yPos + STICK_HEIGHT) {

            VEL_X_BALL = -Math.abs(VEL_X_BALL); // Forza direzione verso sinistra
            changeBallColor();
        }

        // 2. GESTIONE ASSE Y (Rimbalzo sul bordo superiore e inferiore)
        // Toccato il bordo superiore?
        if (yPosBall <= 0) {
            VEL_Y_BALL = Math.abs(VEL_Y_BALL);
            changeBallColor();
        }
        // Toccato il bordo inferiore?
        else if (yPosBall + BALL_SIZE >= canvas.height) {
            VEL_Y_BALL = -Math.abs(VEL_Y_BALL);
            changeBallColor();
        }

        // se non si verifica nessuna di queste condizioni allora la palla ha superato gli stick e ha fatto gol in uno dei due campi
        if (xPosBall < 0){
            resetBall(centerX , centerY )
            addPoint(true)
        }
        else if (xPosBall > canvas.width){
            resetBall(centerX , centerY )
            addPoint(false)
        }

        console.log("x palla" + xPosBall)
        console.log("y palla" + yPosBall)
    }

    let resetBall = ( ) => {
        xPosBall = centerX;
        yPosBall = centerY;
        VEL_Y_BALL = - Math.abs(VEL_Y_BALL);
    }

    let addPoint = (hasBallSurpassedLeft) => {

        if (hasBallSurpassedLeft){
            scoreRight++
        } else {
            scoreLeft++
        }

    }

    let showCurrentPoints = () => {
        pointLeftStickHTML.innerText = `${scoreLeft}`
        pointRightStickHTML.innerText = `${scoreRight}`
    }
    // Fai partire il loop per la prima volta
    requestAnimationFrame(mainLoop);
});