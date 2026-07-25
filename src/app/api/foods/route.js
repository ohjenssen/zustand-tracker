import { NextResponse } from 'next/server';
import food from "../../data/foodData.json";

export async function GET(request, { params }) {
  return NextResponse.json(food);
}

