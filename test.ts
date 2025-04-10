const fs = require('fs');
const path = 'server/migrations/meta/_journal.json';

fs.access(path, fs.constants.F_OK, (err:any) => {
  if (err) {
    console.error(`Error: Cannot access ${path}: ${err}`);
  } else {
    console.log('File exists:', path);
  }
});