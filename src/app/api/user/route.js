// Her lager vi et falskt API endepunkt i form av en GET-forespørsel
import { NextResponse } from "next/server";
import user from "../../data/user.json"

export async function GET(request, { params }) {
  
  return NextResponse.json(user);
}

// Det nye PUT-endepunktet for oppdatering
export async function PUT(request) {
  try {
    // 1. Vi må hente ut og "awajte" JSON-dataene som ble sendt i request-bodyen fra Zustand
    const updatedData = await request.json();
    
    // 2. Her simulerer vi en database-oppdatering.
    // I en ekte produksjonsapp ville du gjort: await db.user.update({ data: updatedData })
    console.log("Mock API mottok oppdaterte data fra Zustand:", updatedData);

    // 3. Send tilbake en suksess-respons med de oppdaterte dataene
    return NextResponse.json({ 
      message: "Bruker oppdatert i databasen (simulert)", 
      success: true,
      updatedUser: updatedData 
    }, { status: 200 });

  } catch (error) {
    // Feilhåndtering hvis noe går galt med lesingen av bodyen
    return NextResponse.json({ 
      error: "Kunne ikke behandle forespørselen" 
    }, { status: 400 });
  }
}