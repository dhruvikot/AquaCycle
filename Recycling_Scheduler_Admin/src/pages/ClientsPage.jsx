import React, { useEffect, useState } from 'react'
import { createClient, editClient, getClassifications, getClients, getCollectionsByIds } from '../api/dummyCalls';
import Spinner from '../components/Navigation/Spinner';
import NavigationWrapper from '../components/Navigation/NavigationWrapper';

const ClientsPage = () => {

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [saveClientREsponse, setSaveClientResponse] = useState(null);

  const handleFetchClients = async () => {
    try {
      setLoading(true);
      await getClients(setClients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [showAddClientMenu, setShowAddClientMenu] = useState(false);
  const [createClientFormData, setCreateClientFormData] = useState({
    id: crypto.randomUUID(),
    client_name: '',
    pickup_frequency: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    locations: [],
  });

  /**
   * Opens the add client form.
   */
  const handleShowAddClientMenu = () => setShowAddClientMenu(true);

  /**
   * Closes and resets the add user form.
   */
  const handleCloseAddClientMenu = () => {
    setShowAddClientMenu(false);
    setCreateClientFormData({
      id: crypto.randomUUID(),
      client_name: '',
      pickup_frequency: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      locations: [],
    })
  };

  /**
   * Handles submission of the add user form: validates, optimistically updates UI, and calls API.
   * @async
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSaveAddClient = async (e) => {
    try {
      e.preventDefault();

      // Destructure the relevant fields from your form state
      const {
        client_name,
        pickup_frequency,
        contact_name,
        contact_email,
        contact_phone,
        locations,
        id,
      } = createClientFormData;

      setClients(prev => [createClientFormData, ...prev]);

      // Call the API, wrapping the payload under “client” as required
      await createClient(
        {
          id,
          client_name,
          pickup_frequency,
          contact_name,
          contact_email,
          contact_phone,
          locations: locations.map(loc => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            contact_name: loc.contact_name,
            contact_phone: loc.contact_phone,
          })),
        },
        setSaveClientResponse
      );

      handleCloseAddClientMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClient = async (id, updatedData) => {
    try {

      // Update local state first (optimistic UI)
      setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updatedData } : c)));
      editClient(updatedData, id);
    } catch (e) {
      console.error(e);
    }
  };

  // CSV downloader with proper escaping
  const downloadCSV = (rows, { filename = 'reporte.csv' } = {}) => {
    if (!rows || !rows.length) return;

    // union of all keys across rows to keep columns stable
    const columns = Array.from(
      rows.reduce((set, r) => {
        Object.keys(r).forEach(k => set.add(k));
        return set;
      }, new Set())
    );

    const esc = (val) => {
      if (val === null || val === undefined) return '';
      const s = String(val).replace(/"/g, '""');
      // quote if it contains comma, quote, CR or LF
      return /[",\r\n]/.test(s) ? `"${s}"` : s;
    };

    const header = columns.map(esc).join(',');
    const body = rows
      .map(r => columns.map(c => esc(r[c])).join(','))
      .join('\r\n');

    // prepend BOM for Excel
    const csv = '\uFEFF' + header + '\r\n' + body;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // === helper: format Firestore Timestamp or Date ===
  const tsToISO = (ts) => {
    if (!ts) return '';
    const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Columns to exclude by default (you can override per call)
  const DEFAULT_EXCLUDE_COLUMNS = [
    'collectionId',
    'updatedAt',
    'id',
    'location',
    'timeStamp',
    'clientId',
  ];

  // === builds rows with BOTH classifications (classified kg) and collections (collected kg) ===
  // classDocs: array returned by getClassifications(clientId)
  // collById:  map { [collectionId]: collectionDoc }
  const prepareReportRows = (classDocs, collById, { exclude = DEFAULT_EXCLUDE_COLUMNS } = {}) => {
    const excludeSet = new Set(exclude);

    // collect all unique sub-material keys & materialIds for *classified*,
    // plus all unique materialIds for collected
    const subKeysSet = new Set(); // e.g. "papel_carton.papel_blanco" (classified)
    const classMatIdsSet = new Set(); // e.g. "papel_carton" (classified totals)
    const collMatIdsSet = new Set();  // e.g. "papel_carton" (collected types)

    classDocs.forEach(doc => {
      const arr = Array.isArray(doc.classifications) ? doc.classifications : [];
      arr.forEach(({ materialId, subMaterialId }) => {
        if (!materialId || !subMaterialId) return;
        subKeysSet.add(`${materialId}.${subMaterialId}`);
        classMatIdsSet.add(materialId);
      });
    });

    // also scan collections to know which collected columns to create
    Object.values(collById || {}).forEach(coll => {
      const carr = Array.isArray(coll.collections) ? coll.collections : [];
      carr.forEach(({ materialId }) => {
        if (materialId) collMatIdsSet.add(materialId);
      });
    });

    const subKeys = Array.from(subKeysSet).sort();
    const classMatIds = Array.from(classMatIdsSet).sort();
    const collMatIds = Array.from(collMatIdsSet).sort();

    const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
    const fmt = (n) => (safeNum(n)).toFixed(2);

    // build one row per classification document (1:1 with a collection via collectionId)
    return classDocs.map(doc => {
      const row = {};

      // copy all top-level fields except "classifications" and anything in exclude
      Object.entries(doc)
        .filter(([k]) => k !== 'classifications' && !excludeSet.has(k))
        .forEach(([k, v]) => {
          row[k] = (v && typeof v.toDate === 'function') ? tsToISO(v) : v;
        });

      // numeric accumulators
      const subTotals = {};   // per subKey
      const matTotals = {};   // per materialId
      let grand = 0;

      const arr = Array.isArray(doc.classifications) ? doc.classifications : [];
      arr.forEach(({ materialId, subMaterialId, weight }) => {
        const w = safeNum(weight);
        const key = `${materialId}.${subMaterialId}`;
        subTotals[key] = (subTotals[key] || 0) + w;
        matTotals[materialId] = (matTotals[materialId] || 0) + w;
        grand += w;
      });

      // ensure stable *classified* columns, defaulting to 0.00 where absent
      subKeys.forEach(k => { row[k] = fmt(subTotals[k] || 0); });
      classMatIds.forEach(m => { row[`TOTAL:${m}`] = fmt(matTotals[m] || 0); });
      row['TOTAL:ALL'] = fmt(grand);

      // === COLLECTED (from the matching collection doc) ===
      const coll = collById?.[doc.collectionId];
      const collTotals = {}; // per collected materialId
      let collGrand = 0;
      if (coll && Array.isArray(coll.collections)) {
        coll.collections.forEach(({ materialId, weight }) => {
          const w = safeNum(weight);
          if (!materialId) return;
          collTotals[materialId] = (collTotals[materialId] || 0) + w;
          collGrand += w;
        });
      }

      // stable collected columns
      collMatIds.forEach(m => { row[`COLLECTED:${m}`] = fmt(collTotals[m] || 0); });
      row['COLLECTED:ALL'] = fmt(collGrand);

      // difference columns
      row['DIFF:COLLECTED-CLASSIFIED'] = fmt(collGrand - grand);

      // If someone passes dynamic keys to exclude (e.g., "TOTAL:ALL"), honor them too
      excludeSet.forEach(k => { if (k in row) delete row[k]; });

      return row;
    });
  };

  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async (clientId) => {
    try {
      setLoadingReport(true);
      const classDocs = await getClassifications(clientId);

      // fetch the matching collection docs (by collectionId)
      const collectionIds = Array.from(
        new Set(
          classDocs
            .map(d => d.collectionId)
            .filter(Boolean)
        )
      );
      const collDocs = collectionIds.length
        ? await getCollectionsByIds(collectionIds)
        : [];
      const collById = Object.fromEntries(collDocs.map(c => [c.id, c]));

      const rows = prepareReportRows(classDocs, collById, { exclude: DEFAULT_EXCLUDE_COLUMNS });

      // Turn internal keys into clean Spanish headers (optionally add " [kg]")
      const prettyRows = prettifyRows(rows, { withUnits: false });

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      downloadCSV(prettyRows, {
        filename: `reporte_classifications_${clientId}_${today}.csv`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    handleFetchClients();
  }, []);

  // === Friendly labels for materials & submateriales ===
  const MATERIAL_LABELS = {
    papel_carton: 'Papel y cartón',
    plasticos: 'Plásticos',
    descarte: 'Descarte',
    organico: 'Orgánico',
    otros: 'Otros',
    otros_reciclables: 'Otros reciclables',
    mezclado: 'Mezclado',
  };

  const SUBMATERIAL_LABELS = {
    papel_carton: {
      carton_color: 'Cartón color',
      carton_corrugado: 'Cartón corrugado',
      papel_blanco: 'Papel blanco',
      papel_color: 'Papel color',
      revista_diario: 'Revista/Diario',
    },
    plasticos: {
      pet_natural: 'PET natural',
    },
    organico: { organico: 'Orgánico' },
    descarte: { descarte: 'Descarte' },
    otros: {
      electronicos: 'Electrónicos',
      latas_aluminio: 'Latas de aluminio',
    },
    mezclado: { mezclado: 'Mezclado' },
  };

  const TOP_FIELD_LABELS = {
    createdAt: 'Creado',
    updatedAt: 'Actualizado',
    timeStamp: 'Fecha',
    location: 'Ubicación',
    clientId: 'Cliente',
    collectionId: 'Colección',
    id: 'ID',
  };

  // fallback: "papel_carton" -> "Papel Carton"
  const titleize = (s) =>
    String(s)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const materialLabel = (id) => MATERIAL_LABELS[id] || titleize(id);
  const subMaterialLabel = (mat, sub) =>
    (SUBMATERIAL_LABELS[mat] && SUBMATERIAL_LABELS[mat][sub]) || titleize(sub);

  // Turn internal column key into a pretty Spanish header
  const prettyColName = (key, { withUnits = false } = {}) => {
    const unit = withUnits ? ' [kg]' : '';

    if (key === 'TOTAL:ALL') return `Clasificado (Total)${unit}`;
    if (key === 'COLLECTED:ALL') return `Recolectado (Total)${unit}`;
    if (key === 'DIFF:COLLECTED-CLASSIFIED') return `Diferencia (Recolectado − Clasificado)${unit}`;

    if (key.startsWith('TOTAL:')) {
      const m = key.split(':')[1];
      return `Clasificado (${materialLabel(m)})${unit}`;
    }
    if (key.startsWith('COLLECTED:')) {
      const m = key.split(':')[1];
      return `Recolectado (${materialLabel(m)})${unit}`;
    }
    if (key.includes('.')) {
      const [m, s] = key.split('.');
      // e.g. "Papel y cartón — Cartón corrugado"
      return `${materialLabel(m)} — ${subMaterialLabel(m, s)}${unit}`;
    }

    return TOP_FIELD_LABELS[key] || titleize(key);
  };

  // Map every row's keys to pretty headers
  const prettifyRows = (rows, opts = {}) =>
    rows.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [prettyColName(k, opts), v]))
    );


  return (
    <NavigationWrapper>
      <div className="pt-12 w-full flex items-center justify-center">
        <div className="flex flex-col w-11/12 md:w-5/6">
          <div className="flex justify-between">
            <div className="flex space-x-5 items-center">
              <h1 className="text-3xl md:text-5xl text-black/70">Clientes</h1>
              {loading && (
                <div className="w-10 h-10">
                  <Spinner />
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={handleShowAddClientMenu}
                className="relative cursor-pointer bg-white shadow-xl shadow-black/30 text-black/70 rounded-3xl px-2.5 py-2 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                <span>Agregar Cliente</span>
              </button>
              {showAddClientMenu && (
                <UpsertClientsPage
                  title="Agregar Cliente"
                  form={createClientFormData}
                  setForm={setCreateClientFormData}
                  handleCancel={handleCloseAddClientMenu}
                  handleSave={handleSaveAddClient}
                />)}
            </div>
          </div>
          {!loading && (
            <div className="flex flex-col w-full bg-white/20 border-[1px] border-black/40 rounded-3xl mt-12 mb-32 shadow-xl shadow-black/30">
              <div className="grid grid-cols-3 w-full text-black bg-white/20 rounded-t-3xl mb-3.5 p-5 font-bold">
                <span>Nombre</span>
                {/* <span>Frequencia de entrega</span> */}
                <span>Ubicaciónes</span>
              </div>
              <div className="flex flex-col overflow-y-scroll h-full px-5 space-y-5">
                {clients.map(client => (
                  <React.Fragment key={client.id}>
                    <ClientEntry
                      client={client}
                      loadingReport={loadingReport}
                      generateReport={handleGenerateReport}
                      onUpdate={handleUpdateClient}
                    />
                    <hr className="border-black/20 w-full" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </NavigationWrapper>
  )
}

const ClientEntry = ({ client, generateReport, loadingReport, onUpdate, onDelete }) => {

  const [showEditUser, setShowEditUser] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...client });

  const handleShowUpdateUserMenu = () => setShowEditUser(true);
  const handleCloseUpdateUserMenu = () => {
    setShowEditUser(false);
    setEditFormData({ ...client });
  };

  /**
  * Save handler for edit form
  * @async
  * @param {React.FormEvent} e
  */
  const handleSaveEditClient = async (e) => {
    e.preventDefault();
    await onUpdate(client.id, editFormData);
    setShowEditUser(false);
  };

  /**
   * Delete handler for edit form
   * @async
   * @param {React.FormEvent} e
   */
  const handleDeleteClient = async (e) => {
    e.preventDefault();
    await onDelete(client.id, editFormData);
    setShowEditUser(false);
  }

  const handleGenerateReport = (e) => {
    generateReport(client.id);
  }

  return (
    <div id={client.id} className="relative text-sm md:text-base grid grid-cols-3 gap-5 items-center text-black">
      <span>{client.client_name}</span>
      {/* <span>{client.pickup_frequency}</span> */}
      <div className='flex space-y-2 flex-col min-h-20'>
        {client?.locations?.map((location, index) => (
          <div key={location.id} className='flex flex-col p-2 rounded-lg bg-white/20'>
            {location.name && <span className='text-black/50'>
              Nombre:
            </span>}
            <span>
              {location.name}
            </span>
            {location.address && <span className='text-black/50'>
              Dirección:
            </span>}
            <span>
              {location.address}
            </span>
            {location.contact_name && <span className='text-black/50'>
              Contacto:
            </span>}
            <span>
              {location.contact_name}
            </span>
            {location.contact_phone && <span className='text-black/50'>
              Telefono del contacto:
            </span>}
            <span>
              {location.contact_phone}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-2 absolute right-2 md:right-5">
        <button
          onClick={handleShowUpdateUserMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 cursor-pointer"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={loadingReport}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 cursor-pointer"
          >
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z" clipRule="evenodd" />
            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
          </svg>
        </button>
      </div>
      {showEditUser && (
        <UpsertClientsPage
          title="Actualizar Cliente"
          form={editFormData}
          setForm={setEditFormData}
          handleCancel={handleCloseUpdateUserMenu}
          handleSave={handleSaveEditClient}
          handleDelete={handleDeleteClient}
        />
      )}
    </div>
  )
}

const UpsertClientsPage = ({ title, form, setForm, handleCancel, handleSave }) => {

  /**
   /**
   * Generic onChange handler for simple (top‐level) inputs
   * @param {string} field - top‐level form field name
   * @returns {function(React.ChangeEvent<HTMLInputElement|HTMLSelectElement>): void}
   */
  const handleChange = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  /**
   * onChange handler for a nested location field
   * @param {number} index - index within form.locations
   * @param {string} field - one of "name" | "address" | "contact_name" | "contact_phone"
   * @returns {function(React.ChangeEvent<HTMLInputElement>): void}
   */
  const handleLocationChange = (index, field) => (e) => {
    const updatedLocations = form.locations.map((loc, i) =>
      i === index ? { ...loc, [field]: e.target.value } : loc
    );
    setForm({ ...form, locations: updatedLocations });
  };

  /**
   * Add a blank location object (with a new UUID for its id)
   */
  const addLocation = () => {
    const newLocation = {
      id: crypto.randomUUID(),
      name: '',
      address: '',
      contact_name: '',
      contact_phone: '',
      client: form.id, // assuming the parent client ID is form.id
    };
    setForm({ ...form, locations: [...form.locations, newLocation] });
  };

  /**
   * Remove location at a given index
   * @param {number} index
   */
  const removeLocation = (index) => {
    const updated = form.locations.filter((_, i) => i !== index);
    setForm({ ...form, locations: updated });
  };

  return (
    <form
      className="flex flex-col z-[20] items-start absolute w-72 md:w-96 p-5 bg-white/20 border-[1px] border-black/40 backdrop-blur-3xl shadow-2xl shadow-black rounded-3xl -top-2 -right-2"
      onSubmit={handleSave}
    >
      <span className="text-black/70 text-lg">{title}:</span>

      {/* Client Name */}
      <span className="mt-3 w-full">
        Nombre del Cliente:
      </span>
      <input
        type="text"
        value={form.client_name}
        onChange={handleChange('client_name')}
        className="w-full bg-white/50 rounded-lg p-2 mt-1"
      />

      {/* Pickup Frequency */}
      <span className="mt-3 w-full">
        Frecuencia de Recogida:
      </span>
      <input
        type="text"
        value={form.pickup_frequency}
        onChange={handleChange('pickup_frequency')}
        placeholder="Ej. Lun Mar Mié Jue Vie"
        className="w-full bg-white/50 rounded-lg p-2 mt-1"
      />

      {/* First Name */}
      <span className="mt-3 w-full">
        Nombre de Contacto:
      </span>
      <input
        type="text"
        value={form.contact_name}
        onChange={handleChange('contact_name')}
        className="w-full bg-white/50 rounded-lg p-2 mt-1"
      />

      {/* Contact Email */}
      <span className="mt-3 w-full">
        Correo Electrónico de Contacto:
      </span>
      <input
        type="email"
        value={form.contact_email || ''}
        onChange={handleChange('contact_email')}
        className="w-full bg-white/50 rounded-lg p-2 mt-1"
      />

      {/* Contact Phone */}
      <span className="mt-3 w-full">
        Teléfono de Contacto:
      </span>
      <input
        type="tel"
        value={form.contact_phone || ''}
        onChange={handleChange('contact_phone')}
        className="w-full bg-white/50 rounded-lg p-2 mt-1"
      />

      <div className="mt-5 w-full">
        <div className='flex justify-between md:items-center flex-col md:flex-row'>
          <span className="text-black/70">Ubicaciones:</span>
          <button
            type="button"
            onClick={addLocation}
            className="relative cursor-pointer bg-white rounded-3xl px-2.5 py-2 flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            <span>
              Agregar Ubicación
            </span>
          </button>
        </div>
        {form.locations.map((loc, idx) => (
          <div key={loc.id} className="mt-3 p-3 bg-white/50 rounded-lg flex flex-col space-y-2 relative">
            <div className='w-full flex justify-between items-center'>
              <span className="w-full">
                Nombre de Ubicación:
              </span>
              <button
                type="button"
                onClick={() => removeLocation(idx)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='fill-black h-5 w-5'>
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={loc.name}
              onChange={handleLocationChange(idx, 'name')}
              className="w-full bg-white/70 rounded-lg p-2 mt-1"
            />

            <span className="w-full">
              Dirección:
            </span>
            <input
              type="text"
              value={loc.address}
              onChange={handleLocationChange(idx, 'address')}
              className="w-full bg-white/70 rounded-lg p-2 mt-1"
            />

            <span className="w-full">
              Nombre de Contacto:
            </span>
            <input
              type="text"
              value={loc.contact_name}
              onChange={handleLocationChange(idx, 'contact_name')}
              className="w-full bg-white/70 rounded-lg p-2 mt-1"
            />

            <span className="w-full">
              Teléfono de Contacto:
            </span>
            <input
              type="tel"
              value={loc.contact_phone || ''}
              onChange={handleLocationChange(idx, 'contact_phone')}
              className="w-full bg-white/70 rounded-lg p-2 mt-1"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-end space-x-5 w-full mt-5">
        <button type="button" className="cursor-pointer" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="submit" className="py-1 px-2 bg-white rounded-3xl cursor-pointer">
          {title.includes('Agregar') ? 'Crear' : 'Actualizar'}
        </button>
      </div>
    </form>)
};

export default ClientsPage