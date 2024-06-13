import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { getGameAssets, loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
  res.send('Hi World');
});

app.get('/api/assets', (req, res) => {
  if (getGameAssets()) {
    res.json(getGameAssets());
  } else {
    res.status(500).json({ error: 'Assets not loaded' });
  }
});

server.listen(PORT, async () => {
  console.log('Server is running on port ' + PORT);
  try {
    const assets = await loadGameAssets();
    console.log(assets);

    console.log('Assets loaded succesful');
  } catch (e) {
    console.log(e.message);
  }
});
