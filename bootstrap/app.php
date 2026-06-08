<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. هادي هي اللي كتحل مشكل الـ Credentials والـ Cookies مع React
        $middleware->statefulApi();

        // 2. هادي اختيارية ولكن كتنفع باش ما يبرزطكش CSRF فـ الـ API ديالك
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'login',
            'logout'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();