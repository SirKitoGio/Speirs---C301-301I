export default {
  slug: 'phytoquest-midterm',
  order: 12,
  title: 'Midterm Practical Exam: PhytoQuest Laravel App',
  short: 'PhytoQuest Midterm',
  term: 'midterm',
  date: '2026-10-02',
  kind: 'Practical Exam',
  team: null,
  stack: ['Laravel 13', 'Laravel Breeze 2.4', 'PHP 8.5', 'Tailwind CSS 3.4', 'SQLite', 'Faker'],
  summary:
    'A Laravel version of PhytoQuest built for the midterm practical exam, with public plant pages, Breeze registration and login, and signed-in modules for managing plant profiles and logging GPS-tagged sightings.',
  objective:
    'The exam had four parts: a Laravel application with three to five or more pages related to the student\'s proposed study, built with MVC, Blade and routing; authentication with registration, login and protected routes; migrations and seeders that fill the database with at least 10 sample records using Faker; and a 250 to 300 word reflection on whether React or Laravel is better for building web applications.',
  built: [
    'Public Home, About and Contact pages, a plant catalog with search and a category filter, and plant profile pages showing habitat, parts studied, physical features, known toxins, extract types, reference and source label',
    'Laravel Breeze authentication (register, login, logout, profile and password update); the dashboard, plant create/edit/delete and every sighting route sit inside an auth middleware group',
    'Dashboard counts for plant profiles, my sightings, pending review and trusted records, with a table of the user\'s five latest sightings',
    'Sightings resource with latitude and longitude, observed date, plant part, visibility (public, private, protected) and an optional photo; new and edited sightings are saved as pending, and users can only open or change their own (403 otherwise)',
    'Migrations for the plants and sightings tables, with plant_id and user_id on sightings as foreign keys that cascade on delete',
    'UserSeeder, PlantSeeder and SightingSeeder called from DatabaseSeeder, built on Faker factories; php artisan migrate:fresh --seed loads 12 plants, 10 users and sample sightings',
    'Feature tests in tests/Feature/PhytoQuestTest.php for public pages, guest redirects, plant search and CRUD, category validation, pending sightings with a photo upload, sighting ownership and password hashing',
  ],
  screenshots: [
    { src: '/work/phytoquest-midterm/01-home.webp', caption: 'PhytoQuest home page with the plant search bar and the research-only notice' },
    { src: '/work/phytoquest-midterm/02-dashboard.webp', caption: 'Signed-in research dashboard with plant, sighting, pending and trusted counts and recent sightings' },
    { src: '/work/phytoquest-midterm/03-plants-catalog.webp', caption: 'Plant catalog with search, category filter and a source label on each card' },
    { src: '/work/phytoquest-midterm/04-plant-details.webp', caption: 'Profile page for Neem with habitat, parts studied, toxins, extract types, reference and a protected sighting' },
    { src: '/work/phytoquest-midterm/05-plant-create.webp', caption: 'Add a plant profile form, available only to signed-in users' },
    { src: '/work/phytoquest-midterm/06-sightings.webp', caption: 'My sightings list with one record marked Needs Correction' },
    { src: '/work/phytoquest-midterm/07-register.webp', caption: 'Breeze registration page restyled to match the PhytoQuest design' },
    { src: '/work/phytoquest-midterm/08-migrate-fresh-seed.webp', caption: 'php artisan migrate:fresh --seed running the plants and sightings migrations and three seeders' },
    { src: '/work/phytoquest-midterm/09-tinker-records.webp', caption: 'Tinker check: Plant::count() returns 12 Faker-seeded plants' },
    { src: '/work/phytoquest-midterm/10-database-seeder.webp', caption: 'DatabaseSeeder calling UserSeeder, PlantSeeder and SightingSeeder in order' },
  ],
  code: [
    {
      title: 'Public pages and auth-protected resources',
      file: 'routes/web.php',
      lang: 'php',
      code: `<?php

use App\\Http\\Controllers\\PageController;
use App\\Http\\Controllers\\PlantController;
use App\\Http\\Controllers\\ProfileController;
use App\\Http\\Controllers\\SightingController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');

    Route::resource('plants', PlantController::class)->except(['index', 'show']);
    Route::resource('sightings', SightingController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('plants', PlantController::class)->only(['index', 'show']);

require __DIR__.'/auth.php';`,
    },
    {
      title: 'sightings table migration',
      file: 'database/migrations/2026_10_02_035942_create_sightings_table.php',
      lang: 'php',
      code: `public function up(): void
{
    Schema::create('sightings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('plant_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->decimal('latitude', 10, 7);
        $table->decimal('longitude', 10, 7);
        $table->date('observed_on');
        $table->string('plant_part');
        $table->string('visibility')->default('public');
        $table->string('status')->default('pending');
        $table->string('location_name')->nullable();
        $table->string('photo_path')->nullable();
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}`,
    },
    {
      title: 'Validation for a new sighting',
      file: 'app/Http/Requests/StoreSightingRequest.php',
      lang: 'php',
      code: `public function rules(): array
{
    return [
        'plant_id' => ['required', 'exists:plants,id'],
        'latitude' => ['required', 'numeric', 'between:-90,90'],
        'longitude' => ['required', 'numeric', 'between:-180,180'],
        'observed_on' => ['required', 'date', 'before_or_equal:today'],
        'plant_part' => ['required', Rule::in(Plant::PLANT_PARTS)],
        'visibility' => ['required', Rule::in(Sighting::VISIBILITIES)],
        'location_name' => ['nullable', 'string', 'max:255'],
        'photo' => ['nullable', 'image', 'max:4096'],
        'notes' => ['nullable', 'string', 'max:2000'],
    ];
}`,
    },
  ],
  reflection:
    'The exam showed me how much Laravel provides before I write any code of my own. Breeze generated registration, login, password reset and the profile page, so most of my time went into the parts that are specific to PhytoQuest: the plants and sightings tables, their forms, and the rule that a sighting stays pending until someone reviews it. Building the seeders on factories was the fastest way to make the catalog, dashboard and tables look like a working system, and php artisan migrate:fresh --seed reset everything in one command whenever I changed a column.\n\nThe hardest part was access control. Putting routes inside the auth group only keeps guests out; it does not stop one signed-in researcher from opening another\'s sighting, so I added an owner check that returns 403 and a test that proves it. My answer to the React versus Laravel question came straight from this build: Laravel on its own was the quicker way to ship a working app, but the scanner and map would feel better as React screens on top of a Laravel API. Next time I would seed real Philippine plant data instead of Faker text, because some generated profiles pair a plant with features that do not match it.',
  docs: [
    { label: 'Midterm practical exam submission (PDF)', href: '/work/phytoquest-midterm/documentation.pdf' },
  ],
};
