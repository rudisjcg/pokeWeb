import { createServer, type IncomingMessage, type Server } from "node:http";
import type { Duplex } from "node:stream";
import { WS_CLOSE_UNAUTHORIZED, type ClientMessage, type ServerMessage } from "@pokeweb/shared";
import { WebSocketServer, type WebSocket } from "ws";
import type { TokenVerifier } from "./auth";

export type BattleServerOptions = {
  verify: TokenVerifier;
  /** Browser origins allowed to open a WebSocket. Requests without an Origin header are not browsers and pass. */
  allowedOrigins: string[];
};

const MAX_MESSAGE_BYTES = 16 * 1024;

function parseClientMessage(raw: string): ClientMessage | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null && "type" in value && value.type === "ping") {
      return { type: "ping" };
    }
    return null;
  } catch {
    return null;
  }
}

function send(socket: WebSocket, message: ServerMessage): void {
  socket.send(JSON.stringify(message));
}

function refuse(socket: Duplex, status: 403 | 404): void {
  const reason = status === 403 ? "Forbidden" : "Not Found";
  socket.end(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
}

function handleConnection(socket: WebSocket): void {
  socket.on("message", (data) => {
    const message = parseClientMessage(data.toString());
    if (!message) {
      send(socket, { type: "error", code: "bad_message" });
      return;
    }
    send(socket, { type: "pong" });
  });
}

export function createBattleServer({ verify, allowedOrigins }: BattleServerOptions): Server {
  const server = createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }
    response.writeHead(404).end();
  });

  const sockets = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });

  server.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname !== "/ws") {
      refuse(socket, 404);
      return;
    }

    const origin = request.headers.origin;
    if (origin !== undefined && !allowedOrigins.includes(origin)) {
      refuse(socket, 403);
      return;
    }

    const token = url.searchParams.get("token") ?? "";
    sockets.handleUpgrade(request, socket, head, (webSocket) => {
      // The handshake is completed before rejecting so the browser receives a
      // close code it can act on; a refused upgrade only surfaces as a generic error.
      void verify(token).then((user) => {
        if (!user) {
          webSocket.close(WS_CLOSE_UNAUTHORIZED, "unauthorized");
          return;
        }
        handleConnection(webSocket);
      });
    });
  });

  return server;
}
