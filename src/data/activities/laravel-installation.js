export default {
  slug: 'laravel-installation',
  order: 13,
  title: 'Laravel 13 Installation and Setup',
  short: 'Laravel Installation',
  term: 'finals',
  date: '2026-10-09',
  kind: 'Activity',
  team: null,
  stack: ['Laravel 13.35', 'PHP 8.5', 'Composer 2.10', 'Artisan', 'SQLite'],
  summary:
    'A fresh Laravel 13 project installed with Composer on macOS, configured with an application key, checked with Artisan and served locally to the default welcome page.',
  objective:
    'Install and verify the Laravel framework on a local machine. The activity walked through checking that PHP 8.2+ and Composer 2.x are available, creating a project with composer create-project, setting up the .env file and APP_KEY, running a health check with php artisan about, and starting the development server to confirm the app loads in a browser.',
  built: [
    'Confirmed the toolchain from Homebrew: PHP 8.5.10 with OPcache and Composer 2.10.3',
    'Ran composer create-project laravel/laravel . in the Laravel101 folder, which installed 109 packages including laravel/framework v13.35.0',
    'The create-project scripts copied .env.example to .env, set an application key and ran the default users, cache and jobs migrations against SQLite',
    'Re-ran php artisan key:generate and checked the APP_KEY line in .env',
    'Used php artisan about to confirm Laravel 13.35.0, the local environment with debug on, and SQLite as the database driver with database-backed cache and sessions',
    'Started php artisan serve --port=8000 and loaded http://127.0.0.1:8000, which returned 200 OK and rendered the v13.35.0 welcome page',
  ],
  screenshots: [
    { src: '/work/laravel-installation/01-welcome-page.webp', caption: 'Laravel 13 welcome page served at 127.0.0.1:8000, showing v13.35.0' },
    { src: '/work/laravel-installation/02-composer-create-project.webp', caption: 'composer create-project installing 109 packages and running the first migrations' },
    { src: '/work/laravel-installation/03-artisan-about.webp', caption: 'php artisan about: versions, environment, cache status and drivers' },
    { src: '/work/laravel-installation/04-artisan-serve.webp', caption: 'Development server on port 8000 answering GET / with 200 OK' },
    { src: '/work/laravel-installation/05-prerequisites.webp', caption: 'Prerequisite check: PHP 8.5.10 and Composer 2.10.3' },
  ],
  code: [
    {
      title: 'Commands used for the installation',
      file: 'Terminal (Laravel101)',
      lang: 'bash',
      code: `# Stage 1: check the prerequisites
php -v
composer --version

# Stage 2: create the project in the current folder
composer create-project laravel/laravel .

# Stage 3: generate the application key and check .env
php artisan key:generate
grep APP_KEY .env

# Stage 4: framework health check
php artisan about

# Stage 5: start the development server
php artisan serve --port=8000`,
    },
    {
      title: 'Dependencies pulled in by create-project',
      file: 'composer.json',
      lang: 'json',
      code: `"require": {
    "php": "^8.3",
    "laravel/framework": "^13.17",
    "laravel/tinker": "^3.0"
},
"require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pail": "^1.2.5",
    "laravel/pao": "^1.0.6",
    "laravel/pint": "^1.27",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.6",
    "phpunit/phpunit": "^12.5.12"
}`,
    },
  ],
  reflection:
    'This activity showed me how much one Composer command does. composer create-project downloaded the skeleton, resolved and locked 109 packages, created .env, set an application key and even ran the first migrations into a SQLite file, all before I typed an Artisan command. php artisan about then became my quick way to check what was actually running: the Laravel and PHP versions, that debug mode was on, and which drivers the cache, session and database were using.\n\nThe main lesson was about the environment rather than code. create-project needs an empty target folder, so the order of the steps matters, and the .env file holds settings and secrets that never belong in version control. Looking back, I would not show the APP_KEY value in my screenshots, since it is the key Laravel uses to encrypt sessions and cookies, and I would run php artisan test once after setup to confirm the skeleton\'s example tests pass before building on it.',
  docs: [{ label: 'Installation report (PDF)', href: '/work/laravel-installation/documentation.pdf' }],
}
