import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const recommendedProducts = PlaceHolderImages.filter((p) =>
  ['blender', 'air-fryer', 'rice-cooker', 'smartphone'].includes(p.id)
);

export default function RecommendedPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Recommended For You
        </h1>
        <p className="text-muted-foreground">
          Popular products and deals curated by our AI based on market trends.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recommendedProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                <Image
                  src={product.imageUrl}
                  alt={product.description}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 p-4">
              <CardTitle className="text-lg font-headline">
                {product.description}
              </CardTitle>
              <CardDescription>
                <span className="font-bold text-lg text-primary">
                  {product.price}
                </span>
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">
                <ShoppingCart />
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
