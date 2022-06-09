import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import User from "../models/user.js";
import { getUserStatus } from "../controllers/user.js";

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5iv8j.mongodb.net/test-blog`;

describe("Feed controller", () => {
  before(async () => {
    try {
      await mongoose.connect(MONGODB_URI);

      const user = new User({
        email: "test@test.test",
        password: "password",
        name: "test",
        posts: [],
        _id: "5c0f66b979af55031b34728a",
      });

      await user.save();
    } catch (error) {
      console.log(error);
    }
  });

  it("should send a response with a valid user status for an existing user", async () => {
    try {
      const req = { userId: "5c0f66b979af55031b34728a" };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.userStatus = data.status;
        },
      };

      await getUserStatus(req, res, () => {});

      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new");
    } catch (error) {
      console.log(error);
    }
  });

  after(async () => {
    try {
      await User.deleteMany({});
      mongoose.disconnect();
    } catch (error) {
      console.log(error);
    }
  });
});
