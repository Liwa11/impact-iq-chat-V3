export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req) {
    const { role, content, user_id } = await req.json();
  
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
  
    const res = await fetch(`${url}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify([{ role, content, user_id }]),
    });
  
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  