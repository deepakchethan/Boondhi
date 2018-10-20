const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
2  
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {

  /*
  * @argument blockchain current instance of blockchain
  * @argument Array of sockets the server is listening on
  */
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  /*
  * This method will create a new socket
  * Then try to connect to the peers
  */
  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    // Make the server to listen to the node's socket at each node
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket Connected');
    this.messageHandler(socket);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on('message', (message) => {
      const data = JSON.parse(message);
      this.blockchain.replaceChainWith(data);
      console.log(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain));
  }

  synchronizeChains() {
    this.sockets.forEach((socket) => {
      this.sendChain(socket);
    });
  }
}

module.exports = P2pServer;
