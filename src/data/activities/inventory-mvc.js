export default {
  slug: 'inventory-mvc',
  order: 8,
  title: 'ApexRetail Inventory System with a Custom PHP MVC Framework',
  short: 'MVC Inventory System',
  term: 'midterm',
  date: '2026-09-18',
  kind: 'Laboratory',
  team: null,
  stack: ['PHP 8.5', 'Custom MVC', 'PDO', 'SQLite', 'MySQL schema'],
  summary:
    'A product inventory manager for a fictional retailer, built on a small MVC framework I wrote from scratch in plain PHP with a front controller, a regex router and PDO.',
  objective:
    'Explain the Model-View-Controller pattern by building one without a framework. The lab asked for a front controller as the single entry point, a router, base Model and Controller classes, a relational schema for inventory, a Product model that talks to the database through PDO prepared statements, controllers that validate requests, and view templates, all wired together into a working create, read, update and delete flow for products.',
  built: [
    'public/index.php front controller with a small autoloader for the App namespace, session start for flash messages, and the full route table',
    'Router class that turns patterns like /products/{id}/edit into regex named groups and calls the matching controller method with the captured parameters, with a 404 page for unknown paths',
    'Database singleton that opens PDO for SQLite (default) or MySQL from app/config/database.php and creates and seeds the products table with 10 items on first run',
    'Product model with getAll() search across name, SKU and description, category and stock-status filters (in, low, out), SKU lookup that can exclude the current ID, and a statistics query for SKU count, total units, stock value and low/out counts',
    'ProductController with server-side validation: required SKU matching /^[A-Z0-9_-]+$/i and unique, name of at least 3 characters, non-negative price, quantity and minimum stock; failed submissions re-render the form with the old input kept',
    'Views for the dashboard (KPI cards, filter bar, catalog table), create and edit forms, and a detail page with a stock gauge, plus one-time flash messages after create, update and delete',
    'Stock status computed from quantity and min_stock at display time: In Stock, Low Stock (quantity at or below min_stock) or Out of Stock',
  ],
  screenshots: [
    { src: '/work/inventory-mvc/01-dashboard.webp', caption: 'Inventory dashboard: 10 SKUs, 105 units, $15,795.84 total value, 2 low and 2 out of stock' },
    { src: '/work/inventory-mvc/02-low-stock-filter.webp', caption: 'Low Stock Alerts filter showing only items at or below their minimum stock' },
    { src: '/work/inventory-mvc/03-product-details.webp', caption: 'Detail view for SKU-1003 with stock valuation and the amber low-stock gauge' },
    { src: '/work/inventory-mvc/04-validation-errors.webp', caption: 'Add form rejecting a blank SKU, name and category plus a negative price and quantity' },
    { src: '/work/inventory-mvc/05-product-created.webp', caption: 'Flash message after adding an Apple MacBook Air (SKU-2026), with the totals recalculated' },
    { src: '/work/inventory-mvc/06-edit-form.webp', caption: 'Edit form pre-filled with the current values for SKU-1003' },
    { src: '/work/inventory-mvc/07-updated-details.webp', caption: 'The MacBook Air after an update to $1,499.00 and 3 units, now flagged Low Stock' },
    { src: '/work/inventory-mvc/08-product-deleted.webp', caption: 'Delete confirmation flash and the catalog back to 10 items' },
  ],
  code: [
    {
      title: 'Route table in the front controller',
      file: 'public/index.php',
      lang: 'php',
      code: `// Initialize Request Router
$router = new Router();

// Define Application Routes (CRUD Operations)
// Read: Dashboard and Catalog
$router->get('/', ProductController::class, 'index');
$router->get('/products', ProductController::class, 'index');

// Create: Add Product Form and Submission
$router->get('/products/create', ProductController::class, 'create');
$router->post('/products/create', ProductController::class, 'store');

// Read: Product Detail View
$router->get('/products/{id}', ProductController::class, 'show');

// Update: Edit Product Form and Submission
$router->get('/products/{id}/edit', ProductController::class, 'edit');
$router->post('/products/{id}/edit', ProductController::class, 'update');

// Delete: Remove Product Action
$router->post('/products/{id}/delete', ProductController::class, 'delete');
$router->get('/products/{id}/delete', ProductController::class, 'delete');

// Dispatch Request
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$router->dispatch($requestUri, $requestMethod);`,
    },
    {
      title: 'Matching {id} patterns with regex',
      file: 'app/core/Router.php',
      lang: 'php',
      code: `foreach ($this->routes as $route) {
    if ($route['method'] !== $method) {
        continue;
    }

    // Convert route pattern {param} to regex named group
    $patternRegex = preg_replace('/\\{([a-zA-Z0-9_]+)\\}/', '(?P<$1>[^/]+)', $route['pattern']);
    $patternRegex = '#^' . $patternRegex . '$#';

    if (preg_match($patternRegex, $path, $matches)) {
        $params = [];
        foreach ($matches as $key => $value) {
            if (is_string($key)) {
                $params[$key] = $value;
            }
        }

        $controllerClass = $route['controller'];
        $actionName = $route['action'];

        // ...class and method existence checks...

        $controllerInstance = new $controllerClass();

        // Call the controller action with parameters
        call_user_func_array([$controllerInstance, $actionName], $params);
        return;
    }
}`,
    },
    {
      title: 'Search and stock filters with bound parameters',
      file: 'app/models/Product.php',
      lang: 'php',
      code: `public function getAll(?string $search = null, ?string $category = null, ?string $stockStatus = null): array
{
    $sql = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $sql .= " AND (name LIKE :search OR sku LIKE :search_sku OR description LIKE :search_desc)";
        $params[':search'] = '%' . $search . '%';
        $params[':search_sku'] = '%' . $search . '%';
        $params[':search_desc'] = '%' . $search . '%';
    }

    if (!empty($category)) {
        $sql .= " AND category = :category";
        $params[':category'] = $category;
    }

    if ($stockStatus === 'low') {
        $sql .= " AND quantity > 0 AND quantity <= min_stock";
    } elseif ($stockStatus === 'out') {
        $sql .= " AND quantity = 0";
    } elseif ($stockStatus === 'in') {
        $sql .= " AND quantity > min_stock";
    }

    $sql .= " ORDER BY id DESC";

    return $this->fetchAll($sql, $params);
}`,
    },
  ],
  reflection:
    'Before this lab, routing and controllers were things Laravel did for me. Writing the router myself showed me how little is actually going on: every request lands in public/index.php, a regex built from /products/{id}/edit pulls out the id, and call_user_func_array() hands it to ProductController::edit(). Splitting the code into a Product model, a controller and plain PHP view templates also made bugs easier to place, because a SQL problem could only be in the model and a validation problem only in the controller.\n\nThe tricky part was the edit flow. Reusing the create-time SKU uniqueness check would have flagged a product\'s own unchanged SKU as a duplicate, so getBySku() takes an optional ID to exclude. Re-rendering a failed form with the user\'s input still filled in also took more care than I expected. If I did it again I would add a CSRF token to the POST forms, drop the GET route for delete so a link cannot remove a product, and move the validation rules that are copied between store() and update() into one shared method.',
  docs: [{ label: 'Laboratory report (PDF)', href: '/work/inventory-mvc/documentation.pdf' }],
}
