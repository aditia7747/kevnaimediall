(function () {
  "use strict";

  const DIRECT_BASE = "https://api.iroha-api.web.id";
  const FALLBACK_KEY = "iroha_267d3ed4b6d2afa34b83e7aa6747ee35bd29c9d7eea10cd6";

  const ROUTES = {
    aio: { path: "/", title: "All-in-One Downloader", icon: "fa-wand-magic-sparkles", hint: "Tempel link TikTok, IG Reel, YouTube, FB, X/Twitter, atau Reddit..." },
    tiktok: { path: "/tiktokdownloaders", title: "TikTok Downloader", icon: "fab fa-tiktok", hint: "Tempel tautan video atau musik TikTok di sini..." },
    ig: { path: "/igdownloaders", title: "Instagram Downloader", icon: "fab fa-instagram", hint: "Tempel tautan Instagram Reels atau Postingan..." },
    fb: { path: "/fbdownloaders", title: "Facebook Downloader", icon: "fab fa-facebook", hint: "Tempel tautan video Facebook (fb.watch / share)..." },
    ytmp4: { path: "/ytmp4", title: "YouTube MP4 Downloader", icon: "fab fa-youtube", hint: "Tempel tautan video YouTube untuk diunduh ke MP4..." },
    ytmp3: { path: "/ytmp3", title: "YouTube ke MP3", icon: "fa-solid fa-headphones", hint: "Ketik judul lagu atau tempel link YouTube..." },
    spotify: { path: "/spotify", title: "Spotify MP3 Downloader", icon: "fab fa-spotify", hint: "Ketik judul lagu/artis atau tempel link track Spotify..." },
    twitter: { path: "/twitter", title: "Twitter/X & Reddit Downloader", icon: "fab fa-x-twitter", hint: "Tempel tautan video Twitter (X) atau Reddit..." }
  };

  let activeRoute = "aio";
  let selectedBitrate = "320";
  let currentMedia = null;
  let timerInterval = null;

  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function extractUrl(raw) {
    if (!raw) return "";
    const m = raw.match(/https?:\/\/[^\s"'<>]+/i);
    return m ? m[0] : "";
  }

  function detectPlatformFromUrl(url) {
    const u = (url || "").toLowerCase();
    if (u.includes("tiktok.com") || u.includes("douyin.com")) return "tiktok";
    if (u.includes("instagram.com") || u.includes("instagr.am")) return "ig";
    if (u.includes("facebook.com") || u.includes("fb.watch") || u.includes("fb.com")) return "fb";
    if (u.includes("spotify.com")) return "spotify";
    if (u.includes("youtube.com") || u.includes("youtu.be")) {
      return activeRoute === "ytmp3" ? "ytmp3" : "ytmp4";
    }
    if (u.includes("twitter.com") || u.includes("x.com") || u.includes("reddit.com")) return "twitter";
    return null;
  }

  function formatNumber(n) {
    const num = Number(n);
    if (!num || isNaN(num)) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return String(num);
  }

  // Dual-Mode Fetcher: Vercel Serverless (/api/iroha) + Fallback Direct Localhost
  async function irohaFetch(apiPath) {
    try {
      const res = await fetch("/api/iroha?path=" + encodeURIComponent(apiPath));
      const cType = res.headers.get("content-type") || "";
      if (res.ok && cType.includes("json")) {
        return await res.json();
      }
    } catch (e) {}

    const sep = apiPath.includes("?") ? "&" : "?";
    const directUrl = DIRECT_BASE + apiPath + sep + "apikey=" + FALLBACK_KEY;
    const directRes = await fetch(directUrl, { headers: { "X-API-Key": FALLBACK_KEY } });
    if (!directRes.ok) throw new Error("HTTP " + directRes.status);
    return await directRes.json();
  }

  // =========================================================================
  // KONTROLER KARAKTER 3D INTERAKTIF (BERGERAK SAAT DIPENCET / SENTUH)
  // =========================================================================
  function setMascotState(state, titleText, subText) {
    const bot = document.getElementById("bot3dWrap");
    const h3 = document.getElementById("mascotTitle");
    const p = document.getElementById("mascotDesc");
    if (h3 && titleText) h3.textContent = titleText;
    if (p && subText) p.textContent = subText;
    if (!bot) return;

    bot.classList.remove("react-click", "react-busy", "react-happy", "react-error");
    if (state === "click") {
      bot.classList.add("react-click");
      setTimeout(function () { bot.classList.remove("react-click"); }, 450);
    } else if (state === "busy") {
      bot.classList.add("react-busy");
    } else if (state === "happy") {
      bot.classList.add("react-happy");
      setTimeout(function () { bot.classList.remove("react-happy"); }, 800);
    } else if (state === "error") {
      bot.classList.add("react-error");
      setTimeout(function () { bot.classList.remove("react-error"); }, 1500);
    }
  }

  function initMascotPhysics() {
    document.addEventListener("pointermove", function (e) {
      const bot = document.getElementById("bot3dWrap");
      if (!bot) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * -18;
      bot.style.transform = "rotateY(" + x + "deg) rotateX(" + y + "deg)";
      document.querySelectorAll(".bot-eye").forEach(function (eye) {
        eye.style.transform = "translate(" + (x * 0.25) + "px, " + (y * -0.2) + "px)";
      });
    });

    document.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button, a, .route-pill, .bot-3d-wrap")) {
        setMascotState("click");
      }
    });
  }

  function showToast(msg) {
    const old = document.getElementById("kmToast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.id = "kmToast";
    el.className = "toast-float";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  // =========================================================================
  // ROUTER URL BOLAK-BALIK (/tiktokdownloaders, /igdownloaders, dll.)
  // =========================================================================
  function resolveRouteFromLocation() {
    const p = window.location.pathname.toLowerCase();
    if (p.includes("tiktok")) return "tiktok";
    if (p.includes("ig")) return "ig";
    if (p.includes("fb")) return "fb";
    if (p.includes("ytmp4")) return "ytmp4";
    if (p.includes("ytmp3")) return "ytmp3";
    if (p.includes("spotify")) return "spotify";
    if (p.includes("twitter")) return "twitter";
    return "aio";
  }

  function switchRoute(routeKey, pushUrl) {
    const cfg = ROUTES[routeKey] || ROUTES.aio;
    activeRoute = routeKey in ROUTES ? routeKey : "aio";

    if (pushUrl !== false) {
      try {
        window.history.pushState({ route: activeRoute }, "", cfg.path);
      } catch (e) {}
    }

    document.title = cfg.title + " — KevnaiMedia";
    document.querySelectorAll(".route-pill").forEach(function (el) {
      el.classList.toggle("active", el.dataset.route === activeRoute);
    });

    const inp = document.getElementById("mainInput");
    const icon = document.getElementById("leadIcon");
    const qBar = document.getElementById("ytQualityBar");

    if (inp) inp.placeholder = cfg.hint;
    if (icon) icon.className = cfg.icon + " lead-icon";
    if (qBar) qBar.style.display = activeRoute === "ytmp3" ? "flex" : "none";

    setMascotState("click", cfg.title, "Siap memproses tautan atau pencarianmu di mode " + cfg.title + ".");
  }

  window.addEventListener("popstate", function () {
    switchRoute(resolveRouteFromLocation(), false);
  });

  // =========================================================================
  // RENDER KERANGKA UTAMA APLIKASI
  // =========================================================================
  function renderAppShell() {
    let app = document.getElementById("app");
    if (!app) {
      app = document.createElement("div");
      app.id = "app";
      document.body.appendChild(app);
    }

    const pillsHTML = Object.keys(ROUTES)
      .map(function (key) {
        const r = ROUTES[key];
        const shortName = key === "aio" ? "All-in-One" : key === "tiktok" ? "TikTok" : key === "ig" ? "Instagram" : key === "fb" ? "Facebook" : key === "ytmp4" ? "YT MP4" : key === "ytmp3" ? "YT MP3" : key === "spotify" ? "Spotify" : "Twitter/X";
        return `
          <button type="button" class="route-pill" data-route="${key}" onclick="switchRoute('${key}', true)">
            <i class="${r.icon}"></i>
            <span>${shortName}</span>
          </button>
        `;
      })
      .join("");

    app.innerHTML = `
      <div class="shell">
        <header class="top-nav">
          <div class="brand" onclick="switchRoute('aio', true)">
            <i class="fa-solid fa-cube"></i> KevnaiMedia
          </div>
          <div class="top-controls">
            <div class="theme-pill active" id="pillCyan" style="background:#00e5ff;" onclick="setTheme('cyan')"></div>
            <div class="theme-pill" id="pillGold" style="background:#fbbf24;" onclick="setTheme('gold')"></div>
          </div>
        </header>

        <!-- Karakter 3D Interaktif -->
        <section class="mascot-stage" onclick="pokeMascot()">
          <div class="bot-3d-wrap" id="bot3dWrap" title="Sentuh aku!">
            <div class="bot-head">
              <div class="bot-antenna"></div>
              <div class="bot-visor">
                <div class="bot-eye"></div>
                <div class="bot-eye"></div>
              </div>
            </div>
          </div>
          <div class="mascot-speech">
            <h3 id="mascotTitle">Halo! Selamat Datang di KevnaiMedia</h3>
            <p id="mascotDesc">Pilih platform di bawah atau langsung tempel tautan video untuk diunduh tanpa watermark.</p>
          </div>
        </section>

        <!-- Menu Pindah Link Platform -->
        <nav class="route-grid">${pillsHTML}</nav>

        <!-- Kartu Utama Input & Hasil -->
        <main class="card-3d-fluid">
          <div class="input-box-3d">
            <i class="fa-solid fa-wand-magic-sparkles lead-icon" id="leadIcon"></i>
            <input type="text" id="mainInput" class="input-fluid" placeholder="Tempel tautan atau ketik judul lagu..." autocomplete="off" spellcheck="false">
            <button type="button" class="btn-paste" onclick="pasteFromClipboard()">
              <i class="fa-regular fa-paste"></i> Tempel
            </button>
          </div>

          <!-- Pilihan Bitrate Audio (Muncul di /ytmp3) -->
          <div class="quality-bar" id="ytQualityBar" style="display:none;">
            <span style="font-size:12px; color:var(--text-sub); font-weight:600;">Kualitas Audio MP3:</span>
            <div style="display:flex; gap:5px;">
              <button type="button" class="q-chip" onclick="setBitrate('128', this)">128kbps</button>
              <button type="button" class="q-chip" onclick="setBitrate('192', this)">192kbps</button>
              <button type="button" class="q-chip active" onclick="setBitrate('320', this)">320kbps HD</button>
            </div>
          </div>

          <div class="action-grid">
            <button type="button" id="submitBtn" class="btn-3d-main" onclick="processInput()">
              <i class="fa-solid fa-bolt"></i> Proses Sekarang
            </button>
            <button type="button" class="btn-3d-sub" onclick="clearWorkspace()" title="Bersihkan">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          </div>

          <div id="resultArea"></div>

          <div id="historyBox" style="display:none; margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:12.5px; font-weight:700; color:var(--text-sub);"><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Terakhir</span>
              <button type="button" class="q-chip" style="color:#fb7185;" onclick="clearHistory()">Hapus</button>
            </div>
            <div id="historyStrip" class="history-strip"></div>
          </div>
        </main>

        <!-- Panduan & Informasi Website -->
        <section class="guide-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:12px; font-weight:800; color:var(--primary); text-transform:uppercase;">Tentang &amp; Cara Penggunaan</span>
            <button type="button" class="q-chip" onclick="shareWebsite()"><i class="fa-solid fa-share-nodes"></i> Bagikan Web</button>
          </div>
          <p style="font-size:12.5px; color:var(--text-sub); line-height:1.55; margin-bottom:12px;">
            <strong style="color:#fff;">KevnaiMedia</strong> memudahkan pengunduhan video MP4 tanpa watermark dan musik MP3 dari TikTok, Instagram, Facebook, YouTube, Spotify, hingga Twitter/X secara langsung dari browser.
          </p>
          <div class="step-row">
            <div class="step-badge">1</div>
            <div style="font-size:12px;">Salin tautan postingan dari aplikasi sosial media atau ketik judul lagu pada mode Spotify / YT MP3.</div>
          </div>
          <div class="step-row">
            <div class="step-badge">2</div>
            <div style="font-size:12px;">Ketuk tombol <b>Tempel</b> lalu tekan <b>Proses Sekarang</b>. Sistem otomatis memilih server tercepat.</div>
          </div>
          <div class="step-row">
            <div class="step-badge">3</div>
            <div style="font-size:12px;">Putar pratinjau media atau langsung unduh file MP4 HD, MP3, maupun kode QR ke perangkatmu.</div>
          </div>
        </section>
      </div>
    `;

    document.getElementById("mainInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") processInput();
    });
  }

  function pokeMascot() {
    const greetings = [
      "Tempel tautan apa saja, biar aku bantu ambilkan videonya!",
      "Mau cari lagu MP3? Pilih tab Spotify atau YT MP3 di bawahku!",
      "Semua unduhan bebas watermark dan langsung tersimpan rapi."
    ];
    const pick = greetings[Math.floor(Math.random() * greetings.length)];
    setMascotState("happy", "KevnBot Siap Membantu!", pick);
  }

  function setBitrate(kbps, btnEl) {
    selectedBitrate = kbps;
    document.querySelectorAll("#ytQualityBar .q-chip").forEach(function (b) { b.classList.remove("active"); });
    if (btnEl) btnEl.classList.add("active");
    showToast("Kualitas audio diatur ke " + kbps + "kbps");
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return showToast("Clipboard kosong");
      const url = extractUrl(text) || text.trim();
      document.getElementById("mainInput").value = url;
      const detected = detectPlatformFromUrl(url);
      if (detected) switchRoute(detected, true);
      setMascotState("click", "Tautan Diterima!", "Tekan Proses Sekarang untuk mulai mengunduh.");
    } catch (e) {
      showToast("Tekan tahan pada kolom untuk menempel");
    }
  }

  // =========================================================================
  // ENGINE UTAMA PEMROSESAN MULTI-ENDPOINT (/v1/aio + ENDPOINT SPESIFIK)
  // =========================================================================
  async function processInput(overrideVal) {
    const inp = document.getElementById("mainInput");
    const raw = (overrideVal !== undefined ? overrideVal : inp.value).trim();
    const btn = document.getElementById("submitBtn");
    const area = document.getElementById("resultArea");

    if (!raw) {
      setMascotState("error", "Kolom Masih Kosong", "Tempelkan tautan atau ketik judul lagu terlebih dahulu ya.");
      inp.focus();
      return;
    }

    const extractedUrl = extractUrl(raw);
    const detectedPlat = detectPlatformFromUrl(extractedUrl);

    if (detectedPlat && activeRoute !== detectedPlat && activeRoute !== "aio") {
      switchRoute(detectedPlat, true);
    }

    btn.disabled = true;
    let sec = 0;
    clearInterval(timerInterval);
    setMascotState("busy", "Sedang Menghubungkan ke Server...", "Mohon tunggu sebentar, media sedang disiapkan.");

    area.innerHTML = `
      <div class="result-panel" style="text-align:center; padding:26px;">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:28px; color:var(--primary); margin-bottom:10px;"></i>
        <p style="font-size:13.5px; font-weight:700; color:var(--primary);">Mengambil data media (<span id="secCounter">0</span> dtk)...</p>
        <p style="font-size:11.5px; color:var(--text-sub); margin-top:4px;">Konversi video HD memerlukan waktu sekitar 5-30 detik.</p>
      </div>
    `;
    timerInterval = setInterval(function () {
      sec++;
      const el = document.getElementById("secCounter");
      if (el) el.textContent = sec;
    }, 1000);

    try {
      const targetMode = detectedPlat || activeRoute;

      // 1. Mode Spotify (Search Judul atau Download URL Track)
      if (targetMode === "spotify" || (!extractedUrl && activeRoute === "spotify")) {
        if (extractedUrl && extractedUrl.includes("spotify.com")) {
          const spDl = await irohaFetch("/v1/spotify?action=download&url=" + encodeURIComponent(extractedUrl));
          renderSpotifyTrackCard(spDl?.data || spDl);
        } else {
          const spSearch = await irohaFetch("/v1/spotify?action=search&q=" + encodeURIComponent(raw));
          renderSpotifySearchResults(spSearch?.data || spSearch);
        }
      }
      // 2. Mode YouTube ke MP3 (/v1/yt/s/play)
      else if (targetMode === "ytmp3" || (!extractedUrl && activeRoute !== "spotify")) {
        const ytMp3 = await irohaFetch("/v1/yt/s/play?query=" + encodeURIComponent(raw) + "&quality=" + encodeURIComponent(selectedBitrate));
        renderYtMp3Card(ytMp3?.data || ytMp3);
      }
      // 3. Mode TikTok (/v1/tt dengan Fallback /v1/aio)
      else if (targetMode === "tiktok") {
        try {
          const ttJson = await irohaFetch("/v1/tt?url=" + encodeURIComponent(extractedUrl));
          if (!ttJson?.data) throw new Error("Fallback AIO");
          renderTiktokCard(ttJson.data, extractedUrl);
        } catch (e) {
          const aioTt = await irohaFetch("/v1/aio?url=" + encodeURIComponent(extractedUrl));
          renderAioCard(aioTt, extractedUrl, "TikTok");
        }
      }
      // 4. Mode Facebook (/v1/fbdown dengan Fallback /v1/aio)
      else if (targetMode === "fb") {
        try {
          const fbJson = await irohaFetch("/v1/fbdown?url=" + encodeURIComponent(extractedUrl));
          if (!fbJson?.data) throw new Error("Fallback AIO");
          renderFacebookCard(fbJson.data, extractedUrl);
        } catch (e) {
          const aioFb = await irohaFetch("/v1/aio?url=" + encodeURIComponent(extractedUrl));
          renderAioCard(aioFb, extractedUrl, "Facebook");
        }
      }
      // 5. Mode YouTube MP4 (/v1/ytmp4 dengan Fallback /v1/aio)
      else if (targetMode === "ytmp4") {
        try {
          const ytJson = await irohaFetch("/v1/ytmp4?url=" + encodeURIComponent(extractedUrl));
          if (!ytJson?.data?.url) throw new Error("Fallback AIO");
          renderYtMp4Card(ytJson.data, extractedUrl);
        } catch (e) {
          const aioYt = await irohaFetch("/v1/aio?url=" + encodeURIComponent(extractedUrl));
          renderAioCard(aioYt, extractedUrl, "YouTube MP4");
        }
      }
      // 6. Mode Instagram, Twitter/X, Reddit & All-in-One (/v1/aio)
      else {
        const aioJson = await irohaFetch("/v1/aio?url=" + encodeURIComponent(extractedUrl));
        renderAioCard(aioJson, extractedUrl, targetMode.toUpperCase());
      }

      setMascotState("happy", "Media Berhasil Ditemukan!", "Silakan putar pratinjaunya atau pilih tombol format unduhan di bawah.");
    } catch (err) {
      area.innerHTML = "";
      setMascotState("error", "Gagal Memproses Media", "Pastikan tautan berstatus publik atau coba lagi beberapa saat.");
      showToast("Gagal memproses tautan. Coba periksa kembali link kamu.");
    } finally {
      clearInterval(timerInterval);
      btn.disabled = false;
    }
  }

  // Render Kartu TikTok (/v1/tt)
  function renderTiktokCard(d, sourceUrl) {
    const videoUrl = d.videoUrl || d.play || "";
    const hdUrl = d.videoUrlHd || d.hdplay || videoUrl;
    const musicUrl = d.music || "";
    const authorName = d.author?.nickname || "Kreator TikTok";
    const authorUser = (d.author?.username || d.author?.unique_id || "tiktok").replace(/^@/, "");
    const cover = d.cover || d.origin_cover || d.author?.avatar || "https://ui-avatars.com/api/?name=TT&background=131c36&color=00e5ff";

    currentMedia = { url: sourceUrl, video: videoUrl, hd: hdUrl, music: musicUrl, title: d.title || "Video TikTok", cover: cover };
    saveHistoryItem({ label: "TikTok", url: sourceUrl, cover: cover });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <div class="media-head">
          <div class="author-wrap">
            <img src="${escapeHTML(cover)}" alt="" referrerpolicy="no-referrer">
            <div>
              <h4>${escapeHTML(authorName)}</h4>
              <span>@${escapeHTML(authorUser)} &bull; ${formatNumber(d.playCount || 0)} tayangan</span>
            </div>
          </div>
          <button type="button" class="q-chip" onclick="toggleQrDrawer()"><i class="fa-solid fa-qrcode"></i> QR</button>
        </div>

        <div class="video-frame">
          <div class="cover-overlay" id="vidOverlay" onclick="playPreviewVideo()">
            <img src="${escapeHTML(cover)}" alt="" referrerpolicy="no-referrer">
            <div class="play-orb"><i class="fa-solid fa-play"></i></div>
          </div>
          <video id="previewVideoEl" controls playsinline preload="metadata" src="${escapeHTML(videoUrl)}"></video>
        </div>

        <p style="font-size:12.5px; color:#e2e8f0; margin-bottom:10px;">${escapeHTML(d.title || "")}</p>

        <div class="dl-buttons">
          <button type="button" class="btn-3d-main span-2" onclick="startDownload('video', 'TikTok_NoWM.mp4')">
            <i class="fa-solid fa-download"></i> Unduh MP4 Tanpa Watermark
          </button>
          <button type="button" class="btn-3d-sub" onclick="startDownload('hd', 'TikTok_HD.mp4')">
            <i class="fa-solid fa-bolt"></i> MP4 HD
          </button>
          <button type="button" class="btn-3d-sub" onclick="startDownload('music', 'TikTok_Audio.mp3')">
            <i class="fa-solid fa-music"></i> Musik MP3
          </button>
        </div>
        <div id="qrDrawer" style="display:none; text-align:center; margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.08);">
          <img id="qrImageEl" src="" alt="" style="width:140px; height:140px; background:#fff; padding:8px; border-radius:14px;">
        </div>
      </div>
    `;
  }

  // Render Kartu All-in-One (/v1/aio)
  function renderAioCard(json, sourceUrl, label) {
    const d = json?.data || json || {};
    const dlUrl = d.downloadUrl || d.url || d.videoUrl || "";
    if (!dlUrl) throw new Error("Link unduhan kosong");

    const fileName = d.fileName || "KevnaiMedia_Video.mp4";
    const sizeText = d.fileSizePretty || d.sizePretty || "";
    const cover = d.thumbnail || d.cover || "https://ui-avatars.com/api/?name=" + encodeURIComponent(label.slice(0, 2)) + "&background=131c36&color=00e5ff";

    currentMedia = { url: sourceUrl, video: dlUrl, hd: dlUrl, title: fileName, cover: cover };
    saveHistoryItem({ label: label, url: sourceUrl, cover: cover });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <div class="media-head">
          <div class="author-wrap">
            <img src="${escapeHTML(cover)}" alt="" referrerpolicy="no-referrer">
            <div>
              <h4>${escapeHTML(fileName)}</h4>
              <span>${escapeHTML(label)} ${sizeText ? "&bull; " + escapeHTML(sizeText) : ""}</span>
            </div>
          </div>
          <button type="button" class="q-chip" onclick="toggleQrDrawer()"><i class="fa-solid fa-qrcode"></i> QR</button>
        </div>

        <div class="video-frame">
          <video id="previewVideoEl" controls playsinline preload="metadata" src="${escapeHTML(dlUrl)}"></video>
        </div>

        <div class="dl-buttons">
          <button type="button" class="btn-3d-main span-2" onclick="startDownload('video', '${escapeHTML(fileName)}')">
            <i class="fa-solid fa-download"></i> Unduh Video MP4 ${sizeText ? "(" + escapeHTML(sizeText) + ")" : ""}
          </button>
        </div>
        <div id="qrDrawer" style="display:none; text-align:center; margin-top:14px;">
          <img id="qrImageEl" src="" alt="" style="width:140px; height:140px; background:#fff; padding:8px; border-radius:14px;">
        </div>
      </div>
    `;
  }

  // Render Kartu Facebook (/v1/fbdown)
  function renderFacebookCard(d, sourceUrl) {
    const hd = d.hd || d.sd || "";
    const sd = d.sd || d.hd || "";
    const mp3 = d.mp3 || "";
    const thumb = d.thumbnail || "https://ui-avatars.com/api/?name=FB&background=131c36&color=00e5ff";

    currentMedia = { url: sourceUrl, video: sd, hd: hd, music: mp3, title: d.title || "Video Facebook", cover: thumb };
    saveHistoryItem({ label: "Facebook", url: sourceUrl, cover: thumb });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <div class="media-head">
          <div class="author-wrap">
            <img src="${escapeHTML(thumb)}" alt="" referrerpolicy="no-referrer">
            <div>
              <h4>${escapeHTML(d.title || "Video Facebook")}</h4>
              <span>Facebook HD / SD</span>
            </div>
          </div>
        </div>
        <div class="video-frame">
          <video id="previewVideoEl" controls playsinline preload="metadata" poster="${escapeHTML(thumb)}" src="${escapeHTML(hd || sd)}"></video>
        </div>
        <div class="dl-buttons">
          ${hd ? `<button type="button" class="btn-3d-main span-2" onclick="startDownload('hd', 'Facebook_HD.mp4')"><i class="fa-solid fa-download"></i> Unduh Video HD 720p</button>` : ""}
          ${sd ? `<button type="button" class="btn-3d-sub" onclick="startDownload('video', 'Facebook_SD.mp4')"> Kualitas SD 360p</button>` : ""}
          ${mp3 ? `<button type="button" class="btn-3d-sub" onclick="startDownload('music', 'Facebook_Audio.mp3')"><i class="fa-solid fa-music"></i> Audio MP3</button>` : ""}
        </div>
      </div>
    `;
  }

  // Render Kartu YouTube MP4 (/v1/ytmp4)
  function renderYtMp4Card(d, sourceUrl) {
    const cover = "https://ui-avatars.com/api/?name=YT&background=131c36&color=00e5ff";
    currentMedia = { url: sourceUrl, video: d.url, hd: d.url, title: d.title || "YouTube MP4", cover: cover };
    saveHistoryItem({ label: "YT MP4", url: sourceUrl, cover: cover });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <h4 style="margin-bottom:6px;">${escapeHTML(d.title || "Video YouTube")}</h4>
        <p style="font-size:12px; color:var(--primary); margin-bottom:12px;">Ukuran File: ${escapeHTML(d.sizePretty || "MP4 HD")}</p>
        <div class="video-frame">
          <video controls playsinline preload="metadata" src="${escapeHTML(d.url)}"></video>
        </div>
        <div class="dl-buttons">
          <button type="button" class="btn-3d-main span-2" onclick="startDownload('video', 'YouTube_Video.mp4')">
            <i class="fa-solid fa-download"></i> Unduh MP4 (${escapeHTML(d.sizePretty || "HD")})
          </button>
        </div>
      </div>
    `;
  }

  // Render Kartu YouTube ke MP3 (/v1/yt/s/play)
  function renderYtMp3Card(d) {
    const v = d.video || d || {};
    const dl = d.download || d || {};
    const mp3Url = dl.downloadUrl || d.downloadUrl || d.url || "";
    if (!mp3Url) throw new Error("MP3 tidak ditemukan");

    const title = v.title || dl.title || "Lagu YouTube";
    const thumb = v.thumbnail || "https://ui-avatars.com/api/?name=MP3&background=131c36&color=00e5ff";
    currentMedia = { url: mp3Url, music: mp3Url, title: title, cover: thumb };
    saveHistoryItem({ label: "YT MP3", url: title, cover: thumb });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <div class="media-head">
          <div class="author-wrap">
            <img src="${escapeHTML(thumb)}" alt="" referrerpolicy="no-referrer">
            <div>
              <h4>${escapeHTML(title)}</h4>
              <span>${escapeHTML(v.author || "YouTube Audio")} &bull; ${escapeHTML(v.duration || selectedBitrate + "kbps")}</span>
            </div>
          </div>
        </div>
        <audio controls style="width:100%; margin:10px 0;" src="${escapeHTML(mp3Url)}"></audio>
        <div class="dl-buttons">
          <button type="button" class="btn-3d-main span-2" onclick="startDownload('music', '${escapeHTML(title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35))}.mp3')">
            <i class="fa-solid fa-download"></i> Unduh Lagu MP3 (${selectedBitrate}kbps)
          </button>
        </div>
      </div>
    `;
  }

  // Render Pencarian & Unduhan Spotify (/v1/spotify)
  function renderSpotifySearchResults(data) {
    const list = Array.isArray(data) ? data : data?.tracks || data?.results || data?.items || (data?.spotify || data?.url ? [data] : []);
    if (!Array.isArray(list) || list.length === 0) throw new Error("Lagu tidak ditemukan");

    const itemsHTML = list
      .slice(0, 8)
      .map(function (t) {
        const trackUrl = t.spotify || t.url || t.external_urls?.spotify || "";
        const title = t.title || t.name || "Lagu Spotify";
        const artist = t.artist || t.artists || "Artis";
        const cover = t.cover || t.thumbnail || t.image || "https://ui-avatars.com/api/?name=SP&background=131c36&color=00e5ff";
        return `
          <div class="track-item">
            <img src="${escapeHTML(cover)}" alt="" referrerpolicy="no-referrer">
            <div class="track-info">
              <h5>${escapeHTML(title)}</h5>
              <p>${escapeHTML(artist)} ${t.duration ? "&bull; " + escapeHTML(t.duration) : ""}</p>
            </div>
            <button type="button" class="btn-3d-sub" style="padding:9px 13px; font-size:12px;" onclick="downloadSpotifyTrackUrl('${escapeHTML(trackUrl)}')">
              <i class="fa-solid fa-download"></i> MP3
            </button>
          </div>
        `;
      })
      .join("");

    document.getElementById("resultArea").innerHTML = `<div class="track-list">${itemsHTML}</div>`;
  }

  async function downloadSpotifyTrackUrl(trackUrl) {
    if (!trackUrl) return;
    document.getElementById("mainInput").value = trackUrl;
    processInput(trackUrl);
  }

  function renderSpotifyTrackCard(d) {
    const dlUrl = d.download || d.downloadUrl || d.mp3 || d.url || "";
    if (!dlUrl) throw new Error("Gagal mengambil MP3 Spotify");
    const title = d.title || "Spotify Track";
    const cover = d.cover || "https://ui-avatars.com/api/?name=SP&background=131c36&color=00e5ff";

    currentMedia = { url: d.spotify || "", music: dlUrl, title: title, cover: cover };
    saveHistoryItem({ label: "Spotify", url: d.spotify || title, cover: cover });

    document.getElementById("resultArea").innerHTML = `
      <div class="result-panel">
        <div class="media-head">
          <div class="author-wrap">
            <img src="${escapeHTML(cover)}" alt="" referrerpolicy="no-referrer">
            <div>
              <h4>${escapeHTML(title)}</h4>
              <span>${escapeHTML(d.artist || "Spotify")} &bull; ${escapeHTML(d.duration || "MP3")}</span>
            </div>
          </div>
        </div>
        <audio controls style="width:100%; margin:10px 0;" src="${escapeHTML(dlUrl)}"></audio>
        <div class="dl-buttons">
          <button type="button" class="btn-3d-main span-2" onclick="startDownload('music', '${escapeHTML(title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35))}.mp3')">
            <i class="fa-solid fa-download"></i> Simpan Lagu MP3
          </button>
        </div>
      </div>
    `;
  }

  function playPreviewVideo() {
    const ov = document.getElementById("vidOverlay");
    const vid = document.getElementById("previewVideoEl");
    if (ov) ov.classList.add("hidden");
    if (vid) vid.play().catch(function () {});
  }

  function toggleQrDrawer() {
    if (!currentMedia) return;
    const box = document.getElementById("qrDrawer");
    const img = document.getElementById("qrImageEl");
    if (!box || !img) return;
    if (box.style.display === "block") {
      box.style.display = "none";
    } else {
      const target = currentMedia.video || currentMedia.music || currentMedia.url;
      img.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent(target);
      box.style.display = "block";
    }
  }

  async function startDownload(type, filename) {
    if (!currentMedia) return;
    const targetUrl = type === "hd" ? currentMedia.hd : type === "music" ? currentMedia.music : currentMedia.video;
    if (!targetUrl) return showToast("Format tidak tersedia");

    setMascotState("busy", "Mengunduh File ke Perangkatmu...", "Menyimpan " + filename);
    try {
      const res = await fetch(targetUrl, { referrerPolicy: "no-referrer" });
      if (!res.ok) throw new Error("Stream block");
      const blob = await res.blob();
      const bUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = bUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(bUrl); }, 5000);
      setMascotState("happy", "Unduhan Selesai!", filename + " berhasil disimpan.");
      showToast("Berhasil mengunduh " + filename);
    } catch (e) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      setMascotState("happy", "Mengalihkan Unduhan", "File dibuka di tab pengunduhan baru.");
    }
  }

  function saveHistoryItem(item) {
    try {
      let list = JSON.parse(localStorage.getItem("km_v2_hist") || "[]");
      list = list.filter(function (x) { return x.url !== item.url; });
      list.unshift(item);
      localStorage.setItem("km_v2_hist", JSON.stringify(list.slice(0, 10)));
      renderHistoryStrip();
    } catch (e) {}
  }

  function renderHistoryStrip() {
    const box = document.getElementById("historyBox");
    const strip = document.getElementById("historyStrip");
    if (!box || !strip) return;
    try {
      const list = JSON.parse(localStorage.getItem("km_v2_hist") || "[]");
      if (list.length === 0) {
        box.style.display = "none";
        return;
      }
      box.style.display = "block";
      strip.innerHTML = list
        .map(function (it, idx) {
          return `
            <div class="hist-thumb" onclick="reloadHistory(${idx})">
              <img src="${escapeHTML(it.cover)}" alt="" referrerpolicy="no-referrer">
              <div class="hist-label">${escapeHTML(it.label)}</div>
            </div>
          `;
        })
        .join("");
    } catch (e) {}
  }

  function reloadHistory(idx) {
    const list = JSON.parse(localStorage.getItem("km_v2_hist") || "[]");
    if (!list[idx]) return;
    document.getElementById("mainInput").value = list[idx].url;
    processInput(list[idx].url);
  }

  function clearHistory() {
    localStorage.removeItem("km_v2_hist");
    renderHistoryStrip();
    showToast("Riwayat dibersihkan");
  }

  function clearWorkspace() {
    document.getElementById("mainInput").value = "";
    document.getElementById("resultArea").innerHTML = "";
    currentMedia = null;
    setMascotState("click", "Siap untuk Tautan Baru!", "Tempelkan tautan atau ketik judul lagu yang ingin kamu unduh.");
  }

  function setTheme(theme) {
    if (theme === "gold") document.documentElement.setAttribute("data-theme", "gold");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("km_v2_theme", theme);
    document.getElementById("pillCyan")?.classList.toggle("active", theme !== "gold");
    document.getElementById("pillGold")?.classList.toggle("active", theme === "gold");
  }

  function shareWebsite() {
    if (navigator.share) {
      navigator.share({ title: "KevnaiMedia Downloader", url: window.location.origin }).catch(function () {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      showToast("Tautan website berhasil disalin!");
    }
  }

  // Ekspos ke Global Window agar 100% Aman Saat main.js Di-Encode / Obfuscate
  Object.assign(window, {
    switchRoute: switchRoute,
    pokeMascot: pokeMascot,
    setBitrate: setBitrate,
    pasteFromClipboard: pasteFromClipboard,
    processInput: processInput,
    downloadSpotifyTrackUrl: downloadSpotifyTrackUrl,
    playPreviewVideo: playPreviewVideo,
    toggleQrDrawer: toggleQrDrawer,
    startDownload: startDownload,
    reloadHistory: reloadHistory,
    clearHistory: clearHistory,
    clearWorkspace: clearWorkspace,
    setTheme: setTheme,
    shareWebsite: shareWebsite
  });

  function boot() {
    renderAppShell();
    initMascotPhysics();
    setTheme(localStorage.getItem("km_v2_theme") || "cyan");
    renderHistoryStrip();
    switchRoute(resolveRouteFromLocation(), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
