// Custom adaptation of node-spinner by Pasquale Boemio
// https://github.com/helloIAmPau/node-spinner

var defaultSpinnerString = 0;
var defaultSpinnerDelay = 60;

var Spinner = function(textToShow){
  this.text = textToShow || '';
  this.setSpinnerString(defaultSpinnerString);
  this.setSpinnerDelay(defaultSpinnerDelay);
};

Spinner.spinners = [
  '|/-\\',
  '⠂-–—–-',
  '◐◓◑◒',
  '←↖↑↗→↘↓↙',
  '┤┘┴└├┌┬┐',
  '◢◣◤◥',
  '.oO°Oo.',
  '.oO@*',
  '☱☲☴',
  '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
  '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓',
  '⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆',
  '⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋',
  '⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁',
  '⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈',
  '⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈',
  '⢄⢂⢁⡁⡈⡐⡠',
  '⢹⢺⢼⣸⣇⡧⡗⡏',
  '⣾⣽⣻⢿⡿⣟⣯⣷',
  '⠁⠂⠄⡀⢀⠠⠐⠈'
];

Spinner.setDefaultSpinnerString = function(value) {
  defaultSpinnerString = value;
};

Spinner.setDefaultSpinnerDelay = function(value) {
  defaultSpinnerDelay = value;
};

Spinner.prototype.start = function() {
  var current = 0;
  var self = this;
  var hasPos = self.text.indexOf('%s') > -1;
  this.id = setInterval(function() {
    var msg = hasPos ? self.text.replace('%s', self.chars[current]) : self.chars[current] + ' ' + self.text;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
    current = ++current % self.chars.length;
  }, this.delay);
};

Spinner.prototype.setSpinnerDelay = function(n) {
  this.delay = n;
};

Spinner.prototype.setSpinnerString = function(str) {
  this.chars = mapToSpinner(str, this.spinners).split('');
};

Spinner.prototype.stop = function() {
  clearInterval(this.id);
};

// Helpers

function isInt(value) {
  return (typeof value==='number' && (value%1)===0);
}

function mapToSpinner(value, spinners) {
  // Not an integer, return as strng
  if (!isInt(value)) {
    return value + '';
  }

  // Check if index is within bounds
  value = (value >= Spinner.spinners.length) ? 0 : value;
  // If negative, count from the end
  value = (value < 0) ? Spinner.spinners.length + value : value;

  return Spinner.spinners[value];
}

exports.Spinner = Spinner;