import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Clock, Thermometer, Info, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import type { Product } from "@/data/products";

const iconMap: Record<string, typeof Clock> = { clock: Clock, thermometer: Thermometer, info: Info };

interface Props {
  product: Product;
}

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={14} className={i <= rating ? "fill-secondary text-secondary" : "text-border"} />
    ))}
  </div>
);

const ProductTabs = ({ product }: Props) => (
  <section className="bg-background pb-12">
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <ScrollReveal>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
            {["Description", "Informations Nutritionnelles", "Conseils d'utilisation", "Avis clients"].map((tab, i) => (
              <TabsTrigger
                key={tab}
                value={["description", "nutrition", "usage", "reviews"][i]}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium data-[state=active]:text-foreground text-muted-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="description" className="pt-6 animate-fade-in">
            <div className="space-y-4">
              {product.description.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
              ))}
              <ul className="space-y-2 pt-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check size={18} className="text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="pt-6 animate-fade-in">
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nutriment</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Pour 100ml</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Par portion</th>
                  </tr>
                </thead>
                <tbody>
                  {product.nutrition.map((row, i) => (
                    <tr key={row.nutriment} className={i % 2 === 0 ? "bg-accent/10" : "bg-background"}>
                      <td className="py-2.5 px-4 text-foreground">{row.nutriment}</td>
                      <td className="py-2.5 px-4 text-right text-muted-foreground">{row.per100ml}</td>
                      <td className="py-2.5 px-4 text-right text-muted-foreground">{row.perPortion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="pt-6 animate-fade-in">
            <div className="space-y-5">
              {product.usageTips.map((tip) => {
                const Icon = iconMap[tip.icon] || Info;
                return (
                  <div key={tip.text} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-2 text-sm">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6 animate-fade-in">
            <div className="space-y-4">
              {/* Average Rating */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <span className="text-3xl font-bold text-foreground">{product.rating}</span>
                <div>
                  <StarRow rating={Math.round(product.rating)} />
                  <p className="text-sm text-muted-foreground mt-0.5">{product.reviewCount} avis</p>
                </div>
              </div>

              {/* Reviews */}
              {product.reviews.map((review) => (
                <div key={review.name} className="border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{review.name}</span>
                      <StarRow rating={review.rating} />
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollReveal>
    </div>
  </section>
);

export default ProductTabs;
