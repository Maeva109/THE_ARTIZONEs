import { useState, useEffect } from 'react';
import CategoryForm from './CategoryForm';

const BACKEND_URL = 'http://localhost:8000';

export default function CategoryList() {
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null as any);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/categories/`);
      if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setNotif({ type: 'error', message: 'Impossible de charger les catégories.' });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Suppression d'une catégorie
  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/categories/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Catégorie supprimée.' });
      fetchCategories();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de la suppression.' });
    }
  };

  // Ajout d'une catégorie (POST vers backend)
  const handleCreateCategory = async (categoryData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      if (categoryData.image) formData.append('image', categoryData.image);
      const res = await fetch(`${BACKEND_URL}/api/categories/`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Catégorie ajoutée.' });
      setShowModal(false);
      fetchCategories();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de l\'ajout.' });
    }
  };

  // Edition d'une catégorie (PUT vers backend)
  const handleEditCategory = async (categoryData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      if (categoryData.image) formData.append('image', categoryData.image);
      const res = await fetch(`${BACKEND_URL}/api/categories/${categoryData.id}/`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Catégorie modifiée.' });
      setShowModal(false);
      fetchCategories();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de la modification.' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Catégories</h2>
        <button
          className="bg-[#405B35] text-white px-4 py-2 rounded hover:bg-[#2e4025]"
          onClick={() => { setEditCategory(null); setShowModal(true); }}
        >
          + Ajouter une catégorie
        </button>
      </div>
      {notif && (
        <div className={`mb-4 p-2 rounded text-sm ${notif.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{notif.message}</div>
      )}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-2 border">{cat.name}</td>
                  <td className="px-4 py-2 border">{cat.description}</td>
                  <td className="px-4 py-2 border">{cat.image ? <img src={cat.image} alt={cat.name} className="h-10" /> : '-'}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => { setEditCategory(cat); setShowModal(true); }}
                    >
                      Éditer
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(cat.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center py-4">Aucune catégorie trouvée.</td></tr>
            )}
          </tbody>
        </table>
      )}
      {/* Modale d'ajout/édition */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <CategoryForm
              category={editCategory}
              onSubmit={editCategory ? handleEditCategory : handleCreateCategory}
              onCancel={() => setShowModal(false)}
              mode={editCategory ? 'edit' : 'create'}
            />
          </div>
        </div>
      )}
    </div>
  );
} 