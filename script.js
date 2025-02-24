<script>
    window.onload = function() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const startBtn = document.getElementById("startBtn");
        const pauseBtn = document.getElementById("pauseBtn");
        const resumeBtn = document.getElementById("resumeBtn");
        const stopBtn = document.getElementById("stopBtn");

        const upBtn = document.getElementById("upBtn");
        const leftBtn = document.getElementById("leftBtn");
        const downBtn = document.getElementById("downBtn");
        const rightBtn = document.getElementById("rightBtn");

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const box = 20;
        const canvasSize = 600;
        let snake, direction, food, score, game;
        let isPaused = false;

        function initGame() {
            snake = [{ x: 9 * box, y: 10 * box }];
            direction = "RIGHT";
            food = generateFood();
            score = 0;
            clearInterval(game);
            game = setInterval(draw, 100);
        }

        function directionHandler(event) {
            const key = event.key.toLowerCase();
            if (key === "a" && direction !== "RIGHT") direction = "LEFT";
            else if (key === "w" && direction !== "DOWN") direction = "UP";
            else if (key === "d" && direction !== "LEFT") direction = "RIGHT";
            else if (key === "s" && direction !== "UP") direction = "DOWN";
        }

        document.addEventListener("keydown", directionHandler);

        upBtn.addEventListener("click", () => {
            if (direction !== "DOWN") direction = "UP";
        });
        leftBtn.addEventListener("click", () => {
            if (direction !== "RIGHT") direction = "LEFT";
        });
        downBtn.addEventListener("click", () => {
            if (direction !== "UP") direction = "DOWN";
        });
        rightBtn.addEventListener("click", () => {
            if (direction !== "LEFT") direction = "RIGHT";
        });

        canvas.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
        });

        canvas.addEventListener("touchend", () => {
            let diffX = touchEndX - touchStartX;
            let diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
                else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
            } else {
                if (diffY > 0 && direction !== "UP") direction = "DOWN";
                else if (diffY < 0 && direction !== "DOWN") direction = "UP";
            }
        });

        function generateFood() {
            return {
                x: Math.floor(Math.random() * (canvasSize / box)) * box,
                y: Math.floor(Math.random() * (canvasSize / box)) * box
            };
        }

        function draw() {
            if (isPaused) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffc0cb";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#ff69b4" : "#ffb6c1";
                ctx.fillRect(segment.x, segment.y, box, box);
                ctx.strokeStyle = "#fff";
                ctx.strokeRect(segment.x, segment.y, box, box);
            });

            ctx.fillStyle = "#ff1493";
            ctx.beginPath();
            ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();

            let headX = snake[0].x;
            let headY = snake[0].y;

            if (direction === "LEFT") headX -= box;
            if (direction === "UP") headY -= box;
            if (direction === "RIGHT") headX += box;
            if (direction === "DOWN") headY += box;

            if (headX === food.x && headY === food.y) {
                score++;
                food = generateFood();
            } else {
                snake.pop();
            }

            const newHead = { x: headX, y: headY };

            if (
                headX < 0 || headY < 0 ||
                headX >= canvasSize || headY >= canvasSize ||
                snake.some(segment => segment.x === headX && segment.y === headY)
            ) {
                clearInterval(game);
                alert("Game Over! Your final score: " + score);
            }

            snake.unshift(newHead);

            ctx.fillStyle = "#ff69b4";
            ctx.font = "20px 'Comic Sans MS'";
            ctx.fillText("Score: " + score, 10, 590);
        }

        startBtn.addEventListener("click", () => {
            initGame();
            isPaused = false;
        });

        pauseBtn.addEventListener("click", () => {
            isPaused = true;
        });

        resumeBtn.addEventListener("click", () => {
            isPaused = false;
        });

        stopBtn.addEventListener("click", () => {
            clearInterval(game);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffc0cb";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ff69b4";
            ctx.font = "30px 'Comic Sans MS'";
            ctx.fillText("Game Stopped", 200, 300);
        });
    };
</script>
