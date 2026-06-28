<?php


$notes = [12, 20, 17, 13, 11, 8, 15, 12];

$total = function (array $notes):mixed {
    $resultat = 0;
    foreach ($notes as $note) {
        $resultat += $note;
    }
    return $resultat / count($notes);
};

echo ($total($notes));

