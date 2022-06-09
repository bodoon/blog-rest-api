import { expect } from "chai";
import sinon from "sinon";

import User from "../models/user.js";
import { login } from "../controllers/auth.js";

describe("Auth Controller - Login", () => {
  it("should throw an error with code 500 if accessing the database fails", async () => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
      },
    };

    const result = await login(req, {}, () => {});
    expect(result).to.be.an("error");
    expect(result).to.have.property("statusCode", 500);

    User.findOne.restore();
  });
});
