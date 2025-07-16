import { useState, FormEvent, ChangeEvent } from 'react';

const BACKEND_URL = 'http://localhost:8000';

type CategoryFormProps = {
  category: any;
  onSubmit: (categoryData: any) => void;
  onCancel: () => void;
  mode: string;
};

export default function CategoryForm({ category, onSubmit, onCancel, mode }: CategoryFormProps) {
  const isEdit = Boolean(category);
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(category?.image || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    if (!isEdit && !image) {
      setError("L'image est requise.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) formData.append('image', image);
      const token = localStorage.getItem('token_admin');
      const url = isEdit ? `${BACKEND_URL}/api/categories/${category.id}/` : `${BACKEND_URL}/api/categories/`;
      const method = isEdit ? 'PUT' : 'POST';
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(url, {
        method,
        headers,
        body: formData
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'Erreur lors de la sauvegarde.');
      } else {
        setSuccess(isEdit ? 'Catégorie modifiée !' : 'Catégorie ajoutée !');
        if (onSubmit) onSubmit(isEdit ? { ...category, name, description, image } : { name, description, image });
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
      <h3 className="text-xl font-semibold mb-2">{isEdit ? 'Modifier' : 'Ajouter'} une catégorie</h3>
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