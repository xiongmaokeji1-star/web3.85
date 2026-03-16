/**
 * i18n.js — Internationalization helper
 * Loads locale JSON files and replaces [data-i18n] attribute values.
 */
(function (window) {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'zh', 'th', 'vi', 'id', 'km'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'w3s_lang';

  let _translations = {};
  let _lang = DEFAULT_LANG;

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browser = (navigator.language || '').split('-')[0].toLowerCase();
    return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
  }

  async function loadLocale(lang) {
    try {
      const res = await fetch(`/locales/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[i18n] Failed to load locale "${lang}":`, err.message);
      return {};
    }
  }

  function get(key) {
    const parts = key.split('.');
    let obj = _translations;
    for (const p of parts) {
      if (obj == null) return key;
      obj = obj[p];
    }
    return obj != null ? String(obj) : key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = get(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = get(el.getAttribute('data-i18n-placeholder'));
    });

    // Update <html lang>
    document.documentElement.lang = _lang;

    // Sync lang selector if present
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = _lang;
  }

  async function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    _lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    _translations = await loadLocale(lang);
    applyTranslations();
    window.dispatchEvent(new CustomEvent('i18n:loaded', { detail: { lang } }));
  }

  async function init() {
    const lang = detectLang();
    await setLang(lang);

    // Wire up language selector
    const sel = document.getElementById('lang-select');
    if (sel) {
      sel.addEventListener('change', e => setLang(e.target.value));
    }
  }

  // Public API
  window.i18n = { init, setLang, get, currentLang: () => _lang };

})(window);
