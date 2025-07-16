import { Users, List, Package, Hammer, Book } from 'lucide-react';

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-to-b from-[#f7fafc] to-[#e6eedd] border-r border-gray-200 shadow-md">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
        <div className="flex flex-col items-center flex-shrink-0 px-4 mb-8">
          <img src="/lovable-uploads/f97e1591-edd7-4e11-a6c8-697a5d131cf0.png" alt="Artizone Admin" className="h-13 w-auto mb-2 rounded" />
          <span className="text-xl font-bold text-[#405B35] tracking-wide">Artizone <span className="text-gray-700">Admin</span></span>
        </div>
        <nav className="flex-1 px-2 space-y-2">
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#e6eedd] hover:text-[#405B35] transition-colors">
            <List className="h-5 w-5" />
            Catégories
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#e6eedd] hover:text-[#405B35] transition-colors">
            <Package className="h-5 w-5" />
            Produits
          </a>
          <a href="/admin/users" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#e6eedd] hover:text-[#405B35] transition-colors">
            <Users className="h-5 w-5" />
            Utilisateurs
          </a>
          <a href="/admin/artisans" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#e6eedd] hover:text-[#405B35] transition-colors">
            <Hammer className="h-5 w-5" />
            Artisans
          </a>
          <a href="/admin/tutorials" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-[#e6eedd] hover:text-[#405B35] transition-colors">
            <Book className="h-5 w-5" />
            Tutoriels
          </a>
        </nav>
      </div>
    </aside>
  );
}