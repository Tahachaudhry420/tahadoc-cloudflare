// functions/api/doctors.js
// Fetches doctors from the D1 database.
// Supports optional query params: ?city=Lahore&specialty=Dentist

export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const city = url.searchParams.get("city") || "";
    const specialty = url.searchParams.get("specialty") || "";

    let query = "SELECT * FROM doctors WHERE 1=1";
    const params = [];

    if (city) {
      query += " AND LOWER(city) LIKE LOWER(?)";
      params.push(`%${city}%`);
    }

    if (specialty) {
      query += " AND LOWER(specialty) LIKE LOWER(?)";
      params.push(`%${specialty}%`);
    }

    query += " ORDER BY name ASC LIMIT 50";

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(
      JSON.stringify({
        count: result.results.length,
        doctors: result.results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Could not fetch doctors. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
