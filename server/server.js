import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;
const url = 'mongodb+srv://sourish:sourish@cluster0.z5sz4by.mongodb.net/somaiya-satellite';

let db;

app.use(cors());
app.use(express.json());

// Helpers
const toId = (id) => new ObjectId(id);
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => res.status(500).json({ error: err.message }));

function buildQuery(req) {
  const { satelliteId, startDate, endDate } = req.query;
  const query = {};
  if (satelliteId) query.satelliteId = satelliteId;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  return query;
}

async function connectDB() {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Telemetry Routes
app.post('/api/telemetry', asyncHandler(async (req, res) => {
  const doc = { ...req.body, timestamp: new Date(req.body.timestamp || Date.now()) };
  const result = await db.collection('telemetry').insertOne(doc);
  res.status(201).json({ ...doc, _id: result.insertedId });
}));

app.get('/api/telemetry', asyncHandler(async (req, res) => {
  const telemetry = await db.collection('telemetry')
    .find(buildQuery(req))
    .toArray();
  res.json(telemetry);
}));

app.get('/api/telemetry/latest/:satelliteId', asyncHandler(async (req, res) => {
  const telemetry = await db.collection('telemetry')
    .findOne({ satelliteId: req.params.satelliteId });
  if (!telemetry)
    return res.status(404).json({ error: 'No telemetry found' });
  res.json(telemetry);
}));

app.get('/api/telemetry/:id', asyncHandler(async (req, res) => {
  const telemetry = await db.collection('telemetry').findOne({ _id: toId(req.params.id) });
  if (!telemetry)
    return res.status(404).json({ error: 'Telemetry not found' });
  res.json(telemetry);
}));

app.put('/api/telemetry/:id', asyncHandler(async (req, res) => {
  const result = await db.collection('telemetry').findOneAndUpdate(
    { _id: toId(req.params.id) },
    { $set: req.body },
    { returnDocument: 'after' }
  );
  if (!result)
    return res.status(404).json({ error: 'Telemetry not found' });
  res.json(result);
}));

app.delete('/api/telemetry/:id', asyncHandler(async (req, res) => {
  const result = await db.collection('telemetry').deleteOne({ _id: toId(req.params.id) });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: 'Telemetry not found' });
  res.json({ message: 'Telemetry deleted successfully' });
}));

// Communication Routes
app.post('/api/communication', asyncHandler(async (req, res) => {
  const doc = { ...req.body, timestamp: new Date(req.body.timestamp || Date.now()) };
  const result = await db.collection('communication').insertOne(doc);
  res.status(201).json({ ...doc, _id: result.insertedId });
}));

app.get('/api/communication', asyncHandler(async (req, res) => {
  const communications = await db.collection('communication')
    .find(buildQuery(req))
    .toArray();
  res.json(communications);
}));

app.get('/api/communication/latest/:satelliteId', asyncHandler(async (req, res) => {
  const communication = await db.collection('communication')
    .findOne({ satelliteId: req.params.satelliteId });
  if (!communication)
    return res.status(404).json({ error: 'No communication record found' });
  res.json(communication);
}));

app.get('/api/communication/:id', asyncHandler(async (req, res) => {
  const communication = await db.collection('communication').findOne({ _id: toId(req.params.id) });
  if (!communication)
    return res.status(404).json({ error: 'Communication record not found' });
  res.json(communication);
}));

app.put('/api/communication/:id', asyncHandler(async (req, res) => {
  const result = await db.collection('communication').findOneAndUpdate(
    { _id: toId(req.params.id) },
    { $set: req.body },
    { returnDocument: 'after' }
  );
  if (!result)
    return res.status(404).json({ error: 'Communication record not found' });
  res.json(result);
}));

app.delete('/api/communication/:id', asyncHandler(async (req, res) => {
  const result = await db.collection('communication').deleteOne({ _id: toId(req.params.id) });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: 'Communication record not found' });
  res.json({ message: 'Communication record deleted successfully' });
}));

app.post('/api/communication/:id/transmission-requests', asyncHandler(async (req, res) => {
  const result = await db.collection('communication').findOneAndUpdate(
    { _id: toId(req.params.id) },
    { $push: { transmissionRequests: req.body } },
    { returnDocument: 'after' }
  );
  if (!result)
    return res.status(404).json({ error: 'Communication record not found' });
  res.status(201).json(result);
}));

app.put('/api/communication/:id/transmission-requests/:requestId', asyncHandler(async (req, res) => {
  const result = await db.collection('communication').findOneAndUpdate(
    { _id: toId(req.params.id), 'transmissionRequests.requestId': req.params.requestId },
    { $set: { 'transmissionRequests.$': req.body } },
    { returnDocument: 'after' }
  );
  if (!result)
    return res.status(404).json({ error: 'Transmission request not found' });
  res.json(result);
}));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);