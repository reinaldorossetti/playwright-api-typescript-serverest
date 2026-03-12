import { faker } from '@faker-js/faker';

export function randomName(): string {
  return faker.person.fullName();
}

export function randomProduct(): string {
  return faker.commerce.productName();
}

export function randomEmail(): string {
  const firstName = faker.person.firstName().toLowerCase().replace(/[^a-z0-9]/g, '');
  const suffix = faker.string.alphanumeric({ length: 8 }).toLowerCase();
  return `${firstName}.${suffix}@gmail.com`;
}

export function randomPassword(): string {
  return faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ });
}
