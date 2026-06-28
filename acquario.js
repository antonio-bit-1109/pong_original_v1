document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const canvasContext = canvas.getContext("2d");

    // Variabili di stato (esempio per vedere qualcosa muoversi)
    let xPos = 0;
    let yPos = 0;
    let choosenBallColor = null
    let VEL_X = 2;
    let VEL_Y = 2;

    const centerX = canvas.width / 2;
    const centerY  = canvas.height / 2;
    const ONE_BLOCK_SIZE = 50;
    const BALL_SIZE = 30;
    const BALL_COLORS = ["cyan" , "white" , "red" , "yellow" , "green"]


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
    let righe = m.length * ONE_BLOCK_SIZE;
    let colonne = m[0].length * ONE_BLOCK_SIZE;


    let createRect = (x, y, width, height, color) => {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    };

    // Il Loop Principale
    let mainLoop = () => {
        // console.log("VELX:" + VEL_X)
        // console.log("VELY:" + VEL_Y)
        console.log(choosenBallColor)

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

        createRect(xPos , yPos , BALL_SIZE, BALL_SIZE, color !== null ? color : choosenBallColor);
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
        drawBall(null);
        //drawWalls();

    };

    let update = () => {
        moveBall();
        //resetBallToStart();
        bounce();
    };

    let moveBall = () => {
        xPos += VEL_X;
        yPos += VEL_Y;
    }

    // gestione assi separatamente
    let bounce = () => {
        // 1. GESTIONE ASSE X (Rimbalzo sui bordi laterali)

        // Toccato il bordo sinistro? Inverti VEL_X facendola diventare positiva
        if (xPos <= 0) {
            VEL_X = Math.abs(VEL_X);

        }
            // Toccato il bordo destro? (considerando la dimensione della palla)
        // Inverti VEL_X facendola diventare negativa
        else if (xPos + BALL_SIZE >= canvas.width) {
            VEL_X = -Math.abs(VEL_X);

        }

        // 2. GESTIONE ASSE Y (Rimbalzo sul bordo superiore e inferiore)

        // Toccato il bordo superiore (y = 0)? Inverti VEL_Y facendola diventare positiva
        if (yPos <= 0) {
            VEL_Y = Math.abs(VEL_Y);

        }
            // Toccato il bordo inferiore? (considerando la dimensione della palla)
        // Inverti VEL_Y facendola diventare negativa
        else if (yPos + BALL_SIZE >= canvas.height) {
            VEL_Y = -Math.abs(VEL_Y);

        }
    }



    // Fai partire il loop per la prima volta
    requestAnimationFrame(mainLoop);
});