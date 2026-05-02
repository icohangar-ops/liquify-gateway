<p align="center">
  <h1 align="center">Mineral Gateway</h1>
  <p align="center">Stellar/Soroban-based critical minerals tracking and domestic-content attestation platform for US defense and industrial policy compliance.</p>
  <p align="center">
    <img src="https://img.shields.io/badge/Stellar-Mainnet-08B5E5?logo=stellar&logoColor=white" alt="Stellar" />
    <img src="https://img.shields.io/badge/Soroban-Smart_Contracts-5A67D8?logo=rust&logoColor=white" alt="Soroban" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  </p>
</p>

## Demo

https://github.com/user-attachments/assets/demo.mp4

## Screenshots

<details>
<summary>📊 Dashboard</summary>
<img src="demo/01-dashboard.png" alt="Dashboard" />
</details>

<details>
<summary>🔩 Assets</summary>
<img src="demo/02-assets.png" alt="Assets" />
</details>

<details>
<summary>🏭 Entities</summary>
<img src="demo/03-entities.png" alt="Entities" />
</details>

<details>
<summary>🔗 Supply Chain</summary>
<img src="demo/04-supply-chain.png" alt="Supply Chain" />
</details>

<details>
<summary>✅ Compliance</summary>
<img src="demo/05-compliance.png" alt="Compliance" />
</details>

<details>
<summary>📋 Events</summary>
<img src="demo/06-events.png" alt="Events" />
</details>

<details>
<summary>⚙️ Settings</summary>
<img src="demo/07-settings.png" alt="Settings" />
</details>

## Overview

**Mineral Gateway** is a blockchain-based platform for tracking critical minerals across the supply chain, providing verifiable provenance and domestic-content attestations required for compliance with US defense and industrial policy frameworks including:

- **Inflation Reduction Act (IRA)** — Electric vehicle tax credit domestic-content requirements
- **Defense Production Act (DPA)** — Critical mineral sourcing and stockpile mandates
- **Executive Order 14017** — America's supply chain resilience and review

The platform tokenizes mineral asset lots on the Stellar network using Soroban smart contracts and the SEP-41 token standard, creating an immutable audit trail from mine to end product. Each token represents a specific lot of critical minerals with metadata including origin, processing steps, and compliance attestations.

## Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        Mineral Gateway                           │
├───────────────────────────────────────────────────────────────────┤
│                        React Frontend                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │Dashboard │ │  Assets  │ │ Entities │ │  Supply  │            │
│  │          │ │          │ │          │ │  Chain   │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │Compliance│ │  Events  │ │ Settings │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
├───────────────────────────────────────────────────────────────────┤
│                    Service Layer (TypeScript)                     │
│              src/lib/stellar.ts · Horizon · Soroban RPC          │
├───────────────────────────────────────────────────────────────────┤
│                       Stellar Network                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │  Horizon  │ │ Soroban  │ │ SEP-41   │                        │
│  │   API    │ │   RPC    │ │  Tokens  │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
└───────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Stellar Mainnet |
| Smart Contracts | Soroban (Rust → WASM) |
| Token Standard | SEP-41 Token Interface |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| SDK | `@stellar/stellar-sdk` |

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time Stellar network status, supply chain overview, and compliance metrics |
| **Assets** | SEP-41 token management — mint, transfer, and burn mineral asset lots |
| **Entities** | Registered supply chain participants with Stellar addresses and roles |
| **Supply Chain** | Asset provenance graph tracking from mine to battery pack |
| **Compliance** | Policy attestations — domestic content %, allied origin %, FEOC checks |
| **Events** | On-chain Soroban contract event log for full auditability |
| **Settings** | Network configuration, wallet management, and platform preferences |

## Stellar Integration

The `src/lib/stellar.ts` service layer provides the bridge between the React frontend and the Stellar blockchain:

- **Horizon API** — Ledger queries, transaction history, and account information
- **Soroban RPC** — Smart contract invocation for minting, transferring, and attesting mineral tokens
- **SEP-41 Token Operations** — Standardized mint/transfer/burn operations for mineral asset lots
- **Contract Event Streaming** — Real-time event listeners for on-chain activity and provenance updates

## Key Features

- **On-Chain Provenance** — Immutable mineral origin tracking from extraction through processing to final product
- **SEP-41 Token Standard** — Interoperable token interface for mineral asset lots with rich metadata
- **Multi-Policy Compliance** — Attestation engine supporting IRA, DPA, and EO 14017 requirements simultaneously
- **FEOC Detection** — Automated Foreign Entity of Concern screening for critical mineral sourcing
- **Supply Chain Graph** — Visual provenance graph showing the complete journey of each mineral lot
- **Real-Time Events** — Live on-chain event streaming via Soroban contract events
- **Entity Registry** — Verified participant management with Stellar address binding and role assignment
- **Responsive Design** — Full-featured interface optimized for desktop and mobile workflows
- **Audit Trail** — Complete on-chain event log ensuring regulatory compliance and transparency
- **Extensible Architecture** — Modular design supporting additional minerals, policies, and integration points

## Getting Started

### Prerequisites

- Node.js 18+
- Stellar wallet (e.g., Freighter, Lobstr, or Albedo)
- Access to Stellar Mainnet or Testnet

### Installation

```bash
git clone https://github.com/Cubiczan/Liquify-gateway.git
cd Liquify-gateway
npm install
```

### Configuration

```bash
cp .env.example .env.local
```

```env
VITE_STELLAR_NETWORK=mainnet
VITE_SOROBAN_RPC_URL=https://rpc.stellar.org
VITE_HORIZON_URL=https://horizon.stellar.org
VITE_CONTRACT_ID=your-contract-id
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Documentation

See `Mineral_Gateway_Stellar_Specification.docx` for the full technical specification.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Cubiczan** — [github.com/Cubiczan](https://github.com/Cubiczan)
