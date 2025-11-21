import React, { useState, useEffect } from 'react';
import NavigationWrapper from '../components/Navigation/NavigationWrapper';

const ActiveMaterials = () => {
    // Materials matching the classify component
    const [materials, setMaterials] = useState([
        { id: 1, name: 'PET Cristal', category: 'Plásticos' },
        { id: 2, name: 'PET Verde', category: 'Plásticos' },
        { id: 3, name: 'PET Bandejas', category: 'Plásticos' },
        { id: 4, name: 'Polietileno Botella', category: 'Plásticos' },
        { id: 5, name: 'Nylon Transparente', category: 'Plásticos' },
        { id: 6, name: 'Nylon Color', category: 'Plásticos' },
        { id: 7, name: 'Papel Blanco', category: 'Papel y Cartón' },
        { id: 8, name: 'Revista/Diario', category: 'Papel y Cartón' },
        { id: 9, name: 'Cartón Corrugado', category: 'Papel y Cartón' },
        { id: 10, name: 'Aluminio', category: 'Metales' },
        { id: 11, name: 'Chatarra', category: 'Metales' },
        { id: 12, name: 'Electrónicos', category: 'Otros' },
        { id: 13, name: 'Vidrio', category: 'Vidrio' },
        { id: 14, name: 'Tetrabrik', category: 'Otros' },
        { id: 15, name: 'Poliestireno Expandido', category: 'Plásticos' },
        { id: 16, name: 'PP (5)', category: 'Plásticos' },
        { id: 17, name: 'Poliestireno PS (6)', category: 'Plásticos' },
        { id: 18, name: 'Descarte', category: 'Descarte' },
    ]);

    // Group materials by category
    const groupedMaterials = materials.reduce((acc, material) => {
        if (!acc[material.category]) {
            acc[material.category] = [];
        }
        acc[material.category].push(material);
        return acc;
    }, {});

    return (
        <NavigationWrapper>
            <div className="pt-12 w-full flex items-center justify-center">
                <div className="flex flex-col w-11/12 md:w-5/6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl md:text-5xl text-black/70">Materiales Activos</h1>
                    </div>

                    <div className="flex flex-col w-full bg-white/20 border-[1px] border-black/40 rounded-3xl p-6 mb-32 shadow-xl shadow-black/30">
                        {Object.entries(groupedMaterials).map(([category, items]) => (
                            <div key={category} className="mb-6">
                                <h2 className="text-2xl font-bold text-black/70 mb-4">{category}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map((material) => (
                                        <div
                                            key={material.id}
                                            className="bg-white/50 rounded-xl p-4 border border-black/20"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg text-black">{material.name}</span>
                                                <span className="text-sm text-black/50">#{material.id}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-800">
                        <strong>Nota:</strong> Esta lista coincide con los materiales disponibles en la función de clasificación de la aplicación móvil.
                    </div>
                </div>
            </div>
        </NavigationWrapper>
    );
};


export default ActiveMaterials;
