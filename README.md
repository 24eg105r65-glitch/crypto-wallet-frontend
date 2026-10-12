# CryptoVault — Frontend Architecture

**Author:** Adabala Pushkaran (`24EG105R65`)  
**Repository:** [https://github.com/24eg105r65-glitch/crypto-wallet-frontend](https://github.com/24eg105r65-glitch/crypto-wallet-frontend)  
**Design Philosophy:** Server-Side Rendered (SSR) HTML5 with Vanilla CSS 3 Design System & High-Performance Vanilla JS Micro-Interactions.

---

## 📁 Directory Structure

```
frontend/
├── css/
│   └── style.css            # Production CSS design system
├── js/
│   └── app.js               # Client-side micro-interactions & live tickers
├── static/
│   ├── css/
│   │   └── style.css        # Bundled static CSS
│   └── js/
│       └── app.js           # Bundled static JS
├── templates/               # Semantic Thymeleaf view templates
│   ├── admin/               # Administrator command center views
│   │   ├── currencies.html
│   │   ├── index.html
│   │   ├── transactions.html
│   │   └── users.html
│   ├── auth/                # Authentication views
│   │   ├── login.html
│   │   └── register.html
│   ├── dashboard/           # User dashboard
│   │   └── index.html
│   ├── fragments/           # Shared reusable layouts & navigation
│   │   └── layout.html
│   ├── notifications/       # User notification center
│   │   └── index.html
│   ├── profile/             # Profile & active security sessions
│   │   └── index.html
│   ├── transactions/        # Ledger, send, receive & receipt views
│   │   ├── index.html
│   │   ├── receipt.html
│   │   ├── receive.html
│   │   └── send.html
│   ├── wallets/             # Multi-asset wallet management
│   │   ├── detail.html
│   │   └── index.html
│   ├── about.html           # Project architecture documentation
│   ├── faq.html             # User FAQ
│   ├── index.html           # High-converting landing page
│   ├── privacy.html         # Privacy policy
│   └── terms.html           # Terms of service
└── package.json             # Frontend project metadata
```

---

## 🎨 Design System & Highlights
- **Curated Color Tokens:** Tailored deep space obsidian `#0B0E14`, midnight navy `#111827`, accented with neon emerald `#10B981` and electric indigo `#6366F1`.
- **Vanilla CSS:** Zero external CSS bloat; ultra-fast first contentful paint (FCP < 300ms).
- **Responsive Layouts:** Mobile-first fluid grids, flexbox components, and responsive cards.
- **Client Islands (`app.js`):** Live market rates polling, QR code generators, address clipboard copy, and real-time form validation.
