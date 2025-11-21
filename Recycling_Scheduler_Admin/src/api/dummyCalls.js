// Dummy API calls (replaces Firebase calls with local dummy data)
import {
  getInMemoryUsers,
  setInMemoryUsers,
  getInMemoryClients,
  setInMemoryClients,
  getInMemoryCollections,
  setInMemoryCollections,
  getInMemoryClassifications,
  setInMemoryClassifications,
  asyncDelay,
} from '../data/dummyData';

// ======================== Client Functions ========================

export const getClients = async (setClients) => {
  try {
    await asyncDelay();
    const list = getInMemoryClients();
    if (typeof setClients === "function") setClients(list);
    return list;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getClient = async (id, setClient) => {
  try {
    await asyncDelay();
    const clients = getInMemoryClients();
    const client = clients.find(c => c.id === id);
    if (!client) throw new Error(`Client ${id} not found`);
    if (typeof setClient === "function") setClient(client);
    return client;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createClient = async (client, setResponse) => {
  try {
    await asyncDelay();
    if (!client?.id) throw new Error("client.id is required");
    const clients = getInMemoryClients();
    setInMemoryClients([...clients, client]);
    if (typeof setResponse === "function") setResponse({ id: client.id });
    return { id: client.id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteClient = async (id) => {
  try {
    await asyncDelay();
    const clients = getInMemoryClients();
    setInMemoryClients(clients.filter(c => c.id !== id));
    return true;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const editClient = async (data, id) => {
  try {
    await asyncDelay();
    const clients = getInMemoryClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Client ${id} not found`);
    clients[index] = { ...clients[index], ...data };
    setInMemoryClients(clients);
    return { id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// ======================== User Functions ========================

export const getUsers = async (setUsers) => {
  try {
    await asyncDelay();
    const list = getInMemoryUsers();
    if (typeof setUsers === "function") setUsers(list);
    return list;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getUser = async (id, setUser) => {
  try {
    await asyncDelay();
    const users = getInMemoryUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    if (typeof setUser === "function") setUser(user);
    return user;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createUser = async (data, setResponse) => {
  try {
    await asyncDelay();
    if (!data?.id) throw new Error("user.id is required");
    const users = getInMemoryUsers();
    setInMemoryUsers([...users, data]);
    if (typeof setResponse === "function") setResponse({ id: data.id });
    return { id: data.id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const editUser = async (data, id) => {
  try {
    await asyncDelay();
    const users = getInMemoryUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error(`User ${id} not found`);
    users[index] = { ...users[index], ...data };
    setInMemoryUsers(users);
    return { id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    await asyncDelay();
    const users = getInMemoryUsers();
    setInMemoryUsers(users.filter(u => u.id !== id));
    return true;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// ======================== Collection Functions ========================

export const getClassifications = async (clientId) => {
  try {
    await asyncDelay();
    if (!clientId) throw new Error("clientId is required");
    const classifications = getInMemoryClassifications();
    return classifications.filter(c => c.clientId === clientId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getCollectionsByIds = async (ids = []) => {
  try {
    await asyncDelay();
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const collections = getInMemoryCollections();
    return collections
      .filter(c => ids.includes(c.id))
      .map(c => ({ ...c }));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getCollectionsByClientId = async (clientId) => {
  try {
    await asyncDelay();
    if (!clientId) throw new Error("clientId is required");
    const collections = getInMemoryCollections();
    return collections.filter(c => c.clientId === clientId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createCollection = async (collectionData) => {
  try {
    await asyncDelay();
    if (!collectionData?.clientId) throw new Error("clientId is required");
    const collections = getInMemoryCollections();
    const newCollection = {
      id: crypto.randomUUID(),
      ...collectionData,
      createdAt: new Date(),
      timeStamp: new Date(),
    };
    setInMemoryCollections([...collections, newCollection]);
    return newCollection;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Legacy material functions (kept for compatibility but empty)
const getMaterials = () => {};
const addMaterial = () => {};
const deleteMaterial = () => {};
const editMaterial = () => {};
const getAllPickups = async () => [];

const calls = {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
  getClients,
  getClient,
  createClient,
  editClient,
  deleteClient,
  getClassifications,
  getCollectionsByIds,
  getCollectionsByClientId,
  createCollection,
  getMaterials,
  addMaterial,
  deleteMaterial,
  editMaterial,
  getAllPickups,
};

export default calls;

