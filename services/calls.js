// ========================================
// PRODUCTION API - COMMENTED OUT FOR DEMO
// ========================================
// const API_URL = 'https://express-auv3rzs3sa-uw.a.run.app/api';
// This was the production Google Cloud API - now using local database

import localDB from './localDatabase';

const handleAPIError = (error) => {
    console.error('API error:', error);
    throw new Error('Failed to perform the operation. Please try again later.');
};

const fetchUsers = async (setUsers) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // return fetch('https://express-auv3rzs3sa-uw.a.run.app/api/user/')...
    
    // LOCAL DATABASE CALL
    try {
        const response = await localDB.getUsers();
        console.log('Local DB Users:', response);
        setUsers(response.users);
    } catch (error) {
        console.log("fetchUsers error:", error);
        throw error;
    }
};

const fetchClients = async (setClients) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // return fetch('https://express-auv3rzs3sa-uw.a.run.app/api/client/')...
    
    // LOCAL DATABASE CALL
    try {
        const response = await localDB.getClients();
        console.log('Local DB Clients:', response);
        setClients(response.clients);
    } catch (error) {
        console.log("fetchClients error:", error);
        throw error;
    }
};

const postPickups = async (payload) => {
    console.log('Received payload in postPickups:', payload);
    // PRODUCTION API CALL - COMMENTED OUT
    // const url = 'https://express-auv3rzs3sa-uw.a.run.app/api/pickup/';
    // const response = await fetch(url, {...});
    
    // LOCAL DATABASE CALL
    try {
      const data = await localDB.createPickup(payload);
      console.log('Response from local DB:', data);
      return data;
    } catch (error) {
      console.error('Error in postPickups:', error);
      handleAPIError(error);
    }
};

const fetchClientDetails = async (clientId) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // const url = `https://express-auv3rzs3sa-uw.a.run.app/api/client/${clientId}`;
    
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.getClient(clientId);
        return data;
    } catch (error) {
        console.error('Failed to fetch client details:', error);
        throw error;
    }
};

const fetchPickupDetails = async (pickupId) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // const url = `https://express-auv3rzs3sa-uw.a.run.app/api/pickup/${pickupId}`;
    
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.getPickup(pickupId);
        return data;
    } catch (error) {
        console.error('Failed to fetch pickup details:', error);
        throw error;
    }
};

const fetchPickups = async () => {
    // PRODUCTION API CALL - COMMENTED OUT
    // return fetch('https://express-auv3rzs3sa-uw.a.run.app/api/pickup/')...
    
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.getPickups();
        console.log('Local DB Pickups:', data.pickups);
        return data.pickups;
    } catch (error) {
        console.error('Failed to fetch pickups:', error);
        throw error;
    }
};

const fetchPickup = async (setPickups) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // return fetch('https://express-auv3rzs3sa-uw.a.run.app/api/pickup/')...
    
    // LOCAL DATABASE CALL
    try {
        const response = await localDB.getPickups();
        console.log('Local DB Pickups:', response.pickups);
        setPickups(response.pickups);
    } catch (error) {
        console.error('Failed to fetch pickups:', error);
        throw error;
    }
};

const patchPickup = async (pickupId, payload) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // const url = `https://express-auv3rzs3sa-uw.a.run.app/api/pickup/${pickupId}/`;
    // const response = await fetch(url, {...});
    
    // LOCAL DATABASE CALL
    try {
      console.log('PATCH Pickup ID:', pickupId);
      console.log('PATCH Payload:', JSON.stringify(payload));
      const data = await localDB.updatePickup(pickupId, payload);
      console.log('PATCH Response:', data);
      return data;
    } catch (error) {
      handleAPIError(error);
    }
};

const deletePickup = async (pickupId) => {
    // PRODUCTION API CALL - COMMENTED OUT
    // const response = await fetch(`${API_URL}/pickup/${pickupId}/`, {...});
    
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.deletePickup(pickupId);
        return data;
    } catch (error) {
        throw new Error('Failed to delete pickup');
    }
};

const fetchMaterials = async (setMaterials) => {
    // LOCAL DATABASE CALL
    try {
        const response = await localDB.getMaterials();
        console.log('Local DB Materials:', response);
        setMaterials(response.materials);
    } catch (error) {
        console.log("fetchMaterials error:", error);
        throw error;
    }
};

const fetchMaterial = async (materialId) => {
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.getMaterial(materialId);
        return data;
    } catch (error) {
        console.error('Failed to fetch material details:', error);
        throw error;
    }
};

const createMaterial = async (materialData) => {
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.createMaterial(materialData);
        return data;
    } catch (error) {
        console.error('Error creating material:', error);
        throw error;
    }
};

const updateMaterial = async (materialId, materialData) => {
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.updateMaterial(materialId, materialData);
        return data;
    } catch (error) {
        console.error('Error updating material:', error);
        throw error;
    }
};

const deleteMaterial = async (materialId) => {
    // LOCAL DATABASE CALL
    try {
        const data = await localDB.deleteMaterial(materialId);
        return data;
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
};




const calls = {
    fetchUsers,
    fetchClients,
    postPickups,
    fetchClientDetails,
    fetchPickupDetails,
    fetchPickups,
    patchPickup,
    fetchPickup,
    deletePickup,
    fetchMaterials,
    fetchMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
};

export default calls;
