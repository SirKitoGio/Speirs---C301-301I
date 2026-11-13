export default {
  slug: 'laravel-routes',
  order: 6,
  title: 'Laravel Routes: Home, About and Contact',
  short: 'Laravel Routes',
  term: 'midterm',
  date: '2026-09-04',
  kind: 'Activity',
  team: null,
  stack: ['Laravel 13', 'PHP 8.5', 'Blade', 'Bootstrap 5.3'],
  summary:
    'A small multi-page Laravel site where Home, About and Contact are each served by their own controller through named routes, share one Blade layout, and the contact form is validated on the server.',
  objective:
    'Create Home, About and Contact pages in Laravel and connect them with routes. The activity asked for page logic to live in controllers instead of route closures, for every route to have a name, for one master Blade layout that all three pages extend, and for the contact form to be handled with CSRF protection, server-side validation and a success message after submitting.',
  built: [
    'Four named routes in routes/web.php: GET / (home), GET /about (about), GET /contact (contact) and POST /contact (contact.store), each mapped to a controller action',
    'HomeController, AboutController and ContactController in app/Http/Controllers, each with an index() action that returns its view',
    'Master layout resources/views/layouts/app.blade.php with a Bootstrap 5.3 navbar built from route() calls, @yield(\'title\', \'My Laravel App\') and @yield(\'content\') slots, and a footer year from date(\'Y\')',
    'Home view with a hero banner and three feature cards, About view with story, mission and team sections, and Contact view with the form next to a contact-information card',
    'ContactController@store rules: name required|string|max:255, email required|email, message required|string; failed input comes back with @error messages under each field and old() values refilled',
    'Post-Redirect-Get after a valid submission: redirect()->route(\'contact\')->with(\'success\', ...) shows a dismissible alert for one request only',
    'Checked with php artisan route:list and php artisan test (2 passing tests), then served with php artisan serve on port 8000 for the page captures',
  ],
  screenshots: [
    { src: '/work/laravel-routes/01-home.webp', caption: 'Home page: hero banner with a Learn More button linked through route(\'about\'), and three feature cards' },
    { src: '/work/laravel-routes/02-about.webp', caption: 'About page with story and mission columns and a three-person team section, inside the shared layout' },
    { src: '/work/laravel-routes/03-contact-success.webp', caption: 'Contact page after a valid submission, with the one-time success flash above the form' },
    { src: '/work/laravel-routes/04-routes.webp', caption: 'routes/web.php next to php artisan route:list output for the four named routes' },
    { src: '/work/laravel-routes/05-terminal-tests.webp', caption: 'Terminal check: caches cleared, php artisan test passing, route:list and php artisan serve' },
  ],
  code: [
    {
      title: 'Named routes mapped to controllers',
      file: 'routes/web.php',
      lang: 'php',
      code: `<?php

use App\\Http\\Controllers\\HomeController;
use App\\Http\\Controllers\\AboutController;
use App\\Http\\Controllers\\ContactController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');`,
    },
    {
      title: 'Validating the contact form and redirecting with a flash message',
      file: 'app/Http/Controllers/ContactController.php',
      lang: 'php',
      code: `public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string'
    ]);

    // Here you can add email sending logic
    // Mail::to('your-email@example.com')->send(new ContactMail($request->all()));

    return redirect()->route('contact')->with('success', 'Thank you for your message! We will get back to you soon.');
}`,
    },
    {
      title: 'Contact form with CSRF token, error messages and old input',
      file: 'resources/views/contact.blade.php',
      lang: 'markup',
      code: `<form action="{{ route('contact.store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="name" class="form-label">Your Name</label>
        <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" required>
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <div class="mb-3">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" class="form-control @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email') }}" required>
        @error('email')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <div class="mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea class="form-control @error('message') is-invalid @enderror" id="message" name="message" rows="5" required>{{ old('message') }}</textarea>
        @error('message')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <button type="submit" class="btn btn-primary">Send Message</button>
</form>`,
    },
  ],
  reflection:
    'Before this activity I would have written each page as a closure inside routes/web.php. Splitting them into three controllers felt like extra files for pages that only return a view, but it made sense once the contact form needed a second action: GET and POST share the /contact URI, and Laravel sends them to index() and store() by HTTP method. Named routes were the other habit I picked up. The navbar, the Learn More button and the redirect after submitting all call route(), so changing a URL only means editing web.php.\n\nThe part I had to test most carefully was the form round trip. I wanted to see for myself that a failed validate() sends the user back on its own, that old() refills what they typed, and that the success message disappears after one page load. If I did it again I would save the messages to a database table with a model and migration instead of discarding them after validation, write a feature test that posts both bad and good data instead of relying on the two example tests, and turn the repeated card markup on the Home and About pages into a Blade component.',
  docs: [
    { label: 'Activity documentation (PDF)', href: '/work/laravel-routes/documentation.pdf' },
  ],
};
