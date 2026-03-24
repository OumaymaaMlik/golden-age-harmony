import ScrollReveal from "@/components/ScrollReveal";

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
  { name: "Nutriwell Boisson Fruitée", flavors: "4 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop", texture: "Boisson", gout: "Fruité", regime: "Standard" },
  { name: "Nutriwell Boisson Concentrée", flavors: "3 saveurs", image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=400&fit=crop", texture: "Boisson", gout: "Fruité", regime: "Hyperprotéiné" },
  { name: "Nutriwell Crème Dessert", flavors: "5 saveurs", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop", texture: "Crème", gout: "Vanille", regime: "Standard" },
  { name: "Nutriwell Boisson Lactée", flavors: "3 saveurs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop", texture: "Boisson", gout: "Lacté", regime: "Standard" },
  { name: "Nutriwell Les Veloutés", flavors: "4 saveurs", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop", texture: "Velouté", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Les Purées", flavors: "3 saveurs", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop", texture: "Purée", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Nutra Cake", flavors: "2 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop", texture: "Céréales", gout: "Chocolat", regime: "Hyperprotéiné" },
  { name: "Nutriwell Crème Sans Sucre", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop", texture: "Crème", gout: "Vanille", regime: "Sans sucre" },
  { name: "Nutriwell Boisson Sans Sucre", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop", texture: "Boisson", gout: "Fruité", regime: "Sans sucre" },
  { name: "Nutriwell Nutra Pâte", flavors: "2 saveurs", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop", texture: "Purée", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Riz au Lait", flavors: "2 saveurs", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=400&fit=crop", texture: "Crème", gout: "Vanille", regime: "Standard" },
  { name: "Nutriwell Céréales Instant", flavors: "3 saveurs", image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=400&h=400&fit=crop", texture: "Céréales", gout: "Chocolat", regime: "Standard" },
  { name: "Nutriwell Poudre de Protéines", flavors: "2 saveurs", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2c614?w=400&h=400&fit=crop", texture: "Poudre", gout: "Neutre", regime: "Hyperprotéiné" },
  { name: "Nutriwell Renal Instant", flavors: "2 saveurs", image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=400&fit=crop", texture: "Poudre", gout: "Neutre", regime: "Rénal" },
  { name: "Nutriwell Gelée Fruitée", flavors: "4 saveurs", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop", texture: "Gelée", gout: "Fruité", regime: "Standard" },
  { name: "Nutriwell Gelée Édulcorée", flavors: "3 saveurs", badge: "SANS SUCRE", badgeColor: "bg-muted-foreground", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop", texture: "Gelée", gout: "Fruité", regime: "Sans sucre" },
  { name: "Nutriwell Poudre Épaississante", flavors: "1 format", image: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=400&h=400&fit=crop", texture: "Poudre", gout: "Neutre", regime: "Standard" },
  { name: "Nutriwell Délice de Fruits", flavors: "4 saveurs", badge: "NOUVEAU", badgeColor: "bg-destructive", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop", texture: "Gelée", gout: "Fruité", regime: "Standard" },
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
    <section className="bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <ScrollReveal key={product.name} delay={Math.min(i * 0.05, 0.3)}>
              <div className="group bg-card rounded-2xl border border-border shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer">
                <div className="relative bg-muted/30 p-6 flex items-center justify-center aspect-square">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 ${product.badgeColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}>
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{product.flavors}</p>
                  <h3 className="font-heading font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>
              </div>
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
