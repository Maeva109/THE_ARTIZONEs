import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

const BACKEND_URL = 'http://localhost:8000';

type ProductFormProps = {
  product: any;
  onSubmit: (productData: any) => void;
  onCancel: () => void;
  mode: string;
};

export default function ProductForm({ product, onSubmit, onCancel, mode }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || '');
  const [price, setPrice] = useState(product?.price || '');
  const [stock, setStock] = useState(product?.stock || '');
  const [status, setStatus] = useState(product?.status || 'active');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(product?.images || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger les catégories pour le dropdown
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories/`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        setError('Format d\'image non supporté (jpg, jpeg, png uniquement).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 2MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    if (!description.trim()) {
      setError('La description est requise.');
      return;
    }
    if (!category) {
      setError('La catégorie est requise.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      setError('Le stock doit être un nombre positif ou nul.');
      return;
    }
    if (!isEdit && !image) {
      setError("L'image est requise.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('status', status);
      if (image) formData.append('images', image);
      const url = isEdit ? `${BACKEND_URL}/api/products/${product.id}/` : `${BACKEND_URL}/api/products/`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        body: formData
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'Erreur lors de la sauvegarde.');
      } else {
        setSuccess(isEdit ? 'Produit modifié !' : 'Produit ajouté !');
        if (onSubmit) onSubmit(formData);
        setTimeout(() => {
          onCancel();
        }, 800);
      }
    } catch (err) {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">{isEdit ? 'Modifier' : 'Ajouter'} un produit</h3>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div>
        <label className="block mb-1 font-medium">Nom *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description *</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Catégorie *</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Prix (€) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Stock *</label>
          <input
            type="number"
            min="0"
            step="1"
            className="w-full border rounded px-3 py-2"
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Statut *</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Image {isEdit ? '' : '*'}</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageChange}
        />
        {preview && (
          <img src={preview} alt="Prévisualisation" className="h-20 mt-2 rounded" />
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded border"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#405B35] text-white hover:bg-[#2e4025]"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
} 