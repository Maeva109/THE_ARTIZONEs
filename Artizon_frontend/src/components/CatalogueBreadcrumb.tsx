
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CatalogueBreadcrumbProps {
  selectedCategory?: string;
}

export const CatalogueBreadcrumb = ({ selectedCategory }: CatalogueBreadcrumbProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 mt-20 px-4 py-3">
      <div className="container mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-[#405B35] transition-colors">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#405B35] font-medium">
                Catalogue
              </BreadcrumbPage>
            </BreadcrumbItem>
            {selectedCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#405B35] font-medium">
                    {selectedCategory}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
};
