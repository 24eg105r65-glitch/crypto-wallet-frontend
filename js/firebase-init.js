/**
 * CryptoVault — Firebase SDK Initialization
 * Project: crypto-vault-8b252
 * Author: Adabala Pushkaran • 24EG105R65
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfrtsm5RNPrjzxJBrW0ekYn0ShS_LQRjM",
  authDomain: "crypto-vault-8b252.firebaseapp.com",
  projectId: "crypto-vault-8b252",
  storageBucket: "crypto-vault-8b252.firebasestorage.app",
  messagingSenderId: "713285952739",
  appId: "1:713285952739:web:56b6e7758e93b6e9bc91d6",
  measurementId: "G-ZEPB3XSDJZ"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics if supported
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.debug("Firebase Analytics running in standard environment:", e.message);
}

window.firebaseApp = app;
window.firebaseAnalytics = analytics;
console.info("⚡ CryptoVault connected to Firebase Project: crypto-vault-8b252");
