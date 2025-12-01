// Shared clients configuration for both driver app and admin panel
// This ensures both apps use the same client list

export const SHARED_CLIENTS = [
  {
    id: 'client-1',
    id_numeric: 1, // For driver app compatibility
    client_name: 'Hotel Plaza',
    client_type: 'Hotelería',
    pickup_frequency: 'Lun Mar Mié Jue Vie',
    contact_name: 'Pedro Gonzalez',
    contact_email: 'pedro@hotelplaza.com',
    contact_phone: '+598-99-123-456',
    first_name: 'Pedro',
    last_name: 'Gonzalez',
    locations: [
      {
        id: 1,
        name: 'Edificio Principal',
        address: 'Av. 18 de Julio 1234, Montevideo',
        contact_name: 'Pedro Gonzalez',
        contact_phone: '+598-99-123-456',
      },
      {
        id: 2,
        name: 'Cocina',
        address: 'Av. 18 de Julio 1234, Montevideo - Piso 2',
        contact_name: 'Maria Lopez',
        contact_phone: '+598-99-123-457',
      },
    ],
  },
  {
    id: 'client-2',
    id_numeric: 2,
    client_name: 'Restaurante El Parador',
    client_type: 'Gastronomía',
    pickup_frequency: 'Lun Mié Vie',
    contact_name: 'Laura Fernandez',
    contact_email: 'laura@elparador.com',
    contact_phone: '+598-99-234-567',
    first_name: 'Laura',
    last_name: 'Fernandez',
    locations: [
      {
        id: 3,
        name: 'Sede Principal',
        address: 'Rambla República del Perú 999, Montevideo',
        contact_name: 'Laura Fernandez',
        contact_phone: '+598-99-234-567',
      },
    ],
  },
  {
    id: 'client-3',
    id_numeric: 3,
    client_name: 'Supermercado Central',
    client_type: 'Retail',
    pickup_frequency: 'Mar Jue Sáb',
    contact_name: 'Roberto Silva',
    contact_email: 'roberto@supercentral.com',
    contact_phone: '+598-99-345-678',
    first_name: 'Roberto',
    last_name: 'Silva',
    locations: [
      {
        id: 4,
        name: 'Depósito Principal',
        address: 'Bulevar Artigas 567, Montevideo',
        contact_name: 'Roberto Silva',
        contact_phone: '+598-99-345-678',
      },
      {
        id: 5,
        name: 'Área de Carga',
        address: 'Bulevar Artigas 567, Montevideo - Lateral',
        contact_name: 'Diego Torres',
        contact_phone: '+598-99-345-679',
      },
    ],
  },
  {
    id: 'client-4',
    id_numeric: 4,
    client_name: 'Oficinas Torre Libertador',
    client_type: 'Oficinas',
    pickup_frequency: 'Lun Jue',
    contact_name: 'Carmen Rios',
    contact_email: 'admin@torrelibertador.com',
    contact_phone: '+598-99-456-789',
    first_name: 'Carmen',
    last_name: 'Rios',
    locations: [
      {
        id: 6,
        name: 'Torre Principal',
        address: 'Plaza Independencia 753, Montevideo',
        contact_name: 'Carmen Rios',
        contact_phone: '+598-99-456-789',
      },
    ],
  },
  {
    id: 'client-5',
    id_numeric: 5,
    client_name: 'Fábrica Textil Del Sur',
    client_type: 'Industrial',
    pickup_frequency: 'Lun Mar Mié Jue Vie',
    contact_name: 'Jorge Mendez',
    contact_email: 'jorge@textildelsur.com',
    contact_phone: '+598-99-567-890',
    first_name: 'Jorge',
    last_name: 'Mendez',
    locations: [
      {
        id: 7,
        name: 'Planta de Producción',
        address: 'Ruta 8 Km 17.5, Montevideo',
        contact_name: 'Jorge Mendez',
        contact_phone: '+598-99-567-890',
      },
      {
        id: 8,
        name: 'Depósito de Materiales',
        address: 'Ruta 8 Km 17.5, Montevideo - Galpón B',
        contact_name: 'Ana Pereira',
        contact_phone: '+598-99-567-891',
      },
    ],
  },
];

// Helper function to get clients for driver app (with numeric IDs)
export const getClientsForDriverApp = () => {
  return SHARED_CLIENTS.map(client => ({
    id: client.id_numeric,
    client_name: client.client_name,
    contact_email: client.contact_email,
    contact_phone: client.contact_phone,
    first_name: client.first_name,
    last_name: client.last_name,
    locations: client.locations
  }));
};

// Helper function to get clients for admin panel (with string IDs)
export const getClientsForAdmin = () => {
  return SHARED_CLIENTS.map(client => ({
    id: client.id,
    client_name: client.client_name,
    client_type: client.client_type,
    pickup_frequency: client.pickup_frequency,
    contact_name: client.contact_name,
    contact_email: client.contact_email,
    contact_phone: client.contact_phone,
    locations: client.locations
  }));
};

// Helper to get client by numeric ID
export const getClientByNumericId = (id) => {
  return SHARED_CLIENTS.find(client => client.id_numeric === parseInt(id));
};

// Helper to get client by string ID
export const getClientByStringId = (id) => {
  return SHARED_CLIENTS.find(client => client.id === id);
};



