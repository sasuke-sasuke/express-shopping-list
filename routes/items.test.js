process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let bacon = { name: "bacon", price: 12.0 };

beforeEach(() => {
  items.push(bacon);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [bacon] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${bacon.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: bacon.name, price: bacon.price });
  });
  test("Responds 404 for invalid item", async () => {
    const res = await request(app).get(`/items/beets`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Create a item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "water", price: 18.0 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      added: { newItem: { name: "water", price: 18.0 } },
    });
  });

  test("Responds 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items", () => {
  test("Update a items", async () => {
    const res = await request(app)
      .patch(`/items/${bacon.name}`)
      .send({ name: "monster", price: 4.23 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "monster", price: 4.23 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/items/redBull`)
      .send({ name: "monster", price: 4.23 });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items", () => {
  test("Delete a items", async () => {
    const res = await request(app).delete(`/items/${bacon.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });

  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/redBull`);
    expect(res.statusCode).toBe(404);
  });
});
