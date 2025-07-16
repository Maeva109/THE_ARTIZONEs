import { useState, useEffect, useRef } from 'react';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';

interface Filters {
  category: string;
  priceRange: number[];
  artisan: string;
  location: string;
  promotions: boolean;
  nouveautes: boolean;
  search: string;
}

interface CatalogueMainProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onProductClick: (productId: number) => void;
}

export const CatalogueMain = ({ filters, onFilterChange, onProductClick }: CatalogueMainProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let url = 'http://localhost:8000/api/products/';
    const params = [];
    if (filters.category) params.push(`category=${filters.category}`);
    if (filters.priceRange) {
      params.push(`price__gte=${filters.priceRange[0]}`);
      params.push(`price__lte=${filters.priceRange[1]}`);
    }
    if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    if (filters.artisan) params.push(`artisan__user__nom=${encodeURIComponent(filters.artisan)}`);
    if (filters.location) params.push(`artisan__ville=${encodeURIComponent(filters.location)}`);
    if (filters.promotions) params.push(`promotions=true`);
    // Add more filters as needed
    if (params.length) url += '?' + params.join('&');
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : data.results || []);
        setPage(1); // Reset to first page on filter change
      })
      .finally(() => setLoading(false));
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Smooth scroll to grid on page change
  const handleSetPage = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <>
      {/* Main Section Title */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre catalogue produit artisanal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez une sélection exceptionnelle de créations authentiques
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3" ref={gridRef}>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <>
                <ProductGrid 
                  products={paginatedProducts}
                  onProductClick={onProductClick}
                />
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        className={`px-4 py-2 rounded border ${page === idx + 1 ? 'bg-[#405B35] text-white' : 'bg-white text-[#405B35] border-[#405B35]'}`}
                        onClick={() => handleSetPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
                {/* Voir plus button (alternative to page numbers) */}
                {/*
                {page < totalPages && (
                  <div className="flex justify-center mt-8">
                    <button
                      className="px-6 py-3 bg-[#405B35] text-white rounded hover:bg-[#2e4025] transition"
                      onClick={() => handleSetPage(page + 1)}
                    >
                      Voir plus
                    </button>
                  </div>
                )}
                */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
