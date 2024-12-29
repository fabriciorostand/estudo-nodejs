const { Person } = require("./person");

// require("./modules/path");
// require("./modules/fs");
require("./modules/http");

const person = new Person('Fabricio');

console.log(person.sayMyName());