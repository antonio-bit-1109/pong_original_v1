document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const canvasContext = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY  = canvas.height / 2;
    const ONE_BLOCK_SIZE = 50;
    const BALL_SIZE = 15;
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
    let VEL_X_BALL = 2;
    let VEL_Y_BALL = 2;
    let VEL_Y_STICK = 5;
    let choosenBallColor = null;

    // posizione stick left iniziale
    let leftStick_xPos = 10;
    let leftStick_yPos = centerY;

    // posizione stick right iniziale
    let rightStick_xPos = 780;
    let rightStick_yPos = centerY;

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

    // Il Loop Principale
    let mainLoop = () => {
        console.log(KEY_STATES);
        update(); // Calcola le nuove posizioni
        draw();   // Disegna tutto
        // Richiama ricorsivamente il loop per il prossimo frame
        requestAnimationFrame(mainLoop);
    };


     // FUNZIONI PRINCIPALI

    let clearCanvas = () => {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    let drawSfondo = () => {
        createRect(0, 0, canvas.width, canvas.height, "black");
    }

    let drawBall = (color) => {
        if (color === null){
            choosenBallColor = "cyan"
        } else {
            choosenBallColor = color
        }

        createRect(xPosBall , yPosBall , BALL_SIZE, BALL_SIZE, color !== null ? color : choosenBallColor);
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
        drawSfondo();
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
        updateSticksPosition()
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


    // gestione assi separatamente
    let bounce = () => {
        // 1. GESTIONE ASSE X (Rimbalzo sui bordi laterali)

        // Toccato il bordo sinistro? Inverti VEL_X facendola diventare positiva
        if ((xPosBall - BALL_SIZE <= leftStick_xPos) && ( yPosBall - BALL_SIZE <= leftStick_yPos ) ) {
            VEL_X_BALL = Math.abs(VEL_X_BALL);
            changeBallColor();
        }
            // Toccato il bordo destro? (considerando la dimensione della palla)
        // Inverti VEL_X facendola diventare negativa
        else if (xPosBall + BALL_SIZE >= rightStick_xPos) {
            VEL_X_BALL = -Math.abs(VEL_X_BALL);
            changeBallColor();
        }

        // 2. GESTIONE ASSE Y (Rimbalzo sul bordo superiore e inferiore)

        // Toccato il bordo superiore (y = 0)? Inverti VEL_Y facendola diventare positiva
        if (yPosBall <= 0) {
            VEL_Y_BALL = Math.abs(VEL_Y_BALL);
            changeBallColor();
        }
            // Toccato il bordo inferiore? (considerando la dimensione della palla)
        // Inverti VEL_Y facendola diventare negativa
        else if (yPosBall + BALL_SIZE >= canvas.height) {
            VEL_Y_BALL = -Math.abs(VEL_Y_BALL);
            changeBallColor();
        }
    }



    // Fai partire il loop per la prima volta
    requestAnimationFrame(mainLoop);
});