<?php
if (file_exists('whiteboard.json')) {
    echo file_get_contents('whiteboard.json');
} else {
    echo '{}'; // Return an empty object if no saved data is found
}
?>
