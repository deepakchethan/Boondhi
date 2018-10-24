const WebSocket = require('ws');


const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
};
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
  /*
  * @argument blockchain current instance of blockchain
  * @argument Array of sockets the server is listening on
  */
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
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
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChainWith(data); break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction); break;
        default:
          console.log('Invalid Message');
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain,
    }));
  }

  synchronizeChains() {
    this.sockets.forEach((socket) => {
      this.sendChain(socket);
    });
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction}));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2pServer;
