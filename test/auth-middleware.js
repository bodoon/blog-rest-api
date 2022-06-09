import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import authMiddleware from "../middleware/is-auth.js";

describe("Auth middleware", () => {
  it("shoud throw an error if no authorization header is present", () => {
    const req = {
      get: (headerName) => {
        return null;
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {});
    }).to.throw("Token verifying failed");
  });

  it("shoud throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xxx";
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {});
    }).to.throw("Token verifying failed");
  });

  it("shoud throw an error if the token cannot be verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xxx";
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {});
    }).to.throw("Token verifying failed");
  });

  it("shoud yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xxx";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    // jwt.verify = () => {
    //   return { userId: "abc" };
    // };
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
