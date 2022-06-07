import { expect } from "chai";

import authMiddleware from "../middleware/is-auth.js";

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
