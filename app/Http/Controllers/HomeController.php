<?php

namespace App\Http\Controllers;

use Jenssegers\Agent\Agent;

class HomeController extends Controller
{
    public function index()
    {
        $agent = new Agent();
        
        // Memenuhi syarat "Adaptive Design": pisahkan state device dari backend
        $deviceType = 'desktop';
        if ($agent->isMobile()) {
            $deviceType = 'smartphone';
        } elseif ($agent->isTablet()) {
            $deviceType = 'tablet';
        }

        return view('app', compact('deviceType'));
    }
}