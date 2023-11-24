// compile the frontend source can serve in dev server.

const watcher = Deno.watchFs("./src/client");

new Deno.Command(Deno.execPath(), {
  args: ["task", "build"],
}).spawn();

const notifiers = new Map<string, number>();

for await (const event of watcher) {
  if (
    event.kind === "create" || event.kind === "modify" ||
    event.kind === "remove"
  ) {
    const dataString = JSON.stringify(event);
    if (notifiers.has(dataString)) {
      clearTimeout(notifiers.get(dataString));
      notifiers.delete(dataString);
    }

    const command = new Deno.Command(Deno.execPath(), {
      args: ["task", "build"],
    });

    notifiers.set(
      dataString,
      setTimeout(() => {
        notifiers.delete(dataString);
        // console.log(event);
        command.spawn();
      }, 20),
    );
  }
}
