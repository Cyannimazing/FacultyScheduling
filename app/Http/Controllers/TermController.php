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

        $terms = Term::query()
            ->when($search && trim($search) !== '', function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($perPage)
            ->withQueryString();

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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Terms/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTermRequest $request)
    {
        $term = Term::create($request->validated());
        return response()->json($term, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Term $term)
    {
        return Inertia::render('Terms/Show', [
            'term' => $term
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Term $term)
    {
        return Inertia::render('Terms/Edit', [
            'term' => $term
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTermRequest $request, Term $term)
    {
        $term->update($request->validated());
        return response()->json($term);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Term $term)
    {
        $term->delete();
        return response()->json(null, 204);
    }
}