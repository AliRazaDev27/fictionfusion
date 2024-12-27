export async function GET(request) {
  return new Response(new Date().toString());
}