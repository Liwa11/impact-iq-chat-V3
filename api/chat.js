export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { messages } = await req.json();
  const message = messages[messages.length - 1]?.content || "";
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
