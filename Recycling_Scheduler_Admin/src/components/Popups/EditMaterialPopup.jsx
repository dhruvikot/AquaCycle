import React, { useState } from 'react';

const EditMaterialPopup = ({ onClose, material, onUpdate }) => {
  console.log('EditMaterialPopup rendered with material:', material);
  const [name, setName] = useState(material?.name || '');
  const [category, setCategory] = useState(material?.category || 'Plásticos');
  const [color, setColor] = useState(material?.color || '#ffc000');

  const categories = ['Plásticos', 'Papel y Cartón', 'Metales', 'Vidrio', 'Otros', 'Descarte'];
  const colorOptions = [
    { value: '#ffc000', label: 'Yellow' },
    { value: '#7f6000', label: 'Brown' },
    { value: '#4a86e8', label: 'Blue' },
    { value: 'grey', label: 'Grey' },
  ];

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a material name');
      return;
    }

    const updatedMaterial = {
      ...material,
      name: name.trim(),
      category: category,
      color: color
    };

    onUpdate(updatedMaterial);
    onClose();
  };

  return (
    <div className="popup_body">
      <div className="popup">
        <div className="client_info">
          <div className="popup_header">
            <div className="popup_title">Editar Material</div>
            <button className="popup_close" onClick={() => onClose()}>X</button>
          </div>
          <div className="popup_field">
            <div className="popup_field_title">ID:</div>
            <input 
              type="text" 
              className="popup_field_input" 
              value={material?.id || ''}
              disabled
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="popup_field">
            <div className="popup_field_title">Nombre:</div>
            <input 
              type="text" 
              className="popup_field_input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: PET Cristal"
            />
          </div>
          <div className="popup_field">
            <div className="popup_field_title">Categoría:</div>
            <select 
              className="popup_field_input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="popup_field">
            <div className="popup_field_title">Color:</div>
            <select 
              className="popup_field_input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {colorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div 
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                border: '1px solid #000',
                marginTop: '10px',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
        <button className="popup_add_client_btn" onClick={handleSubmit}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditMaterialPopup;

