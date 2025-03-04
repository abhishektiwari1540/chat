<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class HomepagesController extends Controller
{
    public function Index(Request $request){
        return Inertia::render('Layouts/Layout');
    }
}
