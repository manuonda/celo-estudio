# Ideas de Mini Apps (Celo / MiniPay)

Backlog para builders. El laboratorio de código es [`mi-app-celo/`](./mi-app-celo/).
Usuario MiniPay: Global South, Android barato, sesión corta, **no** jerga crypto.
Listing: [minipay.to/mini-apps](https://minipay.to/mini-apps). Docs: [MiniPay](https://docs.minipay.xyz/).

**Validación (sep 2026):** las ideas de juegos diarios sirven para aprender y pueden listarse, pero no son “hueco vacío”. Gaming ya tiene ~11 apps (snapshot). MiniPay empuja más África (NG, KE, UG, GH, ZA) que LATAM; español es un ángulo (p. ej. Colombia), no el mercado entero. Ver [scorecard](#scorecard-minipay) abajo.

## Cómo gana una idea (ciudadanos)

1. Se entiende en 5 segundos (“adivina la palabra de hoy”).
2. Se juega en menos de 1 minuto, una mano, 360×640.
3. Vuelves mañana (hábito), no un whitepaper.
4. En MiniPay el valor se siente en **stablecoin** (ganar / apostar poco / propina). Un Wordle 100 % gratis y sin USDm puntúa mal en “stablecoin-native”.
5. Idioma del **país objetivo**, no “LATAM genérico”. Brasil = portugués y varias apps de predict/premios lo tienen en blacklist.

Para un builder nuevo, Celo recomienda **juegos x2earn** o **AI de pago por uso** (no ahorro/crédito/FX: licencias).

`mi-app-celo` es Composer `basic` (MetaMask). Llevarlo a MiniPay no es un rename: hay que quitar Connect, no mostrar `0x…`, y probar en teléfono + ngrok.

---

## Prioridad 1 — Juegos diarios (este repo)

| Idea | ¿Bien para estudiar? | ¿Bien para MiniPay ciudadanos? | Cuidado |
|------|----------------------|--------------------------------|---------|
| **Palabra del día** | Sí — primer ship | Sí, **si** hay premio/entrada en USDm y palabras del país (no un clon de Wordle) | Ya existe [Spell Tower](https://spell-tower.vercel.app/?utm_source=spelltowerdirect) (“Unlock the secret word”). Diferenciar: español local, grid diario, compartir sin spoiler. No copiar marca/colores Wordle (NYT). **No** guardar la palabra en claro on-chain (cualquiera la leería). |
| **Horcado** | Sí, como variante | Débil como 2.ª app: mismo loop que palabra del día | No lo construyas en paralelo. Misma cuenta / mismo contrato “jugó hoy”. |
| **Atínale al tiempo** | Más tarde (commit-reveal es difícil) | Regular: es **suerte + apuesta**, no skill. Cerca de rifa/predictor | En el catálogo ya hay Predictor, Tradcast, Daily Treats (spin). Varios predict/premios **bloquean BR** y otros países. Bajar a prioridad 3 hasta tener el juego de palabras vivo. |

Diseño del premio (MiniPay — no opcional si quieres listing serio):

- Core: jugar y **ganar o pagar en USDm/USDC/USDT** (x2earn). Gratis total = dimensión A baja.
- Entrada chica (0.05–0.20 USDm) o pozo del día; fee de app transparente.
- 1 ticket por wallet por día **no basta** contra sybil (se abren muchas wallets). Para prototipo Sepolia sirve; con dinero real: premio tan chico que no valga la pena, o identidad MiniPay/Self después.
- UX: “Jugar” / “Premio del día” / “Depositar”. Nunca “mint”, “gas”, “sign message”.

On-chain mínimo sano: `played[day][player]`, pozo, `claim`. La palabra: hash + reveal al cerrar el día, o solo off-chain.

---

## Prioridad 2 — Utilidad cotidiana

- **Propina a un comercio** (QR + monto en USDm) — hay scaffold en [`payments-miniapp/`](./payments-miniapp/). Fit de pagos real; es otro producto, no el juego.
- **Vaquita / split** — útil; más complejo (varios pagadores, ODIS/contactos).
- Recordatorio “manda 5 USDm a mamá” — la idea es buena; MiniPay WebView **no garantiza** notificaciones push. Mejor “plantilla de envío” que un recordatorio.
- Mini rifa de barrio — **no en v1**. Misma zona gris que atínale al tiempo.
- Streak (7 días → bonus) — como **feature del juego**, no como app sola (`Daily Reward` ya existe).

---

## Prioridad 3 — Builder / agente (no es MiniPay ciudadano)

Correctas como laboratorio, no como listing:

- Dashboard `Counter` / pagos en Composer + MetaMask — **ya estás aquí** (`mi-app-celo`)
- Bot Telegram + Celina (claves locales)
- MCP de tu contrato
- x402 / AI de pago por uso — hueco de catálogo **alto** (0 apps “Pay AI as you go”), pero es otro stack; no sustituye el juego para aprender Solidity esta semana

---

## Ideas que suelen fallar en MiniPay

- NFT / collectibles como producto único
- Dashboard DeFi con APY y charts
- Connect Wallet + seed phrase + “Welcome to Web3”
- Sesiones de 10 minutos en desktop
- Wordle en inglés para NG/KE, o “español LATAM” sin elegir país
- Apuesta pura de suerte sin skill (rifa, timestamp aleatorio) en países que bloquean predictors

---

## Scorecard MiniPay

Framework: 5 dimensiones 0–2, total /10. Snapshot de catálogo ~2026-04 (Games = 11 apps).

| Dimensión | Palabra del día (ES + premio USDm, p. ej. CO) | Horcado | Atínale al tiempo |
|-----------|-----------------------------------------------|---------|-------------------|
| A. Stablecoin-native | 2 si el premio/entrada es el core; **1 o 0** si solo es un juego gratis | Igual | 2 (hay apuesta) |
| B. Sesión corta | 2 | 2 | 2 |
| C. Mercado local | 2 solo si eliges **un** país y palabras de ahí; 1 si “español genérico” | 1 | 1 (no es pain local) |
| D. Sin `personal_sign` | 2 (dirección = jugador) | 2 | 2 |
| E. Hueco de categoría | 1 (Gaming lleno; Spell Tower ya es palabras) | 1 | 1 (predict/spin ocupados) |
| **Total orientativo** | **7–9 → Tier 1–2** | **6–8** | **7 en papel, peor por regulación** |

Hard checks (un “no” tumba listing): ¿cabe en WebView MiniPay? ¿UI sin CELO ni `0x…` enorme? ¿un no-crypto entiende la primera pantalla?

---

## Primer ship recomendado

**Palabra del día en español, Celo Sepolia, en `mi-app-celo`.**

Por qué sigue siendo el mejor primer proyecto: reglas claras, contrato chico, loop diario, se explica a un no-dev. Para MiniPay, desde el día 1 diseña **premio en stablecoin** y **un país** (p. ej. Colombia), no un clon genérico.

No hagas horcado ni atínale en paralelo. Horcado = misma app, otro modo. Atínale = v3, y solo como skill (p. ej. “a qué hora cierra el mercado del barrio”) o con asesoría legal, no como lotería de bloque.

Plan de estudio: [`mi-app-celo/TAREAS.md`](./mi-app-celo/TAREAS.md).
