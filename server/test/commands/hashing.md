node -e "
const b = require('bcrypt');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('personal_test.json'));
data.forEach(u => u.password = b.hashSync(u.password, 10));
fs.writeFileSync('personal_test_hash.json', JSON.stringify(data, null, 2));
console.log('Done!');
"