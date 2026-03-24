import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { nameToSlug } from "@/data/products";
import productImage1 from "@/assets/produit/1000008562.png";
import productImage2 from "@/assets/produit/1000008564.png";
import productImage3 from "@/assets/produit/1000008565.png";
import productImage4 from "@/assets/produit/1000008566.png";
import productImage5 from "@/assets/produit/1000008567.png";
import productImage6 from "@/assets/produit/1000008568.png";
import productImage7 from "@/assets/produit/1000008569.png";

interface Product {
  name: string;
  flavors: string;
  badge?: string;
  badgeColor?: string;
  image: string;
  texture: string;
  gout: string;
  regime: string;
}

const products: Product[] = [
  { name: "Nutriwell Boisson Fruitée", flavors: "4 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: productImage1, texture: "Boisson", gout: "Fruité", regime: "Standard" },
  { name: "Nutriwell Boisson Concentrée", flavors: "3 saveurs", image: productImage2, texture: "Boisson", gout: "Fruité", regime: "Hyperprotéiné" },
  { name: "Nutriwell Crème Dessert", flavors: "5 saveurs", image: productImage3, texture: "Crème", gout: "Vanille", regime: "Standard" },
  { name: "Nutriwell Boisson Lactée", flavors: "3 saveurs", image: productImage4, texture: "Boisson", gout: "Lacté", regime: "Standard" },
  { name: "Nutriwell Les Veloutés", flavors: "4 saveurs", image: productImage5, texture: "Velouté", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Les Purées", flavors: "3 saveurs", image: productImage6, texture: "Purée", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Nutra Cake", flavors: "2 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: productImage7, texture: "Céréales", gout: "Chocolat", regime: "Hyperprotéiné" },
  { name: "Nutriwell Crème Sans Sucre", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: productImage1, texture: "Crème", gout: "Vanille", regime: "Sans sucre" },
  { name: "Nutriwell Boisson Sans Sucre", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: productImage2, texture: "Boisson", gout: "Fruité", regime: "Sans sucre" },
  { name: "Nutriwell Nutra Pâte", flavors: "2 saveurs", image: productImage3, texture: "Purée", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Riz au Lait", flavors: "2 saveurs", image: productImage4, texture: "Crème", gout: "Vanille", regime: "Standard" },
  { name: "Nutriwell Céréales Instant", flavors: "3 saveurs", image: productImage5, texture: "Céréales", gout: "Chocolat", regime: "Standard" },
  { name: "Nutriwell Poudre de Protéines", flavors: "2 saveurs", image: productImage6, texture: "Poudre", gout: "Neutre", regime: "Hyperprotéiné" },
  { name: "Nutriwell Renal Instant", flavors: "2 saveurs", image: productImage7, texture: "Poudre", gout: "Neutre", regime: "Rénal" },
  { name: "Nutriwell Gelée Fruitée", flavors: "4 saveurs", image: productImage1, texture: "Gelée", gout: "Fruité", regime: "Standard" },
  { name: "Nutriwell Gelée Édulcorée", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: productImage2, texture: "Gelée", gout: "Fruité", regime: "Sans sucre" },
  { name: "Nutriwell Poudre Épaississante", flavors: "1 format", image: productImage3, texture: "Poudre", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Délice de Fruits", flavors: "4 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: productImage4, texture: "Gelée", gout: "Fruité", regime: "Standard" },
];

interface Props {
  activeFilter: string;
  activeTexture: string;
  activeGout: string;
  activeRegime: string;
}

const ProductGrid = ({ activeTexture, activeGout, activeRegime }: Props) => {
  const filtered = products.filter((p) => {
    if (activeTexture && p.texture !== activeTexture) return false;
    if (activeGout && p.gout !== activeGout) return false;
    if (activeRegime && p.regime !== activeRegime) return false;
    return true;
  });

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-3 gap-6 auto-rows-max">
          {filtered.map((product, i) => (
            <ScrollReveal key={product.name} delay={Math.min(i * 0.04, 0.25)} style={{ height: '470px', flexGrow: 0 }}>
              <Link to={`/products/${nameToSlug[product.name] || "boisson-fruitee"}`}>
                <div className="group bg-card border border-dashed shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer p-5 flex flex-col h-full" style={{ borderColor: 'rgba(255, 255, 255, 1)', backgroundColor: '#c8effc', borderTopLeftRadius: '120px', borderTopRightRadius: '0px', borderBottomRightRadius: '120px', borderBottomLeftRadius: '0px', height: '470px' }}>
                  <div className="relative flex items-center justify-center aspect-[5/7] mb-4 overflow-hidden flex-1" style={{ backgroundColor: '#c8effc', borderTopLeftRadius: '120px', borderTopRightRadius: '0px', borderBottomRightRadius: '120px', borderBottomLeftRadius: '0px' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      style={{ border: '1px solid rgb(224, 235, 231)', maxWidth: '100%' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground" style={{ fontSize: '14px', fontWeight: '600' }}>{product.flavors}</p>
                    <h3 className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-snug" style={{ fontSize: '22px' }}>
                      {product.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Aucun produit ne correspond à vos filtres.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
