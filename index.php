<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Whiteboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="toolbar">
        <button id="clear">Clear</button>
        <label for="color">Color:</label>
        <input type="color" id="color" value="#000000">
        <label for="size">Brush Size:</label>
        <input type="range" id="size" min="1" max="10" value="5">
        <button id="save">Save</button> <!-- Save button added -->
        <button id="load">Load</button> <!-- Load button added -->
    </div>
    <canvas id="whiteboard"></canvas>
    <script src="app.js"></script>
</body>
</html>
