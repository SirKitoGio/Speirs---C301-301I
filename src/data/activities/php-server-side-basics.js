export default {
  slug: 'php-server-side-basics',
  order: 7,
  title: 'Module 3: Server-Side Scripting Using PHP',
  short: 'PHP Basics',
  term: 'midterm',
  date: '2026-09-08',
  kind: 'Laboratory',
  team: null,
  stack: ['PHP 8.5', 'PHP built-in server', 'HTML'],
  summary:
    'Three small PHP pages for the Week 9 lab that print text to the browser, work with string variables and string functions, and do arithmetic with constants.',
  objective:
    'Write and run the Module 3 example programs to see how PHP runs on the server and sends plain HTML to the browser. The lab covered PHP tags and statement syntax, output with print and echo, dates with gmdate(), string variables and concatenation, built-in string functions, numeric calculations with number_format(), constants made with define(), and the difference between single- and double-quoted strings.',
  built: [
    'first.php: prints "Hello World!", mixes HTML tags into the output, nests double quotes inside a single-quoted string and shows the current date with gmdate("M d Y")',
    'variables.php: stores the school, course and class name in variables and interpolates them into sentences',
    'variables.php: joins strings with the . operator and appends with .= to build "Harry Potter: The Goblet of Fire" and "The Lord of The Rings: Return of the King"',
    'variables.php: runs strlen(), strtolower(), strtoupper() and ucwords() on a mixed-case name (27 characters)',
    'numbers.php: computes 30 widgets at $119.95 plus 5% tax and formats the total as $3,778.43 with number_format()',
    'numbers.php: defines YEAR and INDAY constants with define() and prints the PHP_VERSION and PHP_OS system constants (8.5.10 on Darwin)',
    'Linted each script with php -l, ran it from the CLI, then served it through PHP\'s built-in web server to check the rendered page',
  ],
  screenshots: [
    { src: '/work/php-server-side-basics/01-variables.webp', caption: 'variables.php: interpolation, concatenation and string functions' },
    { src: '/work/php-server-side-basics/02-numbers.webp', caption: 'numbers.php: tax calculation, define() constants and quote handling' },
    { src: '/work/php-server-side-basics/03-first.webp', caption: 'first.php: basic print and echo output with today\'s date' },
  ],
  code: [
    {
      title: 'Concatenation and string functions',
      file: 'variables.php',
      lang: 'php',
      code: `echo "<b>Using Concatenation Assignment Operator </b><br>";
$title = "Harry Potter:";
$subtitle = " The Goblet of Fire";
$title .= $subtitle;
echo "$title<br> OR: <br>";
$t2 = "The Lord of The Rings:";
$s2 = "Return of the King";
$t = $t2;
$t .= " ";
$t .= $s2;
echo "$t <br><br>";

echo "<b>Using String Functions</b><br>";
$name = "RuSkIn ANtOiNe C. vAlDeRaMa";
$n = strlen($name);
$l = strtolower($name);
$u = strtoupper($name);
$w = ucwords($name);
echo "<i>$name</i> has $n characters.<br>";
echo "<i>$name</i> in lowercase: $l.<br>";
echo "<i>$name</i> in uppercase: $u.<br>";
echo "<i>$name</i> using <i>ucwords()</i>: $w. <br><br>";`,
    },
    {
      title: 'Tax calculation, constants and quotes',
      file: 'numbers.php',
      lang: 'php',
      code: `$quantity = 30; // 30 pcs.
$price = 119.95; // $119.95
$taxrate = .05; // 5% tax rate
$total = $quantity * $price;
$total = $total + ($total * $taxrate); // Add tax
$total = number_format($total, 2); // Format the results
echo "You are purchasing <b> $quantity </b> widgets at a cost of <b>\\$ $price</b> each.<br>";
echo "With tax, the total comes to <b>\\$ $total </b><br><br>";
echo "<b>Using define() Function</b><br>";
define("YEAR", "2020");
define("INDAY", "June 12th");
echo "Independence Day is " . INDAY . "<br>";
echo "We are in year " . YEAR . ".<br>";
echo "This server is running version " . "<b>" . PHP_VERSION . " of the PHP on the " . PHP_OS . ".</b><br><br>";
echo "<b>Single and Double Quotation Marks</b><br>";
$var = 'test';
echo "var is equal to $var <br>";
echo 'var is equal to $var <br>';`,
    },
  ],
  reflection:
    'The main thing I took from this lab is where PHP actually runs. Running each script with php from the terminal showed the raw HTML it produces, and opening the same file through the built-in server showed the browser only ever receives that HTML, never the PHP. The quote rules also clicked here: double quotes replace $var with its value, single quotes print it literally, and \\$ is needed when a real dollar sign sits next to a variable, as in the widget price.\n\nThe tax example taught me to check the math by hand. 30 times 119.95 plus 5% is 3,778.425, and number_format() rounds it to 3,778.43, which matched the module reference even though the reference was produced on Windows with PHP 7.4 and I ran PHP 8.5.10 on macOS. One thing I noticed is that ucwords() only raises first letters, so the mixed-case name keeps its odd inner casing; next time I would combine it with strtolower() to get a properly formatted name.',
  docs: [{ label: 'Lab report (PDF)', href: '/work/php-server-side-basics/documentation.pdf' }],
}
