const Cerbos = require("cerbos");
const db = require("./db");

const cerbos = new Cerbos.default({
  hostname: "http://localhost:3592", // The Cerbos PDP instance
});

const SHOW_PDP_REQUEST_LOG = false;

module.exports = async (principalId, action, resourceAtrr = {}) => {
  const user = db.users.find((item) => item.id === Number(principalId));

  const cerbosObject = {
    actions: ["create", "view:single", "view:all", "update", "delete", "flag"],
    resource: {
      policyVersion: "default",
      kind: "blogpost",
      instances: {
        post: {
          attr: {
            ...resourceAtrr,
          },
        },
      },
    },
    principal: {
      id: principalId || "0",
      policyVersion: "default",
      roles: [user?.role || "unknown"],
      attr: user,
    },
    includeMeta: true,
  };

  SHOW_PDP_REQUEST_LOG &&
    console.log("cerbosObject \n", JSON.stringify(cerbosObject, null, 4));

  const cerbosCheck = await cerbos.check(cerbosObject);

  const isAuthorized = cerbosCheck.isAuthorized("post", action);

  if (!isAuthorized)
    throw new Error("You are not authorized to visit this resource");
  return true;
};
