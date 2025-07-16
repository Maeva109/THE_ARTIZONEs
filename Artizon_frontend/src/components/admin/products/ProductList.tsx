import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

const BACKEND_URL = 'http://localhost:8000';

export default function ProductList() {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null as any);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Charger les produits depuis l'API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/`);
      if (!res.ok) throw new Error('Erreur lors du chargement des produits');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setNotif({ type: 'error', message: 'Impossible de charger les produits.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Suppression d'un produit
  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Produit supprimé.' });
      fetchProducts();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de la suppression.' });
    }
  };

  // Ajout d'un produit (POST vers backend)
  const handleCreateProduct = async (productData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('status', productData.status);
      if (productData.image) formData.append('images', productData.image);
      const res = await fetch(`${BACKEND_URL}/api/products/`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Produit ajouté.' });
      setShowModal(false);
      fetchProducts();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de l\'ajout.' });
    }
  };

  // Edition d'un produit (PUT vers backend)
  const handleEditProduct = async (productData: any) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('status', productData.status);
      if (productData.image) formData.append('images', productData.image);
      const res = await fetch(`${BACKEND_URL}/api/products/${productData.id}/`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error();
      setNotif({ type: 'success', message: 'Produit modifié.' });
      setShowModal(false);
      fetchProducts();
    } catch {
      setNotif({ type: 'error', message: 'Erreur lors de la modification.' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produits</h2>
        <button
          className="bg-[#405B35] text-white px-4 py-2 rounded hover:bg-[#2e4025]"
          onClick={() => { setEditProduct(null); setShowModal(true); }}
        >
          + Ajouter un produit
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
              <th className="px-4 py-2 border">Prix</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Statut</th>
              <th className="px-4 py-2 border">Catégorie</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="px-4 py-2 border">{prod.name}</td>
                <td className="px-4 py-2 border">{prod.price} €</td>
                <td className="px-4 py-2 border">{prod.stock}</td>
                <td className="px-4 py-2 border">{prod.status}</td>
                <td className="px-4 py-2 border">{prod.category_name || prod.category}</td>
                <td className="px-4 py-2 border">{prod.images ? <img src={prod.images} alt={prod.name} className="h-10" /> : '-'}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => { setEditProduct(prod); setShowModal(true); }}
                  >
                    Éditer
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(prod.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
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
            <ProductForm
              product={editProduct}
              onSubmit={editProduct ? handleEditProduct : handleCreateProduct}
              onCancel={() => setShowModal(false)}
              mode={editProduct ? 'edit' : 'create'}
            />
          </div>
        </div>
      )}
    </div>
  );
} 