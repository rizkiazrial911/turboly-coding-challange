<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::where('user_id', Auth::id());

        // Fitur Sorting
        $sortBy = $request->get('sort_by', 'due_date'); // default sort
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (in_array($sortBy, ['due_date', 'description', 'priority'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tasks = $query->get();

        // Fitur Alert: Cek apakah ada task yang jatuh tempo HARI INI
        $hasDueToday = Task::where('user_id', Auth::id())
            ->whereDate('due_date', Carbon::today())
            ->where('is_completed', false)
            ->exists();

        return response()->json([
            'tasks' => $tasks,
            'alert_due_today' => $hasDueToday
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'due_date' => 'required|date',
            'priority' => 'required|in:low,medium,high',
        ]);

        $task = Auth::user()->tasks()->create($validated);

        return response()->json($task, 201);
    }

    public function toggleComplete(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update(['is_completed' => !$task->is_completed]);
        return response()->json($task);
    }
}