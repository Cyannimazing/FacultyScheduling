<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTermRequest;
use App\Http\Requests\UpdateTermRequest;
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

        $terms = Term::where('name' , 'LIKE', "%$search%")
                        ->orderBy('name')
                        ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('application/term', [
            'data' => [
                'terms' => $terms,
                ]
        ]);
    }

    public function store(StoreTermRequest $request)
    {
        $validated = $request->validated();

        Term::create($validated);

        return redirect()->route('term')->with('success', 'Term created successfully.');
    }

    public function update(UpdateTermRequest $request, int $id)
    {
        $term = Term::find($id);
        if($term){
            $term->update([
                'name' => $request->name
            ]);
        }
        return redirect()->route('term')->with('success', 'Term updated successfully.');
    }

    public function destroy(Term $term)
    {
        $term->delete();

        return redirect()->route('term')->with('success', 'Term deleted successfully.');
    }
}
