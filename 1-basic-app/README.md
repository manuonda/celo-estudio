# 1-basic-app — laboratorio Celo Sepolia

App de estudio: MetaMask + **Celo Sepolia** (testnet) + contrato de ejemplo `Lock.sol`. No usa mainnet ni plata real.

Plantilla: [Celo Composer](https://github.com/celo-org/celo-composer) (`basic`) = Next.js + RainbowKit + Hardhat.

## Dónde estamos

| Paso | Estado |
|------|--------|
| Cuenta MetaMask de **dev** (no la principal) | Hecho |
| Red **Celo Sepolia** en MetaMask | Hecho |
| CELO de test en el [faucet](https://faucet.celo.org/celo-sepolia) | Hecho |
| Project ID de Reown en `apps/web/.env.local` | Hecho |
| App en `localhost:3000` conectada | Hecho |
| Compilar `Lock.sol` | Hecho |
| Desplegar `Lock.sol` en Sepolia (Hardhat Ignition) | Hecho |

## Quick path (ya recorrido)

1. Crear una cuenta **dev** en MetaMask. No uses la que tiene fondos reales.
2. Agregar la red **Celo Sepolia**:
   - RPC: `https://forno.celo-sepolia.celo-testnet.org`
   - Chain ID: `11142220`
   - Símbolo: `CELO`
   - Explorer: `https://celo-sepolia.blockscout.com`
3. Pedir tokens de test en [faucet.celo.org/celo-sepolia](https://faucet.celo.org/celo-sepolia) con la dirección `0x…` de la cuenta de dev.
4. Proyecto en [Reown Cloud](https://cloud.reown.com/) → `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` en `apps/web/.env.local`.
5. `pnpm install` → `pnpm dev` → [http://localhost:3000](http://localhost:3000) → Connect.

## Web vs contrato

`pnpm dev` solo levanta Next.js (`localhost:3000`). El contrato **no** es otro puerto.

| Paso | Comando / acción | Dónde vive el resultado |
|------|------------------|-------------------------|
| Compilar | `pnpm contracts:compile` | `apps/contracts/artifacts/` (local) |
| Desplegar | Hardhat Ignition (abajo) | Celo Sepolia + dirección `0x…` |
| Usar | wagmi en la web | La web llama a Sepolia con ABI + address |

Compilar ≠ publicar. Sepolia solo se entera en el **deploy**.

Ciclo: escribir `Lock.sol` → compilar → desplegar → la web lee/escribe esa `0x…`.

## `.env` (nombres, nunca valores)

Son **dos** archivos. Plantillas sí (`.env.example`). Archivos con secretos **no**.

| Archivo | Para qué | Variables |
|---------|----------|-----------|
| `apps/web/.env.local` | Connect (RainbowKit / Reown) | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` |
| `apps/contracts/.env` | Deploy Hardhat | `PRIVATE_KEY` (cuenta **dev**). Opcional: `ETHERSCAN_API_KEY`, `REPORT_GAS` |

`CELO_RPC_URL=https://forno.celo.org` en `.env.local` es el default de Composer (mainnet). El Connect de esta app usa Sepolia en `wallet-provider.tsx`.

`ETHERSCAN_API_KEY` sirve para **verificar** el código en el explorer. Vacío está bien para este lab.

`REPORT_GAS=true` solo imprime gas en `pnpm contracts:test`. Dejar vacío.

`PRIVATE_KEY` en MetaMask: cuenta de **dev** → Account details → Show private key. En el `.env`: `PRIVATE_KEY=0x` + 64 hex, sin comillas ni espacios. No es la seed de 12 palabras. Que empiece con `2d` (u otro hex) es normal.

Hardhat ahora carga `apps/contracts/.env` con `dotenv` (`hardhat.config.ts`).

## Qué no subir (`.gitignore`)

Ya está cubierto. No hagas `git add` de estos archivos.

| Archivo | Ignorado en |
|---------|-------------|
| `.env`, `.env.local` | `1-basic-app/.gitignore` |
| `apps/contracts/.env` | `apps/contracts/.gitignore` |
| `artifacts/`, `cache/` | Compile local (`pnpm contracts:compile`) |
| `ignition/deployments/` | Journal del **deploy** (Sepolia), no del compile |

Nunca pegues `PRIVATE_KEY` ni el Project ID en el chat, el README o un commit.

## `Lock.sol`

Alcancía con fecha (ejemplo de Hardhat). No es Palabra del día.

Al desplegar: `owner` = quien firma; `unlockTime` en el futuro; se mandan **0.001 CELO**. `withdraw()` solo si ya pasó la fecha **y** llama el owner. En este lab el unlock es **3 minutos** (no 2030).

## Deploy en Sepolia (lo que funcionó)

Desde `apps/contracts`:

```bash
HARDHAT_TELEMETRY_CONSENT=false pnpm exec hardhat ignition deploy ignition/modules/Lock.ts --network celo-sepolia --reset
```

No uses `pnpm contracts:deploy:celo` (mainnet). El script `deploy:celo-sepolia` ahora apaga telemetría y Hardhat lee el `.env` con dotenv.

Si Ignition imprime una dirección `0x…`, el contrato está on-chain. Explorer: [celo-sepolia.blockscout.com](https://celo-sepolia.blockscout.com).

Camino alternativo (sin `PRIVATE_KEY`): botón **Desplegar Lock** en localhost (firma MetaMask). Es **otro** contrato / otra address.

## Problemas y solución (lab)

| Qué pasó | Por qué | Qué hicimos |
|----------|---------|-------------|
| Prompt *Help us improve Hardhat…* trabado | Turbo no pasa bien el teclado | `HARDHAT_TELEMETRY_CONSENT=false` y `pnpm exec hardhat …` (sin Turbo) |
| `ProviderError: Invalid params` en `getTransactionCount` | `PRIVATE_KEY` no estaba en el entorno (no había dotenv) | `source .env` en esa terminal; chequeo `cargó` / longitud **64**. Ahora `import "dotenv/config"` |
| `python3` decía `NO cargó` / `0` | Ese comando no lee el archivo; solo el entorno | `set -a && source .env && set +a` y repetir el chequeo |
| `Resuming existing deployment` | Journal de un intento fallido en `ignition/deployments/chain-11142220` | `--reset` |
| La key empezaba con `2d` | Hex normal; MetaMask a veces omite `0x` | Prefijo `0x` + 64 caracteres. No era la causa del error |

Chequeo de longitud (no imprime la clave):

```bash
cd apps/contracts
python3 -c 'import os; k=os.environ.get("PRIVATE_KEY",""); print("cargó" if k else "NO cargó"); print(len(k.replace("0x","")))'
```

Con dotenv, Hardhat carga el `.env` solo. Ese `python3` sigue mostrando `NO cargó` hasta que hagas `source .env` en **esa** shell; no significa que el deploy vaya a fallar.

## Cómo correr / estructura

- `apps/web` — Next.js, RainbowKit, Connect, panel Lock
- `apps/contracts` — Hardhat, `Lock.sol`, Ignition

```bash
pnpm contracts:compile              # local; no publica
pnpm contracts:test
pnpm contracts:deploy:celo-sepolia  # Sepolia (dotenv + telemetría off)
```

## Checklist

- [x] Cuenta MetaMask de laboratorio
- [x] Red Celo Sepolia
- [x] Faucet
- [x] Reown Project ID
- [x] Connect en localhost
- [x] Compilar `Lock.sol`
- [x] Deploy Hardhat Ignition en Sepolia
- [ ] (Opcional) Abrir la address del contrato en el explorer
- [ ] (Opcional) Cablear esa address en la home / retirar a los 3 min
- [ ] (Después) Palabra del día

## Next step

Anotar la dirección que imprimió Ignition y abrirla en el explorer. La home puede desplegar **otro** Lock con MetaMask; no reemplaza el que ya está en Sepolia.
