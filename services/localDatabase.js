// LOCAL DEMO DATABASE - No production data touched!
// This simulates a local database for testing and demo purposes

import { getClientsForDriverApp } from '../shared/clients';

let localData = {
    users: [
        { id: 1, first_name: 'Demo', last_name: 'User', email: 'demo@example.com', phone: '555-1000' },
        { id: 2, first_name: 'Admin', last_name: 'User', email: 'admin@example.com', phone: '555-2000' },
        { id: 3, first_name: 'Test', last_name: 'User', email: 'test@example.com', phone: '555-3000' },
        { id: 4, first_name: 'Maria', last_name: 'Rodriguez', email: 'maria.r@recycling.com', phone: '555-4001' },
        { id: 5, first_name: 'John', last_name: 'Smith', email: 'john.smith@waste.com', phone: '555-5002' },
        { id: 6, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@eco.org', phone: '555-6003' }
    ],
    clients: getClientsForDriverApp(), // Now using shared clients from shared/clients.js
    pickups: [
        {
            id: 1,
            client: 1,
            client_data: { id: 1, client_name: 'Hotel Plaza' },
            location: 'Edificio Principal',
            location_id: 1,
            datetime: new Date().toISOString(),
            total_weight: 50,
            status: 'P',
            notes: 'Regular weekly pickup - Monday morning',
            bags: [
                { id: 1, color: 'Blue', weight: 25 },
                { id: 2, color: 'Green', weight: 25 }
            ],
            categories: []
        },
        {
            id: 2,
            client: 2,
            client_data: { id: 2, client_name: 'Restaurante El Parador' },
            location: 'Sede Principal',
            location_id: 3,
            datetime: new Date(Date.now() - 86400000).toISOString(),
            total_weight: 75,
            status: 'C',
            notes: 'Large collection day - All materials sorted',
            bags: [
                { id: 3, color: 'Blue', weight: 30 },
                { id: 4, color: 'Yellow', weight: 45 }
            ],
            categories: [
                { id: 1, material: { name: 'PET Cristal' }, weight: 35 },
                { id: 2, material: { name: 'Papel Blanco' }, weight: 40 }
            ]
        },
        {
            id: 3,
            client: 3,
            client_data: { id: 3, client_name: 'Supermercado Central' },
            location: 'Depósito Principal',
            location_id: 4,
            datetime: new Date(Date.now() - 172800000).toISOString(),
            total_weight: 120,
            status: 'C',
            notes: 'Special collection event - Community recycling day',
            bags: [
                { id: 5, color: 'Blue', weight: 60 },
                { id: 6, color: 'Green', weight: 60 }
            ],
            categories: [
                { id: 3, material: { name: 'Cartón Corrugado' }, weight: 60 },
                { id: 4, material: { name: 'Aluminio' }, weight: 30 },
                { id: 5, material: { name: 'Vidrio' }, weight: 30 }
            ]
        },
        {
            id: 4,
            client: 4,
            client_data: { id: 4, client_name: 'Oficinas Torre Libertador' },
            location: 'Torre Principal',
            location_id: 6,
            datetime: new Date(Date.now() - 259200000).toISOString(),
            total_weight: 85,
            status: 'C',
            notes: 'Office paper and recyclables collection',
            bags: [
                { id: 7, color: 'Blue', weight: 40 },
                { id: 8, color: 'Yellow', weight: 25 },
                { id: 9, color: 'Green', weight: 20 }
            ],
            categories: [
                { id: 6, material: { name: 'PET Cristal' }, weight: 30 },
                { id: 7, material: { name: 'PET Verde' }, weight: 15 },
                { id: 8, material: { name: 'Nylon Transparente' }, weight: 20 },
                { id: 9, material: { name: 'Papel Blanco' }, weight: 20 }
            ]
        },
        {
            id: 5,
            client: 5,
            client_data: { id: 5, client_name: 'Fábrica Textil Del Sur' },
            location: 'Planta de Producción',
            location_id: 7,
            datetime: new Date(Date.now() - 345600000).toISOString(),
            total_weight: 42,
            status: 'P',
            notes: 'Industrial fabric waste collection',
            bags: [
                { id: 10, color: 'Blue', weight: 22 },
                { id: 11, color: 'Yellow', weight: 20 }
            ],
            categories: []
        },
        {
            id: 6,
            client: 1,
            client_data: { id: 1, client_name: 'Hotel Plaza' },
            location: 'Cocina',
            location_id: 2,
            datetime: new Date(Date.now() - 432000000).toISOString(),
            total_weight: 195,
            status: 'C',
            notes: 'Kitchen organic waste collection',
            bags: [
                { id: 12, color: 'Blue', weight: 80 },
                { id: 13, color: 'Green', weight: 65 },
                { id: 14, color: 'Yellow', weight: 50 }
            ],
            categories: [
                { id: 10, material: { name: 'PET Cristal' }, weight: 45 },
                { id: 11, material: { name: 'Cartón Corrugado' }, weight: 70 },
                { id: 12, material: { name: 'Papel Blanco' }, weight: 30 },
                { id: 13, material: { name: 'Aluminio' }, weight: 25 },
                { id: 14, material: { name: 'Vidrio' }, weight: 25 }
            ]
        },
        {
            id: 7,
            client: 3,
            client_data: { id: 3, client_name: 'Supermercado Central' },
            location: 'Área de Carga',
            location_id: 5,
            datetime: new Date(Date.now() - 518400000).toISOString(),
            total_weight: 68,
            status: 'C',
            notes: 'Loading area cardboard and packaging',
            bags: [
                { id: 15, color: 'Blue', weight: 35 },
                { id: 16, color: 'Green', weight: 33 }
            ],
            categories: [
                { id: 15, material: { name: 'PET Cristal' }, weight: 28 },
                { id: 16, material: { name: 'Nylon Transparente' }, weight: 15 },
                { id: 17, material: { name: 'Cartón Corrugado' }, weight: 25 }
            ]
        },
        {
            id: 8,
            client: 5,
            client_data: { id: 5, client_name: 'Fábrica Textil Del Sur' },
            location: 'Depósito de Materiales',
            location_id: 8,
            datetime: new Date(Date.now() - 604800000).toISOString(),
            total_weight: 110,
            status: 'P',
            notes: 'Material warehouse collection - Awaiting classification',
            bags: [
                { id: 17, color: 'Blue', weight: 55 },
                { id: 18, color: 'Yellow', weight: 35 },
                { id: 19, color: 'Green', weight: 20 }
            ],
            categories: []
        },
        {
            id: 9,
            client: 2,
            client_data: { id: 2, client_name: 'Restaurante El Parador' },
            location: 'Sede Principal',
            location_id: 3,
            datetime: new Date(Date.now() - 691200000).toISOString(),
            total_weight: 230,
            status: 'C',
            notes: 'Restaurant waste - High organic content',
            bags: [
                { id: 20, color: 'Blue', weight: 90 },
                { id: 21, color: 'Yellow', weight: 70 },
                { id: 22, color: 'Green', weight: 70 }
            ],
            categories: [
                { id: 18, material: { name: 'Cartón Corrugado' }, weight: 85 },
                { id: 19, material: { name: 'Chatarra' }, weight: 60 },
                { id: 20, material: { name: 'Aluminio' }, weight: 40 },
                { id: 21, material: { name: 'Vidrio' }, weight: 45 }
            ]
        },
        {
            id: 10,
            client: 4,
            client_data: { id: 4, client_name: 'Oficinas Torre Libertador' },
            location: 'Torre Principal',
            location_id: 6,
            datetime: new Date(Date.now() - 777600000).toISOString(),
            total_weight: 92,
            status: 'C',
            notes: 'Office tower collection - Paper and recyclables',
            bags: [
                { id: 23, color: 'Blue', weight: 45 },
                { id: 24, color: 'Yellow', weight: 27 },
                { id: 25, color: 'Green', weight: 20 }
            ],
            categories: [
                { id: 22, material: { name: 'PET Cristal' }, weight: 32 },
                { id: 23, material: { name: 'Papel Blanco' }, weight: 30 },
                { id: 24, material: { name: 'Nylon Color' }, weight: 15 },
                { id: 25, material: { name: 'Vidrio' }, weight: 15 }
            ]
        }
    ]
};

// Auto-increment IDs
let nextPickupId = 11;
let nextBagId = 26;
let nextCategoryId = 26;

// Helper to simulate async operations
const simulateAsync = (data, delay = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
};

// Database operations
const localDB = {
    // Users
    getUsers: () => {
        return simulateAsync({ users: localData.users });
    },

    // Clients
    getClients: () => {
        return simulateAsync({ clients: localData.clients });
    },

    getClient: (clientId) => {
        const client = localData.clients.find(c => c.id === parseInt(clientId));
        return simulateAsync({ client });
    },

    // Pickups
    getPickups: () => {
        return simulateAsync({ pickups: localData.pickups });
    },

    getPickup: (pickupId) => {
        const pickup = localData.pickups.find(p => p.id === parseInt(pickupId));
        return simulateAsync({ pickup });
    },

    createPickup: (pickupData) => {
        const newPickup = {
            id: nextPickupId++,
            ...pickupData.pickup,
            client_data: localData.clients.find(c => c.id === parseInt(pickupData.pickup.client)),
            datetime: new Date().toISOString(),
            bags: pickupData.pickup.bags.map(bag => ({
                id: nextBagId++,
                ...bag
            })),
            categories: []
        };
        
        // Find location name
        const client = localData.clients.find(c => c.id === parseInt(pickupData.pickup.client));
        if (client) {
            const location = client.locations.find(l => l.id === parseInt(pickupData.pickup.location));
            if (location) {
                newPickup.location = location.name;
                newPickup.location_id = location.id;
            }
        }

        localData.pickups.unshift(newPickup);
        return simulateAsync({ pickup: newPickup, message: 'Pickup created successfully!' });
    },

    updatePickup: (pickupId, pickupData) => {
        const index = localData.pickups.findIndex(p => p.id === parseInt(pickupId));
        
        if (index !== -1) {
            const existingPickup = localData.pickups[index];
            
            // Update bags
            let updatedBags = [];
            if (pickupData.pickup.bags) {
                updatedBags = pickupData.pickup.bags.map(bag => {
                    if (bag.id) {
                        // Existing bag
                        return { ...bag, id: parseInt(bag.id) };
                    } else {
                        // New bag
                        return { ...bag, id: nextBagId++ };
                    }
                });
            }

            // Update categories
            let updatedCategories = existingPickup.categories || [];
            if (pickupData.pickup.categories) {
                updatedCategories = pickupData.pickup.categories.map(category => {
                    const existingCat = existingPickup.categories?.find(c => c.material.name === category.material);
                    return {
                        id: existingCat?.id || nextCategoryId++,
                        material: { name: category.material },
                        weight: category.weight
                    };
                });
            }

            localData.pickups[index] = {
                ...existingPickup,
                ...pickupData.pickup,
                id: parseInt(pickupId),
                bags: updatedBags,
                categories: updatedCategories,
                datetime: existingPickup.datetime,
                client_data: localData.clients.find(c => c.id === parseInt(pickupData.pickup.client || existingPickup.client))
            };
            
            return simulateAsync({ pickup: localData.pickups[index], message: 'Pickup updated successfully!' });
        }
        
        return simulateAsync({ error: 'Pickup not found' });
    },

    deletePickup: (pickupId) => {
        const index = localData.pickups.findIndex(p => p.id === parseInt(pickupId));
        if (index !== -1) {
            localData.pickups.splice(index, 1);
            return simulateAsync({ message: 'Pickup deleted successfully!' });
        }
        return simulateAsync({ error: 'Pickup not found' });
    },

    // Reset database to initial state
    reset: () => {
        localData = {
            users: [
                { id: 1, first_name: 'Demo', last_name: 'User', email: 'demo@example.com' },
                { id: 2, first_name: 'Admin', last_name: 'User', email: 'admin@example.com' },
                { id: 3, first_name: 'Test', last_name: 'User', email: 'test@example.com' }
            ],
            clients: [...localData.clients],
            pickups: [...localData.pickups]
        };
        nextPickupId = 4;
        nextBagId = 7;
        nextCategoryId = 6;
    }
};

export default localDB;

