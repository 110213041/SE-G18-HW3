export default async function apiController(req: Request): Promise<Response> {
  return await new Response("API entry", {
    status: 200,
    headers: {
      "content-type": "text/plain",
    },
  });
}
