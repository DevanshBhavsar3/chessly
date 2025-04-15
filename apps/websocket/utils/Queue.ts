import type WebSocket from "ws";
import { Game } from "./Game";
import { WEBSOCKET_MESSAGES } from "@repo/common";

type Node = {
  value: WebSocket;
  userId: string;
  mode: string;
  next?: Node;
  prev?: Node;
};

export class Queue {
  private head?: Node;
  private tail?: Node;
  public length: number;

  constructor() {
    this.head = undefined;
    this.length = 0;
  }

  enqueue(item: WebSocket, userId: string, mode: string): Game | undefined {
    if (this.seek(userId)) {
      const message = {
        type: WEBSOCKET_MESSAGES.ERROR,
        message: "Already in the Queue.",
      };

      item.send(JSON.stringify(message));
      return;
    }

    this.length++;

    const node: Node = { value: item, userId, mode };

    if (!this.head) {
      this.head = this.tail = node;
      return;
    }

    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }

    return this.matchmake();
  }

  dequeue() {
    if (!this.head) {
      return;
    }
    this.length--;

    if (this.length === 0) {
      this.head = this.tail = undefined;
      return;
    }

    this.head = this.head.next;
  }

  seek(userId: string): boolean {
    if (this.length === 0) {
      return false;
    }

    let curr = this.head;

    while (curr) {
      if (curr.userId === userId) {
        return true;
      }

      curr = curr.next;
    }

    return false;
  }

  remove(userId: string) {
    if (!this.seek(userId)) {
      return;
    }

    this.length--;

    if (this.length === 0) {
      this.head = this.tail = undefined;
      return;
    }

    let curr = this.head;

    while (curr) {
      if (curr.userId === userId) {
        if (curr.prev) {
          curr.prev.next = curr.next;
        }

        if (curr.next) {
          curr.next.prev = curr.prev;
        }
      }

      curr = curr.next;
    }
  }

  matchmake() {
    if (!this.head) return;

    let curr: Node | undefined = this.head;
    const opponent = this.head;

    while (curr) {
      if (curr.userId !== opponent.userId && curr.mode === opponent.mode) {
        const game = new Game(curr.value, opponent.value);

        const message = {
          type: WEBSOCKET_MESSAGES.START_GAME,
          message: "Game Found.",
          gameId: game.id,
        };

        curr.value.send(JSON.stringify({ ...message, side: "w" }));
        this.remove(curr.userId);

        opponent.value.send(JSON.stringify({ ...message, side: "b" }));
        this.remove(opponent.userId);

        return game;
      }

      curr = curr.next;
    }

    return;
  }
}
