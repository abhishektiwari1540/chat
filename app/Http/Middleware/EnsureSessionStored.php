<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Stevebauman\Location\Facades\Location;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;


class EnsureSessionStored
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Start session if not already started
        if (!Session::has('session_id')) {
            Session::put('session_id', session()->getId());
        }

        $session_id = Session::getId();
        $user_ip = $request->ip();

        // Get user location details
        $user_location = Location::get($user_ip);
        $user_country = $user_location ? $user_location->countryName : 'Unknown';


        // Store session info in the database
        DB::table('users')->updateOrInsert(
            ['session_id' => $session_id], // Check if session_id exists

            [
                'name' => 'Guest', // Default name for unidentified users
                'user_ip' => $user_ip,
                'user_countery' => $user_country,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        return $next($request);
    }
}
