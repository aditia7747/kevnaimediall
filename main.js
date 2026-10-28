(function () {
  "use strict";

  // 1. Proteksi Anti-Intip Source Code
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) ||
      (e.ctrlKey && ["U", "u", "S", "s"].includes(e.key))
    ) {
      e.preventDefault();
      return false;
    }
  });

  // 2. Suntikkan Meta, Font & Seluruh CSS Modern Cyberpunk ke <head>
  document.head.insertAdjacentHTML(
    "beforeend",
    `<meta http-equiv="X-Content-Type-Options" content="nosniff">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
      :root {
        --bg-base: #060913;
        --bg-surface: #0c1224;
        --bg-elevated: #121b33;
        --bg-subtle: rgba(255, 255, 255, 0.03);
        --primary: #00e5ff;
        --primary-dark: #0099b8;
        --secondary: #3b82f6;
        --btn-shadow: rgba(0, 229, 255, 0.25);
        --text-main: #f8fafc;
        --text-sub: #94a3b8;
        --border-subtle: rgba(255, 255, 255, 0.07);
        --border-accent: rgba(0, 229, 255, 0.22);
        --glow-color: rgba(0, 229, 255, 0.14);
      }

      [data-theme="gold"] {
        --primary: #fbbf24;
        --primary-dark: #d97706;
        --secondary: #f59e0b;
        --btn-shadow: rgba(251, 191, 36, 0.25);
        --border-accent: rgba(251, 191, 36, 0.25);
        --glow-color: rgba(251, 191, 36, 0.14);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
      }

      html, body {
        width: 100%;
        min-height: 100vh;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: var(--bg-base);
        color: var(--text-main);
        overflow-x: hidden;
        scroll-behavior: smooth;
      }

      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 16px 56px;
        position: relative;
        background-image: 
          radial-gradient(circle at 15% 10%, var(--glow-color), transparent 42%),
          radial-gradient(circle at 85% 90%, rgba(59, 130, 246, 0.1), transparent 45%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
        background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
      }

      .app-shell {
        width: 100%;
        max-width: 520px;
        position: relative;
        z-index: 2;
      }

      /* SVG Inline Helper */
      .svg-icon {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        flex-shrink: 0;
      }

      /* Top Bar */
      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        margin-bottom: 24px;
        background: rgba(12, 18, 36, 0.75);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        border: 1px solid var(--border-subtle);
      }

      .theme-switcher {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .theme-dot {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.2s ease, border-color 0.2s, box-shadow 0.2s;
      }

      .theme-dot.active {
        transform: scale(1.15);
        border-color: #ffffff;
        box-shadow: 0 0 12px var(--primary);
      }

      .btn-icon-top {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-subtle);
        color: var(--text-sub);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-icon-top:hover {
        color: var(--primary);
        background: rgba(255, 255, 255, 0.08);
      }

      /* Hero Header */
      .hero-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .hero-title {
        font-family: 'Outfit', sans-serif;
        font-size: clamp(28px, 7vw, 34px);
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, #ffffff 30%, var(--primary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 6px;
      }

      .hero-sub {
        font-size: 13.5px;
        color: var(--text-sub);
        font-weight: 400;
      }

      .metrics-bar {
        display: inline-flex;
        align-items: center;
        gap: 16px;
        margin-top: 14px;
        padding: 7px 16px;
        border-radius: 99px;
        background: rgba(12, 18, 36, 0.7);
        border: 1px solid var(--border-subtle);
        font-size: 12px;
        color: var(--text-sub);
      }

      .metrics-bar span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .metrics-bar strong {
        font-family: 'JetBrains Mono', monospace;
        color: var(--primary);
      }

      /* Main Container Card */
      .main-card {
        background: rgba(12, 18, 36, 0.85);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 22px;
        border: 1px solid var(--border-accent);
        box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.7);
      }

      /* Segmented 2-Tabs */
      .segmented-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        background: rgba(6, 9, 19, 0.8);
        padding: 5px;
        border-radius: 14px;
        margin-bottom: 20px;
        border: 1px solid var(--border-subtle);
      }

      .seg-btn {
        border: none;
        background: transparent;
        color: var(--text-sub);
        font-family: inherit;
        font-size: 13.5px;
        font-weight: 600;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
      }

      .seg-btn.active {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: #040711;
        font-weight: 700;
        box-shadow: 0 4px 14px var(--btn-shadow);
      }

      .tab-view { display: none; }
      .tab-view.active { display: block; animation: viewEnter 0.22s ease-out; }

      @keyframes viewEnter {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Input Field (Fixed Padding & Placeholder) */
      .input-wrap {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .input-wrap .prefix-icon {
        position: absolute;
        left: 16px;
        color: var(--primary);
        font-size: 15px;
        pointer-events: none;
      }

      .input-field {
        width: 100%;
        padding: 15px 108px 15px 44px;
        border-radius: 14px;
        background: rgba(6, 9, 19, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #ffffff;
        font-family: inherit;
        font-size: 13.5px;
        outline: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .input-field::placeholder {
        color: #64748b;
      }

      .input-field:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--glow-color);
      }

      .btn-paste {
        position: absolute;
        right: 8px;
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid var(--border-accent);
        color: var(--primary);
        padding: 8px 12px;
        border-radius: 10px;
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .btn-paste:hover {
        background: rgba(0, 229, 255, 0.18);
      }

      .action-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: #040711;
        border: none;
        padding: 14px 20px;
        border-radius: 14px;
        font-family: 'Outfit', sans-serif;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 6px 20px var(--btn-shadow);
        transition: transform 0.15s ease, filter 0.2s ease;
      }

      .btn-primary:hover:not(:disabled) {
        filter: brightness(1.08);
        transform: translateY(-1px);
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(1px);
      }

      .btn-primary:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      .btn-clear {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-subtle);
        color: var(--text-sub);
        width: 48px;
        border-radius: 14px;
        font-size: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .btn-clear:hover {
        color: #fb7185;
        background: rgba(251, 113, 133, 0.1);
        border-color: rgba(251, 113, 133, 0.3);
      }

      /* Progress Bar */
      .progress-card {
        display: none;
        margin-top: 16px;
        background: rgba(6, 9, 19, 0.85);
        border: 1px solid var(--border-accent);
        padding: 12px 14px;
        border-radius: 12px;
      }

      .progress-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 8px;
      }

      .progress-track {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 99px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        transition: width 0.15s ease;
      }

      .status-box {
        margin-top: 18px;
        padding: 28px 16px;
        border-radius: 16px;
        background: rgba(6, 9, 19, 0.6);
        border: 1px solid var(--border-subtle);
        text-align: center;
      }

      .loader-ring {
        width: 34px;
        height: 34px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
        margin: 0 auto 10px;
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      /* =====================================================
         KARTU HASIL MEDIA (CLEAN, MINIMAL BORDER, PROPORTIONAL)
         ===================================================== */
      .result-card {
        margin-top: 22px;
        padding-top: 22px;
        border-top: 1px solid var(--border-subtle);
      }

      .creator-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px;
        margin-bottom: 14px;
        background: var(--bg-subtle);
        border-radius: 14px;
      }

      .creator-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .creator-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid var(--primary);
        background: #111827;
        cursor: pointer;
        flex-shrink: 0;
      }

      .creator-text {
        min-width: 0;
      }

      .creator-text h4 {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 2px;
      }

      .creator-text a {
        font-size: 12px;
        color: var(--primary);
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .creator-text a:hover {
        text-decoration: underline;
      }

      .meta-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 14px;
      }

      .meta-pill {
        font-size: 11px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 8px;
        background: var(--bg-subtle);
        color: var(--text-sub);
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      .meta-pill i { color: var(--primary); }

      /* Video Stage */
      .video-stage {
        position: relative;
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        background: #040711;
        margin-bottom: 14px;
        border: 1px solid var(--border-subtle);
        min-height: 260px;
        max-height: 420px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .video-stage video {
        width: 100%;
        max-height: 420px;
        object-fit: contain;
        display: block;
        position: relative;
        z-index: 1;
      }

      .video-poster-overlay {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #060913;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }

      .video-poster-overlay.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      .video-poster-overlay img.poster-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.78);
        transition: transform 0.35s ease;
      }

      .video-poster-overlay:hover img.poster-bg {
        transform: scale(1.03);
      }

      .play-trigger {
        position: relative;
        z-index: 4;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: #040711;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        padding-left: 4px;
        box-shadow: 0 8px 28px var(--btn-shadow);
        transition: transform 0.2s ease;
      }

      .video-poster-overlay:hover .play-trigger {
        transform: scale(1.06);
      }

      .poster-hint {
        position: relative;
        z-index: 4;
        margin-top: 12px;
        padding: 5px 12px;
        border-radius: 99px;
        background: rgba(6, 9, 19, 0.85);
        border: 1px solid var(--border-subtle);
        color: #f8fafc;
        font-size: 11.5px;
        font-weight: 600;
        backdrop-filter: blur(6px);
      }

      /* Panel Caption & Statistik */
      .caption-box {
        background: var(--bg-subtle);
        border-radius: 14px;
        padding: 12px 14px;
        margin-bottom: 14px;
      }

      .caption-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-sub);
        margin-bottom: 6px;
      }

      .caption-header svg {
        color: var(--primary);
      }

      .caption-body {
        font-size: 13px;
        color: #e2e8f0;
        line-height: 1.55;
        word-break: break-word;
      }

      .hashtag-inline {
        color: var(--primary);
        font-weight: 600;
        background: rgba(0, 229, 255, 0.08);
        padding: 1px 6px;
        border-radius: 5px;
        cursor: pointer;
        display: inline-block;
        margin: 1px 0;
        transition: background 0.15s;
      }

      .hashtag-inline:hover {
        background: rgba(0, 229, 255, 0.2);
      }

      /* Audio Bar */
      .audio-bar {
        background: rgba(0, 229, 255, 0.05);
        border: 1px solid var(--border-accent);
        border-radius: 14px;
        padding: 10px 14px;
        margin-bottom: 14px;
      }

      .audio-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .audio-info {
        display: flex;
        align-items: center;
        gap: 10px;
        overflow: hidden;
        flex: 1;
      }

      .audio-toggle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--primary);
        color: #040711;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
      }

      .audio-meta-text {
        overflow: hidden;
        flex: 1;
      }

      .audio-name {
        font-size: 12.5px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .audio-time {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10.5px;
        color: var(--text-sub);
      }

      .audio-seek {
        width: 100%;
        height: 4px;
        margin-top: 8px;
        accent-color: var(--primary);
        cursor: pointer;
      }

      .eq-bars {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 16px;
      }

      .eq-bar {
        width: 3px;
        height: 4px;
        background: var(--primary);
        border-radius: 2px;
      }

      .eq-bars.playing .eq-bar {
        animation: eqPulse 0.55s infinite alternate ease-in-out;
      }
      .eq-bars.playing .eq-bar:nth-child(2) { animation-delay: 0.18s; }
      .eq-bars.playing .eq-bar:nth-child(3) { animation-delay: 0.35s; }

      @keyframes eqPulse {
        0% { height: 4px; }
        100% { height: 16px; }
      }

      /* Statistik Video */
      .stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }

      .stat-cell {
        background: var(--bg-subtle);
        border-radius: 12px;
        padding: 9px 6px;
        text-align: center;
      }

      .stat-cell i {
        color: var(--primary);
        font-size: 12px;
        display: block;
        margin-bottom: 4px;
      }

      .stat-cell span {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11.5px;
        font-weight: 600;
        color: #ffffff;
      }

      /* =====================================================
         HIRARKI TOMBOL UNDUH (PRIMARY CTA & SECONDARY ACTIONS)
         ===================================================== */
      .dl-hierarchy {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 14px;
      }

      .btn-cta-main {
        width: 100%;
        padding: 15px 18px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        color: #040711;
        border: none;
        font-family: 'Outfit', sans-serif;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        box-shadow: 0 8px 24px var(--btn-shadow);
        transition: transform 0.15s ease, filter 0.2s ease;
      }

      .btn-cta-main:hover:not(:disabled) {
        filter: brightness(1.08);
        transform: translateY(-1px);
      }

      .btn-cta-main:active:not(:disabled) {
        transform: translateY(1px);
      }

      .dl-secondary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .dl-secondary-grid.two-cols {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 400px) {
        .dl-secondary-grid {
          grid-template-columns: 1fr;
        }
      }

      .btn-dl-sec {
        padding: 11px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-subtle);
        color: #f1f5f9;
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-align: center;
        transition: all 0.2s ease;
      }

      .btn-dl-sec:hover:not(:disabled) {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(0, 229, 255, 0.06);
      }

      /* =====================================================
         ACCORDION: OPSI & ALAT TAMBAHAN
         ===================================================== */
      .extra-tools-accordion {
        border-radius: 14px;
        background: rgba(6, 9, 19, 0.55);
        border: 1px solid var(--border-subtle);
        overflow: hidden;
      }

      .accordion-trigger {
        width: 100%;
        padding: 12px 14px;
        background: transparent;
        border: none;
        color: var(--text-sub);
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: color 0.2s ease, background 0.2s ease;
      }

      .accordion-trigger:hover {
        color: var(--text-main);
        background: rgba(255, 255, 255, 0.02);
      }

      .accordion-trigger-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .accordion-trigger-left svg {
        color: var(--primary);
      }

      .accordion-chevron {
        transition: transform 0.25s ease;
      }

      .extra-tools-accordion.open .accordion-chevron {
        transform: rotate(180deg);
      }

      .accordion-content {
        display: none;
        padding: 14px;
        border-top: 1px solid var(--border-subtle);
      }

      .extra-tools-accordion.open .accordion-content {
        display: block;
        animation: viewEnter 0.2s ease-out;
      }

      .tools-group-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--text-sub);
        margin-bottom: 8px;
        display: block;
      }

      .tools-row {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-bottom: 12px;
      }

      .tools-row:last-child {
        margin-bottom: 0;
      }

      .chip-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-subtle);
        color: #e2e8f0;
        font-family: inherit;
        font-size: 11.5px;
        font-weight: 600;
        padding: 7px 11px;
        border-radius: 9px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.18s ease;
      }

      .chip-btn:hover, .chip-btn.active {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(0, 229, 255, 0.08);
      }

      /* QR Code Drawer */
      .qr-drawer {
        display: none;
        margin-top: 12px;
        padding: 14px;
        background: rgba(12, 18, 36, 0.9);
        border-radius: 12px;
        text-align: center;
        border: 1px solid var(--border-accent);
      }

      .qr-preview-frame {
        display: inline-block;
        padding: 10px;
        background: #ffffff;
        border-radius: 12px;
        margin-bottom: 8px;
      }

      .qr-preview-frame img {
        width: 140px;
        height: 140px;
        display: block;
      }

      .qr-actions {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 10px;
        flex-wrap: wrap;
      }

      /* Slideshow Grid */
      .slides-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 14px;
        max-height: 320px;
        overflow-y: auto;
      }

      .slide-item {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-subtle);
        background: #060913;
      }

      .slide-item img {
        width: 100%;
        height: 145px;
        object-fit: cover;
        display: block;
      }

      .slide-item button {
        width: 100%;
        padding: 9px;
        font-size: 11.5px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary);
        border: none;
        border-top: 1px solid var(--border-subtle);
        cursor: pointer;
        transition: background 0.2s;
      }

      .slide-item button:hover {
        background: rgba(0, 229, 255, 0.1);
      }

      /* FYP Feed Grid (Bebas Tombol Hantu) */
      .feed-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 16px;
        max-height: 460px;
        overflow-y: auto;
        padding-right: 4px;
      }

      .feed-grid:empty {
        display: none;
        margin-top: 0;
      }

      .feed-item {
        background: rgba(6, 9, 19, 0.75);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: border-color 0.2s ease, transform 0.2s ease;
      }

      .feed-item:hover {
        border-color: var(--border-accent);
        transform: translateY(-2px);
      }

      .feed-cover {
        position: relative;
        height: 165px;
        background: #050811;
      }

      .feed-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .feed-badge {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: rgba(4, 7, 17, 0.82);
        backdrop-filter: blur(4px);
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 6px;
      }

      .feed-info {
        padding: 11px;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
      }

      .feed-user {
        font-size: 12px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .feed-desc {
        font-size: 11px;
        color: var(--text-sub);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 10px;
        line-height: 1.4;
      }

      /* History Section */
      .history-hub {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid var(--border-subtle);
        display: none;
      }

      .history-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .history-title {
        font-size: 12.5px;
        font-weight: 700;
        color: #e2e8f0;
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .history-title i { color: var(--primary); }

      .btn-wipe-history {
        background: rgba(244, 63, 94, 0.1);
        border: 1px solid rgba(244, 63, 94, 0.25);
        color: #fb7185;
        font-size: 11px;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-wipe-history:hover { background: rgba(244, 63, 94, 0.2); }

      .history-carousel {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 2px 2px 8px;
        scrollbar-width: thin;
      }

      .history-card {
        flex: 0 0 78px;
        height: 104px;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background: #0d1326;
        border: 1px solid var(--border-subtle);
        transition: transform 0.18s ease, border-color 0.2s;
      }

      .history-card:hover {
        transform: translateY(-2px);
        border-color: var(--primary);
      }

      .history-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .history-card-label {
        position: absolute;
        inset: auto 0 0 0;
        background: linear-gradient(to top, rgba(4, 6, 15, 0.95), transparent);
        color: #fff;
        font-size: 9.5px;
        font-weight: 600;
        padding: 14px 5px 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }

      .history-del-single {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: rgba(6, 9, 19, 0.85);
        color: #fb7185;
        border: none;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 3;
      }

      /* =====================================================
         TENTANG WEB, CARA PAKAI & FOOTER (BERSIH TANPA BORDER BERLEBIH)
         ===================================================== */
      .info-hub {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid var(--border-subtle);
        text-align: left;
      }

      .info-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .info-tag {
        font-size: 12px;
        font-weight: 700;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .about-web-desc {
        font-size: 12.5px;
        color: var(--text-sub);
        line-height: 1.6;
        margin-bottom: 16px;
      }

      .about-web-desc strong {
        color: var(--text-main);
      }

      .howto-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
      }

      .howto-step {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: var(--bg-subtle);
        border-radius: 12px;
        padding: 12px;
      }

      .step-num {
        width: 24px;
        height: 24px;
        border-radius: 7px;
        background: rgba(0, 229, 255, 0.12);
        color: var(--primary);
        font-family: 'Outfit', sans-serif;
        font-size: 12.5px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .step-text h5 {
        font-size: 12.5px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 2px;
      }

      .step-text p {
        font-size: 11.5px;
        color: var(--text-sub);
        line-height: 1.45;
      }

      .dev-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.025);
        font-size: 12.5px;
        font-weight: 500;
        color: var(--text-sub);
      }

      .dev-footer svg {
        color: var(--primary);
      }

      .dev-footer strong {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.3px;
      }

      /* =====================================================
         TOAST NOTIFICATION (FIXED FLOATING TOP CENTER)
         ===================================================== */
      .toast-stack {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: max-content;
        max-width: calc(100vw - 32px);
        pointer-events: none;
      }

      .toast-msg {
        background: rgba(12, 18, 36, 0.92);
        backdrop-filter: blur(12px);
        border: 1px solid var(--primary);
        color: #fff;
        padding: 10px 16px;
        border-radius: 99px;
        font-size: 12.5px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        animation: toastDrop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .toast-msg i {
        color: var(--primary);
      }

      .toast-msg.error {
        border-color: #fb7185;
      }

      .toast-msg.error i {
        color: #fb7185;
      }

      @keyframes toastDrop {
        from { opacity: 0; transform: translateY(-10px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    </style>`
  );

  // 3. Render Struktur Utama HTML ke dalam <body>
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="toast-stack" id="toastStack"></div>

    <div class="app-shell">
      <div class="top-bar">
        <div class="theme-switcher" title="Ganti Tema Warna">
          <div class="theme-dot active" id="dot-cyan" style="background: #00e5ff;" onclick="setTheme('cyan')"></div>
          <div class="theme-dot" id="dot-gold" style="background: #fbbf24;" onclick="setTheme('gold')"></div>
        </div>
        <button class="btn-icon-top" onclick="toggleFullScreen()" title="Mode Layar Penuh">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </button>
      </div>

      <div class="hero-header">
        <h1 class="hero-title">TikTok Downloader</h1>
        <p class="hero-sub">Simpan video MP4 kualitas asli, slide foto & audio MP3</p>
        <div class="metrics-bar">
          <span>
            <svg class="svg-icon" style="width:14px;height:14px;color:var(--primary)" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Unduhan: <strong id="statDownloads">0</strong>
          </span>
          <span>
            <svg class="svg-icon" style="width:14px;height:14px;color:var(--primary)" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Riwayat: <strong id="statHistory">0</strong>
          </span>
        </div>
      </div>

      <div class="main-card">
        <div class="segmented-tabs">
          <button class="seg-btn active" id="tabBtnDownload" onclick="switchTab('download', this)">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Unduh Link
          </button>
          <button class="seg-btn" id="tabBtnTrending" onclick="switchTab('trending', this)">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            FYP Indo
          </button>
        </div>

        <div id="view-download" class="tab-view active">
          <div class="input-wrap">
            <i class="fa-solid fa-link prefix-icon"></i>
            <input id="tiktokUrl" class="input-field" type="text" placeholder="Tempel link video TikTok di sini..." autocomplete="off" spellcheck="false">
            <button type="button" class="btn-paste" onclick="pasteClipboard()">
              <i class="fa-regular fa-paste"></i> Tempel
            </button>
          </div>

          <div class="action-row">
            <button id="processBtn" class="btn-primary" onclick="handleProcessClick()">
              <i class="fa-solid fa-bolt"></i> Ambil Video
            </button>
            <button class="btn-clear" onclick="resetAll()" title="Bersihkan Kolom">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <div id="view-trending" class="tab-view">
          <button id="trendBtn" class="btn-primary" style="width: 100%;" onclick="loadTrendingVideos()">
            <i class="fa-solid fa-arrows-rotate"></i> Segarkan Video FYP Indonesia
          </button>
          <div id="trendingStatus"></div>
          <div id="trendingResults" class="feed-grid"></div>
        </div>

        <div id="dlProgressCard" class="progress-card">
          <div class="progress-meta">
            <span id="dlProgressLabel">Menyiapkan unduhan...</span>
            <span id="dlProgressPct">0%</span>
          </div>
          <div class="progress-track">
            <div id="dlProgressFill" class="progress-fill"></div>
          </div>
        </div>

        <div id="result"></div>

        <div id="historySection" class="history-hub">
          <div class="history-top">
            <span class="history-title">
              <i class="fa-solid fa-clock-rotate-left"></i> Riwayat Terakhir Diproses
            </span>
            <button class="btn-wipe-history" onclick="clearHistory()">Hapus Semua</button>
          </div>
          <div id="historyList" class="history-carousel"></div>
        </div>

        <!-- Bagian Tentang Web & Cara Menggunakan -->
        <div class="info-hub">
          <div class="info-head">
            <span class="info-tag">
              <svg class="svg-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Tentang & Cara Pakai
            </span>
            <button class="chip-btn" onclick="shareWebApp()">
              <i class="fa-solid fa-share-nodes"></i> Bagikan Web
            </button>
          </div>

          <p class="about-web-desc">
            <strong>KevnaiMedia</strong> adalah alat pengunduh media TikTok berbasis web untuk menyimpan video MP4 resolusi asli (HD) tanpa watermark, galeri slide foto, hingga audio MP3 secara langsung tanpa perlu aplikasi tambahan.
          </p>

          <div class="howto-list">
            <div class="howto-step">
              <div class="step-num">1</div>
              <div class="step-text">
                <h5>Salin Tautan TikTok</h5>
                <p>Buka video atau slide foto di TikTok, ketuk tombol <b>Bagikan</b> lalu pilih <b>Salin Tautan</b>.</p>
              </div>
            </div>
            <div class="howto-step">
              <div class="step-num">2</div>
              <div class="step-text">
                <h5>Tempel pada Kolom</h5>
                <p>Ketuk tombol <b>Tempel</b> di atas untuk memasukkan tautan secara otomatis, lalu tekan <b>Ambil Video</b>.</p>
              </div>
            </div>
            <div class="howto-step">
              <div class="step-num">3</div>
              <div class="step-text">
                <h5>Pilih Format & Unduh</h5>
                <p>Putar pratinjau video atau musiknya, lalu unduh format <b>MP4 Tanpa Watermark</b>, <b>MP4 HD</b>, <b>MP3</b>, atau buka <b>Opsi & Alat Tambahan</b>.</p>
              </div>
            </div>
          </div>

          <div class="dev-footer">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>Dikembangkan oleh <strong>KevnAI</strong></span>
          </div>
        </div>
      </div>
    </div>`
  );

  // 4. State Global & Utilitas
  let currentMedia = null;
  let feedCache = [];
  let previewAudio = null;
  let lastRequestTime = 0;
  const COOLDOWN_MS = 1600;

  function setTheme(theme) {
    if (theme === "gold") {
      document.documentElement.setAttribute("data-theme", "gold");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("tt_royale_theme", theme);
    document.getElementById("dot-cyan").classList.toggle("active", theme !== "gold");
    document.getElementById("dot-gold").classList.toggle("active", theme === "gold");
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function switchTab(tab, btnEl) {
    document.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-view").forEach((v) => v.classList.remove("active"));
    btnEl.classList.add("active");
    document.getElementById(`view-${tab}`).classList.add("active");

    if (tab === "trending" && document.getElementById("trendingResults").children.length === 0) {
      loadTrendingVideos();
    }
  }

  function showToast(msg, type = "info") {
    const stack = document.getElementById("toastStack");
    const el = document.createElement("div");
    el.className = `toast-msg ${type === "error" ? "error" : ""}`;
    const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    el.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.2s ease";
      setTimeout(() => el.remove(), 220);
    }, 2800);
  }

  function extractTiktokUrl(raw) {
    if (!raw) return "";
    const match = raw.match(/https?:\/\/[^\s"'<>]+/i);
    const candidate = match ? match[0] : raw.trim();
    try {
      const parsed = new URL(candidate);
      const host = parsed.hostname.toLowerCase();
      const validHosts = ["tiktok.com", "www.tiktok.com", "vt.tiktok.com", "vm.tiktok.com", "m.tiktok.com", "douyin.com"];
      const isAllowed = validHosts.some((h) => host === h || host.endsWith("." + h));
      return isAllowed ? parsed.href : "";
    } catch (e) {
      return "";
    }
  }

  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return showToast("Clipboard kosong", "error");
      const clean = extractTiktokUrl(text) || text.trim();
      document.getElementById("tiktokUrl").value = clean;
      showToast("Tautan berhasil ditempel");
    } catch (e) {
      showToast("Tekan tahan pada kolom untuk menempel tautan", "error");
    }
  }

  document.getElementById("tiktokUrl").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleProcessClick();
  });

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m]));
  }

  function formatCaptionWithHashtags(rawTitle) {
    const safe = escapeHtml(rawTitle || "Video TikTok");
    return safe.replace(/#[\w\u00C0-\u017F]+/g, (tag) => {
      return `<span class="hashtag-inline" onclick="copySingleTag('${tag}')" title="Klik untuk salin ${tag}">${tag}</span>`;
    });
  }

  function copySingleTag(tag) {
    navigator.clipboard.writeText(tag).then(() => {
      showToast(`Hashtag ${tag} disalin!`);
    });
  }

  function formatNum(n) {
    if (!n) return "0";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  }

  function formatBytes(bytes) {
    if (!bytes || isNaN(bytes) || bytes <= 0) return "";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  // Fallback Validasi Metadata Ukuran File (Menyembunyikan ukuran jika tidak logis, misal HD <= SD)
  function getLogicalFileSizes(sdBytes, hdBytes) {
    const sd = Number(sdBytes) || 0;
    const hd = Number(hdBytes) || 0;

    if (sd <= 0 || hd <= 0 || hd <= sd) {
      return { sdLabel: "", hdLabel: "" };
    }
    return {
      sdLabel: `(${formatBytes(sd)})`,
      hdLabel: `(${formatBytes(hd)})`
    };
  }

  function formatDuration(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function buildFallbackAvatar(name) {
    const clean = encodeURIComponent((name || "TK").slice(0, 2));
    return `https://ui-avatars.com/api/?name=${clean}&background=0d1428&color=00e5ff&bold=true&size=128`;
  }

  async function fetchTikwmWithRetry(apiUrl, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const res = await fetch(apiUrl);
      const json = await res.json();
      if (json && json.code === 0 && json.data) {
        return json;
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1250 * attempt));
      } else {
        throw new Error(json?.msg || "Video tidak ditemukan atau tautan bersifat privat.");
      }
    }
  }

  function handleProcessClick() {
    const now = Date.now();
    if (now - lastRequestTime < COOLDOWN_MS) {
      return showToast("Mohon tunggu sebentar sebelum memproses lagi", "error");
    }
    lastRequestTime = now;
    getTiktok();
  }

  async function getTiktok(customUrl = null) {
    const inputEl = document.getElementById("tiktokUrl");
    const rawText = customUrl || inputEl.value;
    const validUrl = extractTiktokUrl(rawText);
    const result = document.getElementById("result");
    const btn = document.getElementById("processBtn");

    if (!validUrl) {
      showToast("Masukkan tautan resmi TikTok (vt.tiktok.com / tiktok.com)", "error");
      inputEl.focus();
      return;
    }

    inputEl.value = validUrl;
    stopAudioPreview();
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memuat Data...';
    result.innerHTML = `
      <div class="status-box">
        <div class="loader-ring"></div>
        <p style="font-size:13px; color:var(--primary); font-weight:600;">Menghubungkan ke server media...</p>
      </div>
    `;

    try {
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(validUrl)}&hd=1`;
      const json = await fetchTikwmWithRetry(apiUrl, 3);
      populateAndRenderData(json.data, validUrl);
    } catch (err) {
      result.innerHTML = "";
      showToast(err.message || "Gagal memuat video. Pastikan tautan benar.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Ambil Video';
    }
  }

  function populateAndRenderData(data, sourceUrl = "") {
    const authorName = data.author?.nickname || "Kreator TikTok";
    const coverImg = data.origin_cover || data.ai_dynamic_cover || data.cover || "";
    const avatarImg = data.author?.avatar || coverImg || buildFallbackAvatar(authorName);

    currentMedia = {
      id: data.id || Date.now(),
      url: sourceUrl || `https://www.tiktok.com/@${data.author?.unique_id || "user"}/video/${data.id}`,
      title: data.title || "Video TikTok",
      play: data.play,
      hdplay: data.hdplay || data.play,
      wmplay: data.wmplay || data.play,
      music: data.music,
      musicTitle: data.music_info?.title || "Suara Asli",
      cover: coverImg,
      avatar: avatarImg,
      fallbackAvatar: buildFallbackAvatar(authorName),
      authorName: authorName,
      authorId: data.author?.unique_id || "tiktok",
      duration: data.duration || 0,
      size: data.size || 0,
      hdSize: data.hd_size || 0,
      region: data.region || "ID",
      createTime: data.create_time ? new Date(data.create_time * 1000).toLocaleDateString("id-ID") : "Terbaru",
      images: data.images || null,
      stats: {
        views: data.play_count,
        likes: data.digg_count,
        comments: data.comment_count,
        shares: data.share_count
      }
    };

    saveToHistory(currentMedia);
    renderMediaCard();
  }

  function toggleExtraTools(btnEl) {
    const wrapper = btnEl.closest(".extra-tools-accordion");
    if (wrapper) {
      wrapper.classList.toggle("open");
    }
  }

  // Render Kartu Hasil Media dengan Hirarki Tombol & Menu Accordion
  function renderMediaCard() {
    const m = currentMedia;
    const result = document.getElementById("result");
    const isSlide = Array.isArray(m.images) && m.images.length > 0;
    const { sdLabel, hdLabel } = getLogicalFileSizes(m.size, m.hdSize);

    let mediaPreview = "";
    if (isSlide) {
      const slides = m.images
        .map(
          (img, i) => `
        <div class="slide-item">
          <img src="${escapeHtml(img)}" referrerpolicy="no-referrer" alt="Slide ${i + 1}" loading="lazy">
          <button onclick="downloadSlide(${i}, this)">
            <i class="fa-solid fa-download"></i> Unduh Foto ${i + 1}
          </button>
        </div>
      `
        )
        .join("");
      mediaPreview = `
        <div class="slides-grid">${slides}</div>
      `;
    } else {
      mediaPreview = `
        <div class="video-stage" id="videoStage">
          <div class="video-poster-overlay" id="videoPosterOverlay" onclick="startMainVideo()">
            <img class="poster-bg" src="${escapeHtml(m.cover)}" referrerpolicy="no-referrer" alt="Cover Video" onerror="this.onerror=null; this.src='${escapeHtml(m.avatar)}';">
            <div class="play-trigger">
              <i class="fa-solid fa-play"></i>
            </div>
            <span class="poster-hint"><i class="fa-solid fa-circle-play"></i> Putar Pratinjau (${formatDuration(m.duration)})</span>
          </div>

          <video id="mainVideoPlayer" controls playsinline preload="metadata" crossorigin="anonymous">
            <source src="${escapeHtml(m.play)}" type="video/mp4">
            <source src="${escapeHtml(m.hdplay)}" type="video/mp4">
          </video>
        </div>
      `;
    }

    result.innerHTML = `
      <div class="result-card">
        <div class="creator-row">
          <div class="creator-profile">
            <img class="creator-avatar" src="${escapeHtml(m.avatar)}" referrerpolicy="no-referrer" alt="Avatar"
              onerror="this.onerror=null; this.src='${escapeHtml(m.cover || m.fallbackAvatar)}';"
              onclick="triggerAssetDownload('avatar', this)" title="Klik untuk mengunduh foto profil">
            <div class="creator-text">
              <h4>${escapeHtml(m.authorName)}</h4>
              <a href="https://www.tiktok.com/@${encodeURIComponent(m.authorId)}" target="_blank" rel="noopener noreferrer">
                @${escapeHtml(m.authorId)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i>
              </a>
            </div>
          </div>
          <button class="chip-btn" onclick="shareMedia()">
            <i class="fa-solid fa-share-nodes"></i> Bagikan
          </button>
        </div>

        <div class="meta-pills">
          <span class="meta-pill"><i class="fa-regular fa-clock"></i> ${formatDuration(m.duration)}</span>
          <span class="meta-pill"><i class="fa-solid fa-earth-asia"></i> ${escapeHtml(m.region)}</span>
          <span class="meta-pill"><i class="fa-regular fa-calendar"></i> ${m.createTime}</span>
          <span class="meta-pill"><i class="fa-solid fa-film"></i> ${isSlide ? m.images.length + " Slide" : "Video MP4"}</span>
        </div>

        ${mediaPreview}

        <div class="caption-box">
          <div class="caption-header">
            <svg class="svg-icon" style="width:14px;height:14px;" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Deskripsi & Hashtag</span>
          </div>
          <p class="caption-body">${formatCaptionWithHashtags(m.title)}</p>
        </div>

        <div class="audio-bar">
          <div class="audio-top">
            <div class="audio-info">
              <button class="audio-toggle" id="audioPlayBtn" onclick="toggleAudioPreview()">
                <i class="fa-solid fa-play"></i>
              </button>
              <div class="audio-meta-text">
                <span class="audio-name"><i class="fa-solid fa-music"></i> ${escapeHtml(m.musicTitle)}</span>
                <span class="audio-time" id="audioTimeLabel">Ketuk putar untuk pratinjau audio MP3</span>
              </div>
            </div>
            <div class="eq-bars" id="eqVisualizer">
              <div class="eq-bar"></div>
              <div class="eq-bar"></div>
              <div class="eq-bar"></div>
            </div>
          </div>
          <input type="range" id="audioSeekBar" class="audio-seek" min="0" max="100" value="0" style="display:none;" oninput="seekAudioPreview(this.value)">
        </div>

        <div class="stats-row">
          <div class="stat-cell"><i class="fa-solid fa-play"></i><span>${formatNum(m.stats.views)}</span></div>
          <div class="stat-cell"><i class="fa-solid fa-heart"></i><span>${formatNum(m.stats.likes)}</span></div>
          <div class="stat-cell"><i class="fa-solid fa-comment"></i><span>${formatNum(m.stats.comments)}</span></div>
          <div class="stat-cell"><i class="fa-solid fa-share"></i><span>${formatNum(m.stats.shares)}</span></div>
        </div>

        <!-- Hirarki Tombol Unduh Utama & Sekunder -->
        <div class="dl-hierarchy">
          ${
            isSlide
              ? `
            <button class="btn-cta-main" onclick="downloadAllSlides(this)">
              <i class="fa-solid fa-layer-group"></i> Unduh Semua Foto (${m.images.length} Slide)
            </button>
            <div class="dl-secondary-grid two-cols">
              <button class="btn-dl-sec" onclick="triggerAssetDownload('music', this)">
                <i class="fa-solid fa-music"></i> Musik MP3
              </button>
              <button class="btn-dl-sec" onclick="triggerAssetDownload('cover', this)">
                <i class="fa-regular fa-image"></i> Thumbnail
              </button>
            </div>
          `
              : `
            <button class="btn-cta-main" onclick="triggerAssetDownload('play', this)">
              <i class="fa-solid fa-download"></i> Unduh MP4 Tanpa Watermark ${sdLabel}
            </button>
            <div class="dl-secondary-grid">
              <button class="btn-dl-sec" onclick="triggerAssetDownload('hdplay', this)">
                <i class="fa-solid fa-bolt"></i> Unduh MP4 HD ${hdLabel}
              </button>
              <button class="btn-dl-sec" onclick="triggerAssetDownload('music', this)">
                <i class="fa-solid fa-music"></i> Musik MP3
              </button>
              <button class="btn-dl-sec" onclick="triggerAssetDownload('cover', this)">
                <i class="fa-regular fa-image"></i> Thumbnail
              </button>
            </div>
          `
          }
        </div>

        <!-- Menu Accordion: Opsi & Alat Tambahan -->
        <div class="extra-tools-accordion" id="extraToolsAccordion">
          <button type="button" class="accordion-trigger" onclick="toggleExtraTools(this)">
            <span class="accordion-trigger-left">
              <svg class="svg-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Opsi & Alat Tambahan
            </span>
            <svg class="svg-icon accordion-chevron" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div class="accordion-content">
            ${
              !isSlide
                ? `
              <span class="tools-group-label">Kontrol Pemutaran & Frame Video</span>
              <div class="tools-row">
                <div class="speed-group" style="display:inline-flex; gap:6px;">
                  <button class="chip-btn active" onclick="setVideoSpeed(1, this)">1x</button>
                  <button class="chip-btn" onclick="setVideoSpeed(1.5, this)">1.5x</button>
                  <button class="chip-btn" onclick="setVideoSpeed(2, this)">2x</button>
                </div>
                <button class="chip-btn" onclick="captureVideoFrame()">
                  <i class="fa-solid fa-camera"></i> Tangkap Frame
                </button>
                <button class="chip-btn" onclick="replayMainVideo()">
                  <i class="fa-solid fa-rotate-right"></i> Putar Ulang
                </button>
              </div>
            `
                : ""
            }

            <span class="tools-group-label">Utilitas Teks & Kode QR</span>
            <div class="tools-row">
              <button class="chip-btn" onclick="copyCaption(false)">
                <i class="fa-regular fa-copy"></i> Salin Caption
              </button>
              <button class="chip-btn" onclick="copyCaption(true)">
                <i class="fa-solid fa-hashtag"></i> Salin Hashtag
              </button>
              <button class="chip-btn" id="qrToggleBtn" onclick="toggleQrCode()">
                <i class="fa-solid fa-qrcode"></i> QR Code
              </button>
            </div>

            <div id="qrBox" class="qr-drawer">
              <div class="qr-preview-frame">
                <img id="qrImg" src="" crossorigin="anonymous" alt="QR Code">
              </div>
              <p style="font-size:11.5px; color:var(--text-sub); margin-bottom:4px;">
                Scan kode QR ini atau unduh gambarnya untuk dibagikan ke perangkat lain
              </p>
              <div class="qr-actions">
                <button class="btn-dl-sec" style="padding:8px 14px;" onclick="downloadQrCodeImage(this)">
                  <i class="fa-solid fa-download"></i> Unduh Gambar QR (PNG)
                </button>
                <button class="chip-btn" onclick="shareMedia()">
                  <i class="fa-regular fa-copy"></i> Salin Link Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const vid = document.getElementById("mainVideoPlayer");
    if (vid) {
      vid.addEventListener("play", () => {
        stopAudioPreview();
        const ov = document.getElementById("videoPosterOverlay");
        if (ov) ov.classList.add("hidden");
      });
      vid.addEventListener("error", () => {
        if (vid.src !== m.wmplay && m.wmplay) {
          vid.src = m.wmplay;
        }
      });
    }
  }

  function startMainVideo() {
    const vid = document.getElementById("mainVideoPlayer");
    const ov = document.getElementById("videoPosterOverlay");
    if (ov) ov.classList.add("hidden");
    if (vid) {
      stopAudioPreview();
      vid.play().catch(() => {
        vid.controls = true;
      });
    }
  }

  function replayMainVideo() {
    const vid = document.getElementById("mainVideoPlayer");
    if (!vid) return;
    vid.currentTime = 0;
    startMainVideo();
  }

  function setVideoSpeed(rate, btnEl) {
    const vid = document.getElementById("mainVideoPlayer");
    if (!vid) return;
    vid.playbackRate = rate;
    document.querySelectorAll(".speed-group .chip-btn").forEach((b) => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    showToast(`Kecepatan video: ${rate}x`);
  }

  function captureVideoFrame() {
    const vid = document.getElementById("mainVideoPlayer");
    if (!vid || !currentMedia) return;
    try {
      if (vid.readyState < 2) {
        return triggerAssetDownload("cover", null);
      }
      const canvas = document.createElement("canvas");
      canvas.width = vid.videoWidth || 720;
      canvas.height = vid.videoHeight || 1280;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return triggerAssetDownload("cover", null);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Frame_${currentMedia.authorId}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        showToast("Frame video berhasil disimpan!");
      }, "image/png");
    } catch (e) {
      triggerAssetDownload("cover", null);
    }
  }

  // FYP Trending Indonesia (Bebas Bug Tombol Hantu)
  async function loadTrendingVideos() {
    const box = document.getElementById("trendingResults");
    const statusBox = document.getElementById("trendingStatus");
    const btn = document.getElementById("trendBtn");

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memuat FYP Indonesia...';
    box.innerHTML = "";
    statusBox.innerHTML = '<p style="font-size:12.5px; color:var(--primary); padding:18px 8px; text-align:center;">Mengambil daftar video populer...</p>';

    try {
      const json = await fetchTikwmWithRetry(`https://www.tikwm.com/api/feed/list?region=ID&count=10`, 3);
      const videos = Array.isArray(json.data) ? json.data : [];
      feedCache = videos;
      statusBox.innerHTML = "";

      if (videos.length === 0) {
        statusBox.innerHTML = '<p style="font-size:12.5px; color:var(--text-sub); padding:18px 8px; text-align:center;">Tidak ada video FYP yang tersedia saat ini.</p>';
        return;
      }

      box.innerHTML = videos
        .map(
          (v, idx) => `
        <div class="feed-item">
          <div class="feed-cover">
            <img src="${escapeHtml(v.origin_cover || v.cover)}" referrerpolicy="no-referrer" alt="Cover" loading="lazy">
            <span class="feed-badge"><i class="fa-solid fa-play"></i> ${formatNum(v.play_count)}</span>
          </div>
          <div class="feed-info">
            <div>
              <div class="feed-user">@${escapeHtml(v.author?.unique_id || "tiktok")}</div>
              <div class="feed-desc">${escapeHtml(v.title || "Video TikTok")}</div>
            </div>
            <button type="button" class="btn-dl-sec" style="width:100%; padding:8px; font-size:11.5px;" onclick="selectFromFeed(${idx})">
              <i class="fa-solid fa-download"></i> Pilih Video
            </button>
          </div>
        </div>
      `
        )
        .join("");
    } catch (e) {
      box.innerHTML = "";
      statusBox.innerHTML = '<p style="font-size:12.5px; color:var(--text-sub); padding:18px 8px; text-align:center;">Server sedang sibuk. Klik tombol di atas untuk memuat ulang.</p>';
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Segarkan Video FYP Indonesia';
    }
  }

  function selectFromFeed(idx) {
    const item = feedCache[idx];
    if (!item) return;
    document.getElementById("tabBtnDownload").click();
    populateAndRenderData(item);
    document.getElementById("result").scrollIntoView({ behavior: "smooth" });
  }

  function toggleAudioPreview() {
    if (!currentMedia || !currentMedia.music) return;
    const btn = document.getElementById("audioPlayBtn");
    const eq = document.getElementById("eqVisualizer");
    const seek = document.getElementById("audioSeekBar");
    const timeLabel = document.getElementById("audioTimeLabel");

    const vid = document.getElementById("mainVideoPlayer");
    if (vid && !vid.paused) vid.pause();

    if (!previewAudio) {
      previewAudio = new Audio(currentMedia.music);
      previewAudio.addEventListener("timeupdate", () => {
        if (!previewAudio || !previewAudio.duration) return;
        const pct = (previewAudio.currentTime / previewAudio.duration) * 100;
        if (seek) {
          seek.style.display = "block";
          seek.value = pct;
        }
        if (timeLabel) {
          timeLabel.textContent = `${formatDuration(previewAudio.currentTime)} / ${formatDuration(previewAudio.duration)}`;
        }
      });
      previewAudio.onended = () => stopAudioPreview();
    }

    if (previewAudio.paused) {
      previewAudio
        .play()
        .then(() => {
          btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          eq.classList.add("playing");
        })
        .catch(() => showToast("Audio tidak dapat diputar langsung", "error"));
    } else {
      previewAudio.pause();
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (eq) eq.classList.remove("playing");
    }
  }

  function seekAudioPreview(val) {
    if (previewAudio && previewAudio.duration) {
      previewAudio.currentTime = (val / 100) * previewAudio.duration;
    }
  }

  function stopAudioPreview() {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio = null;
    }
    const btn = document.getElementById("audioPlayBtn");
    const eq = document.getElementById("eqVisualizer");
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (eq) eq.classList.remove("playing");
  }

  function copyCaption(onlyTags = false) {
    if (!currentMedia) return;
    let text = currentMedia.title || "";
    if (onlyTags) {
      const tags = text.match(/#[\w\u00C0-\u017F]+/g);
      if (!tags || tags.length === 0) return showToast("Tidak ditemukan hashtag", "error");
      text = tags.join(" ");
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast(onlyTags ? "Semua hashtag berhasil disalin" : "Caption berhasil disalin");
    });
  }

  function toggleQrCode() {
    if (!currentMedia) return;
    const box = document.getElementById("qrBox");
    const img = document.getElementById("qrImg");
    const btn = document.getElementById("qrToggleBtn");
    const accordion = document.getElementById("extraToolsAccordion");

    if (accordion && !accordion.classList.contains("open")) {
      accordion.classList.add("open");
    }

    if (box.style.display === "block") {
      box.style.display = "none";
      if (btn) btn.classList.remove("active");
    } else {
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(currentMedia.url)}`;
      box.style.display = "block";
      if (btn) btn.classList.add("active");
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  async function downloadQrCodeImage(btnEl) {
    if (!currentMedia) return;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(currentMedia.url)}`;
    const filename = `QR_KevnaiMedia_${currentMedia.authorId}_${currentMedia.id}.png`;
    const origHtml = btnEl ? btnEl.innerHTML : "";

    try {
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan QR...';
      }

      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      const canvas = document.createElement("canvas");
      canvas.width = 460;
      canvas.height = 520;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0b1124";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(30, 30, 400, 400);
      ctx.drawImage(bitmap, 30, 30, 400, 400);

      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`@${currentMedia.authorId}`, canvas.width / 2, 465);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 14px sans-serif";
      ctx.fillText("kevnaimedia.my.id • TikTok Downloader", canvas.width / 2, 492);

      canvas.toBlob((finalBlob) => {
        const blobUrl = URL.createObjectURL(finalBlob || blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        showToast("Gambar QR Code berhasil diunduh!");
      }, "image/png");
    } catch (e) {
      streamDownload(qrApiUrl, filename, btnEl);
    } finally {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = origHtml;
      }
    }
  }

  async function shareMedia() {
    if (!currentMedia) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: currentMedia.authorName, text: currentMedia.title, url: currentMedia.url });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(currentMedia.url);
      showToast("Tautan video disalin");
    }
  }

  async function shareWebApp() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "KevnaiMedia — TikTok Downloader",
          text: "Unduh video TikTok tanpa watermark & musik MP3 gratis di KevnaiMedia!",
          url: shareUrl
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Tautan website berhasil disalin untuk dibagikan!");
    }
  }

  function triggerAssetDownload(type, btnEl) {
    if (!currentMedia) return;
    const base = ("KevnaiMedia_" + currentMedia.authorId + "_" + currentMedia.id).replace(/[^a-zA-Z0-9_-]/g, "");
    if (type === "play") streamDownload(currentMedia.play, `${base}_NoWM.mp4`, btnEl);
    else if (type === "hdplay") streamDownload(currentMedia.hdplay, `${base}_HD.mp4`, btnEl);
    else if (type === "music") streamDownload(currentMedia.music, `${base}_Audio.mp3`, btnEl);
    else if (type === "cover") streamDownload(currentMedia.cover, `${base}_Thumbnail.jpg`, btnEl);
    else if (type === "avatar") streamDownload(currentMedia.avatar, `${base}_Avatar.jpg`, btnEl);
  }

  function downloadSlide(idx, btnEl) {
    if (!currentMedia || !currentMedia.images?.[idx]) return;
    streamDownload(currentMedia.images[idx], `KevnaiMedia_Slide_${idx + 1}.jpg`, btnEl);
  }

  async function downloadAllSlides(btnEl) {
    if (!currentMedia || !Array.isArray(currentMedia.images)) return;
    btnEl.disabled = true;
    for (let i = 0; i < currentMedia.images.length; i++) {
      btnEl.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Mengunduh (${i + 1}/${currentMedia.images.length})...`;
      await streamDownload(currentMedia.images[i], `KevnaiMedia_Slide_${i + 1}.jpg`, null);
    }
    btnEl.disabled = false;
    btnEl.innerHTML = `<i class="fa-solid fa-check"></i> Semua Slide Terunduh`;
  }

  async function streamDownload(fileUrl, filename, btnEl) {
    const origHtml = btnEl ? btnEl.innerHTML : "";
    const card = document.getElementById("dlProgressCard");
    const fill = document.getElementById("dlProgressFill");
    const pct = document.getElementById("dlProgressPct");
    const label = document.getElementById("dlProgressLabel");

    try {
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Mengunduh...`;
      }
      card.style.display = "block";
      fill.style.width = "0%";
      pct.textContent = "0%";
      label.textContent = `Mengunduh ${filename}...`;

      const response = await fetch(fileUrl, { referrerPolicy: "no-referrer" });
      if (!response.ok) throw new Error("Stream error");

      const total = parseInt(response.headers.get("content-length") || "0", 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total > 0) {
          const p = Math.min(100, Math.round((loaded / total) * 100));
          fill.style.width = p + "%";
          pct.textContent = `${p}% (${formatBytes(loaded)})`;
        } else {
          fill.style.width = "80%";
          pct.textContent = formatBytes(loaded);
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 6000);

      incrementDownloadCount();
      showToast(`Selesai: ${filename}`);
    } catch (e) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      showToast("Membuka file di tab baru...");
    } finally {
      setTimeout(() => {
        card.style.display = "none";
      }, 1000);
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = origHtml;
      }
    }
  }

  function incrementDownloadCount() {
    const c = parseInt(localStorage.getItem("tt_royale_dl_count") || "0", 10) + 1;
    localStorage.setItem("tt_royale_dl_count", c);
    updateStatsUI();
  }

  function updateStatsUI() {
    const dl = localStorage.getItem("tt_royale_dl_count") || "0";
    const hist = JSON.parse(localStorage.getItem("tt_royale_history") || "[]");
    document.getElementById("statDownloads").textContent = dl;
    document.getElementById("statHistory").textContent = hist.length;
  }

  function saveToHistory(item) {
    try {
      let list = JSON.parse(localStorage.getItem("tt_royale_history") || "[]");
      list = list.filter((x) => x.id !== item.id);
      list.unshift({
        id: item.id,
        url: item.url,
        cover: item.cover,
        avatar: item.avatar,
        authorId: item.authorId || "tiktok"
      });
      if (list.length > 10) list.pop();
      localStorage.setItem("tt_royale_history", JSON.stringify(list));
      renderHistory();
      updateStatsUI();
    } catch (e) {}
  }

  function renderHistory() {
    const section = document.getElementById("historySection");
    const listEl = document.getElementById("historyList");
    try {
      const list = JSON.parse(localStorage.getItem("tt_royale_history") || "[]");
      if (list.length === 0) {
        section.style.display = "none";
        return;
      }
      section.style.display = "block";
      listEl.innerHTML = list
        .map(
          (item, idx) => `
        <div class="history-card" onclick="reloadHistoryItem(${idx})" title="Muat ulang @${escapeHtml(item.authorId)}">
          <button class="history-del-single" onclick="deleteSingleHistory(event, ${idx})" title="Hapus">×</button>
          <img src="${escapeHtml(item.cover)}" referrerpolicy="no-referrer" alt="Riwayat" onerror="this.onerror=null; this.src='${escapeHtml(item.avatar || "")}';">
          <div class="history-card-label">@${escapeHtml(item.authorId || "video")}</div>
        </div>
      `
        )
        .join("");
    } catch (e) {
      section.style.display = "none";
    }
  }

  function reloadHistoryItem(idx) {
    const list = JSON.parse(localStorage.getItem("tt_royale_history") || "[]");
    if (!list[idx]) return;
    document.getElementById("tabBtnDownload").click();
    document.getElementById("tiktokUrl").value = list[idx].url;
    getTiktok(list[idx].url);
  }

  function deleteSingleHistory(e, idx) {
    e.stopPropagation();
    let list = JSON.parse(localStorage.getItem("tt_royale_history") || "[]");
    list.splice(idx, 1);
    localStorage.setItem("tt_royale_history", JSON.stringify(list));
    renderHistory();
    updateStatsUI();
  }

  function clearHistory() {
    localStorage.removeItem("tt_royale_history");
    renderHistory();
    updateStatsUI();
    showToast("Semua riwayat dihapus");
  }

  function resetAll() {
    stopAudioPreview();
    document.getElementById("tiktokUrl").value = "";
    document.getElementById("result").innerHTML = "";
    currentMedia = null;
    showToast("Kolom dibersihkan");
  }

  // 5. Ekspos Seluruh Fungsi ke Window
  Object.assign(window, {
    setTheme,
    toggleFullScreen,
    switchTab,
    pasteClipboard,
    handleProcessClick,
    resetAll,
    loadTrendingVideos,
    selectFromFeed,
    startMainVideo,
    replayMainVideo,
    setVideoSpeed,
    captureVideoFrame,
    toggleAudioPreview,
    seekAudioPreview,
    copyCaption,
    copySingleTag,
    toggleQrCode,
    downloadQrCodeImage,
    shareMedia,
    shareWebApp,
    triggerAssetDownload,
    downloadSlide,
    downloadAllSlides,
    reloadHistoryItem,
    deleteSingleHistory,
    clearHistory,
    toggleExtraTools
  });

  // Inisialisasi Awal
  const savedTheme = localStorage.getItem("tt_royale_theme") || "cyan";
  setTheme(savedTheme);
  updateStatsUI();
  renderHistory();
})();
