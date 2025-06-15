<?php

namespace App\Http\Controllers;

use App\Models\Term;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $perPage = 5;

        $query = Term::query()->orderBy('created_at', 'desc');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $terms = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/term', [
            'terms' => $terms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:terms,name',
        ]);

        Term::create($validated);

        return redirect()->route('term')->with('success', 'Term created successfully.');
    }

    public function update(Request $request, Term $term)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:terms,name,'.$term->id,
        ]);

        $term->update($validated);

        return redirect()->route('term')->with('success', 'Term updated successfully.');
    }

    public function destroy(Term $term)
    {
        $term->delete();

        return redirect()->route('term')->with('success', 'Term deleted successfully.');
    }
}