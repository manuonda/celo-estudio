// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

// Laboratorio: 3 minutos (no 2030) para poder probar withdraw en la misma sesión.
const UNLOCK_IN_SECONDS = 3 * 60;
const LOCKED_AMOUNT = parseEther("0.001");

const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter(
    "unlockTime",
    Math.floor(Date.now() / 1000) + UNLOCK_IN_SECONDS
  );
  const lockedAmount = m.getParameter("lockedAmount", LOCKED_AMOUNT);

  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;
