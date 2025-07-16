
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - ready for API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        login(data); // stocke tokens et user dans le contexte
        // Redirection selon le rôle
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'artisan') {
          // Check if user has a valid shop name or ID
          const shopIdentifier = data.user.nom || data.user.id || data.user.boutique_id;
          if (shopIdentifier) {
            navigate('/artisan/' + shopIdentifier);
          } else {
            // If no shop identifier, redirect to profile completion
            navigate('/artisan/profile-completion');
          }
        } else {
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || 'Erreur de connexion' });
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

  return (
    <div className="min-h-screen bg-[#EDF0E0] flex flex-col">
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
          {/* Login Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Connexion à votre compte
            </h1>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Phone Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Votre email"
                  className={`w-full ${errors.email ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-orange-600">
                    {errors.email}
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
                    placeholder="Votre mot de passe"
                    className={`w-full pr-10 ${errors.password ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'focus:border-[#405B35] focus:ring-[#405B35]'}`}
                    aria-describedby={errors.password ? 'password-error' : undefined}
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
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-orange-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                />
                <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Se souvenir de moi
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-[#405B35] hover:text-[#405B35]/80 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">— ou —</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/register" 
                    className="text-[#405B35] hover:text-[#405B35]/80 font-medium transition-colors"
                  >
                    S'inscrire
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

export default Login;
