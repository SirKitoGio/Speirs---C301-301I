export default {
  slug: 'php-arithmetic',
  order: 9,
  title: 'PHP Arithmetic Operations and Number Theory Tasks',
  short: 'PHP Arithmetic',
  term: 'midterm',
  date: '2026-09-18',
  kind: 'Activity',
  team: null,
  stack: ['PHP 8.5', 'PHP CLI', 'PHP built-in server', '$argv / $_GET'],
  summary:
    'Six PHP scripts that take two numbers and run arithmetic, odd/even checks, odd and even ranges, factor lists and the greatest common factor, plus a runner that executes all six at once.',
  objective:
    'Given two numbers, num1 and num2, write PHP programs that (1) apply every arithmetic operator, (2) check whether each number is odd or even, (3) list all odd numbers up to num1, (4) list all even numbers up to num2, (5) list the factors of both numbers, and (6) find their greatest common factor. The exercise practises operators, conditionals, loops, arrays and simple functions.',
  built: [
    'task1_arithmetic.php: addition, subtraction, multiplication, division (rounded to 4 places), modulus and exponentiation, with division and modulus skipped when num2 is 0',
    'task2_odd_even.php: a checkOddOrEven() helper that uses % 2 and prints the reason for each result',
    'task3_odd_range.php and task4_even_range.php: for loops that collect odd numbers from 1 to num1 and even numbers from 1 to num2, then print the count, smallest, largest and sum',
    'task5_factors.php: a getFactors() function that scans 1..n for divisors, plus array_intersect() to find the common factors',
    'task6_gcf.php: the GCF found two ways, as the largest common factor and with the Euclidean algorithm printed step by step, with a note when the numbers are coprime',
    'Every script reads its inputs from command-line arguments, from ?num1=&num2= in the URL, or falls back to defaults of 24 and 18',
    'run_all.php: includes the six scripts in order with one input pair and wraps each result in a styled card when opened in a browser',
  ],
  screenshots: [
    { src: '/work/php-arithmetic/01-run-all.webp', caption: 'run_all.php in the browser with the default inputs 24 and 18' },
    { src: '/work/php-arithmetic/02-factors-gcf.webp', caption: 'Tasks 5 and 6 with num1=60 and num2=36: factor lists and a three-step Euclidean trace' },
    { src: '/work/php-arithmetic/03-odd-even-ranges.webp', caption: 'Tasks 3 and 4: odd numbers up to 24 and even numbers up to 18 with their sums' },
    { src: '/work/php-arithmetic/04-divide-by-zero.webp', caption: 'Task 1 with num2=0, where the division and modulus guards return "Undefined"' },
  ],
  code: [
    {
      title: 'Reading inputs from the CLI or the URL',
      file: 'task1_arithmetic.php',
      lang: 'php',
      code: `// Preset default values
$default_num1 = 24;
$default_num2 = 18;

// Resolve inputs based on execution environment
if (PHP_SAPI === 'cli') {
    $num1 = isset($argv[1]) && is_numeric($argv[1]) ? (float)$argv[1] : $default_num1;
    $num2 = isset($argv[2]) && is_numeric($argv[2]) ? (float)$argv[2] : $default_num2;
    $nl = "\\n";
} else {
    header('Content-Type: text/html; charset=utf-8');
    $num1 = isset($_GET['num1']) && is_numeric($_GET['num1']) ? (float)$_GET['num1'] : $default_num1;
    $num2 = isset($_GET['num2']) && is_numeric($_GET['num2']) ? (float)$_GET['num2'] : $default_num2;
    $nl = "<br>";
    echo "<pre style='font-family: monospace; font-size: 15px;'>";
}`,
    },
    {
      title: 'Division and modulus with a zero guard',
      file: 'task1_arithmetic.php',
      lang: 'php',
      code: `// 4. Division (/) with Division by Zero Guard
if ($num2 == 0) {
    echo "[/] Division:        Undefined (Cannot divide by zero)" . $nl;
} else {
    $quotient = $num1 / $num2;
    $quotient_display = is_float($quotient) ? round($quotient, 4) : $quotient;
    echo "[/] Division:        $num1 / $num2 = $quotient_display" . $nl;
}

// 5. Modulus (%) with Division by Zero Guard
if ($num2 == 0) {
    echo "[%] Modulus:         Undefined (Cannot divide by zero)" . $nl;
} else {
    $remainder = (int)$num1 % (int)$num2;
    echo "[%] Modulus:         $num1 % $num2 = $remainder" . $nl;
}`,
    },
    {
      title: 'Euclidean algorithm with a step trace',
      file: 'task6_gcf.php',
      lang: 'php',
      code: `// Method 2: Euclidean Algorithm (Iterative with step trace)
echo "[Method 2: Euclidean Algorithm Steps]" . $nl;
$a = $num1;
$b = $num2;
$step = 1;

if ($b === 0) {
    $gcf = $a;
    echo "Since num2 is 0, GCF is $a." . $nl;
} else {
    while ($b !== 0) {
        $remainder = $a % $b;
        $quotient = intdiv($a, $b);
        echo "Step $step: $a = ($b * $quotient) + $remainder" . $nl;
        $a = $b;
        $b = $remainder;
        $step++;
    }
    $gcf = $a;
}

echo "--------------------------------------------------" . $nl;
echo ">> FINAL RESULT: GCF($num1, $num2) = $gcf <<" . $nl;`,
    },
  ],
  reflection:
    'This activity was mostly about getting small details right. Division and modulus by zero throw a DivisionByZeroError in PHP 8, so both needed a guard, and 24 ** 18 is too large for an integer, so PHP prints it as the float 6.9791470795844E+24. Writing the GCF two ways helped me check my own work: the largest common factor from Task 5 and the last non-zero remainder from the Euclidean loop both gave 6 for 24 and 18, and 12 for 60 and 36.\n\nThe runner needed extra care. run_all.php includes task5 and task6 in the same request and both define getFactors(), so each helper is wrapped in function_exists() to avoid a redeclaration error. Making every script accept command-line arguments and URL parameters also meant repeating the same input block six times. If I did it again I would put the input handling and getFactors() in one shared file, and only loop up to the square root of n when collecting factors.',
  docs: [{ label: 'Activity documentation (PDF)', href: '/work/php-arithmetic/documentation.pdf' }],
}
