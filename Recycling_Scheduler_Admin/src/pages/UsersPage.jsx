import React, { useState, useEffect } from 'react';
import NavigationWrapper from '../components/Navigation/NavigationWrapper';
import calls from '../api/dummyCalls';
import Spinner from '../components/Navigation/Spinner';

const ROLE_LABELS_ES = {
  admin: 'Administrador',
  collector: 'Receptor',
  classifier: 'Clasificador',
  both: 'Receptor y Clasificador',
};

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // ⟵ plain array
  const [saveUserResponse, setSaveUserResponse] = useState(null);

  const handleFetchUsers = async () => {
    try {
      setLoading(true);
      await calls.getUsers(setUsers); // sets array directly
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      // optimistic update on plain array
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updatedData } : u)));

      // send raw patch (no wrappers)
      await calls.editUser(updatedData, id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      // optimistic removal
      setUsers(prev => prev.filter(u => u.id !== id));

      await calls.deleteUser(id);
    } catch (e) {
      console.error(e);
    }
  };

  const [showAddUserMenu, setShowAddUserMenu] = useState(false);
  const [createUserFormData, setCreateUserFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    id: crypto.randomUUID(), // ⟵ explicit id is the only requirement
  });

  const handleShowAddUserMenu = () => setShowAddUserMenu(true);

  const handleCloseAddUserMenu = () => {
    setShowAddUserMenu(false);
    setCreateUserFormData({
      first_name: '',
      last_name: '',
      role: '',
      id: crypto.randomUUID(),
    });
  };

  const handleSaveAddUserMenu = async (e) => {
    try {
      e.preventDefault();
      const { first_name, last_name, role } = createUserFormData;
      if (!first_name || !last_name || !role) return;

      // optimistic prepend to array
      setUsers(prev => [createUserFormData, ...prev]);

      // send raw object as-is (no wrapper, no extra fields)
      await calls.createUser(createUserFormData, setSaveUserResponse);

      handleCloseAddUserMenu();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  return (
    <NavigationWrapper>
      <div className="pt-12 w-full flex items-center justify-center">
        <div className="flex flex-col w-11/12 md:w-5/6">
          <div className="flex justify-between">
            <div className="flex space-x-5 items-center">
              <h1 className="text-3xl md:text-5xl text-black/70">Usuarios</h1>
              {loading && (
                <div className="w-10 h-10">
                  <Spinner />
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={handleShowAddUserMenu}
                className="relative cursor-pointer bg-white shadow-xl shadow-black/30 text-black/70 rounded-3xl px-2.5 py-2 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                <span>Agregar Usuario</span>
              </button>
              {showAddUserMenu && (
                <UpsertUserMenu
                  title="Agregar Usuario"
                  form={createUserFormData}
                  setForm={setCreateUserFormData}
                  handleCancel={handleCloseAddUserMenu}
                  handleSave={handleSaveAddUserMenu}
                />
              )}
            </div>
          </div>
          {!loading && (
            <div className="flex flex-col w-full bg-white/20 border-[1px] border-black/40 rounded-3xl mt-12 mb-32 shadow-xl shadow-black/30">
              <div className="grid grid-cols-3 w-full text-black bg-white/20 rounded-t-3xl mb-3.5 p-5 font-bold">
                <span>Nombre</span>
                <span>Apellido</span>
                <span>Rol</span>
              </div>
              <div className="flex flex-col overflow-y-scroll h-full px-5 space-y-5">
                {users.map(user => (
                  <React.Fragment key={user.id}>
                    <UserEntry user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
                    <hr className="border-black/20 w-full" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </NavigationWrapper>
  );
};

const UserEntry = ({ user, onUpdate, onDelete }) => {
  const [showEditUser, setShowEditUser] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...user });

  const handleShowUpdateUserMenu = () => setShowEditUser(true);
  const handleCloseUpdateUserMenu = () => {
    setShowEditUser(false);
    setEditFormData({ ...user });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    await onUpdate(user.id, editFormData);
    setShowEditUser(false);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    await onDelete(user.id); // ⟵ pass only id
    setShowEditUser(false);
  };

  const roleToSpanish = (role) => (role && ROLE_LABELS_ES[role]) || role || '';

  return (
    <div id={user.id} className="relative text-sm md:text-base grid grid-cols-3 items-center text-black">
      <span>{user.first_name}</span>
      <span>{user.last_name}</span>
      <span>{roleToSpanish(user.role)}</span>
      <button onClick={handleShowUpdateUserMenu} className="absolute right-2 md:right-5 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
        </svg>
      </button>
      {showEditUser && (
        <UpsertUserMenu
          title="Actualizar Usuario"
          form={editFormData}
          setForm={setEditFormData}
          handleCancel={handleCloseUpdateUserMenu}
          handleSave={handleSaveEditUser}
          handleDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

const UpsertUserMenu = ({ title, form, setForm, handleCancel, handleSave, handleDelete }) => {
  const handleChange = field => e => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  return (
    <form
      className="flex flex-col z-[20] items-start absolute w-72 md:w-96 p-5 bg-white/20 border-[1px] border-black/40 backdrop-blur-3xl shadow-2xl shadow-black rounded-3xl -top-2 -right-2"
      onSubmit={handleSave}
    >
      <span className="text-black/70 text-lg">{title}:</span>
      <label className="mt-3 w-full">
        Nombre:
        <input
          type="text"
          value={form.first_name}
          onChange={handleChange('first_name')}
          className="w-full bg-white/50 rounded-lg p-2 mt-1"
        />
      </label>
      <label className="mt-3 w-full">
        Apellido:
        <input
          type="text"
          value={form.last_name}
          onChange={handleChange('last_name')}
          className="w-full bg-white/50 rounded-lg p-2 mt-1"
        />
      </label>
      <label className="mt-3 w-full">
        Rol:
        <select
          value={form.role}
          onChange={handleChange('role')}
          className="w-full bg-white/50 rounded-lg p-2 mt-1"
        >
          <option value="" disabled>Seleccionar</option>
          {Object.entries(ROLE_LABELS_ES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

      </label>
      <div className="flex flex-row justify-end space-x-5 w-full mt-5">
        {handleDelete && (
          <div className='w-full'>
            <button onClick={handleDelete} className='cursor-pointer' type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-6 h-6'>
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <button type="button" className="cursor-pointer" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="submit" className="py-1 px-2 bg-white rounded-3xl">
          {title.includes('Agregar') ? 'Crear' : 'Actualizar'}
        </button>
      </div>
    </form>
  );
};

export default UsersPage;