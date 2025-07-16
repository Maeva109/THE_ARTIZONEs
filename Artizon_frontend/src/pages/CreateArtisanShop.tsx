
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Upload, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const artisanFormSchema = z.object({
  email: z.string().email('Email invalide'),
  verificationCode: z.string().min(4, 'Code de vérification requis'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  shopName: z.string().min(2, 'Nom du magasin requis'),
  address1: z.string().min(5, 'Adresse requise'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Ville/Localité requise'),
  businessPhone: z.string().min(8, 'Téléphone de l\'entreprise requis'),
  region: z.string().min(1, 'Région requise'),
  department: z.string().min(1, 'Département requis'),
  password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
  confirmPassword: z.string().min(8, 'Confirmation mot de passe requise'),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité'),
  acceptCharter: z.boolean().refine(val => val === true, 'Vous devez accepter la charte des artisans')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ArtisanFormData = z.infer<typeof artisanFormSchema>;

const CreateArtisanShop = () => {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    demandeTimbre: null,
    attestationEnregistrement: null,
    photosProduits: null,
    planLocalisation: null,
    copieCNI: null,
  });
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ArtisanFormData>({
    resolver: zodResolver(artisanFormSchema)
  });

  const email = watch('email');
  const selectedRegion = watch('region');

  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }
    setCheckingEmail(true);
    const timeout = setTimeout(() => {
      fetch(`http://localhost:8000/api/check-email/?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          setEmailExists(!!data.exists);
          setCheckingEmail(false);
        })
        .catch(() => {
          setEmailExists(false);
          setCheckingEmail(false);
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, [email]);

  // Regions and departments data
  const regions = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];

  const departmentsByRegion: {[key: string]: string[]} = {
    'Ouest': ['Bamboutos', 'Haut-Nkam', 'Hauts-Plateaux', 'Koung-Khi', 'Menoua', 'Mifi', 'Noun', 'Ndé'],
    'Centre': ['Haute-Sanaga', 'Lekié', 'Mbam-et-Inoubou', 'Mbam-et-Kim', 'Méfou-et-Afamba', 'Méfou-et-Akono', 'Mfoundi', 'Nyong-et-Kéllé', 'Nyong-et-Mfoumou', 'Nyong-et-So\'o'],
    // Add other regions as needed
  };

  const handleSendVerificationCode = async () => {
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un email valide"
      });
      return;
    }
    setSendingCode(true);
    try {
      const res = await fetch('http://localhost:8000/api/send-verification-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setIsVerificationSent(true);
        toast({
          title: "Code envoyé",
          description: "Un code de vérification a été envoyé à votre email"
        });
      } else {
        const err = await res.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: err.error || "Erreur lors de l'envoi du code"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'envoi du code"
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleFileUpload = (fileType: string, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const onSubmit = async (data: ArtisanFormData) => {
    if (emailExists) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Cet email est déjà utilisé"
      });
      return;
    }
    try {
      // Check if all required files are uploaded
      const requiredFiles = ['demandeTimbre', 'attestationEnregistrement', 'photosProduits', 'planLocalisation', 'copieCNI'];
      const missingFiles = requiredFiles.filter(fileType => !uploadedFiles[fileType]);
      if (missingFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Documents manquants",
          description: "Veuillez télécharger tous les documents requis"
        });
        return;
      }
      // Build FormData for backend
      const formData = new FormData();
      formData.append('user[nom]', data.lastName);
      formData.append('user[prenom]', data.firstName);
      formData.append('user[email]', data.email);
      formData.append('user[telephone]', data.businessPhone);
      formData.append('user[password]', data.password);
      formData.append('shop_name', data.shopName);
      formData.append('departement', data.department);
      formData.append('ville', data.city);
      formData.append('description_artisan', data.address1 + (data.address2 ? ' ' + data.address2 : ''));
      formData.append('region', data.region);
      // Fichiers
      formData.append('demande_timbre', uploadedFiles.demandeTimbre!);
      formData.append('attestation_enregistrement', uploadedFiles.attestationEnregistrement!);
      formData.append('photos_produits', uploadedFiles.photosProduits!);
      formData.append('plan_localisation', uploadedFiles.planLocalisation!);
      formData.append('copie_cni', uploadedFiles.copieCNI!);
      // Envoi
      const res = await fetch('http://localhost:8000/api/artisans/', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.id) {
          localStorage.setItem('artisan_id', result.id.toString());
        }
        toast({ title: "Demande envoyée", description: "Votre demande a été soumise avec succès" });
        navigate('/artisan/confirmation');
      } else {
        const err = await res.json();
        toast({ variant: 'destructive', title: 'Erreur', description: err.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'envoi de la demande"
      });
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
                <BreadcrumbLink href="/artisans">Nos artisans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Créer sa boutique d'artisan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-[#405B35] mb-2">
                Créer sa boutique d'artisan
              </CardTitle>
              <p className="text-xl text-gray-600">Enregistrement</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email and Verification */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      {...register('email')}
                      type="email"
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {checkingEmail && <p className="text-gray-500 text-sm mt-1">Vérification...</p>}
                    {emailExists && <p className="text-red-500 text-sm mt-1">Cet email est déjà utilisé</p>}
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="verificationCode">Code de Vérification *</Label>
                    <div className="flex gap-2">
                      <Input
                        {...register('verificationCode')}
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                        disabled={!isVerificationSent}
                      />
                      <Button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={!email || isVerificationSent || sendingCode}
                        className="bg-[#405B35] hover:bg-[#405B35]/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendingCode ? 'Envoi...' : isVerificationSent ? 'Envoyé' : 'Envoyer'}
                      </Button>
                    </div>
                    {errors.verificationCode && <p className="text-red-500 text-sm mt-1">{errors.verificationCode.message}</p>}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      {...register('firstName')}
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      {...register('lastName')}
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Shop Information */}
                <div>
                  <Label htmlFor="shopName">Nom du magasin *</Label>
                  <Input
                    {...register('shopName')}
                    className="focus:border-[#405B35] focus:ring-[#405B35]"
                  />
                  {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName.message}</p>}
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address1">Adresse 1 *</Label>
                    <Input
                      {...register('address1')}
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address2">Adresse 2 (optionnel)</Label>
                    <Input
                      {...register('address2')}
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville/Localité *</Label>
                      <Input
                        {...register('city')}
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="businessPhone">Téléphone de l'entreprise *</Label>
                      <Input
                        {...register('businessPhone')}
                        type="tel"
                        className="focus:border-[#405B35] focus:ring-[#405B35]"
                      />
                      {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Region and Department */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Région *</Label>
                    <Select onValueChange={(value) => setValue('region', value)}>
                      <SelectTrigger className="focus:border-[#405B35] focus:ring-[#405B35]">
                        <SelectValue placeholder="Sélectionner une région" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Département *</Label>
                    <Select 
                      onValueChange={(value) => setValue('department', value)}
                      disabled={!selectedRegion}
                    >
                      <SelectTrigger className="focus:border-[#405B35] focus:ring-[#405B35]">
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRegion && departmentsByRegion[selectedRegion]?.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#405B35]">Documents requis</h3>
                  
                  {[
                    { key: 'demandeTimbre', label: 'Demande timbrée' },
                    { key: 'attestationEnregistrement', label: 'Attestation d\'enregistrement dans sa commune' },
                    { key: 'photosProduits', label: 'Photo de vos produits' },
                    { key: 'planLocalisation', label: 'Plan de localisation' },
                    { key: 'copieCNI', label: 'Photocopie de la CNI' }
                  ].map(({ key, label }) => (
                    <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">{label} *</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={key}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <label
                            htmlFor={key}
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#405B35] text-white rounded-md hover:bg-[#405B35]/90"
                          >
                            <Upload className="h-4 w-4" />
                            Choisir fichier
                          </label>
                        </div>
                      </div>
                      {uploadedFiles[key] && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedFiles[key]?.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Password */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Mot de passe *</Label>
                    <Input
                      {...register('password')}
                      type="password"
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirmez le mot de passe *</Label>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      className="focus:border-[#405B35] focus:ring-[#405B35]"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm leading-5">
                      J'accepte les conditions générales d'utilisation *
                    </Label>
                  </div>
                  {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>}
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptPrivacy"
                      onCheckedChange={(checked) => setValue('acceptPrivacy', checked as boolean)}
                    />
                    <Label htmlFor="acceptPrivacy" className="text-sm leading-5">
                      J'accepte la politique de confidentialité *
                    </Label>
                  </div>
                  {errors.acceptPrivacy && <p className="text-red-500 text-sm">{errors.acceptPrivacy.message}</p>}
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptCharter"
                      onCheckedChange={(checked) => setValue('acceptCharter', checked as boolean)}
                    />
                    <Label htmlFor="acceptCharter" className="text-sm leading-5">
                      J'accepte la charte des artisans Artizone *
                    </Label>
                  </div>
                  {errors.acceptCharter && <p className="text-red-500 text-sm">{errors.acceptCharter.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#405B35] hover:bg-[#405B35]/90 px-8 py-3 text-lg"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
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

export default CreateArtisanShop;
