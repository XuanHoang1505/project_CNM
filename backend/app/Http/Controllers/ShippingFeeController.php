<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShippingFee\ShippingFeeRequest;
use App\Models\ShippingFee;
use Illuminate\Http\Request;

class ShippingFeeController extends Controller
{
    // GET /api/shipping-fees
    // supports ?province_code=&ward_code=&q=&page=&per_page=
    public function index(Request $request)
    {
        $query = ShippingFee::query();

        if ($request->filled('province_code')) {
            $query->where('province_code', $request->province_code);
        }

        if ($request->filled('ward_code')) {
            $query->where('ward_code', $request->ward_code);
        }

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($qbc) use ($q) {
                $qbc->where('province_name', 'like', "%{$q}%")
                    ->orWhere('ward_name', 'like', "%{$q}%");
            });
        }

        // pagination optional
        $perPage = (int) $request->get('per_page', 20);
        $data = $query->orderBy('province_name')->paginate($perPage);

        return response()->json($data);
    }

    // POST /api/shipping-fees
    public function store(ShippingFeeRequest $request)
    {
        $payload = $request->validated();

        // nếu muốn tránh duplicate theo province+ward, check trước
        $existing = ShippingFee::where('province_code', $payload['province_code'])
            ->when(!empty($payload['ward_code']), function($q) use ($payload) {
                $q->where('ward_code', $payload['ward_code']);
            })
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Shipping fee already exists for this province/ward',
                'data' => $existing
            ], 409);
        }

        $fee = ShippingFee::create($payload);

        return response()->json([
            'message' => 'Created',
            'data' => $fee
        ], 201);
    }

    // GET /api/shipping-fees/{id}
    public function show($id)
    {
        $fee = ShippingFee::find($id);
        if (!$fee) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($fee);
    }

    // PUT /api/shipping-fees/{id}
    public function update(ShippingFeeRequest $request, $id)
    {
        $fee = ShippingFee::find($id);
        if (!$fee) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $fee->update($request->validated());

        return response()->json([
            'message' => 'Updated',
            'data' => $fee
        ]);
    }

    // DELETE /api/shipping-fees/{id}
    public function destroy($id)
    {
        $fee = ShippingFee::find($id);
        if (!$fee) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $fee->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // Helper: get fee by province/ward for checkout
    // GET /api/shipping-fees/lookup?province_code=xxx&ward_code=yyy
    public function lookup(Request $request)
    {
        $province = $request->province_code;
        $ward = $request->ward_code;

        if (!$province) {
            return response()->json(['message' => 'province_code is required'], 400);
        }

        // ưu tiên exact ward match, fallback to province only
        $query = ShippingFee::where('province_code', $province);

        if ($ward) {
            $byWard = (clone $query)->where('ward_code', $ward)->first();
            if ($byWard) {
                return response()->json(['data' => $byWard]);
            }
        }

        $byProvince = $query->whereNull('ward_code')->first()
            ?? $query->orderBy('fee')->first();

        if (!$byProvince) {
            return response()->json(['message' => 'No shipping fee found'], 404);
        }

        return response()->json(['data' => $byProvince]);
    }

    public function getAll()
    {
        $data = ShippingFee::orderBy('province_name')->get();

        return response()->json([
            'message' => 'OK',
            'data' => $data
        ]);
    }

}
