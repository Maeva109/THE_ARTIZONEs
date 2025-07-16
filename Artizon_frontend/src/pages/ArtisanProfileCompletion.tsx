
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Upload, Image, Clock, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { artisanAPI } from '@/lib/api';

// Profile completion schema
const profileSchema = z.object({
  profilePhoto: z.string().optional(),
  description: z.string().min(50, 'Description minimum 50 caractères'),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  openingHours: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ArtisanProfileCompletion = () => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [loadingArtisan, setLoadingArtisan] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { artisanId } = useParams(); // Get from URL params if available
  const { toast } = useToast();

  // Detect edit mode from query string
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsEditMode(searchParams.get('edit') === '1');
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  // Function to get artisan ID from various sources
  const getArtisanId = (): string => {
    // 1. Query string
    const searchParams = new URLSearchParams(window.location.search);
    const queryId = searchParams.get('artisan_id');
    if (queryId) return queryId;
    // 2. URL params
    if (artisanId) return artisanId;
    // 3. localStorage
    const storedId = localStorage.getItem('artisan_id');
    if (storedId) return storedId;
    // 4. fallback
    return '1';
  };

  // Fetch artisan data on mount
  useEffect(() => {
    const fetchArtisan = async () => {
      setLoadingArtisan(true);
      try {
        const id = getArtisanId();
        const data = await artisanAPI.getProfile(id);
        setArtisanData(data);
        // If in edit mode, pre-fill the form fields
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('edit') === '1' && data) {
          setValue('description', data.description_artisan || '');
          setValue('facebook', data.facebook || '');
          setValue('instagram', data.instagram || '');
          setValue('whatsapp', data.whatsapp || '');
          setValue('openingHours', data.opening_hours || '');
          // No prefill for profilePhoto or galleryPhotos (file inputs)
        }
      } catch (e) {
        setArtisanData(null);
      } finally {
        setLoadingArtisan(false);
      }
    };
    fetchArtisan();
    // eslint-disable-next-line
  }, [setValue]);

  const handleProfilePhotoChange = (file: File | null) => {
    setProfilePhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewPhoto('');
    }
  };

  const handleGalleryUpload = (files: FileList | null) => {
    if (files) {
      const newPhotos = Array.from(files).slice(0, 6 - galleryPhotos.length);
      setGalleryPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      // Add text fields
      formData.append('description', data.description);
      if (data.facebook) formData.append('facebook', data.facebook);
      if (data.instagram) formData.append('instagram', data.instagram);
      if (data.whatsapp) formData.append('whatsapp', data.whatsapp);
      if (data.openingHours) formData.append('opening_hours', data.openingHours);
      // Add profile photo
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }
      // Add gallery photos
      galleryPhotos.forEach((photo, index) => {
        formData.append('galerie', photo);
      });
      // Get artisan ID and update profile
      const artisanId = getArtisanId();
      const result = await artisanAPI.updateProfile(artisanId, formData);
      toast({
        title: isEditMode ? "Profil mis à jour" : "Profil complété",
        description: isEditMode ? "Votre profil artisan a été mis à jour avec succès" : "Votre boutique artisan a été créée avec succès"
      });
      // Navigate to the artisan's public profile using the actual artisan ID
      const boutiqueSlug = result.boutique_id 
        ? result.boutique_id.toLowerCase().replace(/\s+/g, '-')
        : `artisan-${artisanId}`;
      navigate(`/artisan/${boutiqueSlug}`);
    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la finalisation du profil"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/mon-compte">Mon compte</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Finalisation profil artisan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-[#405B35] mb-2">
                Finalisez votre profil artisan
              </CardTitle>
              <p className="text-gray-600">
                Complétez votre profil pour optimiser votre boutique
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Informations enregistrées */}
              <div className="bg-gray-100 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#405B35] mb-4">Informations enregistrées</h3>
                {loadingArtisan ? (
                  <div className="text-gray-500">Chargement...</div>
                ) : artisanData ? (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Nom :</span> {artisanData.user?.prenom} {artisanData.user?.nom}</div>
                    <div><span className="font-medium">Boutique :</span> {artisanData.boutique_id}</div>
                    <div><span className="font-medium">Email :</span> {artisanData.user?.email}</div>
                    <div><span className="font-medium">Localisation :</span> {artisanData.ville}, {artisanData.region}</div>
                  </div>
                ) : (
                  <div className="text-red-500">Impossible de charger les informations de l'artisan.</div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Profile Photo */}
                <div>
                  <Label className="text-lg font-semibold text-[#405B35]">Photo de profil / Logo</Label>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={(e) => handleProfilePhotoChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label
                        htmlFor="profilePhoto"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#405B35] text-white rounded-md hover:bg-[#405B35]/90"
                      >
                        <Upload className="h-4 w-4" />
                        Choisir une photo
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Format recommandé : JPG, PNG (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold text-[#405B35]">
                    Description / Bio *
                  </Label>
                  <Textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Parlez-nous de votre histoire, votre savoir-faire, ce qui vous passionne dans l'artisanat..."
                    className="mt-2 focus:border-[#405B35] focus:ring-[#405B35]"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Social Media */}
                <div>
                  <Label className="text-lg font-semibold text-[#405B35] mb-4 block">Réseaux sociaux</Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        {...register('facebook')}
                        placeholder="https://facebook.com/votre-page"
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                      />
                      {errors.facebook && <p className="text-red-500 text-sm mt-1">{errors.facebook.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        {...register('instagram')}
                        placeholder="https://instagram.com/votre-compte"
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                      />
                      {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        {...register('whatsapp')}
                        placeholder="+237 6XX XXX XXX"
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <Label className="text-lg font-semibold text-[#405B35] mb-4 block">Galerie de photos</Label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <input
                        type="file"
                        id="gallery"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleGalleryUpload(e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor="gallery"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500"
                      >
                        <Upload className="h-8 w-8" />
                        <span>Cliquez pour ajouter des photos de vos créations</span>
                        <span className="text-sm">(Maximum 6 photos)</span>
                      </label>
                    </div>
                    
                    {galleryPhotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {galleryPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryPhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <Label htmlFor="openingHours" className="text-lg font-semibold text-[#405B35]">
                    Horaires d'ouverture (optionnel)
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <Textarea
                      {...register('openingHours')}
                      rows={3}
                      placeholder="Ex: Lundi-Vendredi: 8h-17h, Samedi: 8h-12h, Dimanche: Fermé"
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#405B35] hover:bg-[#405B35]/90 px-8 py-3 text-lg"
                  >
                    {isSubmitting ? 'Création en cours...' : 'Valider et créer ma boutique'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanProfileCompletion;
