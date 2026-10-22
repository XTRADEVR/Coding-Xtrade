/**
 * WebStudio PWA - Hybrid Code Editor & Device Simulator Engine
 * Senior Android Architect & Hybrid App Conversion Specialist
 */

(function () {
  'use strict';

  // --- Initial Default HTML Sample Template ---
  const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hybrid PWA Showcase</title>
  <style>
    :root {
      --primary: #0ea5e9;
      --primary-dark: #0284c7;
      --bg: #0b0f19;
      --surface: #131b2e;
      --border: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding: 20px;
      background: linear-gradient(180deg, rgba(14, 165, 233, 0.15), transparent);
      border-radius: 16px;
      border: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(14, 165, 233, 0.2);
      color: var(--primary);
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p { color: var(--text-muted); font-size: 14px; line-height: 1.5; }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }
    .card-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .cta-btn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 12px 18px;
      border-radius: 10px;
      background: var(--primary);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
      transition: all 0.2s;
    }
    .cta-btn:hover { background: var(--primary-dark); }
  </style>
</head>
<body>
  <header class="header">
    <span class="badge">Hybrid App 1.0</span>
    <h1>WebStudio Live Preview</h1>
    <p>Ubah kode di editor dan saksikan pembaruan langsung di layar emulator ini.</p>
  </header>

  <main class="card-grid">
    <div class="card">
      <h2 class="card-title">🚀 Real-time Sync</h2>
      <p>Render instan ke iframe tanpa reload manual setiap kali kode disimpan.</p>
    </div>
    <div class="card">
      <h2 class="card-title">📱 Device Toolbar</h2>
      <p>Uji responsivitas di iPhone 15 Pro, Pixel 8, iPad, dan Desktop.</p>
    </div>
  </main>

  <button class="cta-btn" onclick="alert('Halo dari WebStudio PWA!')">Klik Uji Interaksi</button>
</body>
</html>`;

  // --- State Management ---
  const state = {
    code: localStorage.getItem('webstudio_code') || DEFAULT_HTML,
    savedCode: localStorage.getItem('webstudio_code') || DEFAULT_HTML,
    theme: localStorage.getItem('webstudio_theme') || 'system',
    splitMode: localStorage.getItem('webstudio_split') || 'horizontal', // 'horizontal', 'vertical', 'code-only', 'preview-only'
    device: 'responsive', // 'responsive', 'iphone15pro', 'pixel8', 'ipadair', 'desktop1080'
    orientation: 'portrait', // 'portrait' | 'landscape'
    zoom: 1, // 0.5, 0.75, 1, 1.25
    showChassis: true,
    cursorPos: { line: 1, col: 1 },
    lintIssues: [],
    findQuery: '',
    replaceQuery: '',
    findMatches: [],
    currentMatchIndex: -1,
    appData: null,
    deferredPrompt: null,
    isOffline: !navigator.onLine,
    history: [],
    historyIndex: -1
  };

  // --- Broadcast Channel for External Browser Sync ---
  let syncChannel = null;
  try {
    syncChannel = new BroadcastChannel('webstudio-preview-sync');
  } catch (e) {
    console.warn('BroadcastChannel not supported');
  }

  // --- DOM Elements Cache ---
  const el = {};

  function initElements() {
    el.app = document.getElementById('app');
    el.codeTextarea = document.getElementById('code-textarea');
    el.syntaxLayer = document.getElementById('syntax-highlight-layer');
    el.codeGutter = document.getElementById('code-gutter');
    el.previewIframe = document.getElementById('preview-iframe');
    el.deviceWrapper = document.getElementById('device-wrapper');
    el.workspaceContainer = document.getElementById('workspace-container');
    el.themeToggleBtn = document.getElementById('btn-toggle-theme');
    el.deviceSelect = document.getElementById('select-device');
    el.rotateBtn = document.getElementById('btn-rotate-device');
    el.zoomSelect = document.getElementById('select-zoom');
    el.chassisToggleBtn = document.getElementById('btn-toggle-chassis');
    el.splitPillGroup = document.getElementById('split-pill-group');
    el.formatBtn = document.getElementById('btn-format-code');
    el.findToggleBtn = document.getElementById('btn-toggle-find');
    el.aiToggleBtn = document.getElementById('btn-toggle-ai');
    el.findBar = document.getElementById('find-replace-bar');
    el.findInput = document.getElementById('find-input');
    el.replaceInput = document.getElementById('replace-input');
    el.findCount = document.getElementById('find-count');
    el.btnFindNext = document.getElementById('btn-find-next');
    el.btnFindPrev = document.getElementById('btn-find-prev');
    el.btnReplace = document.getElementById('btn-replace');
    el.btnReplaceAll = document.getElementById('btn-replace-all');
    el.btnFindClose = document.getElementById('btn-find-close');
    el.aiDrawer = document.getElementById('ai-inline-drawer');
    el.aiInput = document.getElementById('ai-prompt-input');
    el.btnAiApply = document.getElementById('btn-ai-apply');
    el.btnAiClose = document.getElementById('btn-ai-close');
    el.aiChipsContainer = document.getElementById('ai-chips-container');
    el.statusLint = document.getElementById('status-lint');
    el.statusCursor = document.getElementById('status-cursor');
    el.statusLength = document.getElementById('status-length');
    el.lintDrawer = document.getElementById('lint-drawer');
    el.lintList = document.getElementById('lint-list');
    el.btnExport = document.getElementById('btn-export-file');
    el.btnSyncExternal = document.getElementById('btn-sync-external');
    el.btnInstallPWA = document.getElementById('btn-install-pwa');
    el.btnShowSchema = document.getElementById('btn-show-schema');
    el.schemaModal = document.getElementById('schema-modal');
    el.schemaContent = document.getElementById('schema-content');
    el.btnCloseSchema = document.getElementById('btn-close-schema');
    el.autocompletePopup = document.getElementById('autocomplete-popup');
    el.toastContainer = document.getElementById('toast-container');
    el.splitter = document.getElementById('splitter-handle');
    el.tabBadge = document.getElementById('editor-tab-badge');
    el.btnTemplates = document.getElementById('btn-open-templates');
    el.templatesModal = document.getElementById('templates-modal');
    el.btnCloseTemplates = document.getElementById('btn-close-templates');
    el.templatesList = document.getElementById('templates-list');
  }

  // --- Show Toast Utility ---
  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:700; color:var(--brand-primary);">${icon}</span> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // --- Load App Data Schema ---
  async function loadAppData() {
    try {
      const res = await fetch('./app-data.json');
      if (res.ok) {
        state.appData = await res.json();
        renderAiChips();
        renderTemplatesModal();
      }
    } catch (e) {
      console.warn('Failed to fetch app-data.json:', e);
    }
  }

  // --- 1. Live Preview Rendering ---
  let previewTimeout = null;
  function updateLivePreview() {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      if (!el.previewIframe) return;
      
      // Inject error tracker into user document
      const injectedScript = `
        <script>
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'webstudio_runtime_error', msg, line }, '*');
          };
          console.log = (function(oldLog) {
            return function(...args) {
              oldLog(...args);
              window.parent.postMessage({ type: 'webstudio_console_log', data: args.join(' ') }, '*');
            };
          })(console.log);
        <\/script>
      `;

      let docContent = state.code;
      if (docContent.includes('<head>')) {
        docContent = docContent.replace('<head>', `<head>${injectedScript}`);
      } else {
        docContent = injectedScript + docContent;
      }

      el.previewIframe.srcdoc = docContent;

      // Broadcast to external windows / sync
      if (syncChannel) {
        syncChannel.postMessage({ type: 'code_update', code: state.code });
      }
      localStorage.setItem('webstudio_synced_preview', state.code);

      // Save to localStorage
      localStorage.setItem('webstudio_code', state.code);
      checkUnsavedChanges();
    }, 150);
  }

  function checkUnsavedChanges() {
    if (el.tabBadge) {
      if (state.code !== state.savedCode) {
        el.tabBadge.classList.add('unsaved');
      } else {
        el.tabBadge.classList.remove('unsaved');
      }
    }
    if (el.statusLength) {
      el.statusLength.textContent = `${state.code.length} chars | ${state.code.split('\n').length} lines`;
    }
  }

  // --- 2. Syntax Highlighting Tokenizer ---
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderSyntaxHighlight(code) {
    // Quick regex tokenizer for HTML
    let highlighted = escapeHtml(code);

    // Comments: &lt;!-- ... --&gt;
    highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');

    // Tags and Attributes
    highlighted = highlighted.replace(/(&lt;\/?)([a-zA-Z0-9\-]+)([\s\S]*?)(&gt;)/g, function (match, p1, p2, p3, p4) {
      // p1 = &lt; or &lt;/
      // p2 = tag name
      // p3 = attributes string
      // p4 = &gt;

      let coloredAttrs = p3.replace(/([a-zA-Z0-9\-:]+)(=(?:&quot;[^&]*?&quot;|'[^']*?'|[^\s&gt;]+))?/g, function (m, attrName, attrVal) {
        let res = `<span class="tok-attr">${attrName}</span>`;
        if (attrVal) {
          res += `<span class="tok-punct">=</span><span class="tok-val">${attrVal.replace(/^=/, '')}</span>`;
        }
        return res;
      });

      return `<span class="tok-punct">${p1}</span><span class="tok-tag">${p2}</span>${coloredAttrs}<span class="tok-punct">${p4}</span>`;
    });

    if (el.syntaxLayer) {
      el.syntaxLayer.innerHTML = highlighted + '\n';
    }
    renderGutter(code);
  }

  // --- Gutter & Line Numbering with Code Folding ---
  function renderGutter(code) {
    if (!el.codeGutter) return;
    const lines = code.split('\n');
    let gutterHtml = '';

    for (let i = 1; i <= lines.length; i++) {
      const lineText = lines[i - 1].trim();
      const isFoldable = /<[a-zA-Z0-9\-]+[^>]*>/.test(lineText) && !lineText.endsWith('/>') && !/<\/[a-zA-Z0-9\-]+>/.test(lineText);
      gutterHtml += `<div class="gutter-line" data-line="${i}">
        ${isFoldable ? `<span class="fold-btn" onclick="window.webstudioFoldLine(${i})">▾</span>` : ''}
        <span>${i}</span>
      </div>`;
    }
    el.codeGutter.innerHTML = gutterHtml;
  }

  window.webstudioFoldLine = function (lineNum) {
    showToast(`Fold blok baris ${lineNum} disimulasikan`, 'info');
  };

  // --- Sync Scrolling between Textarea, Highlighting, and Gutter ---
  function syncEditorScroll() {
    if (!el.codeTextarea) return;
    const top = el.codeTextarea.scrollTop;
    const left = el.codeTextarea.scrollLeft;
    if (el.syntaxLayer) {
      el.syntaxLayer.scrollTop = top;
      el.syntaxLayer.scrollLeft = left;
    }
    if (el.codeGutter) {
      el.codeGutter.scrollTop = top;
    }
  }

  // --- 3. Auto-Complete / IntelliSense & Tag Closing ---
  const HTML_TAGS = [
    { tag: 'div', desc: 'Kontainer generik' },
    { tag: 'header', desc: 'Bagian kepala halaman' },
    { tag: 'nav', desc: 'Navigasi situs' },
    { tag: 'main', desc: 'Konten utama dokumen' },
    { tag: 'section', desc: 'Bagian tematik dokumen' },
    { tag: 'article', desc: 'Artikel independen' },
    { tag: 'footer', desc: 'Kaki halaman' },
    { tag: 'button', desc: 'Tombol interaktif' },
    { tag: 'form', desc: 'Formulir input' },
    { tag: 'input', desc: 'Field isian', void: true },
    { tag: 'p', desc: 'Paragraf teks' },
    { tag: 'span', desc: 'Inline container' },
    { tag: 'h1', desc: 'Judul level 1' },
    { tag: 'h2', desc: 'Judul level 2' },
    { tag: 'h3', desc: 'Judul level 3' },
    { tag: 'ul', desc: 'Unordered list' },
    { tag: 'ol', desc: 'Ordered list' },
    { tag: 'li', desc: 'Item daftar' },
    { tag: 'a', desc: 'Hyperlink' },
    { tag: 'img', desc: 'Gambar', void: true },
    { tag: 'style', desc: 'Blok CSS internal' },
    { tag: 'script', desc: 'Blok JavaScript' }
  ];

  function handleEditorInput(e) {
    const val = el.codeTextarea.value;
    state.code = val;
    renderSyntaxHighlight(val);
    updateLivePreview();
    runLinter(val);
    updateCursorPosition();

    // Check for auto closing tag trigger
    if (e.inputType === 'insertText') {
      const pos = el.codeTextarea.selectionStart;
      const char = e.data;

      // Auto close </
      if (char === '/' && val.slice(pos - 2, pos) === '</') {
        const textBefore = val.slice(0, pos - 2);
        const matchTag = textBefore.match(/<([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>[^(?:<\/\1>)]*$/);
        if (matchTag && matchTag[1] && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(matchTag[1].toLowerCase())) {
          const tagToClose = matchTag[1];
          const newCode = val.slice(0, pos) + tagToClose + '>' + val.slice(pos);
          el.codeTextarea.value = newCode;
          state.code = newCode;
          el.codeTextarea.selectionStart = el.codeTextarea.selectionEnd = pos + tagToClose.length + 1;
          renderSyntaxHighlight(newCode);
          updateLivePreview();
          return;
        }
      }

      // Check for autocomplete popup on '<'
      if (char === '<') {
        showAutocompletePopup('', pos);
      } else {
        checkAutocompleteTrigger(pos);
      }
    } else {
      hideAutocompletePopup();
    }
  }

  function checkAutocompleteTrigger(pos) {
    const val = el.codeTextarea.value;
    const textBefore = val.slice(0, pos);
    const lastOpen = textBefore.lastIndexOf('<');
    if (lastOpen !== -1 && lastOpen > textBefore.lastIndexOf('>')) {
      const query = textBefore.slice(lastOpen + 1);
      if (/^[a-zA-Z0-9\-]*$/.test(query)) {
        showAutocompletePopup(query, pos);
        return;
      }
    }
    hideAutocompletePopup();
  }

  function showAutocompletePopup(query, cursorIndex) {
    if (!el.autocompletePopup) return;
    const filtered = HTML_TAGS.filter(t => t.tag.toLowerCase().startsWith(query.toLowerCase()));
    if (filtered.length === 0) {
      hideAutocompletePopup();
      return;
    }

    let html = '';
    filtered.slice(0, 7).forEach((item, idx) => {
      html += `<div class="ac-item ${idx === 0 ? 'selected' : ''}" data-tag="${item.tag}" data-void="${item.void ? 'true' : 'false'}">
        <span>&lt;${item.tag}&gt;</span>
        <span class="ac-badge">${item.desc}</span>
      </div>`;
    });
    el.autocompletePopup.innerHTML = html;

    // Position popup near cursor
    const lines = el.codeTextarea.value.slice(0, cursorIndex).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length;

    const topPos = Math.min(lineNum * 20 + 24 - el.codeTextarea.scrollTop, el.codeTextarea.clientHeight - 120);
    const leftPos = Math.min(colNum * 7.5 + 48 - el.codeTextarea.scrollLeft, el.codeTextarea.clientWidth - 180);

    el.autocompletePopup.style.top = `${Math.max(10, topPos)}px`;
    el.autocompletePopup.style.left = `${Math.max(48, leftPos)}px`;
    el.autocompletePopup.classList.add('show');

    // Attach click events
    el.autocompletePopup.querySelectorAll('.ac-item').forEach(elem => {
      elem.addEventListener('click', () => {
        applyAutocomplete(elem.getAttribute('data-tag'), elem.getAttribute('data-void') === 'true');
      });
    });
  }

  function hideAutocompletePopup() {
    if (el.autocompletePopup) {
      el.autocompletePopup.classList.remove('show');
    }
  }

  function applyAutocomplete(tag, isVoid) {
    const pos = el.codeTextarea.selectionStart;
    const val = el.codeTextarea.value;
    const textBefore = val.slice(0, pos);
    const openIndex = textBefore.lastIndexOf('<');
    if (openIndex === -1) return;

    const before = val.slice(0, openIndex);
    const after = val.slice(pos);
    const insertion = isVoid ? `<${tag}>` : `<${tag}></${tag}>`;
    const newPos = isVoid ? before.length + insertion.length : before.length + tag.length + 2;

    el.codeTextarea.value = before + insertion + after;
    state.code = el.codeTextarea.value;
    el.codeTextarea.selectionStart = el.codeTextarea.selectionEnd = newPos;
    hideAutocompletePopup();
    renderSyntaxHighlight(state.code);
    updateLivePreview();
  }

  // --- 4. Emmet Abbreviation Engine ---
  function expandEmmet(abbr) {
    abbr = abbr.trim();
    if (abbr === '!') {
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dokumen Baru</title>
</head>
<body>
  
</body>
</html>`;
    }

    // Parse simple Emmet: tag.class#id*count or parent>child or sibling+sibling
    try {
      if (abbr.includes('>')) {
        const parts = abbr.split('>');
        let currentResult = '';
        for (let i = parts.length - 1; i >= 0; i--) {
          const expandedPart = parseSingleEmmetNode(parts[i]);
          if (!currentResult) {
            currentResult = expandedPart;
          } else {
            // Nest inside the innermost tag
            currentResult = expandedPart.replace(/><\/[a-zA-Z0-9\-]+>$/, `>${currentResult}</${parts[i].split(/[.#*]/)[0]}>`);
          }
        }
        return currentResult;
      } else if (abbr.includes('+')) {
        return abbr.split('+').map(part => parseSingleEmmetNode(part)).join('\n');
      } else {
        return parseSingleEmmetNode(abbr);
      }
    } catch (e) {
      return null;
    }
  }

  function parseSingleEmmetNode(nodeStr) {
    let multiplier = 1;
    if (nodeStr.includes('*')) {
      const parts = nodeStr.split('*');
      nodeStr = parts[0];
      multiplier = parseInt(parts[1], 10) || 1;
    }

    let tagName = 'div';
    let className = '';
    let idName = '';

    // Extract classes and ID
    const idMatch = nodeStr.match(/#([a-zA-Z0-9\-_]+)/);
    if (idMatch) idName = idMatch[1];

    const classMatches = nodeStr.match(/\.([a-zA-Z0-9\-_]+)/g);
    if (classMatches) {
      className = classMatches.map(c => c.slice(1)).join(' ');
    }

    const tagMatch = nodeStr.match(/^([a-zA-Z0-9\-]+)/);
    if (tagMatch) tagName = tagMatch[1];

    let attrs = '';
    if (className) attrs += ` class="${className}"`;
    if (idName) attrs += ` id="${idName}"`;

    const isVoid = ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName.toLowerCase());
    const single = isVoid ? `<${tagName}${attrs}>` : `<${tagName}${attrs}></${tagName}>`;

    let res = '';
    for (let i = 0; i < multiplier; i++) {
      res += (i > 0 ? '\n' : '') + single;
    }
    return res;
  }

  // --- 5. Auto-Formatting (Prettier / Beautifier) ---
  function formatHtml(html) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Normalize tags
    const clean = html.replace(/>\s*</g, '><').trim();
    const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

    tokens.forEach(token => {
      if (token.startsWith('<!--')) {
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.endsWith('/>')) {
        const tagNameMatch = token.match(/<([a-zA-Z0-9\-]+)/);
        const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
        const isVoid = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'].includes(tagName);

        formatted += tab.repeat(indent) + token + '\n';
        if (!isVoid) {
          indent++;
        }
      } else {
        const trimmed = token.trim();
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + '\n';
        }
      }
    });

    return formatted.trim();
  }

  // --- 6. Error & Warning Detection (Linter) ---
  function runLinter(code) {
    const issues = [];

    // Check DOCTYPE
    if (!/<!DOCTYPE\s+html>/i.test(code)) {
      issues.push({ type: 'warning', line: 1, msg: 'Disarankan menyertakan deklarasi <!DOCTYPE html> standar.' });
    }

    // Check Viewport Meta
    if (!/<meta[^>]*name=["']viewport["'][^>]*>/i.test(code)) {
      issues.push({ type: 'warning', line: 1, msg: 'Tag <meta name="viewport"> tidak ditemukan (perlu untuk responsivitas mobile).' });
    }

    // Check images missing alt
    const imgMatches = [...code.matchAll(/<img([^>]*)>/gi)];
    imgMatches.forEach(m => {
      if (!/alt\s*=/i.test(m[1])) {
        const line = code.slice(0, m.index).split('\n').length;
        issues.push({ type: 'warning', line, msg: 'Tag <img> tidak memiliki atribut alt (aksesibilitas).' });
      }
    });

    // Check unclosed tags (basic stack parser)
    const tagRegex = /<\/?([a-zA-Z0-9\-]+)[^>]*>/g;
    const stack = [];
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype']);

    let match;
    while ((match = tagRegex.exec(code)) !== null) {
      const fullTag = match[0];
      const tagName = match[1].toLowerCase();
      const line = code.slice(0, match.index).split('\n').length;

      if (voidTags.has(tagName) || fullTag.endsWith('/>')) {
        continue;
      }

      if (fullTag.startsWith('</')) {
        if (stack.length === 0) {
          issues.push({ type: 'error', line, msg: `Tag penutup </${tagName}> berlebih tanpa pasangan tag pembuka.` });
        } else {
          const last = stack.pop();
          if (last.name !== tagName) {
            issues.push({ type: 'error', line, msg: `Tag penutup </${tagName}> tidak cocok dengan tag pembuka <${last.name}> (baris ${last.line}).` });
          }
        }
      } else {
        stack.push({ name: tagName, line });
      }
    }

    while (stack.length > 0) {
      const unclosed = stack.pop();
      issues.push({ type: 'error', line: unclosed.line, msg: `Tag <${unclosed.name}> belum ditutup.` });
    }

    state.lintIssues = issues;
    renderLintStatus();
  }

  function renderLintStatus() {
    if (!el.statusLint) return;
    const errors = state.lintIssues.filter(i => i.type === 'error').length;
    const warnings = state.lintIssues.filter(i => i.type === 'warning').length;

    const dotClass = errors > 0 ? 'error' : warnings > 0 ? 'warning' : '';
    el.statusLint.innerHTML = `
      <span class="status-dot ${dotClass}"></span>
      <span>${errors} Error, ${warnings} Peringatan</span>
    `;

    // Render list in drawer
    if (el.lintList) {
      if (state.lintIssues.length === 0) {
        el.lintList.innerHTML = '<div style="padding:12px; color:var(--success); font-size:12px;">✓ Sintaks bersih, tidak ada error atau peringatan!</div>';
      } else {
        el.lintList.innerHTML = state.lintIssues.map(issue => `
          <div class="lint-item" onclick="window.webstudioJumpToLine(${issue.line})">
            <span style="color:${issue.type === 'error' ? 'var(--danger)' : 'var(--warning)'}; font-weight:700;">
              ${issue.type === 'error' ? '✖' : '⚠'}
            </span>
            <span style="font-weight:600;">Baris ${issue.line}:</span>
            <span>${issue.msg}</span>
          </div>
        `).join('');
      }
    }
  }

  window.webstudioJumpToLine = function (lineNum) {
    if (!el.codeTextarea) return;
    const lines = el.codeTextarea.value.split('\n');
    let charIndex = 0;
    for (let i = 0; i < lineNum - 1 && i < lines.length; i++) {
      charIndex += lines[i].length + 1;
    }
    el.codeTextarea.focus();
    el.codeTextarea.selectionStart = el.codeTextarea.selectionEnd = charIndex;
    el.codeTextarea.scrollTop = Math.max(0, (lineNum - 3) * 20);
    syncEditorScroll();
  };

  // --- 7. Find and Replace Engine ---
  function openFindReplace() {
    el.findBar.classList.add('open');
    el.findInput.focus();
    const selected = el.codeTextarea.value.slice(el.codeTextarea.selectionStart, el.codeTextarea.selectionEnd);
    if (selected && !selected.includes('\n')) {
      el.findInput.value = selected;
    }
    executeFind();
  }

  function closeFindReplace() {
    el.findBar.classList.remove('open');
    state.findMatches = [];
    state.currentMatchIndex = -1;
    if (el.findCount) el.findCount.textContent = '0 of 0';
    el.codeTextarea.focus();
  }

  function executeFind() {
    const q = el.findInput.value;
    state.findQuery = q;
    state.findMatches = [];
    if (!q) {
      el.findCount.textContent = '0 of 0';
      return;
    }

    const val = el.codeTextarea.value;
    let idx = 0;
    while ((idx = val.indexOf(q, idx)) !== -1) {
      state.findMatches.push(idx);
      idx += q.length;
    }

    if (state.findMatches.length > 0) {
      state.currentMatchIndex = 0;
      highlightCurrentMatch();
    } else {
      state.currentMatchIndex = -1;
      el.findCount.textContent = '0 of 0';
    }
  }

  function highlightCurrentMatch() {
    if (state.findMatches.length === 0 || state.currentMatchIndex < 0) return;
    const matchPos = state.findMatches[state.currentMatchIndex];
    el.findCount.textContent = `${state.currentMatchIndex + 1} of ${state.findMatches.length}`;
    el.codeTextarea.focus();
    el.codeTextarea.selectionStart = matchPos;
    el.codeTextarea.selectionEnd = matchPos + state.findQuery.length;

    // Scroll textarea to match
    const lines = el.codeTextarea.value.slice(0, matchPos).split('\n');
    el.codeTextarea.scrollTop = Math.max(0, (lines.length - 4) * 20);
    syncEditorScroll();
  }

  function findNext() {
    if (state.findMatches.length === 0) return;
    state.currentMatchIndex = (state.currentMatchIndex + 1) % state.findMatches.length;
    highlightCurrentMatch();
  }

  function findPrev() {
    if (state.findMatches.length === 0) return;
    state.currentMatchIndex = (state.currentMatchIndex - 1 + state.findMatches.length) % state.findMatches.length;
    highlightCurrentMatch();
  }

  function replaceOne() {
    if (state.findMatches.length === 0 || state.currentMatchIndex < 0) return;
    const matchPos = state.findMatches[state.currentMatchIndex];
    const rep = el.replaceInput.value;
    const before = el.codeTextarea.value.slice(0, matchPos);
    const after = el.codeTextarea.value.slice(matchPos + state.findQuery.length);

    el.codeTextarea.value = before + rep + after;
    state.code = el.codeTextarea.value;
    renderSyntaxHighlight(state.code);
    updateLivePreview();
    runLinter(state.code);
    executeFind();
  }

  function replaceAll() {
    if (!state.findQuery) return;
    const rep = el.replaceInput.value;
    const newCode = el.codeTextarea.value.replaceAll(state.findQuery, rep);
    el.codeTextarea.value = newCode;
    state.code = newCode;
    renderSyntaxHighlight(state.code);
    updateLivePreview();
    runLinter(state.code);
    executeFind();
    showToast(`Diganti semua kemunculan "${state.findQuery}"`, 'success');
  }

  // --- 8. In-line AI Code Revision Engine ---
  function openAiDrawer() {
    el.aiDrawer.classList.toggle('open');
    if (el.aiDrawer.classList.contains('open')) {
      el.aiInput.focus();
    }
  }

  function renderAiChips() {
    if (!el.aiChipsContainer || !state.appData || !state.appData.aiPromptPresets) return;
    el.aiChipsContainer.innerHTML = state.appData.aiPromptPresets.map(preset => `
      <button class="ai-chip" onclick="window.webstudioSetAiPrompt('${escapeHtml(preset)}')">
        ✨ ${preset}
      </button>
    `).join('');
  }

  window.webstudioSetAiPrompt = function (text) {
    if (el.aiInput) {
      el.aiInput.value = text;
      el.aiInput.focus();
    }
  };

  async function applyAiRevision() {
    const prompt = el.aiInput.value.trim();
    if (!prompt) return;

    el.btnAiApply.disabled = true;
    el.btnAiApply.textContent = 'Menganalisis...';

    setTimeout(() => {
      let revised = state.code;
      const lower = prompt.toLowerCase();

      if (lower.includes('hero') || lower.includes('cta')) {
        const heroSection = `
  <!-- AI Generated: Hero Section -->
  <section style="text-align:center; padding: 48px 20px; background: radial-gradient(circle at 50% 20%, rgba(14,165,233,0.2), transparent 70%); border-radius: 16px; margin: 20px 0; border: 1px solid rgba(14,165,233,0.3);">
    <h1 style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Transformasi Ide Jadi Aplikasi Hybrid</h1>
    <p style="color: #94a3b8; font-size: 16px; margin: 12px auto; max-width: 480px;">Satu basis kode HTML, CSS, dan JS yang siap dijalankan sebagai PWA maupun web independen.</p>
    <div style="display:flex; justify-content:center; gap:12px; margin-top:20px;">
      <a href="#demo" style="background:#0ea5e9; color:#fff; padding:10px 22px; border-radius:8px; text-decoration:none; font-weight:600; box-shadow:0 4px 14px rgba(14,165,233,0.4);">Mulai Sekarang →</a>
      <a href="#learn" style="background:rgba(255,255,255,0.06); color:#f8fafc; padding:10px 22px; border-radius:8px; text-decoration:none; font-weight:500; border:1px solid #334155;">Pelajari Fitur</a>
    </div>
  </section>`;
        if (revised.includes('<body>')) {
          revised = revised.replace('<body>', '<body>\n' + heroSection);
        } else {
          revised += heroSection;
        }
      } else if (lower.includes('kontak') || lower.includes('form')) {
        const formSection = `
  <!-- AI Generated: Contact Form -->
  <section style="background:#131b2e; border:1px solid #1e293b; border-radius:12px; padding:24px; margin:20px 0;">
    <h2 style="font-size:20px; margin-bottom:8px; color:#f8fafc;">Kirim Pesan</h2>
    <p style="font-size:13px; color:#94a3b8; margin-bottom:16px;">Kami akan membalas pertanyaan Anda dalam 24 jam.</p>
    <form onsubmit="event.preventDefault(); alert('Pesan berhasil terkirim via PWA!');" style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <label style="display:block; font-size:12px; margin-bottom:4px; color:#cbd5e1;">Nama Lengkap</label>
        <input type="text" required placeholder="Masukkan nama..." style="width:100%; padding:10px; border-radius:6px; background:#0b0f19; border:1px solid #334155; color:#fff; outline:none;">
      </div>
      <div>
        <label style="display:block; font-size:12px; margin-bottom:4px; color:#cbd5e1;">Email</label>
        <input type="email" required placeholder="nama@email.com" style="width:100%; padding:10px; border-radius:6px; background:#0b0f19; border:1px solid #334155; color:#fff; outline:none;">
      </div>
      <div>
        <label style="display:block; font-size:12px; margin-bottom:4px; color:#cbd5e1;">Pesan</label>
        <textarea rows="3" required placeholder="Tuliskan pesan Anda..." style="width:100%; padding:10px; border-radius:6px; background:#0b0f19; border:1px solid #334155; color:#fff; outline:none; resize:none;"></textarea>
      </div>
      <button type="submit" style="background:#0ea5e9; color:#fff; padding:10px; border-radius:6px; font-weight:600; border:none; cursor:pointer;">Kirim Pesan Sekarang</button>
    </form>
  </section>`;
        if (revised.includes('</body>')) {
          revised = revised.replace('</body>', formSection + '\n</body>');
        } else {
          revised += formSection;
        }
      } else if (lower.includes('pricing') || lower.includes('harga')) {
        const pricingSection = `
  <!-- AI Generated: Pricing Table -->
  <section style="margin:24px 0;">
    <h2 style="text-align:center; font-size:22px; margin-bottom:16px;">Pilihan Paket Langganan</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
      <div style="background:#131b2e; border:1px solid #1e293b; border-radius:12px; padding:20px; text-align:center;">
        <h3 style="font-size:16px;">Starter</h3>
        <p style="font-size:24px; font-weight:800; color:#38bdf8; margin:12px 0;">Gratis</p>
        <p style="font-size:12px; color:#94a3b8; margin-bottom:16px;">Cocok untuk eksplorasi dan prototipe.</p>
        <button style="width:100%; padding:8px; border-radius:6px; background:#1e293b; color:#fff; border:none; cursor:pointer;">Pilih Paket</button>
      </div>
      <div style="background:#131b2e; border:2px solid #0ea5e9; border-radius:12px; padding:20px; text-align:center; position:relative;">
        <span style="position:absolute; top:-10px; right:12px; background:#0ea5e9; font-size:10px; padding:2px 8px; border-radius:9999px; font-weight:700;">POPULER</span>
        <h3 style="font-size:16px;">Pro Studio</h3>
        <p style="font-size:24px; font-weight:800; color:#38bdf8; margin:12px 0;">Rp 99K <span style="font-size:12px; color:#94a3b8;">/bln</span></p>
        <p style="font-size:12px; color:#94a3b8; margin-bottom:16px;">Fitur lengkap preview multi-device & AI assistant.</p>
        <button style="width:100%; padding:8px; border-radius:6px; background:#0ea5e9; color:#fff; border:none; cursor:pointer;">Mulai Pro</button>
      </div>
    </div>
  </section>`;
        if (revised.includes('</body>')) {
          revised = revised.replace('</body>', pricingSection + '\n</body>');
        } else {
          revised += pricingSection;
        }
      } else {
        // Generic intelligent revision based on user instruction
        const genericBlock = `
  <!-- AI Generated: ${escapeHtml(prompt)} -->
  <div style="background:rgba(14,165,233,0.1); border:1px dashed #0ea5e9; border-radius:10px; padding:16px; margin:16px 0; text-align:center;">
    <h3 style="font-size:16px; color:#38bdf8;">✨ Komponen Baru: ${escapeHtml(prompt)}</h3>
    <p style="font-size:13px; color:#94a3b8; margin-top:6px;">Komponen telah diinjeksikan secara otomatis dan divalidasi ke Live Preview.</p>
  </div>`;
        if (revised.includes('</body>')) {
          revised = revised.replace('</body>', genericBlock + '\n</body>');
        } else {
          revised += genericBlock;
        }
      }

      el.codeTextarea.value = revised;
      state.code = revised;
      renderSyntaxHighlight(revised);
      updateLivePreview();
      runLinter(revised);

      el.btnAiApply.disabled = false;
      el.btnAiApply.textContent = 'Terapkan Revisi';
      el.aiDrawer.classList.remove('open');
      showToast('Revisi AI diterapkan & divalidasi ke Live Preview!', 'success');
    }, 600);
  }

  // --- 9. Device Emulator Toolbar & Responsiveness ---
  const DEVICE_CONFIGS = {
    responsive: { w: '100%', h: '100%', hasChassis: false },
    iphone15pro: { w: 393, h: 852, hasChassis: true },
    pixel8: { w: 412, h: 915, hasChassis: true },
    ipadair: { w: 820, h: 1180, hasChassis: true },
    desktop1080: { w: 1280, h: 720, hasChassis: false }
  };

  function updateDeviceView() {
    if (!el.deviceWrapper) return;
    const cfg = DEVICE_CONFIGS[state.device] || DEVICE_CONFIGS.responsive;

    if (state.device === 'responsive') {
      el.deviceWrapper.style.width = '100%';
      el.deviceWrapper.style.height = '100%';
      el.deviceWrapper.classList.remove('has-chassis');
      el.deviceWrapper.style.transform = 'none';
      return;
    }

    let targetWidth = cfg.w;
    let targetHeight = cfg.h;

    if (state.orientation === 'landscape') {
      const temp = targetWidth;
      targetWidth = targetHeight;
      targetHeight = temp;
    }

    el.deviceWrapper.style.width = `${targetWidth}px`;
    el.deviceWrapper.style.height = `${targetHeight}px`;

    if (state.showChassis && cfg.hasChassis) {
      el.deviceWrapper.classList.add('has-chassis');
    } else {
      el.deviceWrapper.classList.remove('has-chassis');
    }

    el.deviceWrapper.style.transform = `scale(${state.zoom})`;
    el.deviceWrapper.style.transformOrigin = 'center center';
  }

  // --- 10. Split Screen Layout Management ---
  function setSplitMode(mode) {
    state.splitMode = mode;
    localStorage.setItem('webstudio_split', mode);

    el.workspaceContainer.className = 'workspace-container';

    if (mode === 'horizontal') {
      el.workspaceContainer.classList.add('split-horizontal');
    } else if (mode === 'vertical') {
      el.workspaceContainer.classList.add('split-vertical');
    } else if (mode === 'code-only') {
      el.workspaceContainer.classList.add('view-code-only');
    } else if (mode === 'preview-only') {
      el.workspaceContainer.classList.add('view-preview-only');
    }

    // Update pill buttons active state
    if (el.splitPillGroup) {
      el.splitPillGroup.querySelectorAll('.btn-pill').forEach(btn => {
        if (btn.getAttribute('data-split') === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // --- 11. External Browser Sync & Preview ---
  function syncExternalBrowser() {
    const previewUrl = new URL(window.location.href);
    previewUrl.hash = '#external-preview';

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(state.code);
      win.document.close();
      showToast('Pratinjau disinkronkan ke tab browser eksternal', 'success');
    } else {
      showToast('Popup diblokir browser. Izinkan popup untuk sync.', 'warning');
    }
  }

  // --- 12. PWA Installation Handler ---
  function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      if (el.btnInstallPWA) {
        el.btnInstallPWA.style.display = 'inline-flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      state.deferredPrompt = null;
      if (el.btnInstallPWA) {
        el.btnInstallPWA.style.display = 'none';
      }
      showToast('Aplikasi WebStudio PWA berhasil diinstal!', 'success');
    });

    if (el.btnInstallPWA) {
      el.btnInstallPWA.addEventListener('click', async () => {
        if (state.deferredPrompt) {
          state.deferredPrompt.prompt();
          const { outcome } = await state.deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            state.deferredPrompt = null;
            el.btnInstallPWA.style.display = 'none';
          }
        } else {
          // iOS or unsupported fallback
          const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
          if (isIOS) {
            alert('Untuk menginstal di iOS:\n1. Ketuk tombol Share (ikon kotak panah ke atas) di Safari.\n2. Pilih "Add to Home Screen".');
          } else {
            showToast('Aplikasi sudah siap dijalankan atau silakan pasang via menu browser', 'info');
          }
        }
      });
    }
  }

  // --- 13. Service Worker Registration ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[WebStudio PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[WebStudio PWA] Service Worker registration failed:', err);
        });
    }
  }

  // --- 14. Cursor Position Tracker ---
  function updateCursorPosition() {
    if (!el.codeTextarea || !el.statusCursor) return;
    const pos = el.codeTextarea.selectionStart;
    const lines = el.codeTextarea.value.slice(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    state.cursorPos = { line, col };
    el.statusCursor.textContent = `Ln ${line}, Col ${col}`;
  }

  // --- 15. Templates Library Modal ---
  function renderTemplatesModal() {
    if (!el.templatesList || !state.appData || !state.appData.templates) return;
    el.templatesList.innerHTML = state.appData.templates.map(tpl => `
      <div style="border:1px solid var(--border-color); border-radius:8px; padding:12px; margin-bottom:10px; background:var(--bg-tertiary); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:600; font-size:13px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
            ${tpl.name}
            <span style="font-size:9px; background:var(--badge-bg); color:var(--brand-primary); padding:1px 6px; border-radius:9999px;">${tpl.badge}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${tpl.description}</div>
        </div>
        <button class="btn btn-primary" onclick="window.webstudioLoadTemplate('${tpl.id}')" style="font-size:11px; padding:4px 10px;">Gunakan</button>
      </div>
    `).join('');
  }

  window.webstudioLoadTemplate = function (templateId) {
    let tplCode = DEFAULT_HTML;
    if (templateId === 'mobile-app') {
      tplCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Android Hybrid App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Roboto, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding-bottom: 60px; }
    .top-bar { height: 56px; background: #1e293b; display: flex; align-items: center; padding: 0 16px; font-weight: 700; border-bottom: 1px solid #334155; }
    .container { padding: 16px; }
    .stat-card { background: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid #334155; }
    .stat-val { font-size: 28px; font-weight: 800; color: #38bdf8; margin-top: 4px; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 56px; background: #1e293b; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #334155; }
    .nav-item { color: #94a3b8; font-size: 11px; text-align: center; }
    .nav-item.active { color: #38bdf8; font-weight: 700; }
  </style>
</head>
<body>
  <div class="top-bar">Dashboard Android PWA</div>
  <div class="container">
    <div class="stat-card">
      <div style="font-size:12px; color:#94a3b8;">Total Kunjungan</div>
      <div class="stat-val">12,840</div>
    </div>
    <div class="stat-card">
      <div style="font-size:12px; color:#94a3b8;">Status Service Worker</div>
      <div class="stat-val" style="color:#34d399; font-size:20px;">✓ Active (CacheFirst)</div>
    </div>
  </div>
  <div class="bottom-nav">
    <div class="nav-item active">Beranda</div>
    <div class="nav-item">Proyek</div>
    <div class="nav-item">Pengaturan</div>
  </div>
</body>
</html>`;
    }
    el.codeTextarea.value = tplCode;
    state.code = tplCode;
    renderSyntaxHighlight(tplCode);
    updateLivePreview();
    runLinter(tplCode);
    if (el.templatesModal) el.templatesModal.classList.remove('open');
    showToast('Template berhasil dimuat ke editor!', 'success');
  };

  // --- 16. Event Listeners Setup ---
  function setupEventListeners() {
    // Textarea input & keyboard shortcuts
    el.codeTextarea.addEventListener('input', handleEditorInput);
    el.codeTextarea.addEventListener('scroll', syncEditorScroll);
    el.codeTextarea.addEventListener('click', updateCursorPosition);
    el.codeTextarea.addEventListener('keyup', (e) => {
      updateCursorPosition();
      if (e.key === 'Escape') hideAutocompletePopup();
    });

    // Keyboard Shortcuts (Tab for Emmet / Indent, Shift+Alt+F for format, Ctrl+F for find)
    el.codeTextarea.addEventListener('keydown', (e) => {
      // Tab Key - Emmet or Indent
      if (e.key === 'Tab') {
        e.preventDefault();
        const pos = el.codeTextarea.selectionStart;
        const val = el.codeTextarea.value;
        const textBefore = val.slice(0, pos);
        const lastWordMatch = textBefore.match(/([!a-zA-Z0-9\-#.>+*]+)$/);

        if (lastWordMatch) {
          const abbr = lastWordMatch[1];
          const expanded = expandEmmet(abbr);
          if (expanded) {
            const startPos = pos - abbr.length;
            const newCode = val.slice(0, startPos) + expanded + val.slice(pos);
            el.codeTextarea.value = newCode;
            state.code = newCode;
            el.codeTextarea.selectionStart = el.codeTextarea.selectionEnd = startPos + expanded.length;
            renderSyntaxHighlight(newCode);
            updateLivePreview();
            runLinter(newCode);
            showToast(`Emmet '${abbr}' diperluas!`, 'info');
            return;
          }
        }

        // Standard 2-spaces tab
        const newCode = val.slice(0, pos) + '  ' + val.slice(pos);
        el.codeTextarea.value = newCode;
        state.code = newCode;
        el.codeTextarea.selectionStart = el.codeTextarea.selectionEnd = pos + 2;
        renderSyntaxHighlight(newCode);
      }

      // Format: Shift + Alt + F
      if (e.shiftKey && e.altKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        formatCurrentCode();
      }

      // Find: Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        openFindReplace();
      }

      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        state.savedCode = state.code;
        localStorage.setItem('webstudio_code', state.code);
        checkUnsavedChanges();
        showToast('Kode berhasil disimpan ke LocalStorage!', 'success');
      }
    });

    // Theme Toggle
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('webstudio_theme', newTheme);
        el.themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        showToast(`Tema diubah ke ${newTheme} mode`, 'info');
      });
    }

    // Split Mode Toggle Buttons
    if (el.splitPillGroup) {
      el.splitPillGroup.querySelectorAll('.btn-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          setSplitMode(btn.getAttribute('data-split'));
        });
      });
    }

    // Device Select
    if (el.deviceSelect) {
      el.deviceSelect.addEventListener('change', (e) => {
        state.device = e.target.value;
        updateDeviceView();
      });
    }

    // Rotate Button
    if (el.rotateBtn) {
      el.rotateBtn.addEventListener('click', () => {
        state.orientation = state.orientation === 'portrait' ? 'landscape' : 'portrait';
        updateDeviceView();
        showToast(`Orientasi: ${state.orientation}`, 'info');
      });
    }

    // Zoom Select
    if (el.zoomSelect) {
      el.zoomSelect.addEventListener('change', (e) => {
        state.zoom = parseFloat(e.target.value) || 1;
        updateDeviceView();
      });
    }

    // Chassis Frame Toggle
    if (el.chassisToggleBtn) {
      el.chassisToggleBtn.addEventListener('click', () => {
        state.showChassis = !state.showChassis;
        updateDeviceView();
        el.chassisToggleBtn.classList.toggle('active', state.showChassis);
      });
    }

    // Format Code Button
    if (el.formatBtn) {
      el.formatBtn.addEventListener('click', formatCurrentCode);
    }

    // Find and Replace Controls
    if (el.findToggleBtn) el.findToggleBtn.addEventListener('click', openFindReplace);
    if (el.btnFindClose) el.btnFindClose.addEventListener('click', closeFindReplace);
    if (el.findInput) el.findInput.addEventListener('input', executeFind);
    if (el.btnFindNext) el.btnFindNext.addEventListener('click', findNext);
    if (el.btnFindPrev) el.btnFindPrev.addEventListener('click', findPrev);
    if (el.btnReplace) el.btnReplace.addEventListener('click', replaceOne);
    if (el.btnReplaceAll) el.btnReplaceAll.addEventListener('click', replaceAll);

    // AI Drawer Controls
    if (el.aiToggleBtn) el.aiToggleBtn.addEventListener('click', openAiDrawer);
    if (el.btnAiClose) el.btnAiClose.addEventListener('click', () => el.aiDrawer.classList.remove('open'));
    if (el.btnAiApply) el.btnAiApply.addEventListener('click', applyAiRevision);
    if (el.aiInput) {
      el.aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyAiRevision();
        }
      });
    }

    // Status Bar Lint Click
    if (el.statusLint) {
      el.statusLint.addEventListener('click', () => {
        el.lintDrawer.classList.toggle('open');
      });
    }

    // Export HTML File Button
    if (el.btnExport) {
      el.btnExport.addEventListener('click', () => {
        const blob = new Blob([state.code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('File index.html berhasil diunduh!', 'success');
      });
    }

    // Sync External Browser
    if (el.btnSyncExternal) {
      el.btnSyncExternal.addEventListener('click', syncExternalBrowser);
    }

    // Schema Modal Controls
    if (el.btnShowSchema) {
      el.btnShowSchema.addEventListener('click', () => {
        if (el.schemaContent && state.appData) {
          el.schemaContent.textContent = JSON.stringify(state.appData, null, 2);
        }
        el.schemaModal.classList.add('open');
      });
    }
    if (el.btnCloseSchema) {
      el.btnCloseSchema.addEventListener('click', () => {
        el.schemaModal.classList.remove('open');
      });
    }

    // Templates Modal Controls
    if (el.btnTemplates) {
      el.btnTemplates.addEventListener('click', () => {
        el.templatesModal.classList.add('open');
      });
    }
    if (el.btnCloseTemplates) {
      el.btnCloseTemplates.addEventListener('click', () => {
        el.templatesModal.classList.remove('open');
      });
    }

    // Online / Offline Status Listeners
    window.addEventListener('online', () => {
      showToast('Koneksi online kembali aktif', 'success');
    });
    window.addEventListener('offline', () => {
      showToast('Mode Offline aktif — data dan cache PWA digunakan', 'warning');
    });
  }

  function formatCurrentCode() {
    const formatted = formatHtml(el.codeTextarea.value);
    el.codeTextarea.value = formatted;
    state.code = formatted;
    renderSyntaxHighlight(formatted);
    updateLivePreview();
    runLinter(formatted);
    showToast('Kode HTML berhasil dirapikan (Prettier/Beautifier)', 'success');
  }

  // --- Initialization Bootstrap ---
  function init() {
    initElements();
    setupEventListeners();
    setupPWAInstall();
    registerServiceWorker();
    loadAppData();

    // Set initial theme
    const savedTheme = localStorage.getItem('webstudio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (el.themeToggleBtn) {
      el.themeToggleBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }

    // Initialize Editor
    el.codeTextarea.value = state.code;
    renderSyntaxHighlight(state.code);
    updateLivePreview();
    runLinter(state.code);
    setSplitMode(state.splitMode);
    updateDeviceView();
    updateCursorPosition();
    checkUnsavedChanges();

    console.log('[WebStudio PWA] Initialized successfully in flat root architecture.');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
