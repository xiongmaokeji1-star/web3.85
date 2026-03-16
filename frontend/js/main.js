/**
 * main.js — Shared utilities for Web3 Security Platform
 */
(function (window) {
  'use strict';

  const API_BASE = '/api';

  /* ── API helper ──────────────────────────────────────────────── */
  async function apiPost(endpoint, data) {
    const res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async function apiGet(endpoint, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const url = API_BASE + endpoint + (qs ? '?' + qs : '');
    const res = await fetch(url);
    return res.json();
  }

  /* ── Toast ───────────────────────────────────────────────────── */
  function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ── Tabs ────────────────────────────────────────────────────── */
  function initTabs(containerSelector) {
    document.querySelectorAll(containerSelector || '.tabs').forEach(tabContainer => {
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          const parent = btn.closest('.tab-wrapper') || document;

          tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          parent.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.id === target);
          });
        });
      });
    });
  }

  /* ── Risk color ──────────────────────────────────────────────── */
  function getRiskClass(risk) {
    switch ((risk || '').toUpperCase()) {
      case 'HIGH':
      case 'DANGER':    return 'danger';
      case 'MEDIUM':    return 'medium';
      case 'LOW':
      case 'SAFE':      return 'safe';
      default:          return 'unknown';
    }
  }

  function getRiskColor(risk) {
    switch ((risk || '').toUpperCase()) {
      case 'HIGH':
      case 'DANGER':    return '#ef4444';
      case 'MEDIUM':    return '#f59e0b';
      case 'LOW':
      case 'SAFE':      return '#22c55e';
      default:          return '#64748b';
    }
  }

  /* ── Severity badge HTML ─────────────────────────────────────── */
  function severityBadge(severity) {
    const map = {
      critical: '<span class="badge badge-critical">⚠ Critical</span>',
      high:     '<span class="badge badge-high">🔴 High</span>',
      medium:   '<span class="badge badge-medium">🟡 Medium</span>',
      low:      '<span class="badge badge-low">🟢 Low</span>'
    };
    return map[(severity || '').toLowerCase()] || `<span class="badge badge-unknown">${severity}</span>`;
  }

  /* ── Escape HTML ─────────────────────────────────────────────── */
  function escHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  /* ── Format date ─────────────────────────────────────────────── */
  function fmtDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return iso; }
  }

  /* ── Copy to clipboard ───────────────────────────────────────── */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied!', 'success', 2000);
    } catch {
      showToast('Copy failed', 'error', 2000);
    }
  }

  /* ── Nav active link ─────────────────────────────────────────── */
  function highlightNavLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
  }

  /* ── Mobile hamburger ────────────────────────────────────────── */
  function initMobileNav() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileNav = document.getElementById('nav-mobile');
    if (!hamburger || !mobileNav) return;
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  /* ── Animated counters ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const step = ts => {
      const pct = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(pct * target).toLocaleString();
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── Init on DOMContentLoaded ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    highlightNavLink();
    initMobileNav();
    initTabs();
    if (window.i18n) window.i18n.init();
  });

  // Public API
  window.W3S = {
    apiPost,
    apiGet,
    showToast,
    initTabs,
    getRiskClass,
    getRiskColor,
    severityBadge,
    escHtml,
    fmtDate,
    copyText,
    animateCounter
  };

})(window);
