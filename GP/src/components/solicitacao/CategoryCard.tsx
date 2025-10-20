import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryInfo } from "@/types/solicitacao";

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: () => void;
  isSelected?: boolean;
}

export function CategoryCard({ category, onClick, isSelected = false }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-elegant hover:scale-105 ${
        isSelected ? 'ring-2 ring-primary shadow-glow' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            {category.title}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {category.description}
          </p>
          {category.subcategories && (
            <div className="flex flex-wrap gap-1 justify-center">
              {category.subcategories.slice(0, 3).map((sub, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {sub}
                </Badge>
              ))}
              {category.subcategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{category.subcategories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}