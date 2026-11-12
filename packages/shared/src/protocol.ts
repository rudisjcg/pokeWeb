/** Messages the browser sends to the battle server. */
export type ClientMessage = { type: "ping" };

/** Messages the battle server sends to the browser. */
export type ServerMessage = { type: "pong" } | { type: "error"; code: string };

/** WebSocket close code for a missing, expired or invalid session token. */
export const WS_CLOSE_UNAUTHORIZED = 4401;
