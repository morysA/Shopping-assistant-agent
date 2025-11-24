import ShoppingListClient from '@/components/shopping-list-client';

export default function ShoppingListPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI Shopping Assistant
        </h1>
        <p className="text-muted-foreground">
          Tell the AI what you need, and it will generate a shopping list for you.
        </p>
      </div>
      <ShoppingListClient />
    </div>
  );
}
