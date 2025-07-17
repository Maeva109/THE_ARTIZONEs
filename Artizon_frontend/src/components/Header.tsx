import { useState } from 'react';
import { Search, User, UserPlus, ChevronDown, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';

export const Header = () => {
  const [showArtisansDropdown, setShowArtisansDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const { cartItems } = useCart();
  const { getTotalFavorites } = useFavorites();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté.',
      variant: 'default',
    });
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      {/* Top header with logo, search, and auth buttons */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* Logo - centré sur mobile */}
          <div className="flex-shrink-0 mb-2 md:mb-0 flex justify-center w-full md:w-auto">
            <Link to="/">
              <img 
                src="/lovable-uploads/f97e1591-edd7-4e11-a6c8-697a5d131cf0.png" 
                alt="Artizone Logo" 
                className="h-16 md:h-20 w-auto mx-auto md:mx-0 transform hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Search bar - prend toute la largeur sur mobile */}
          <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 max-w-2xl mx-0 md:mx-8 order-3 md:order-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher un produit, un artisan…"
                className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-300 focus:border-[#405B35] focus:ring-[#405B35] text-base md:text-lg"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </div>
          </form>

          {/* Auth buttons and icons - empilés sur mobile */}
          <div className="flex flex-row md:flex-row items-center gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end order-2 md:order-none mb-2 md:mb-0">
            {/* Favorites */}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalFavorites()}
              </span>
            </Button>
            {/* Cart */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/panier">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-[#405B35] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>
            </Button>
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-base"
                  onClick={() => setShowUserMenu((v) => !v)}
                >
                  <User className="h-4 w-4" />
                  {user?.prenom || user?.nom || user?.email}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 text-gray-800 border-b border-gray-100">
                      <div className="font-semibold">{user?.prenom} {user?.nom}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button asChild variant="outline" className="flex items-center gap-2 border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-base">
                  <Link to="/login">
                    <User className="h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
                <Button asChild className="flex items-center gap-2 bg-[#405B35] hover:bg-[#405B35]/90 text-white px-3 md:px-6 py-2 md:py-3 text-xs md:text-base">
                  <Link to="/register">
                    <UserPlus className="h-4 w-4" />
                    Inscription
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="bg-[#405B35] text-white relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Burger button - visible on mobile/tablette only */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center justify-center space-x-8 py-3 w-full">
            <li><Link to="/" className="hover:text-orange-400 transition-colors font-medium py-2">Accueil</Link></li>
            <li><Link to="/catalogue" className="hover:text-orange-400 transition-colors font-medium py-2">Nos Catalogue Artisanal</Link></li>
            {/* Espace Artisans dropdown */}
            <li className="relative"
                onMouseEnter={() => setShowArtisansDropdown(true)}
                onMouseLeave={() => setShowArtisansDropdown(false)}>
              <button className="hover:text-orange-400 transition-colors font-medium py-2 flex items-center gap-1">
                Espace Artisans
                <ChevronDown className="h-4 w-4" />
              </button>
              {showArtisansDropdown && (
                <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-md py-2 min-w-48 z-10">
                  <Link to="/artisans" className="block px-4 py-2 hover:bg-gray-100">Découvrez nos artisan créateur</Link>
                  <Link to="/artisan/create" className="block px-4 py-2 hover:bg-gray-100">Créer sa boutique artisan</Link>
                </div>
              )}
            </li>
            <li><Link to="/tutoriels" className="hover:text-orange-400 transition-colors font-medium py-2">Tutoriels</Link></li>
            {/* À propos dropdown */}
            <li className="relative"
                onMouseEnter={() => setShowAboutDropdown(true)}
                onMouseLeave={() => setShowAboutDropdown(false)}>
              <button className="hover:text-orange-400 transition-colors font-medium py-2 flex items-center gap-1">
                À propos
                <ChevronDown className="h-4 w-4" />
              </button>
              {showAboutDropdown && (
                <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-md py-2 min-w-48 z-10">
                  <Link to="/qui-sommes-nous" className="block px-4 py-2 hover:bg-gray-100">Qui sommes-nous</Link>
                  <Link to="/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ</Link>
                  <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
                </div>
              )}
            </li>
          </ul>

          {/* Mobile menu overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden" onClick={() => setIsMenuOpen(false)}>
              <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-[#405B35] text-white shadow-lg p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <button className="self-end mb-4" onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu">
                  <X className="h-7 w-7" />
                </button>
                <Link to="/" className="block py-2 font-medium hover:text-orange-400" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                <Link to="/catalogue" className="block py-2 font-medium hover:text-orange-400" onClick={() => setIsMenuOpen(false)}>Nos Catalogue Artisanal</Link>
                <div className="border-t border-white/20 my-2"></div>
                <div>
                  <span className="block py-2 font-medium">Espace Artisans</span>
                  <Link to="/artisans" className="block px-4 py-2 hover:bg-[#405B35]/80 rounded" onClick={() => setIsMenuOpen(false)}>Découvrez nos artisan créateur</Link>
                  <Link to="/artisan/create" className="block px-4 py-2 hover:bg-[#405B35]/80 rounded" onClick={() => setIsMenuOpen(false)}>Créer sa boutique artisan</Link>
                </div>
                <Link to="/tutoriels" className="block py-2 font-medium hover:text-orange-400" onClick={() => setIsMenuOpen(false)}>Tutoriels</Link>
                <div className="border-t border-white/20 my-2"></div>
                <div>
                  <span className="block py-2 font-medium">À propos</span>
                  <Link to="/qui-sommes-nous" className="block px-4 py-2 hover:bg-[#405B35]/80 rounded" onClick={() => setIsMenuOpen(false)}>Qui sommes-nous</Link>
                  <Link to="/faq" className="block px-4 py-2 hover:bg-[#405B35]/80 rounded" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                  <Link to="/contact" className="block px-4 py-2 hover:bg-[#405B35]/80 rounded" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
