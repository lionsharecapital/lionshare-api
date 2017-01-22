import uws from 'uws';
import Exchange from './exchange/Exchange';

class WebsocketServer {
  constructor(server) {
    this.exchange = new Exchange();
    this.wss = new uws.Server({
      server,
      verifyClient: this.verifyClient,
      clientTracking: true,
    });
  }

  broadcast = (data) => {
    this.wss.clients.forEach((client) => {
      if (client.readyState === uws.OPEN) {
        try {
          client.send(data);
        } catch(e) {
          console.log(e);
        }
      }
    });
  }

  ping = () => {
    this.wss.clients.forEach((client) => {
      if (client.readyState === uws.OPEN) {
        try {
          client.ping();
        } catch(e) {
          console.log(e);
        }
      }
    });
  }

  verifyClient = (info) => {
    return this.originIsAllowed(info.origin);
  }

  originIsAllowed = (origin) => {
    // TODO: add origin checks here
    return true;
  }

  start = () => {
    this.exchange.connect();
    this.exchange.on('message', (data) => {
      this.broadcast(JSON.stringify(data));
    });

    setInterval(() => {
      // Ping to prevent connections from closing
      this.ping();
    }, 30000);
  }
}

export default WebsocketServer;
