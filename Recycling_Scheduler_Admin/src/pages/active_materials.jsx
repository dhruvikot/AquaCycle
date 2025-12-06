import React, { useState, useEffect } from 'react';
import NavigationWrapper from '../components/Navigation/NavigationWrapper';
import { MATERIALS_LIST, getMaterialsByCategory } from '../../../shared/materials';
import AddMaterialPopup from '../components/Popups/AddMaterialPopup';
import EditMaterialPopup from '../components/Popups/EditMaterialPopup';
import editIcon from '../images/edit_icon.png';

const ActiveMaterials = () => {
    // Get materials from shared configuration or localStorage
    const getInitialMaterials = () => {
        const stored = localStorage.getItem('materials');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return MATERIALS_LIST;
            }
        }
        return MATERIALS_LIST;
    };

    const [materials, setMaterials] = useState(getInitialMaterials());
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);

    // Debug: Log state changes
    useEffect(() => {
        console.log('showAddPopup:', showAddPopup);
    }, [showAddPopup]);

    useEffect(() => {
        console.log('showEditPopup:', showEditPopup, 'editingMaterial:', editingMaterial);
    }, [showEditPopup, editingMaterial]);

    // Save to localStorage whenever materials change
    useEffect(() => {
        localStorage.setItem('materials', JSON.stringify(materials));
    }, [materials]);

    // Group materials by category
    const groupedMaterials = materials.reduce((acc, material) => {
        if (!acc[material.category]) {
            acc[material.category] = [];
        }
        acc[material.category].push(material);
        return acc;
    }, {});

    const handleAddMaterial = (newMaterial) => {
        setMaterials([...materials, newMaterial]);
    };

    const handleEditMaterial = (updatedMaterial) => {
        setMaterials(materials.map(m => 
            m.id === updatedMaterial.id ? updatedMaterial : m
        ));
    };

    const handleEditClick = (material) => {
        setEditingMaterial(material);
        setShowEditPopup(true);
    };

    return (
        <NavigationWrapper>
            <div className="pt-12 w-full flex items-center justify-center">
                <div className="flex flex-col w-11/12 md:w-5/6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl md:text-5xl text-black/70">Materiales Activos</h1>
                        <button
                            onClick={() => {
                                console.log('Add button clicked, setting showAddPopup to true');
                                setShowAddPopup(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
                        >
                            + Nuevo Material
                        </button>
                    </div>

                    <div className="flex flex-col w-full bg-white/20 border-[1px] border-black/40 rounded-3xl p-6 mb-32 shadow-xl shadow-black/30">
                        {Object.entries(groupedMaterials).map(([category, items]) => (
                            <div key={category} className="mb-6">
                                <h2 className="text-2xl font-bold text-black/70 mb-4">{category}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map((material) => (
                                        <div
                                            key={material.id}
                                            className="bg-white/50 rounded-xl p-4 border border-black/20 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: material.color,
                                                        border: '1px solid #000',
                                                        borderRadius: '4px',
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-lg text-black">{material.name}</span>
                                                    <span className="text-sm text-black/50">#{material.id}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    console.log('Edit button clicked for material:', material);
                                                    handleEditClick(material);
                                                }}
                                                className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors"
                                                title="Editar material"
                                            >
                                                <img src={editIcon} alt="Edit" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAddPopup && (
                <AddMaterialPopup
                    onClose={() => {
                        console.log('Closing add popup');
                        setShowAddPopup(false);
                    }}
                    onAdd={(newMaterial) => {
                        console.log('Adding new material:', newMaterial);
                        handleAddMaterial(newMaterial);
                        setShowAddPopup(false);
                    }}
                />
            )}

            {showEditPopup && editingMaterial && (
                <EditMaterialPopup
                    onClose={() => {
                        setShowEditPopup(false);
                        setEditingMaterial(null);
                    }}
                    material={editingMaterial}
                    onUpdate={(updatedMaterial) => {
                        handleEditMaterial(updatedMaterial);
                        setShowEditPopup(false);
                        setEditingMaterial(null);
                    }}
                />
            )}
        </NavigationWrapper>
    );
};

export default ActiveMaterials;
