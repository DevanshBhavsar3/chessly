import type WebSocket from "ws";
import { Game } from "./Game";

type Node = {
  value: WebSocket;
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

  enqueue(item: WebSocket): Game | undefined {
    this.length++;

    const node: Node = { value: item };

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

  seek(socket: WebSocket): boolean {
    if (this.length === 0) {
      return false;
    }

    let curr = this.head;

    while (curr) {
      if (curr.value === socket) {
        return true;
      }

      curr = curr.next;
    }

    return false;
  }

  remove(socket: WebSocket) {
    if (!this.seek(socket)) {
      return;
    }

    this.length--;

    if (this.length === 0) {
      this.head = this.tail = undefined;
      return;
    }

    let curr = this.head;

    while (curr) {
      if (curr.value === socket) {
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
    if (this.head && this.head.next) {
      const game = new Game(this.head, this.head?.next);

      this.head.value.send("Match Found");
      this.head.next.value.send("Match Found");

      this.dequeue();
      this.dequeue();

      return game;
    }

    return;
  }
}
