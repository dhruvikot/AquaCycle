// Dummy data for the admin panel (replaces Firebase)

import { getClientsForAdmin } from '../../../shared/clients';

export const dummyUsers = [
  {
    id: '1',
    first_name: 'Maria',
    last_name: 'Rodriguez',
    role: 'collector',
  },
  {
    id: '2',
    first_name: 'John',
    last_name: 'Smith',
    role: 'classifier',
  },
  {
    id: '3',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: 'both',
  },
  {
    id: '4',
    first_name: 'Carlos',
    last_name: 'Garcia',
    role: 'collector',
  },
  {
    id: '5',
    first_name: 'Ana',
    last_name: 'Martinez',
    role: 'admin',
  },
];

// Now using shared clients from shared/clients.js for consistency
export const dummyClients = getClientsForAdmin();

// Generate collections for the current year and previous months
const generateCollectionsForYear = (year) => {
  const collections = [];
  
  // Client configurations with realistic waste profiles
  const clientConfigs = [
    {
      id: 'client-1', // Hotel Plaza
      locationNames: ['Edificio Principal', 'Cocina'],
      collectionsPerMonth: 4, // High frequency
      wasteProfile: { papel_carton: 25, plasticos: 20, organico: 45, otros: 8, descarte: 15 }
    },
    {
      id: 'client-2', // Restaurante El Parador
      locationNames: ['Sede Principal'],
      collectionsPerMonth: 3, // Medium-high frequency
      wasteProfile: { papel_carton: 15, plasticos: 18, organico: 60, otros: 5, descarte: 12 }
    },
    {
      id: 'client-3', // Supermercado Central
      locationNames: ['Depósito Principal', 'Área de Carga'],
      collectionsPerMonth: 3, // Medium frequency
      wasteProfile: { papel_carton: 40, plasticos: 35, organico: 30, otros: 10, descarte: 20 }
    },
    {
      id: 'client-4', // Oficinas Torre Libertador
      locationNames: ['Torre Principal'],
      collectionsPerMonth: 2, // Low frequency
      wasteProfile: { papel_carton: 50, plasticos: 15, organico: 8, otros: 12, descarte: 8 }
    },
    {
      id: 'client-5', // Fábrica Textil Del Sur
      locationNames: ['Planta de Producción', 'Depósito de Materiales'],
      collectionsPerMonth: 4, // High frequency
      wasteProfile: { papel_carton: 35, plasticos: 30, organico: 10, otros: 15, descarte: 25 }
    }
  ];
  
  // Generate data for each month (0-11 for Jan-Dec)
  for (let month = 0; month < 12; month++) {
    clientConfigs.forEach((config, clientIndex) => {
      // Generate collections per month based on client configuration
      for (let i = 0; i < config.collectionsPerMonth; i++) {
        const day = 5 + (i * 7); // Spread throughout the month
        const date = new Date(year, month, Math.min(day, 28), 10 + i * 2, 0, 0);
        
        // Randomly select a location for this client
        const location = config.locationNames[Math.floor(Math.random() * config.locationNames.length)];
        
        collections.push({
          id: `coll-${year}-${month}-${clientIndex}-${i}`,
          clientId: config.id,
          timeStamp: date,
          createdAt: date,
          location: location,
          collections: [
            { materialId: 'papel_carton', weight: config.wasteProfile.papel_carton + Math.random() * 20 },
            { materialId: 'plasticos', weight: config.wasteProfile.plasticos + Math.random() * 15 },
            { materialId: 'organico', weight: config.wasteProfile.organico + Math.random() * 25 },
            { materialId: 'otros', weight: config.wasteProfile.otros + Math.random() * 8 },
            { materialId: 'descarte', weight: config.wasteProfile.descarte + Math.random() * 10 },
          ],
        });
      }
    });
  }
  
  return collections;
};

// Generate for 2024 and 2025
export const dummyCollections = [
  ...generateCollectionsForYear(2024),
  ...generateCollectionsForYear(2025),
];

// Generate classifications matching the collections
const generateClassificationsForCollections = (collections) => {
  return collections.map((coll) => {
    const classDate = new Date(coll.timeStamp.getTime() + 30 * 60 * 1000); // 30 mins after collection
    
    // Break down each collection into sub-materials
    const classifications = [];
    coll.collections.forEach((mat) => {
      if (mat.materialId === 'papel_carton') {
        // Split paper/cardboard into subcategories
        const half = mat.weight / 2;
        classifications.push(
          { materialId: 'papel_carton', subMaterialId: 'carton_corrugado', weight: half * 0.6 },
          { materialId: 'papel_carton', subMaterialId: 'papel_blanco', weight: half * 0.4 },
        );
      } else if (mat.materialId === 'plasticos') {
        classifications.push(
          { materialId: 'plasticos', subMaterialId: 'pet_natural', weight: mat.weight },
        );
      } else if (mat.materialId === 'organico') {
        classifications.push(
          { materialId: 'organico', subMaterialId: 'organico', weight: mat.weight },
        );
      } else if (mat.materialId === 'otros') {
        const half = mat.weight / 2;
        classifications.push(
          { materialId: 'otros', subMaterialId: 'latas_aluminio', weight: half },
          { materialId: 'otros', subMaterialId: 'electronicos', weight: half },
        );
      } else if (mat.materialId === 'descarte') {
        classifications.push(
          { materialId: 'descarte', subMaterialId: 'descarte', weight: mat.weight },
        );
      }
    });
    
    return {
      id: `class-${coll.id}`,
      clientId: coll.clientId,
      collectionId: coll.id,
      location: coll.location,
      createdAt: classDate,
      timeStamp: classDate,
      classifications: classifications,
    };
  });
};

export const dummyClassifications = generateClassificationsForCollections(dummyCollections);

// In-memory storage (for add/edit/delete operations)
let users = [...dummyUsers];
let clients = [...dummyClients];
let collections = [...dummyCollections];
let classifications = [...dummyClassifications];

// Helper to simulate async
const asyncDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Export getter/setter functions
export const getInMemoryUsers = () => [...users];
export const setInMemoryUsers = (newUsers) => { users = [...newUsers]; };

export const getInMemoryClients = () => [...clients];
export const setInMemoryClients = (newClients) => { clients = [...newClients]; };

export const getInMemoryCollections = () => [...collections];
export const setInMemoryCollections = (newCollections) => { collections = [...newCollections]; };

export const getInMemoryClassifications = () => [...classifications];
export const setInMemoryClassifications = (newClassifications) => { classifications = [...newClassifications]; };

export { asyncDelay };

