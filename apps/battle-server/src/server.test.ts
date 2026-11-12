import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { WS_CLOSE_UNAUTHORIZED } from "@pokeweb/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import WebSocket from "ws";
import { createBattleServer } from "./server";

const ALLOWED_ORIGIN = "https://pokeweb.test";

let server: Server;
let port: number;

beforeEach(async () => {
  server = createBattleServer({
    verify: async (token) => (token === "good" ? { userId: "user-1" } : null),
    allowedOrigins: [ALLOWED_ORIGIN],
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  port = (server.address() as AddressInfo).port;
});

afterEach(async () => {
  await new Promise<void>((resolve) => {
    server.closeAllConnections();
    server.close(() => resolve());
  });
});

function connect(path: string, origin: string | undefined = ALLOWED_ORIGIN): WebSocket {
  return new WebSocket(`ws://127.0.0.1:${port}${path}`, origin ? { origin } : {});
}

function closeCode(socket: WebSocket): Promise<number> {
  return new Promise((resolve, reject) => {
    socket.once("close", (code) => resolve(code));
    socket.once("error", reject);
  });
}

function nextMessage(socket: WebSocket): Promise<unknown> {
  return new Promise((resolve, reject) => {
    socket.once("message", (data) => resolve(JSON.parse(String(data))));
    socket.once("error", reject);
  });
}

function opened(socket: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.once("open", () => resolve());
    socket.once("error", reject);
  });
}

describe("GET /health", () => {
  it("responds 200 with status ok", async () => {
    const response = await fetch(`http://127.0.0.1:${port}/health`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });

  it("responds 404 for other paths", async () => {
    const response = await fetch(`http://127.0.0.1:${port}/nope`);

    expect(response.status).toBe(404);
  });
});

describe("WebSocket /ws", () => {
  it("closes with 4401 when no token is sent", async () => {
    await expect(closeCode(connect("/ws"))).resolves.toBe(WS_CLOSE_UNAUTHORIZED);
  });

  it("closes with 4401 when the token is rejected", async () => {
    await expect(closeCode(connect("/ws?token=bad"))).resolves.toBe(WS_CLOSE_UNAUTHORIZED);
  });

  it("answers ping with pong for an authenticated client", async () => {
    const socket = connect("/ws?token=good");
    await opened(socket);

    socket.send(JSON.stringify({ type: "ping" }));

    await expect(nextMessage(socket)).resolves.toEqual({ type: "pong" });
    socket.close();
  });

  it("reports bad_message for invalid JSON and keeps the connection open", async () => {
    const socket = connect("/ws?token=good");
    await opened(socket);

    socket.send("{not json");
    await expect(nextMessage(socket)).resolves.toEqual({ type: "error", code: "bad_message" });

    socket.send(JSON.stringify({ type: "ping" }));
    await expect(nextMessage(socket)).resolves.toEqual({ type: "pong" });
    socket.close();
  });

  it("reports bad_message for an unknown message type", async () => {
    const socket = connect("/ws?token=good");
    await opened(socket);

    socket.send(JSON.stringify({ type: "launch-missiles" }));

    await expect(nextMessage(socket)).resolves.toEqual({ type: "error", code: "bad_message" });
    socket.close();
  });

  it("refuses the upgrade from an origin that is not allowed", async () => {
    const socket = connect("/ws?token=good", "https://evil.example");

    await expect(opened(socket)).rejects.toThrow(/403/);
  });

  it("refuses the upgrade on a path other than /ws", async () => {
    const socket = connect("/other?token=good");

    await expect(opened(socket)).rejects.toThrow(/404/);
  });
});
