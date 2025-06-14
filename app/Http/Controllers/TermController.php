<?php

namespace App\Http\Controllers;

use App\Models\Term;
use App\Http\Requests\StoreTermRequest;
use App\Http\Requests\UpdateTermRequest;

class TermController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $terms = Term::all();
        return response()->json($terms);
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
        return response()->json($term);
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
