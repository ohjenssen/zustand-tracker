// Her lager vi et falskt API endepunkt i form av en GET-forespørsel
import { NextResponse } from "next/server";
import foodData from "../../../data/foodData.json";

export async function GET(request, { params }) {
  const { id } = await params; 

  const food = foodData.find((f) => f.id === id);

  if (!food) {
    return NextResponse.json({ error: "Matvare ikke funnet" }, { status: 404 });
  }

  return NextResponse.json(food);
}

