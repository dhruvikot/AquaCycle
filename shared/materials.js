// Shared materials configuration for both driver app and admin panel
// This ensures both apps use the same materials list

export const MATERIALS_LIST = [
  { id: 1, name: 'PET Cristal', category: 'Plásticos', weight: 0, color: '#ffc000' },
  { id: 2, name: 'PET Verde', category: 'Plásticos', weight: 0, color: '#ffc000' },
  { id: 3, name: 'PET Bandejas', category: 'Plásticos', weight: 0, color: '#ffc000' },
  { id: 4, name: 'Polietileno Botella', category: 'Plásticos', weight: 0, color: '#7f6000' },
  { id: 5, name: 'Nylon Transparente', category: 'Plásticos', weight: 0, color: '#4a86e8' },
  { id: 6, name: 'Nylon Color', category: 'Plásticos', weight: 0, color: '#4a86e8' },
  { id: 7, name: 'Papel Blanco', category: 'Papel y Cartón', weight: 0, color: '#4a86e8' },
  { id: 8, name: 'Revista/Diario', category: 'Papel y Cartón', weight: 0, color: '#7f6000' },
  { id: 9, name: 'Cartón Corrugado', category: 'Papel y Cartón', weight: 0, color: '#4a86e8' },
  { id: 10, name: 'Aluminio', category: 'Metales', weight: 0, color: '#ffc000' },
  { id: 11, name: 'Chatarra', category: 'Metales', weight: 0, color: '#7f6000' },
  { id: 12, name: 'Electrónicos', category: 'Otros', weight: 0, color: 'grey' },
  { id: 13, name: 'Vidrio', category: 'Vidrio', weight: 0, color: '#7f6000' },
  { id: 14, name: 'Tetrabrik', category: 'Otros', weight: 0, color: '#7f6000' },
  { id: 15, name: 'Poliestireno Expandido', category: 'Plásticos', weight: 0, color: '#7f6000' },
  { id: 16, name: 'PP (5)', category: 'Plásticos', weight: 0, color: '#ffc000' },
  { id: 17, name: 'Poliestireno PS (6)', category: 'Plásticos', weight: 0, color: '#ffc000' },
  { id: 18, name: 'Descarte', category: 'Descarte', weight: 0, color: 'grey' },
];

// Helper function to get materials grouped by category
export const getMaterialsByCategory = () => {
  return MATERIALS_LIST.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {});
};

// Helper function to get material by ID
export const getMaterialById = (id) => {
  return MATERIALS_LIST.find(material => material.id === id);
};

// Helper function to get material by name
export const getMaterialByName = (name) => {
  return MATERIALS_LIST.find(material => material.name === name);
};



