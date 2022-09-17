declare global {
  var testRequest: import("supertest").SuperTest<import("supertest").Test>; // implementando em tipos que já  existe
}

export {};