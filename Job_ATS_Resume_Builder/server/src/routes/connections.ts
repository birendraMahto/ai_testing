import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllConnections,
  getConnectionById,
  getConnectionByName,
  createConnection,
  updateConnection,
  deleteConnection,
} from '../db/store';
import { testLLMConnection } from '../services/llm/factory';
import { LLMConnection, CreateConnectionRequest, TestConnectionRequest, PROVIDER_MODELS } from '../types';

const router = Router();

// GET /api/connections — List all connections
router.get('/', (_req: Request, res: Response) => {
  const connections = getAllConnections();
  // Remove API keys from response for security
  const safe = connections.map((c) => ({ ...c, apiKey: '••••••••' }));
  res.json({ success: true, data: safe });
});

// GET /api/connections/providers — Get provider models list
router.get('/providers', async (_req: Request, res: Response) => {
  const providers = JSON.parse(JSON.stringify(PROVIDER_MODELS));
  
  // Try to fetch local Ollama models dynamically
  try {
    const ollamaProvider = providers.find((p: any) => p.provider === 'ollama');
    if (ollamaProvider) {
      const response = await fetch('http://127.0.0.1:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        if (data.models && Array.isArray(data.models)) {
          ollamaProvider.models = data.models.map((m: any) => m.name);
        }
      }
    }
  } catch (err) {
    // Silently ignore if Ollama is not running locally
  }

  // Try to fetch local LM Studio models dynamically
  try {
    const lmstudioProvider = providers.find((p: any) => p.provider === 'lmstudio');
    if (lmstudioProvider) {
      const response = await fetch('http://127.0.0.1:1234/v1/models');
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          lmstudioProvider.models = data.data.map((m: any) => m.id);
        }
      }
    }
  } catch (err) {
    // Silently ignore if LM Studio is not running locally
  }

  res.json({ success: true, data: providers });
});

// GET /api/connections/:id — Get a specific connection
router.get('/:id', (req: Request, res: Response) => {
  const connection = getConnectionById(req.params.id);
  if (!connection) {
    res.status(404).json({ success: false, error: 'Connection not found' });
    return;
  }
  res.json({ success: true, data: { ...connection, apiKey: '••••••••' } });
});

// POST /api/connections/test — Test a connection
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { provider, modelName, apiKey } = req.body as TestConnectionRequest;

    if (!provider || !modelName || (!apiKey && provider !== 'ollama')) {
      res.status(400).json({
        success: false,
        error: 'Provider, model name, and API key are required',
      });
      return;
    }

    await testLLMConnection(provider, apiKey || '', modelName);
    res.json({ success: true, data: { message: 'Connection successful!' } });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: `Connection test failed: ${error.message}`,
    });
  }
});

// POST /api/connections/scan-local — Scan and create local connections
router.post('/scan-local', async (_req: Request, res: Response) => {
  const newConnections: LLMConnection[] = [];

  try {
    // Scan Ollama
    try {
      const response = await fetch('http://127.0.0.1:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        if (data.models && Array.isArray(data.models)) {
          data.models.forEach((m: any) => {
            const connectionName = `Ollama - ${m.name}`;
            if (!getConnectionByName(connectionName)) {
              const connection: LLMConnection = {
                id: uuidv4(),
                connectionName,
                provider: 'ollama',
                modelName: m.name,
                apiKey: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              createConnection(connection);
              newConnections.push(connection);
            }
          });
        }
      }
    } catch (e) {}

    // Scan LM Studio
    try {
      const response = await fetch('http://127.0.0.1:1234/v1/models');
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((m: any) => {
            const connectionName = `LM Studio - ${m.id}`;
            if (!getConnectionByName(connectionName)) {
              const connection: LLMConnection = {
                id: uuidv4(),
                connectionName,
                provider: 'lmstudio',
                modelName: m.id,
                apiKey: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              createConnection(connection);
              newConnections.push(connection);
            }
          });
        }
      }
    } catch (e) {}

    res.json({ success: true, data: { added: newConnections.length, connections: newConnections } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: `Scan failed: ${error.message}` });
  }
});

// POST /api/connections — Create a new connection
router.post('/', (req: Request, res: Response) => {
  const { connectionName, provider, modelName, apiKey } = req.body as CreateConnectionRequest;

  if (!connectionName || !provider || !modelName || (!apiKey && provider !== 'ollama' && provider !== 'lmstudio')) {
    res.status(400).json({
      success: false,
      error: 'All fields are required: connectionName, provider, modelName, apiKey',
    });
    return;
  }

  // Check for duplicate name
  const existing = getConnectionByName(connectionName);
  if (existing) {
    res.status(409).json({
      success: false,
      error: `Connection with name "${connectionName}" already exists`,
    });
    return;
  }

  const connection: LLMConnection = {
    id: uuidv4(),
    connectionName,
    provider,
    modelName,
    apiKey: apiKey || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  createConnection(connection);
  res.status(201).json({ success: true, data: { ...connection, apiKey: '••••••••' } });
});

// PUT /api/connections/:id — Update a connection
router.put('/:id', (req: Request, res: Response) => {
  const { provider, modelName, apiKey } = req.body;

  const updated = updateConnection(req.params.id, {
    ...(provider && { provider }),
    ...(modelName && { modelName }),
    ...(apiKey && { apiKey }),
  });

  if (!updated) {
    res.status(404).json({ success: false, error: 'Connection not found' });
    return;
  }

  res.json({ success: true, data: { ...updated, apiKey: '••••••••' } });
});

// DELETE /api/connections/:id — Delete a connection
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteConnection(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: 'Connection not found' });
    return;
  }
  res.json({ success: true, data: { message: 'Connection deleted' } });
});

export default router;
