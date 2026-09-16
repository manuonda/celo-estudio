"use strict";

function createBaseAccountSDK() {
  return {
    getProvider() {
      throw new Error("Base Account is disabled in this Celo lab");
    },
  };
}

module.exports = { createBaseAccountSDK };
exports.createBaseAccountSDK = createBaseAccountSDK;
