/* ==========================================================================
   WebStudio PWA - Mobile-First Stylesheet & Light/Dark Theme Engine
   ========================================================================== */

:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Fira Code", "JetBrains Mono", Consolas, "SF Mono", Menlo, Monaco, "Courier New", monospace;
  
  /* Light Theme (Default fallback) */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --bg-elevated: #ffffff;
  --bg-editor: #f8fafc;
  --border-color: #e2e8f0;
  --border-focus: #0284c7;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  --brand-primary: #0284c7;
  --brand-primary-hover: #0369a1;
  --brand-accent: #06b6d4;
  --brand-gradient: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
  
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --badge-bg: #e0f2fe;
  --badge-text: #0369a1;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Syntax Highlighting Light */
  --syn-tag: #0284c7;
  --syn-attr: #db2777;
  --syn-val: #16a34a;
  --syn-comment: #94a3b8;
  --syn-punct: #64748b;
  --syn-entity: #d97706;

  --toolbar-height: 52px;
  --bottom-bar-height: 38px;
}

/* System Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #090d16;
    --bg-secondary: #0f172a;
    --bg-tertiary: #1e293b;
    --bg-elevated: #1e293b;
    --bg-editor: #090d16;
    --border-color: #1e293b;
    --border-focus: #38bdf8;
    
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    
    --brand-primary: #38bdf8;
    --brand-primary-hover: #0ea5e9;
    --brand-accent: #22d3ee;
    --brand-gradient: linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #22d3ee 100%);
    
    --success: #34d399;
    --warning: #fbbf24;
    --danger: #f87171;
    --badge-bg: rgba(56, 189, 248, 0.15);
    --badge-text: #38bdf8;
    
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 8px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    
    /* Syntax Highlighting Dark */
    --syn-tag: #38bdf8;
    --syn-attr: #f472b6;
    --syn-val: #a3e635;
    --syn-comment: #64748b;
    --syn-punct: #94a3b8;
    --syn-entity: #fbbf24;
  }
}

/* Explicit User Overrides */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --bg-elevated: #ffffff;
  --bg-editor: #f8fafc;
  --border-color: #e2e8f0;
  --border-focus: #0284c7;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --brand-primary: #0284c7;
  --badge-bg: #e0f2fe;
  --badge-text: #0369a1;
  --syn-tag: #0284c7;
  --syn-attr: #db2777;
  --syn-val: #16a34a;
  --syn-comment: #94a3b8;
  --syn-punct: #64748b;
}

[data-theme="dark"] {
  --bg-primary: #090d16;
  --bg-secondary: #0f172a;
  --bg-tertiary: #1e293b;
  --bg-elevated: #1e293b;
  --bg-editor: #090d16;
  --border-color: #1e293b;
  --border-focus: #38bdf8;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --brand-primary: #38bdf8;
  --badge-bg: rgba(56, 189, 248, 0.15);
  --badge-text: #38bdf8;
  --syn-tag: #38bdf8;
  --syn-attr: #f472b6;
  --syn-val: #a3e635;
  --syn-comment: #64748b;
  --syn-punct: #94a3b8;
}

/* Base Reset & Setup */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* App Container Layout */
#app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: relative;
  overflow: hidden;
}

/* Primary Top Navigation Bar */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--toolbar-height);
  padding: 0 12px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 40;
  gap: 8px;
  flex-shrink: 0;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.app-icon-img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.brand-text-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--badge-bg);
  color: var(--badge-text);
  text-transform: uppercase;
}

.brand-subtitle {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Navbar Controls Group */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  user-select: none;
  white-space: nowrap;
}

.btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--border-focus);
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: var(--brand-gradient);
  color: #ffffff !important;
  border: none;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  opacity: 0.95;
  box-shadow: 0 3px 12px rgba(14, 165, 233, 0.45);
}

.btn-accent {
  background-color: rgba(56, 189, 248, 0.1);
  color: var(--brand-primary);
  border-color: rgba(56, 189, 248, 0.3);
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
}

.btn-pill-group {
  display: inline-flex;
  background: var(--bg-tertiary);
  padding: 2px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.btn-pill {
  padding: 4px 8px;
  font-size: 11px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-pill.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

/* Secondary Toolbars: Editor & Device bar */
.sub-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: 11px;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

.sub-toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Workspace Main Stage (Split View Container) */
.workspace-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-primary);
}

@media (min-width: 768px) {
  .workspace-container.split-horizontal {
    flex-direction: row;
  }
}

.workspace-container.view-code-only .preview-panel {
  display: none !important;
}

.workspace-container.view-preview-only .editor-panel {
  display: none !important;
}

/* Editor Panel */
.editor-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background-color: var(--bg-editor);
  position: relative;
  border-right: 1px solid var(--border-color);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.editor-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.editor-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  color: var(--text-primary);
  font-size: 11px;
  font-family: var(--font-mono);
}

.editor-tab-badge {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--success);
}

.editor-tab-badge.unsaved {
  background-color: var(--warning);
}

/* Find & Replace Bar */
.find-replace-bar {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 20;
  flex-wrap: wrap;
}

.find-replace-bar.open {
  display: flex;
}

.input-compact {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  outline: none;
  min-width: 140px;
}

.input-compact:focus {
  border-color: var(--border-focus);
}

/* In-line AI Revision Drawer */
.ai-inline-drawer {
  display: none;
  flex-direction: column;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
  z-index: 25;
}

.ai-inline-drawer.open {
  display: flex;
}

.ai-prompt-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ai-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  outline: none;
}

.ai-input:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.ai-chips-container {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.ai-chip {
  padding: 3px 8px;
  border-radius: 9999px;
  background: var(--bg-tertiary);
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.15s;
}

.ai-chip:hover {
  background: var(--badge-bg);
  color: var(--brand-primary);
  border-color: var(--brand-primary);
}

/* Editor Wrapper & Gutter */
.code-editor-wrapper {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  font-family: var(--font-mono);
}

.code-gutter {
  width: 48px;
  padding: 12px 6px;
  background-color: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 12px;
  line-height: 20px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
}

.gutter-line {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  height: 20px;
}

.fold-btn {
  font-size: 9px;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.6;
}

.fold-btn:hover {
  opacity: 1;
  color: var(--brand-primary);
}

/* Editor Text Area & Syntax Overlay */
.editor-stage {
  flex: 1;
  position: relative;
  overflow: auto;
  min-height: 0;
}

.code-textarea, .syntax-highlight-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 12px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 20px;
  tab-size: 2;
  white-space: pre;
  word-wrap: normal;
  overflow: auto;
}

.code-textarea {
  background: transparent;
  color: transparent;
  caret-color: var(--text-primary);
  border: none;
  outline: none;
  resize: none;
  z-index: 2;
}

.syntax-highlight-layer {
  z-index: 1;
  pointer-events: none;
  color: var(--text-primary);
}

/* Syntax Highlighting Colors */
.tok-tag { color: var(--syn-tag); font-weight: 600; }
.tok-attr { color: var(--syn-attr); }
.tok-val { color: var(--syn-val); }
.tok-str { color: var(--syn-val); }
.tok-comment { color: var(--syn-comment); font-style: italic; }
.tok-punct { color: var(--syn-punct); }
.tok-css { color: #818cf8; }
.tok-js { color: #f59e0b; }

/* Autocomplete Suggestion Popup */
.autocomplete-popup {
  position: absolute;
  display: none;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  border-radius: 6px;
  z-index: 50;
  min-width: 180px;
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-popup.show {
  display: block;
}

.ac-item {
  padding: 6px 10px;
  font-size: 11px;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.ac-item:hover, .ac-item.selected {
  background-color: var(--brand-primary);
  color: #ffffff;
}

.ac-badge {
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  background: rgba(0,0,0,0.1);
}

/* Splitter / Resizer handle */
.splitter-handle {
  width: 6px;
  height: 100%;
  background: var(--border-color);
  cursor: col-resize;
  transition: background 0.2s;
  z-index: 10;
  flex-shrink: 0;
}

.splitter-handle:hover, .splitter-handle.dragging {
  background: var(--brand-primary);
}

@media (max-width: 767px) {
  .splitter-handle {
    width: 100%;
    height: 6px;
    cursor: row-resize;
  }
}

/* Preview Panel */
.preview-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background-color: var(--bg-tertiary);
  position: relative;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  flex-shrink: 0;
  gap: 8px;
  overflow-x: auto;
}

.preview-stage-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  overflow: auto;
  padding: 12px;
  background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Device Emulator Frame */
.device-wrapper {
  position: relative;
  background: #ffffff;
  box-shadow: var(--shadow-lg);
  border-radius: 8px;
  overflow: hidden;
  transition: width 0.25s ease, height 0.25s ease;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
}

.device-wrapper.has-chassis {
  border: 10px solid #1e293b;
  border-radius: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.device-top-island {
  display: none;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 20px;
  background-color: #0f172a;
  border-radius: 20px;
  z-index: 10;
}

.device-wrapper.has-chassis .device-top-island {
  display: block;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
  display: block;
}

/* Bottom Status & Diagnostic Bar */
.bottom-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--bottom-bar-height);
  padding: 0 12px;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-secondary);
  z-index: 40;
  flex-shrink: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-badge:hover {
  background: var(--bg-tertiary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--success);
}

.status-dot.error { background-color: var(--danger); }
.status-dot.warning { background-color: var(--warning); }

/* Modal & Dialogs */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-overlay.open {
  display: flex;
}

.modal-card {
  width: 100%;
  max-width: 560px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-body {
  padding: 16px 18px;
  overflow-y: auto;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 48px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 110;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}

@keyframes slideIn {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Linter Diagnostics List */
.lint-drawer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  max-height: 180px;
  overflow-y: auto;
  display: none;
  z-index: 30;
}

.lint-drawer.open {
  display: block;
}

.lint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 11px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.lint-item:hover {
  background: var(--bg-tertiary);
}

/* Mobile Media Queries */
@media (max-width: 640px) {
  .hide-on-mobile {
    display: none !important;
  }
  .brand-subtitle {
    display: none;
  }
  .btn span {
    display: none;
  }
  .btn svg {
    margin: 0;
  }
}
