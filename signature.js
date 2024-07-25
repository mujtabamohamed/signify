document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signatureCanvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let points = [];

    const lineWidthInput = document.getElementById("lineWidth");
    const colorInput = document.getElementById("color");

    // Set initial stroke settings
    ctx.lineWidth = lineWidthInput.value;
    ctx.strokeStyle = colorInput.value;
    ctx.lineJoin = 'round';  // Makes the corners smoother
    ctx.lineCap = 'round';   // Makes the line ends smoother

    // Resize the canvas to fill its parent container
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        redraw();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Update line width and color based on user input
    lineWidthInput.addEventListener("input", () => {
        ctx.lineWidth = lineWidthInput.value;
    });

    colorInput.addEventListener("input", () => {
        ctx.strokeStyle = colorInput.value;
    });

    // Helper function to get the mouse or touch position
    function getPos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        if (evt.touches) {
            return {
                x: evt.touches[0].clientX - rect.left,
                y: evt.touches[0].clientY - rect.top
            };
        }
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    // Function to draw a smooth line
    function drawSmoothLine() {
        ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i].end) {
                ctx.moveTo(points[i + 1].x, points[i + 1].y);
            } else {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
        }
        ctx.stroke();
    }

    // Function to redraw the entire drawing
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length > 0) {
            drawSmoothLine();
        }
    }

    // Event listeners for mouse events
    canvas.addEventListener("mousedown", (evt) => {
        drawing = true;
        const pos = getPos(canvas, evt);
        points.push({ x: pos.x, y: pos.y, end: false });
    });

    canvas.addEventListener("mousemove", (evt) => {
        if (drawing) {
            const pos = getPos(canvas, evt);
            points.push({ x: pos.x, y: pos.y, end: false });
            redraw();
        }
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        points.push({ ...points[points.length - 1], end: true });
    });

    canvas.addEventListener("mouseleave", () => {
        drawing = false;
    });

    // Event listeners for touch events
    canvas.addEventListener("touchstart", (evt) => {
        evt.preventDefault(); // Prevent scrolling
        drawing = true;
        const pos = getPos(canvas, evt);
        points.push({ x: pos.x, y: pos.y, end: false });
    });

    canvas.addEventListener("touchmove", (evt) => {
        evt.preventDefault(); // Prevent scrolling
        if (drawing) {
            const pos = getPos(canvas, evt);
            points.push({ x: pos.x, y: pos.y, end: false });
            redraw();
        }
    });

    canvas.addEventListener("touchend", (evt) => {
        evt.preventDefault(); // Prevent scrolling
        drawing = false;
        points.push({ ...points[points.length - 1], end: true });
    });

    canvas.addEventListener("touchcancel", () => {
        drawing = false;
    });

    // Clear the canvas
    document.getElementById("clearButton").addEventListener("click", () => {
        points = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save the canvas as an image
    document.getElementById("saveButton").addEventListener("click", () => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "signature.png";
        link.click();
    });
});
