export default {
  slug: 'laravel-crud',
  order: 10,
  title: 'Laravel 13 CRUD Application',
  short: 'Laravel CRUD',
  term: 'midterm',
  date: '2026-09-22',
  kind: 'Activity',
  team: null,
  stack: ['Laravel 13', 'PHP 8.5', 'Eloquent', 'SQLite', 'Tailwind CSS'],
  summary:
    'A product inventory manager in Laravel 13 that lists, searches, adds, shows, edits and deletes products stored in SQLite, using a resource controller and an Eloquent model.',
  objective:
    'Build a full create, read, update and delete application in Laravel: start a project on SQLite, generate a model and migration for one resource, register resourceful routes, write the seven controller actions with server-side validation, and build Blade views for the list, create, detail and edit screens with a confirmation message after every change.',
  built: [
    'products migration: name (150 chars), category (100), price decimal(10,2), stock integer defaulting to 0, nullable description and timestamps',
    'Product model with $fillable for mass assignment and casts for price (decimal:2) and stock (integer), plus a ProductFactory and a ProductSeeder with six sample products',
    'Route::resource(\'products\', ProductController::class) for the seven REST routes, with / redirecting to /products',
    'index() search on name or category in a grouped where/orWhere, 10 items per page with withQueryString(), and three totals: product count, sum of price * stock, and products with 10 or fewer in stock',
    'One validationRules() method shared by store() and update(): name required|max:150, category required|max:100, price numeric between 0 and 99,999,999.99, stock integer min 0',
    'Blade views styled with Tailwind: inventory table with stock badges, create and edit forms with a category select from a CATEGORIES constant, @error messages and old() values, a detail page with total lot value, and a DELETE form behind a confirm() prompt',
    'tests/Feature/ProductCrudTest.php with 13 feature tests for the redirect, listing, search, totals, validation failures, create, show, edit, update and delete',
  ],
  screenshots: [
    { src: '/work/laravel-crud/01-inventory.webp', caption: 'Product Inventory page with total products, inventory value and low-stock count above the searchable catalog' },
    { src: '/work/laravel-crud/02-validation-errors.webp', caption: 'Create form showing required-field errors for name, category, price and stock' },
    { src: '/work/laravel-crud/03-product-detail.webp', caption: 'Detail page for product #1 with unit price, stock status, total lot value and record timestamps' },
    { src: '/work/laravel-crud/04-edit-form.webp', caption: 'Edit form pre-filled with the saved values for product #1' },
    { src: '/work/laravel-crud/05-route-list.webp', caption: 'php artisan route:list --path=products listing the seven resource routes' },
    { src: '/work/laravel-crud/06-migration-seed.webp', caption: 'make:model, make:seeder and migrate:fresh --seed creating and filling the products table' },
  ],
  code: [
    {
      title: 'Search, pagination and inventory totals in index()',
      file: 'app/Http/Controllers/ProductController.php',
      lang: 'php',
      code: `public function index(Request $request): View
{
    $search = $request->input('search');
    $query = Product::query();

    if (! empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('category', 'like', '%' . $search . '%');
        });
    }

    $products = $query->latest()->paginate(10)->withQueryString();

    $totalProducts = Product::count();
    $totalInventoryValue = (float) Product::sum(DB::raw('price * stock'));
    $lowStockCount = Product::where('stock', '<=', 10)->count();`,
    },
    {
      title: 'Validation rules shared by store() and update()',
      file: 'app/Http/Controllers/ProductController.php',
      lang: 'php',
      code: `protected function validationRules(): array
{
    return [
        'name' => 'required|string|max:150',
        'category' => 'required|string|max:100',
        'price' => 'required|numeric|min:0|max:99999999.99',
        'stock' => 'required|integer|min:0',
        'description' => 'nullable|string',
    ];
}`,
    },
    {
      title: 'products table migration',
      file: 'database/migrations/2026_09_22_124449_create_products_table.php',
      lang: 'php',
      code: `public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name', 150);
        $table->string('category', 100);
        $table->decimal('price', 10, 2);
        $table->integer('stock')->default(0);
        $table->text('description')->nullable();
        $table->timestamps();
    });
}`,
    },
  ],
  reflection:
    'Route::resource did more of the work than I expected. One line gave me all seven routes, and because I followed the action names Laravel expects, the views could link with route(\'products.edit\', $product) without a single hand-written URL. Route-model binding meant show(), edit(), update() and destroy() receive a Product object instead of an ID I have to look up myself. Keeping the rules in one validationRules() method kept create and edit consistent, and the min:0 rules on price and stock block negative values that the HTML inputs alone would let through.\n\nThe index page took the most work. Search, pagination and the three totals all live in one action, the orWhere had to sit inside a closure so it would not interfere with any other condition added later, and withQueryString() was needed so moving to page two did not drop the search term. Next time I would add soft deletes so a removed product can be restored, move validation into a Form Request class, and load Tailwind through the Vite build the project already includes instead of the CDN script.',
  docs: [
    { label: 'Activity documentation (PDF)', href: '/work/laravel-crud/documentation.pdf' },
  ],
};
