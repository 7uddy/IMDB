<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('film.{id}', function ($user, $id) {
    if (!$user) {
        return false;
    }
    return ['id' => $user->id, 'name' => $user->name];
});
