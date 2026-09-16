"use client"

import { useEffect, useState } from "react"
import { isAddress, formatEther, type Address } from "viem"
import { celoSepolia } from "wagmi/chains"
import {
  useAccount,
  useBalance,
  useChainId,
  useDeployContract,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  LOCK_STORAGE_KEY,
  LOCK_VALUE,
  UNLOCK_DELAY_SECONDS,
  lockAbi,
  lockBytecode,
  lockExplorerUrl,
} from "@/lib/lock"

function shortError(error: unknown) {
  if (!error || typeof error !== "object") return "Falló la transacción"
  const e = error as { shortMessage?: string; message?: string }
  return e.shortMessage || e.message || "Falló la transacción"
}

function formatUnlock(unlockTime: bigint) {
  return new Date(Number(unlockTime) * 1000).toLocaleString()
}

function LockPanelInner() {
  const { address: account, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const onSepolia = chainId === celoSepolia.id

  const [lockAddress, setLockAddress] = useState<Address | undefined>()
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCK_STORAGE_KEY)
    if (saved && isAddress(saved)) setLockAddress(saved)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const {
    deployContract,
    data: deployHash,
    isPending: isDeploying,
    error: deployError,
    reset: resetDeploy,
  } = useDeployContract()

  const { data: deployReceipt, isLoading: isConfirmingDeploy } =
    useWaitForTransactionReceipt({ hash: deployHash })

  useEffect(() => {
    const deployed = deployReceipt?.contractAddress
    if (!deployed) return
    setLockAddress(deployed)
    window.localStorage.setItem(LOCK_STORAGE_KEY, deployed)
  }, [deployReceipt])

  const enabled = Boolean(lockAddress) && onSepolia

  const { data: unlockTime, refetch: refetchUnlock } = useReadContract({
    address: lockAddress,
    abi: lockAbi,
    functionName: "unlockTime",
    query: { enabled },
  })

  const { data: owner, refetch: refetchOwner } = useReadContract({
    address: lockAddress,
    abi: lockAbi,
    functionName: "owner",
    query: { enabled },
  })

  const { data: lockedBalance, refetch: refetchBalance } = useBalance({
    address: lockAddress,
    query: { enabled },
  })

  const {
    writeContract,
    data: withdrawHash,
    isPending: isWithdrawing,
    error: withdrawError,
    reset: resetWithdraw,
  } = useWriteContract()

  const { isLoading: isConfirmingWithdraw, isSuccess: withdrew } =
    useWaitForTransactionReceipt({ hash: withdrawHash })

  useEffect(() => {
    if (!withdrew) return
    void refetchBalance()
    void refetchUnlock()
    void refetchOwner()
  }, [withdrew, refetchBalance, refetchUnlock, refetchOwner])

  const canWithdraw =
    typeof unlockTime === "bigint" &&
    now >= Number(unlockTime) &&
    owner &&
    account &&
    owner.toLowerCase() === account.toLowerCase() &&
    lockedBalance !== undefined &&
    lockedBalance.value > 0n

  const secondsLeft =
    typeof unlockTime === "bigint" ? Math.max(0, Number(unlockTime) - now) : 0

  function onDeploy() {
    resetDeploy()
    const unlockAt = BigInt(Math.floor(Date.now() / 1000) + UNLOCK_DELAY_SECONDS)
    deployContract({
      abi: lockAbi,
      bytecode: lockBytecode,
      args: [unlockAt],
      value: LOCK_VALUE,
      chainId: celoSepolia.id,
    })
  }

  function onWithdraw() {
    if (!lockAddress) return
    resetWithdraw()
    writeContract({
      address: lockAddress,
      abi: lockAbi,
      functionName: "withdraw",
      chainId: celoSepolia.id,
    })
  }

  function onReset() {
    window.localStorage.removeItem(LOCK_STORAGE_KEY)
    setLockAddress(undefined)
    resetDeploy()
    resetWithdraw()
  }

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Lock on-chain</CardTitle>
        <CardDescription>
          Desplegá el contrato con MetaMask (cuenta de dev, Celo Sepolia). Manda{" "}
          {formatEther(LOCK_VALUE)} CELO y se puede retirar a los{" "}
          {UNLOCK_DELAY_SECONDS / 60} minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <p className="text-sm text-muted-foreground">
            Conectá la wallet de dev arriba a la derecha.
          </p>
        )}

        {isConnected && !onSepolia && (
          <Button
            type="button"
            onClick={() => switchChain({ chainId: celoSepolia.id })}
            disabled={isSwitching}
          >
            {isSwitching ? "Cambiando red…" : "Cambiar a Celo Sepolia"}
          </Button>
        )}

        {isConnected && onSepolia && !lockAddress && (
          <Button
            type="button"
            onClick={onDeploy}
            disabled={isDeploying || isConfirmingDeploy}
          >
            {isDeploying || isConfirmingDeploy
              ? "Confirmá en MetaMask…"
              : `Desplegar Lock (${formatEther(LOCK_VALUE)} CELO)`}
          </Button>
        )}

        {lockAddress && (
          <dl className="space-y-2 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">Contrato</dt>
              <dd className="font-mono break-all">
                <a
                  className="underline underline-offset-2"
                  href={lockExplorerUrl(lockAddress)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lockAddress}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="font-mono">
                {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "…"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">CELO trabado</dt>
              <dd>
                {lockedBalance ? `${formatEther(lockedBalance.value)} CELO` : "…"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Se desbloquea</dt>
              <dd>
                {typeof unlockTime === "bigint"
                  ? `${formatUnlock(unlockTime)}${
                      secondsLeft > 0 ? ` (en ${secondsLeft}s)` : " (ya)"
                    }`
                  : "…"}
              </dd>
            </div>
          </dl>
        )}

        {lockAddress && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={onWithdraw}
              disabled={!canWithdraw || isWithdrawing || isConfirmingWithdraw}
            >
              {isWithdrawing || isConfirmingWithdraw
                ? "Retirando…"
                : "Retirar CELO"}
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              Desplegar otro
            </Button>
          </div>
        )}

        {(deployError || withdrawError) && (
          <p className="text-sm text-destructive">
            {shortError(deployError || withdrawError)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function LockPanel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="text-left">
        <CardHeader>
          <CardTitle>Lock on-chain</CardTitle>
          <CardDescription>Cargando wallet…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return <LockPanelInner />
}
