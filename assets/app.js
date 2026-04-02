// Big Five (20-item Likert) — interactive notebook UI for GitHub Pages.
(() => {
  "use strict";

  /** @typedef {"O"|"C"|"E"|"A"|"N"} TraitKey */

  /**
   * @typedef {{ id: string, trait: TraitKey, text: string, reverse: boolean }} QuizItem
   */

  const ITEMS = /** @type {const} */ ([
    { id: "q1", trait: "O", text: "ฉันมีความยินดี และพร้อมที่จะเรียนรู้ ปรับเปลี่ยน แนวปฏิบัติ นวัตกรรมใหม่ๆ และพร้อมรับการเปลี่ยนแปลงระบบการทำงานในโรงพยาบาลอยู่เสมอ", reverse: false },
    { id: "q2", trait: "O", text: "ฉันสามารถเปิดใจยอมรับและเคารพค่านิยม ตลอดจนความเชื่อทางศาสนาหรือวัฒนธรรมที่แตกต่างกันของผู้ป่วยได้ แม้ฉันจะไม่เข้าใจ", reverse: false },
    { id: "q3", trait: "O", text: "เมื่อเจอปัญหาในวอร์ด ฉันมักจะมีความคิดริเริ่มสร้างสรรค์ในการหาวิธีการแก้ไขปัญหา หรือปรับปรุงการพยาบาลให้ดีขึ้น", reverse: false },
    { id: "q4", trait: "O", text: "ฉันเป็นคนอยากรู้อยากเห็น ชอบค้นคว้าหาความรู้เพิ่มเติมเพื่อนำมาประยุกต์ใช้ในการทำงานหรือชีวิตประจำวัน", reverse: false },
    { id: "q5", trait: "C", text: "ฉันมีความรับผิดชอบสูงและปฏิบัติตามงานที่ได้รับมอบหมายอย่างเคร่งครัดและตรงเวลา", reverse: false },
    { id: "q6", trait: "C", text: "ในการปฏิบัติงาน เช่น การรับ-ส่งเวร ฉันสามารถสื่อสารข้อมูลอาการของผู้ป่วยได้อย่างครบถ้วน ถูกต้อง และเป็นระบบ", reverse: false },
    { id: "q7", trait: "C", text: "ฉันมักจะวางแผน และเตรียมความพร้อม อย่างละเอียดรอบคอบที่สุดเท่าที่ฉันทำได้ ก่อนเริ่มงานหรือเริ่มลงมือทำอะไรบางอย่างเสมอ", reverse: false },
    { id: "q8", trait: "C", text: "ฉันมีความมุ่งมั่นและมีวินัยในตนเองที่จะพัฒนาทักษะวิชาชีพพยาบาลให้ได้ตามมาตรฐานและเป้าหมายที่กำหนด", reverse: false },
    { id: "q9", trait: "E", text: "ฉันเป็นคนร่าเริง ช่างพูด และมักจะเป็นฝ่ายเริ่มพูดคุยเพื่อสร้างความเป็นกันเองกับผู้ป่วย ญาติ และเพื่อนก่อนเสมอ", reverse: false },
    { id: "q10", trait: "E", text: "เมื่อต้องทำงานร่วมกับทีมสหวิชาชีพ (เช่น แพทย์ เภสัชกร) ฉันสามารถแสดงความคิดเห็นและกล้าแสดงออกได้อย่างมั่นใจ", reverse: false },
    { id: "q11", trait: "E", text: "ฉันรู้สึกมีพลังและกระตือรือร้น แม้จะต้องทำงานในวอร์ดที่มีความวุ่นวายและมีผู้ป่วยจำนวนมาก", reverse: false },
    { id: "q12", trait: "E", text: "ฉันชอบการทำงานเป็นทีม ชอบการพบปะผู้คน และรู้สึกดีที่ได้มีปฏิสัมพันธ์กับเพื่อนร่วมงานในโรงพยาบาล", reverse: false },
    { id: "q13", trait: "A", text: "ฉันช่วยเหลือทั้งเพื่อนร่วมงานและผู้ป่วยด้วยความเต็มใจเสมอ", reverse: false },
    { id: "q14", trait: "A", text: "เมื่อมีความขัดแย้งในการทำงาน ฉันมักจะรับฟัง ยอมรับความคิดเห็นของผู้อื่น และเลือกใช้วิธีประนีประนอมเสมอ", reverse: false },
    { id: "q15", trait: "A", text: "ฉันมีความไว้วางใจในความสามารถและเจตนาดีของผู้ป่วย และเพื่อนร่วมงาน", reverse: false },
    { id: "q16", trait: "A", text: "ฉันปฏิบัติต่อผู้ป่วยและเพื่อนร่วมงานอย่างสุภาพ ถ่อมตน และไม่นำเอาความเหนื่อยล้ามาลงที่ผู้อื่น", reverse: false },
    { id: "q17", trait: "N", text: "ฉันมักจะรู้สึกวิตกกังวลและเครียดได้ง่าย และมักจะตำหนิตนเองซ้ำแล้วซ้ำเล่าเมื่อเกิดความผิดพลาด แม้จะเป็นเพียงเรื่องเล็กๆ น้อยๆ", reverse: false },
    { id: "q18", trait: "N", text: "บางครั้งฉันรู้สึกควบคุมอารมณ์หงุดหงิดหรือความฉุนเฉียวได้ยาก เมื่อสถานการณ์มีความกดดันสูงหรือเร่งด่วน", reverse: false },
    { id: "q19", trait: "N", text: "ฉันรู้สึกเหนื่อยใจ ท้อแท้ หรือหมดกำลังใจได้ง่าย เมื่อถูกติติงหรือเผชิญกับความคาดหวังที่สูง", reverse: false },
    { id: "q20", trait: "N", text: "ฉันรู้สึกหดหู่ หรืออารมณ์แปรปรวนบ่อยครั้ง", reverse: false },
  ]);

  const TRAIT_ORDER = /** @type {const} */ (["O", "C", "E", "A", "N"]);

  const TRAIT_LABELS = /** @type {Record<TraitKey, { title: string, short: string }>} */ ({
    O: { title: "การเปิดรับประสบการณ์ (Openness)", short: "O" },
    C: { title: "ความมีจิตสำนึก (Conscientiousness)", short: "C" },
    E: { title: "ความเป็นคนแสดงออก (Extraversion)", short: "E" },
    A: { title: "ความเป็นมิตร (Agreeableness)", short: "A" },
    N: { title: "ความไม่มั่นคงทางอารมณ์ (Neuroticism)", short: "N" },
  });

  /** Short hints when score 16–20 (O/C/E/A) — expand in page copy as needed */
  const HIGH_BAND_OCEA = /** @type {Record<Exclude<TraitKey, "N">, string>} */ ({
    O: "คะแนนสูงในมิตินี้บ่งชี้การเปิดรับนวัตกรรม ความยืดหยุ่น และการเรียนรู้ในงานพยาบาล",
    C: "คะแนนสูงสะท้อนความรับผิดชอบ การวางแผน และความเชื่อถือได้ในการปฏิบัติงาน",
    E: "คะแนนสูงสะท้อนพลังงานทางสังคม ความกระตือรือร้น และการสื่อสารเชิงรุก",
    A: "คะแนนสูงสะท้อนความเอื้อเฟื้อ การไว้วางใจ และการประนีประนอมในทีม",
  });

  const LIKERT_SCALE = /** @type {const} */ ([
    { v: 1, cap: "ไม่เห็นด้วยอย่างยิ่ง" },
    { v: 2, cap: "ไม่เห็นด้วย" },
    { v: 3, cap: "เฉยๆ" },
    { v: 4, cap: "เห็นด้วย" },
    { v: 5, cap: "เห็นด้วยอย่างยิ่ง" },
  ]);

  const STORAGE_KEY = "big5_nurse20_v1_answers";
  const BIG5_RADAR_MAX = 20;

  /**
   * @param {Record<string, number>} answers
   * @returns {Record<TraitKey, { sum: number, n: number }>}
   */
  function traitAggregates(answers) {
    /** @type {Record<TraitKey, { sum: number, n: number }>} */
    const out = { O: { sum: 0, n: 0 }, C: { sum: 0, n: 0 }, E: { sum: 0, n: 0 }, A: { sum: 0, n: 0 }, N: { sum: 0, n: 0 } };
    for (const item of ITEMS) {
      const val = answers[item.id];
      if (typeof val !== "number" || val < 1 || val > 5) continue;
      out[item.trait].sum += val;
      out[item.trait].n += 1;
    }
    return out;
  }

  /**
   * @param {Record<string, number>} answers
   * @returns {Record<TraitKey, number | null>}
   */
  function traitSums(answers) {
    const agg = traitAggregates(answers);
    /** @type {Record<TraitKey, number | null>} */
    const sums = { O: null, C: null, E: null, A: null, N: null };
    for (const t of TRAIT_ORDER) {
      if (agg[t].n === 4) sums[t] = agg[t].sum;
    }
    return sums;
  }

  /**
   * @param {TraitKey} trait
   * @param {number | null} sum
   * @returns {string}
   */
  function bandLabel(trait, sum) {
    if (sum == null) return "—";

    if (trait === "N") {
      if (sum >= 16) return "สูง — ความไม่มั่นคงทางอารมณ์สูง / เครียดง่าย — พักผ่อนและจัดการอารมณ์";
      if (sum <= 10) return "ต่ำ–ปานกลาง — มั่นคงทางอารมณ์ (Emotional Stability) รับมือกับความกดดันได้ดี";
      return "ปานกลาง — ระหว่างเสถียรภาพกับความไม่มั่นคงทางอารมณ์";
    }

    if (sum >= 16) return `สูง — ${HIGH_BAND_OCEA[trait]}`;
    if (sum >= 11) return "ปานกลาง — มีจุดเด่นและจุดที่พัฒนาได้ตามบริบทงาน";
    return "ต่ำ–ปานกลาง (4–10) — โอกาสพัฒนาหรือบทบาทงานที่เน้นด้านอื่น";
  }

  /**
   * @param {Record<string, number>} answers
   * @returns {Record<TraitKey, number>}
   */
  function radarValues(answers) {
    const agg = traitAggregates(answers);
    /** @type {Record<TraitKey, number>} */
    const out = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    for (const t of TRAIT_ORDER) {
      if (agg[t].n === 4) out[t] = agg[t].sum;
      else if (agg[t].n > 0) {
        const mean = agg[t].sum / agg[t].n;
        out[t] = Math.min(20, Math.round(mean * 4 * 10) / 10);
      }
    }
    return out;
  }

  /**
   * @returns {Record<string, number>}
   */
  function loadAnswers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return {};
      return /** @type {Record<string, number>} */ (data);
    } catch {
      return {};
    }
  }

  /**
   * @param {Record<string, number>} answers
   */
  function saveAnswers(answers) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }

  function clearAnswers() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * @param {HTMLElement} root
   * @param {number} total
   * @returns {HTMLElement}
   */
  function buildProgressDots(root, total) {
    const wrap = document.createElement("div");
    wrap.className = "nbk-progress";
    wrap.setAttribute("role", "navigation");
    wrap.setAttribute("aria-label", "ความคืบหน้าแบบสอบถาม");

    for (let i = 0; i < total; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nbk-dot";
      btn.setAttribute("aria-label", `ไปข้อที่ ${i + 1}`);
      btn.dataset.q = String(i + 1);
      btn.addEventListener("click", () => {
        const target = root.querySelector(`#nbk-q-${i + 1}`);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wrap.appendChild(btn);
    }

    return wrap;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Record<TraitKey, number>} values
   */
  function renderBig5Radar(canvas, values) {
    const W = 380;
    const H = 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const labelPad = 56;
    const radius = Math.min(W, H) / 2 - labelPad;

    const dims = TRAIT_ORDER.map((key) => ({
      key,
      letter: TRAIT_LABELS[key].short,
      title: TRAIT_LABELS[key].title.split(" ")[0],
    }));

    const n = dims.length;
    const vals = dims.map((d) => values[d.key]);
    const angles = dims.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / n);

    function pointAt(angle, dist) {
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
      };
    }

    ctx.strokeStyle = "rgba(17, 24, 39, 0.08)";
    ctx.lineWidth = 1;
    for (let g = 1; g <= 4; g++) {
      const rr = (radius * g) / 4;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = angles[i % n];
        const p = pointAt(a, rr);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(17, 24, 39, 0.12)";
    for (let i = 0; i < n; i++) {
      const a = angles[i];
      const p = pointAt(a, radius);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    const fillPts = angles.map((a, i) => {
      const t = BIG5_RADAR_MAX > 0 ? vals[i] / BIG5_RADAR_MAX : 0;
      const d = Math.max(0, Math.min(1, t)) * radius;
      return pointAt(a, d);
    });

    ctx.fillStyle = "rgba(59, 130, 246, 0.22)";
    ctx.strokeStyle = "rgba(37, 99, 235, 0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = fillPts[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const p = fillPts[i];
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      const outer = pointAt(angles[i], radius + 28);
      ctx.fillStyle = "rgba(17, 24, 39, 0.88)";
      ctx.font = '700 13px "Noto Sans Thai", system-ui, sans-serif';
      ctx.fillText(dims[i].letter, outer.x, outer.y - 10);
      ctx.font = '600 11px "Noto Sans Thai", system-ui, sans-serif';
      ctx.fillStyle = "rgba(17, 24, 39, 0.55)";
      ctx.fillText(dims[i].title, outer.x, outer.y + 6);
      ctx.font = '700 12px "Noto Sans Thai", system-ui, sans-serif';
      ctx.fillStyle = "rgba(37, 99, 235, 0.95)";
      ctx.fillText(String(vals[i]), outer.x, outer.y + 22);
    }
  }

  /**
   * @param {HTMLElement} resultsEl
   * @param {Record<TraitKey, number | null>} sums
   * @param {Record<TraitKey, number>} radarVals
   * @param {boolean} complete
   */
  function renderResults(resultsEl, sums, radarVals, complete) {
    const scoreRows = TRAIT_ORDER.map((t) => {
      const s = sums[t];
      const display = s == null ? "—" : String(s);
      const band = bandLabel(t, s);
      return `
        <div class="nbk-score" role="listitem">
          <span class="k">${escapeHtml(TRAIT_LABELS[t].title)}</span>
          <span class="v">${display}<span class="nbk-band">${escapeHtml(band)}</span></span>
        </div>`;
    }).join("");

    resultsEl.innerHTML = `
      <div class="nbk-card">
        <div class="nbk-card-head">
          <h4>สรุปผล</h4>
          <div class="nbk-status ${complete ? "is-complete" : ""}">
            ${complete ? "ครบ 20 ข้อ" : "ตอบให้ครบทุกข้อ (คะแนนรวมต่อมิติแสดงเมื่อครบ 4 ข้อในมิตินั้น)"}
          </div>
        </div>

        <div class="nbk-scores" role="list" aria-label="คะแนน Big Five ตามมิติ (สูงสุด 20 ต่อมิติ)">
          ${scoreRows}
        </div>

        <div class="nbk-meta">
          <div class="nbk-meta-line">มิติละ 4 ข้อ คะแนนรวม 4–20 ต่อมิติ • ใช้เป็นแนวทางสะท้อนตนเอง ไม่ใช่การวินิจฉัย</div>
          <div class="nbk-meta-line">การอ่านคะแนน Big Five เพื่อปรับสมดุล: อ้างอิงได้จากแนวทางการสะท้อนตนเอง (เช่น Jordan Peterson) — ไม่ใช่เกณฑ์ทางคลินิก</div>
        </div>

        <div class="nbk-actions">
          <button type="button" class="nbk-btn nbk-btn-send" data-action="send">ส่งผล</button>
          <button type="button" class="nbk-btn" data-action="copy">คัดลอกสรุป</button>
          <button type="button" class="nbk-btn nbk-btn-ghost" data-action="reset">ล้างคำตอบ</button>
        </div>

        <div class="nbk-note">
          *ผลนี้ใช้เพื่อสะท้อนตนเองและการสื่อสารในทีม ไม่ใช่เครื่องมือเชิงคลินิก
        </div>
      </div>

      <div class="nbk-radar-card" aria-label="กราฟเรดาร์คะแนนมิติ Big Five">
        <div class="nbk-radar-head">
          <h4 class="nbk-radar-title">โปรไฟล์ Big Five</h4>
          <p class="nbk-radar-caption">เปรียบเทียบ 5 มิติ (O C E A N) สเกล 0–20 ต่อมิติ — ขอบนอก = 20</p>
        </div>
        <div class="nbk-radar-canvas-wrap">
          <canvas id="nbk-big5-radar" role="img" aria-label="เรดาร์ O C E A N"></canvas>
        </div>
      </div>
    `;

    const radarCanvas = /** @type {HTMLCanvasElement | null} */ (resultsEl.querySelector("#nbk-big5-radar"));
    if (radarCanvas) {
      requestAnimationFrame(() => renderBig5Radar(radarCanvas, radarVals));
    }
  }

  /**
   * @param {HTMLElement} quizMount
   * @param {QuizItem[]} items
   */
  function buildQuizUI(quizMount, items) {
    const stored = loadAnswers();
    /** @type {Record<string, number>} */
    const answers = { ...stored };

    const sheet = document.createElement("div");
    sheet.className = "nbk-sheet";
    sheet.innerHTML = `
      <div class="nbk-paper">
        <header class="nbk-header">
          <div class="nbk-title">
            <div class="nbk-badge">Big-5</div>
            <div>
              <div class="nbk-title-main">แบบสอบถาม 20 ข้อ</div>
              <div class="nbk-title-sub">ประเมิน 1–5 ต่อข้อ • คำนวณคะแนนรวมต่อมิติอัตโนมัติ</div>
            </div>
          </div>
        </header>

        <div class="nbk-layout">
          <form class="nbk-form" autocomplete="off">
            <div class="nbk-grid" id="nbk-grid"></div>
          </form>

          <div class="nbk-results" id="nbk-results" aria-label="ผลคะแนน Big Five"></div>
        </div>
      </div>
    `;

    quizMount.appendChild(sheet);

    const header = sheet.querySelector(".nbk-header");
    const grid = /** @type {HTMLElement} */ (sheet.querySelector("#nbk-grid"));
    const resultsEl = /** @type {HTMLElement} */ (sheet.querySelector("#nbk-results"));

    const progress = buildProgressDots(sheet, items.length);
    header?.appendChild(progress);

    for (let i = 0; i < items.length; i++) {
      const qNum = i + 1;
      const item = items[i];

      const block = document.createElement("div");
      block.className = "nbk-q";
      block.id = `nbk-q-${qNum}`;
      const qtextId = `nbk-qtext-${qNum}`;
      block.setAttribute("role", "group");
      block.setAttribute("aria-labelledby", qtextId);

      const likertCells = LIKERT_SCALE.map(({ v, cap }) => {
        const id = `nbk-${item.id}-${v}`;
        return `
          <label class="nbk-likert-opt" for="${id}">
            <input id="${id}" type="radio" name="${item.id}" value="${v}" />
            <span class="nbk-likert-num">${v}</span>
            <span class="nbk-likert-cap">${escapeHtml(cap)}</span>
          </label>`;
      }).join("");

      block.innerHTML = `
        <div class="nbk-q-head" id="${qtextId}">
          <span class="nbk-qno">${qNum}</span>
          <span class="nbk-qtext">${escapeHtml(item.text)}</span>
        </div>
        <p class="nbk-likert-legend">1 = ไม่เห็นด้วยอย่างยิ่ง … 5 = เห็นด้วยอย่างยิ่ง</p>
        <div class="nbk-likert-opts" role="radiogroup" aria-labelledby="${qtextId}">
          ${likertCells}
        </div>
      `;
      grid.appendChild(block);

      const storedVal = answers[item.id];
      if (typeof storedVal === "number") {
        const input = block.querySelector(`input[value="${storedVal}"]`);
        if (input) /** @type {HTMLInputElement} */ (input).checked = true;
      }

      block.addEventListener("change", (ev) => {
        const t = ev.target;
        if (!(t instanceof HTMLInputElement)) return;
        if (t.name !== item.id) return;
        const v = Number(t.value);
        if (v >= 1 && v <= 5) answers[item.id] = v;
        saveAnswers(answers);
        update();
      });
    }

    function isComplete() {
      for (const it of items) {
        const v = answers[it.id];
        if (typeof v !== "number" || v < 1 || v > 5) return false;
      }
      return true;
    }

    function updateDots() {
      const dots = Array.from(sheet.querySelectorAll(".nbk-dot"));
      for (const dot of dots) {
        const q = Number(dot.getAttribute("data-q") || "0");
        const id = items[q - 1]?.id;
        const filled = id ? typeof answers[id] === "number" : false;
        dot.classList.toggle("is-filled", filled);
      }
    }

    function update() {
      const sums = traitSums(answers);
      const radarVals = radarValues(answers);
      renderResults(resultsEl, sums, radarVals, isComplete());
      updateDots();
    }

    quizMount.addEventListener("click", async (ev) => {
      const t = ev.target;
      if (!(t instanceof HTMLElement)) return;
      const btn = t.closest("[data-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (action === "reset") {
        for (const it of items) delete answers[it.id];
        clearAnswers();
        for (const input of Array.from(sheet.querySelectorAll('input[type="radio"]'))) {
          /** @type {HTMLInputElement} */ (input).checked = false;
        }
        update();
      }

      if (action === "copy") {
        const sums = traitSums(answers);
        const parts = TRAIT_ORDER.map((k) => {
          const s = sums[k];
          return `${k}=${s == null ? "—" : s}`;
        });
        const text =
          `Big Five — พยาบาล (20 ข้อ, Likert 1–5)\n` +
          `${parts.join(", ")}\n` +
          `รายละเอียดมิติ: แต่ละมิติ 4–20 คะแนน\n`;

        try {
          await navigator.clipboard.writeText(text);
          flashStatus(resultsEl, "คัดลอกแล้ว");
        } catch {
          window.prompt("คัดลอกข้อความนี้:", text);
        }
      }

      if (action === "send") {
        if (!isComplete()) {
          flashStatus(resultsEl, "กรุณาตอบให้ครบ 20 ข้อก่อนส่ง");
          return;
        }

        const sums = traitSums(answers);
        if (sums.O == null || sums.C == null || sums.E == null || sums.A == null || sums.N == null) {
          flashStatus(resultsEl, "ข้อมูลคะแนนไม่ครบ");
          return;
        }

        const resultSummary = TRAIT_ORDER.map((k) => `${k}=${sums[k]}`).join(", ");

        const cfg = window.BIG5_OWNER_SUBMISSION_CONFIG;
        const submitFn = window.submitBig5SubmissionToOwner;
        if (cfg && cfg.enabled && typeof submitFn === "function") {
          /** @type {Record<string, unknown>} */
          const row = {
            submitted_at: new Date().toISOString(),
            result_summary: resultSummary,
            big5_score_o: sums.O,
            big5_score_c: sums.C,
            big5_score_e: sums.E,
            big5_score_a: sums.A,
            big5_score_n: sums.N,
            answers: { ...answers },
          };
          const sent = await submitFn(row);
          if (sent.ok) {
            flashStatus(resultsEl, "ส่งผลให้ผู้ดูแลระบบแล้ว");
          } else if (sent.error !== "not_configured") {
            flashStatus(resultsEl, "ส่งผลไม่สำเร็จ โปรดลองอีกครั้ง");
          }
        } else {
          flashStatus(resultsEl, "ยังไม่ได้ตั้งค่า webhook (ดู README)");
        }
      }
    });

    update();
  }

  /**
   * @param {string} s
   * @returns {string}
   */
  function escapeHtml(s) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /**
   * @param {HTMLElement} resultsEl
   * @param {string} msg
   */
  function flashStatus(resultsEl, msg) {
    const badge = document.createElement("div");
    badge.className = "nbk-toast";
    badge.textContent = msg;
    resultsEl.appendChild(badge);
    setTimeout(() => badge.remove(), 2000);
  }

  function init() {
    document.documentElement.classList.add("js");

    const mount = document.getElementById("big5-quiz");
    if (!mount) return;

    buildQuizUI(mount, ITEMS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
