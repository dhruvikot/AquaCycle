// Dummy data for the admin panel (replaces Firebase)

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

export const dummyClients = [
  {
    id: 'client-1',
    client_name: 'Hotel Plaza',
    pickup_frequency: 'Lun Mar Mié Jue Vie',
    contact_name: 'Pedro Gonzalez',
    contact_email: 'pedro@hotelplaza.com',
    contact_phone: '+598-99-123-456',
    locations: [
      {
        id: 'loc-1-1',
        name: 'Edificio Principal',
        address: 'Av. 18 de Julio 1234, Montevideo',
        contact_name: 'Pedro Gonzalez',
        contact_phone: '+598-99-123-456',
      },
      {
        id: 'loc-1-2',
        name: 'Cocina',
        address: 'Av. 18 de Julio 1234, Montevideo - Piso 2',
        contact_name: 'Maria Lopez',
        contact_phone: '+598-99-123-457',
      },
    ],
  },
  {
    id: 'client-2',
    client_name: 'Restaurante El Parador',
    pickup_frequency: 'Lun Mié Vie',
    contact_name: 'Laura Fernandez',
    contact_email: 'laura@elparador.com',
    contact_phone: '+598-99-234-567',
    locations: [
      {
        id: 'loc-2-1',
        name: 'Sede Principal',
        address: 'Rambla República del Perú 999, Montevideo',
        contact_name: 'Laura Fernandez',
        contact_phone: '+598-99-234-567',
      },
    ],
  },
  {
    id: 'client-3',
    client_name: 'Supermercado Central',
    pickup_frequency: 'Mar Jue Sáb',
    contact_name: 'Roberto Silva',
    contact_email: 'roberto@supercentral.com',
    contact_phone: '+598-99-345-678',
    locations: [
      {
        id: 'loc-3-1',
        name: 'Depósito Principal',
        address: 'Bulevar Artigas 567, Montevideo',
        contact_name: 'Roberto Silva',
        contact_phone: '+598-99-345-678',
      },
      {
        id: 'loc-3-2',
        name: 'Área de Carga',
        address: 'Bulevar Artigas 567, Montevideo - Lateral',
        contact_name: 'Diego Torres',
        contact_phone: '+598-99-345-679',
      },
    ],
  },
];

// Generate collections for the current year and previous months
const generateCollectionsForYear = (year) => {
  const collections = [];
  const clients = ['client-1', 'client-2', 'client-3'];
  
  // Generate data for each month (0-11 for Jan-Dec)
  for (let month = 0; month < 12; month++) {
    clients.forEach((clientId, clientIndex) => {
      // Generate 2-4 collections per month per client
      const collectionsPerMonth = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < collectionsPerMonth; i++) {
        const day = 5 + (i * 7); // Spread throughout the month
        const date = new Date(year, month, Math.min(day, 28), 10 + i * 2, 0, 0);
        
        collections.push({
          id: `coll-${year}-${month}-${clientIndex}-${i}`,
          clientId: clientId,
          timeStamp: date,
          createdAt: date,
          location: clientIndex === 0 ? 'Edificio Principal' : clientIndex === 1 ? 'Sede Principal' : 'Depósito Principal',
          collections: [
            { materialId: 'papel_carton', weight: 15 + Math.random() * 30 },
            { materialId: 'plasticos', weight: 10 + Math.random() * 25 },
            { materialId: 'organico', weight: 30 + Math.random() * 60 },
            { materialId: 'otros', weight: 2 + Math.random() * 10 },
            { materialId: 'descarte', weight: 3 + Math.random() * 12 },
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

