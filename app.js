window.addEventListener('load', () => {
    const canvas = document.getElementById('whiteboard');
    const context = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;

    let drawing = false;
    let color = document.getElementById('color').value;
    let size = document.getElementById('size').value;

    // Initialize WebSocket connection
    const ws = new WebSocket('ws://localhost:8080');

    function startPosition(e) {
        drawing = true;
        draw(e);
    }

    function endPosition() {
        drawing = false;
        context.beginPath();
    }

    function draw(e) {
        if (!drawing) return;

        const x = e.clientX;
        const y = e.clientY;

        context.lineWidth = size;
        context.lineCap = 'round';
        context.strokeStyle = color;

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);

        // Send drawing data to the server
        ws.send(JSON.stringify({
            x,
            y,
            color,
            size,
            type: 'draw'
        }));
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // Handle color and size changes
    document.getElementById('color').addEventListener('change', (e) => color = e.target.value);
    document.getElementById('size').addEventListener('change', (e) => size = e.target.value);

    // Clear the canvas
    document.getElementById('clear').addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        ws.send(JSON.stringify({ type: 'clear' }));
    });

    // Handle save button click
    document.getElementById('save').addEventListener('click', () => {
        const image = canvas.toDataURL();
        fetch('save.php', {
            method: 'POST',
            body: JSON.stringify({ image })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });

    // Handle load button click
    document.getElementById('load').addEventListener('click', () => {
        fetch('load.php')
        .then(response => response.json())
        .then(data => {
            const image = new Image();
            image.src = data.image;
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
        })
        .catch(error => console.error('Error:', error));
    });

    // Handle incoming messages from the WebSocket server
    ws.onmessage = function(event) {
        if (event.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function() {
                const data = JSON.parse(reader.result);

                if (data.type === 'draw') {
                    context.lineWidth = data.size;
                    context.lineCap = 'round';
                    context.strokeStyle = data.color;

                    context.lineTo(data.x, data.y);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(data.x, data.y);
                } else if (data.type === 'clear') {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
            };
            reader.readAsText(event.data);
        } else {
            const data = JSON.parse(event.data);

            if (data.type === 'draw') {
                context.lineWidth = data.size;
                context.lineCap = 'round';
                context.strokeStyle = data.color;

                context.lineTo(data.x, data.y);
                context.stroke();
                context.beginPath();
                context.moveTo(data.x, data.y);
            } else if (data.type === 'clear') {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };
});