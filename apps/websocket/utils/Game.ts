export class Game {
  public id: string;
  private player1?: WebSocket;
  private player2?: WebSocket;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.id = Math.random().toString();
    this.player1 = player1;
    this.player2 = player2;
  }

  move() {}
}
