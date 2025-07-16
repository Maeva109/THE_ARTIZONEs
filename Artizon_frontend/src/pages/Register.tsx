
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: 'client',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { label: 'Très faible', color: 'text-red-600' };
      case 2: return { label: 'Faible', color: 'text-orange-600' };
      case 3: return { label: 'Moyen', color: 'text-yellow-600' };
      case 4: return { label: 'Fort', color: 'text-green-600' };
      case 5: return { label: 'Très fort', color: 'text-green-700' };
      default: return { label: '', color: '' };
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Nom requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Prénom requis';
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Numéro de téléphone requis';
    } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = 'Le mot de passe n\'est pas assez fort';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation du mot de passe requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          role: formData.role,
          password: formData.password
        })
      });
      if (response.ok) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setErrors(data);
      }
    } catch (error) {
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="min-h-screen bg-[#EDF0E0] flex flex-col pt-32 md:pt-36">
      {/* Logo Section */}
      <div className="flex justify-center pt-8 pb-4">
        <Link to="/">
          <img 
            src="/lovable-uploads/f97e1591-edd7-4e11-a6c8-697a5d131cf0.png" 
            alt="Artizone Logo" 
            className="h-16 w-auto"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Registration Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Créer un compte Artizone
            </h1>

            {/* GDPR Information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                En créant un compte, vos données personnelles seront traitées conformément à notre 
                <Link to="/privacy" className="underline hover:no-underline"> politique de confidentialité</Link>.
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-600 text-sm">{errors.general}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <Label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Votre nom"
                  className={`w-full ${errors.nom ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                  aria-describedby={errors.nom ? 'nom-error' : undefined}
                />
                {errors.nom && (
                  <p id="nom-error" className="mt-1 text-sm text-orange-600">
                    {errors.nom}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Votre prénom"
                  className={`w-full ${errors.prenom ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                  aria-describedby={errors.prenom ? 'prenom-error' : undefined}
                />
                {errors.prenom && (
                  <p id="prenom-error" className="mt-1 text-sm text-orange-600">
                    {errors.prenom}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  className={`w-full ${errors.email ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-orange-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <Label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className={`w-full ${errors.telephone ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                  aria-describedby={errors.telephone ? 'telephone-error' : undefined}
                />
                {errors.telephone && (
                  <p id="telephone-error" className="mt-1 text-sm text-orange-600">
                    {errors.telephone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Choisir un mot de passe"
                    className={`w-full pr-10 ${errors.password ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                    aria-describedby={errors.password ? 'password-error' : 'password-strength'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <p id="password-strength" className={`mt-1 text-sm ${passwordStrengthInfo.color}`}>
                    Force du mot de passe: {passwordStrengthInfo.label}
                  </p>
                )}
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-orange-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirmer votre mot de passe"
                    className={`w-full pr-10 ${errors.confirmPassword ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm text-orange-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-[#405B35] hover:text-[#405B35]/80 underline">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-[#405B35] hover:text-[#405B35]/80 underline">
                      politique de confidentialité
                    </Link>
                    {' '}*
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-orange-600">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </Button>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">— ou —</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Déjà un compte ?{' '}
                  <Link 
                    to="/login" 
                    className="text-[#405B35] hover:text-[#405B35]/80 font-medium transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Artizone. Tous droits réservés.
          </p>
          <div className="mt-2 space-x-4">
            <Link to="/legal" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
