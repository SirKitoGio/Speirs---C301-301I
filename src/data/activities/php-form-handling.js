export default {
  slug: 'php-form-handling',
  order: 5,
  title: 'PHP Form Handling with HTML Input Types',
  short: 'PHP Form Handling',
  term: 'midterm',
  date: '2026-09-01',
  kind: 'Activity',
  team: null,
  stack: ['PHP 8', 'HTML forms', '$_POST', 'PHP arrays'],
  summary:
    'An HTML form that uses every common input type and a PHP script that reads the POST data and prints it back, with multi-select answers sorted into lists.',
  objective:
    'Build a form with text fields, a single checkbox, a checkbox group, radio buttons, a dropdown, a multi-select list box and a textarea, then process the submission in PHP. The goal was to learn how each control arrives in the $_POST superglobal, how to check for missing values with isset(), and how array-named inputs such as hobby[] become PHP arrays that can be counted and sorted.',
  built: [
    'input_types.html: a POST form targeting input_types.php with name and age text fields, a "Have you eaten an apple?" checkbox, three hobby checkboxes, a three-option radio group, a price dropdown, a multi-select pants-size list and a comments textarea',
    'Array notation on the multi-value controls (name="hobby[]" and name="pantsSize[]") so PHP receives them as indexed arrays',
    'input_types.php: reads $_POST[\'pangalan\'] and $_POST[\'edad\'] and greets the user by name and age',
    'isset() checks on the checkbox group, radio group and multi-select list before reading them, since unchecked controls are not sent',
    'Checked hobbies sorted with sort() and printed as an ordered list; selected pants sizes sorted and printed as an unordered list',
    'Submit ("See Results") and reset ("Clear") buttons, plus a Back link from the output page to the form',
    'Tested a second submission with the single checkbox left unchecked, which exposed an "Undefined array key" warning in the else branch',
  ],
  screenshots: [
    { src: '/work/php-form-handling/01-form-filled.webp', caption: 'The form filled in with sample answers for every input type' },
    { src: '/work/php-form-handling/02-php-output.webp', caption: 'input_types.php output, with hobbies and pant sizes sorted alphabetically' },
    { src: '/work/php-form-handling/03-unchecked-warning.webp', caption: 'Second test with the checkbox unchecked, showing the undefined array key warning' },
  ],
  code: [
    {
      title: 'Array-named inputs in the form',
      file: 'input_types.html',
      lang: 'markup',
      code: `<b> Multiple Checkboxes </b> <br>
Have you experienced: <br>
<input type="checkbox" name="hobby[]" value="Diving in Anilao"> Diving in Anilao? <br>
<input type="checkbox" name="hobby[]" value="Surfing in Siargao"> Surfing in Siargao? <br>
<input type="checkbox" name="hobby[]" value="Snorkling in Cebu"> Snorkling in Cebu? <br> <br>

<b> Radio Buttons </b> <br>
Which do you prefer most? <br>
<input type="radio" name="q1" value="Microsoft"> Microsoft <br>
<input type="radio" name="q1" value="Open Source"> Open Source <br>
<input type="radio" name="q1" value="NA"> Not applicable <br> <br>

What size are you in Pants? <br>
<select name="pantsSize[]" multiple>
	<option> Small </option>
	<option> Medium </option>
	<option> Large </option>
	<option> Extra Large </option>
</select> <br> <br>`,
    },
    {
      title: 'Reading text fields and the checkbox group',
      file: 'input_types.php',
      lang: 'php',
      code: `$name = $_POST['pangalan'];

echo "OUTPUT From: <b> TextField </b> <br>";
echo "Hi $name!<br>";
echo "You are {$_POST['edad']} years old. <br><br>";

echo "<br>OUTPUT From: <b> Multiple CheckBoxes </b> <br>";

if (isset($_POST['hobby']))
{
  $choi = $_POST['hobby'];
  $n=count($choi);
  $i=0;
  echo "You have experienced: <br>"."<ol>";

 while ($i<$n)
  {
  sort($choi);
  echo "<li>{$choi[$i]}</li><br>"  ;
  $i++;
  }
echo "</ol>";
}`,
    },
  ],
  reflection:
    'This activity made it clear that a form only sends what the user actually selects. Text fields always arrive, even empty, but an unchecked checkbox or an unpicked radio button is missing from $_POST entirely, so the PHP side has to ask isset() before it reads anything optional. The square brackets in name="hobby[]" were the other key idea: without them PHP keeps only the last checked value, and with them I get an array I can count, sort and loop over.\n\nThe hardest part was understanding the warning in my second test. The single-checkbox block checks isset(), but its else branch still reads $_POST[\'choice\'], so leaving the box unchecked prints "Undefined array key". If I did it again I would print a fallback such as "Not selected" in that branch, call sort() once before the loop instead of on every pass, and wrap every echoed value in htmlspecialchars() so user input cannot inject HTML into the results page.',
  docs: [{ label: 'Activity documentation (PDF)', href: '/work/php-form-handling/documentation.pdf' }],
}
