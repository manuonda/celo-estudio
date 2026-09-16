// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/// @title Lock — alcancía con fecha (ejemplo de Hardhat)
/// @notice Guarda CELO hasta `unlockTime`. Solo el `owner` puede retirarlo después.
/// @dev El frontend (`LockPanel`) lo despliega con MetaMask y después lee
///      `unlockTime` / `owner` (`useReadContract`) y llama `withdraw`
///      (`useWriteContract`). Ver README del lab.
contract Lock {
    /// Unix timestamp (segundos) a partir del cual se puede retirar.
    uint public unlockTime;

    /// Wallet que desplegó el contrato. Recibe el CELO en `withdraw`.
    address payable public owner;

    /// Se emite cuando el owner retira. La web podría escuchar este evento.
    event Withdrawal(uint amount, uint when);

    /// `payable`: en el deploy se puede mandar CELO junto con la transacción.
    /// `_unlockTime` tiene que ser *después* de ahora (`block.timestamp`).
    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    /// Saca todo el balance del contrato hacia el owner.
    /// Falla si aún no llegó la fecha o si llama otra wallet.
    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
