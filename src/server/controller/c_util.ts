export type info_request = {
  id: number;
  session: string;
};

export function getSession(body: string) {
  try {
    const obj: { session?: string } = JSON.parse(body);
    if (obj.session !== undefined && typeof obj.session === "string") {
      return obj.session;
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }
}
