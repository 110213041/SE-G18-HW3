import {
  STATUS_TEXT,
  StatusCode,
} from "https://deno.land/std@0.208.0/http/status.ts";

export function responseTemplateBase(payload: object, status: StatusCode) {
  return new Response(JSON.stringify(payload), {
    status: status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export function responseTemplate(
  payload: { type: string; content: object },
  status: StatusCode,
) {
  return responseTemplateBase(payload, status);
}

export function statusResponse(status: StatusCode) {
  return responseTemplate(
    {
      type: "status",
      content: {
        status: status,
        message: STATUS_TEXT[status],
      },
    },
    status,
  );
}

export function getFirstPath(pathname: string) {
  return pathname.split("/", 2).join("/");
}

export async function getRequestBody(req: Request) {
  const bodyReader = await req.body?.getReader().read();
  const decoder = new TextDecoder();
  return decoder.decode(bodyReader?.value);
}

export function isMethodJson(req: Request, method: "GET" | "POST"): boolean {
  return req.method === method ||
    req.headers.get("content-type") === "application/json";
}
