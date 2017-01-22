require('./init');

const http = require('http');
const WebsocketServer = require('./WebsocketServer').default;
const app = require('./app').default;
const UpdateJob = require('./db/UpdateJob').default;

// Start all the periodic jobs
const updateJob = new UpdateJob({ period: 60000 });
updateJob.start();

// Start the http server
const httpServer = http.createServer(app.callback());
httpServer.listen(process.env.PORT || '3005');
httpServer.on('error', (err) => {
  throw err;
});

httpServer.on('listening', () => {
  const address = httpServer.address();
  console.log('Listening on %s%s', address.address, address.port);
});

const wsServer = new WebsocketServer(httpServer);
wsServer.start();
