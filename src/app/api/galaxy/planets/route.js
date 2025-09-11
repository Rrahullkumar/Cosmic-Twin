// src/app/api/galaxy/planets/route.js  
export async function GET() {
  try {
    const { planetsData } = await import('@/data/planets');
    return Response.json(planetsData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
