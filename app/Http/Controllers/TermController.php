<?php

namespace App\Http\Controllers;

use App\Models\Term;
use App\Http\Requests\StoreTermRequest;
use App\Http\Requests\UpdateTermRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5;
        $search = $request->query('search', '');

        $terms = Term::where('name', 'LIKE', "%$search%")->paginate($perPage);

        return Inertia::render('application/term', [
            'terms' => [
                'data' => $terms->items(),
                'last_page' => $terms->lastPage(),
                'current_page' => $terms->currentPage(),
                'total' => $terms->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTermRequest $request)
    {
        Term::create($request->validated());
        return Inertia::render('application/term');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $term = Term::findOrFail($id);
        return Inertia::render('application/term', [
            'term' => $term
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTermRequest $request, int $id)
    {
        $t = Term::find($id);
        $t->name = $request->name;
        $t->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $term = Term::findOrFail($id);
        $term->delete();
    }
}
