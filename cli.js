import chokidar from 'chokidar';
import { exec } from 'child_process';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

// Parse command line arguments
if (!argv.i || !argv.o) {
  console.error('Usage: transbend -i <input_directory> -o <output_directory>');
  process.exit(1);
}

const inputDirectory = argv.i;
const outputDirectory = argv.o;

// Initialize watcher
const watcher = chokidar.watch(inputDirectory, {
  persistent: true,
  ignored: /^\./, // ignore dotfiles
  ignoreInitial: true // ignore initial files when watcher is set up
});

console.log(`${new Date().toISOString()} transbend ${inputDirectory} --> ${outputDirectory}`);

// Watch for file changes
watcher.on('add', processFile);
watcher.on('change', processFile);

function processFile(filePath) {
  
  // Modify the command to use the file path and output directory appropriately
  const relativeFilePath = filePath.substring(inputDirectory.length - 1);
  const outputFile = `${outputDirectory}/${relativeFilePath.replace('.bs', '.bend')}`;

  console.log(`${new Date().toISOString()} telebend ${filePath} --> ${outputFile}`);
  const command = `telebend -i ${filePath} -o ${outputFile}`;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${command}`, error);
      return;
    }
    // console.log(`Command executed successfully: ${command}`);
  });
}

// Handle CTRL+C to exit
process.on('SIGINT', () => {
  console.log('\nExiting...');
  watcher.close();
  process.exit();
});
