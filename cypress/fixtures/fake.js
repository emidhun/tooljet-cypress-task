import faker from "@faker-js/faker";

export let fake = {};

function email() {
  return `${faker.name.findName()}@example.com`;
}
function password() {
  return faker.internet.password();
}
function appName() {
  return faker.name.firstName();
}

Object.defineProperty(fake, "email", { get: email });
Object.defineProperty(fake, "password", { get: password });
Object.defineProperty(fake, "appName", { get: appName });
