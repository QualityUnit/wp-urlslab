<?php

namespace Urlslab_Vendor;

// Don't redefine the functions if included multiple times.
if (!\function_exists('Urlslab_Vendor\\GuzzleHttp\\Promise\\promise_for')) {
    require __DIR__ . '/functions.php';
}
