import React, { useState, useEffect } from 'react';
import NavigationWrapper from '../components/Navigation/NavigationWrapper';
import { MATERIALS_LIST, getMaterialsByCategory } from '../../../shared/materials';

const ActiveMaterials = () => {
    // Get materials from shared configuration
    const [materials, setMaterials] = useState(MATERIALS_LIST);

    // Group materials by category
    const groupedMaterials = getMaterialsByCategory();

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

                    <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-sm text-green-800">
                        <strong>✓ Sincronizado en tiempo real:</strong> Esta lista se comparte automáticamente con la aplicación móvil desde <code>shared/materials.js</code>. Cualquier cambio en el archivo compartido se reflejará en ambas aplicaciones.
                    </div>
                </div>
            </div>
        </NavigationWrapper>
    );
};


export default ActiveMaterials;
