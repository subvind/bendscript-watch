"use strict";

var _chokidar = _interopRequireDefault(require("chokidar"));
var _child_process = require("child_process");
var _minimist = _interopRequireDefault(require("minimist"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var argv = (0, _minimist["default"])(process.argv.slice(2));

// Parse command line arguments
if (!argv.i || !argv.o) {
  console.error('Usage: transbend -i <input_directory> -o <output_directory>');
  process.exit(1);
}
var inputDirectory = argv.i;
var outputDirectory = argv.o;

// Initialize watcher
var watcher = _chokidar["default"].watch(inputDirectory, {
  persistent: true,
  ignored: /^\./,
  // ignore dotfiles
  ignoreInitial: true // ignore initial files when watcher is set up
});
console.log("".concat(new Date().toISOString(), " transbend ").concat(inputDirectory, " --> ").concat(outputDirectory));

// Watch for file changes
watcher.on('add', processFile);
watcher.on('change', processFile);
function processFile(filePath) {
  // Modify the command to use the file path and output directory appropriately
  var relativeFilePath = filePath.substring(inputDirectory.length - 1);
  var outputFile = "".concat(outputDirectory, "/").concat(relativeFilePath.replace('.bs', '.bend'));
  console.log("".concat(new Date().toISOString(), " telebend ").concat(filePath, " --> ").concat(outputFile));
  var command = "telebend -i ".concat(filePath, " -o ").concat(outputFile);

  // Execute the command
  (0, _child_process.exec)(command, function (error, stdout, stderr) {
    if (error) {
      console.error("Error executing command: ".concat(command), error);
      return;
    }
    // console.log(`Command executed successfully: ${command}`);
  });
}

// Handle CTRL+C to exit
process.on('SIGINT', function () {
  console.log('\nExiting...');
  watcher.close();
  process.exit();
});
