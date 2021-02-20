const { assert } = require("chai");

const { findUserByEmail } = require("../helper.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("findUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });

  it("should return false for non existing email", function () {
    const user = findUserByEmail("user1@example.com", testUsers);
    const expectedOutput = null;
    assert.notStrictEqual(user, expectedOutput);
  });
});