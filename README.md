# Big Five (FFM) — พยาบาลวิชาชีพชาวไทย

เว็บสแตติกพร้อม GitHub Pages: แบบสอบถาม **20 ข้อ** มาตราส่วน **Likert 1–5** ครอบคลุมมิติ **O · C · E · A · N** (ข้อละมิติ 4 ข้อ) คะแนนรวมต่อมิติ **4–20** ไม่มี reverse coding

## การให้คะแนน

- แต่ละข้อ: 1 = ไม่เห็นด้วยอย่างยิ่ง … 5 = เห็นด้วยอย่างยิ่ง  
- แต่ละมิติ: **ผลบวกของ 4 ข้อ** → ช่วง **4–20**  
- **N (Neuroticism):** คะแนนสูง = แนวโน้มไม่มั่นคงทางอารมณ์สูงขึ้น · คะแนนต่ำ (เช่น 4–10) อ่านในเชิงเสถียรภาพทางอารมณ์และการรับมือความกดดัน — ดูคำอธิบายบนหน้าเว็บ

## เก็บคำตอบใน Google Sheets

GitHub Pages ไม่เก็บข้อมูลฝั่งเซิร์ฟเวอร์ ใช้ **Google Apps Script** แบบเดียวกับโปรเจกต์ต้นแบบ:

1. สร้าง Google Sheet แล้วคัดลอก `SPREADSHEET_ID` จาก URL  
2. **Extensions → Apps Script** วางโค้ดจาก `google-apps-script/Webhook.gs`  
3. ตั้ง `SPREADSHEET_ID` และ `SHEET_NAME` (ค่าเริ่มต้น `Big5Submissions`)  
4. (แนะนำ) Script properties → `WEBHOOK_TOKEN` ให้ตรงกับ `webhookToken` ใน `assets/submission-config.js`  
5. **Deploy → Web app** — Execute as: Me, Who has access: Anyone — คัดลอก URL `/exec`  

### คอลัมน์ใน Sheet

`submitted_at`, `result_summary`, `big5_o`, `big5_c`, `big5_e`, `big5_a`, `big5_n`, `answers_json`

ฝั่งเบราว์เซอร์ส่งฟิลด์ `big5_score_o` … `big5_score_n` ใน JSON; สคริปต์แมปลงคอลัมน์ด้านบน

## GitHub Actions และความลับ

- ตั้งค่า **Pages** ให้ deploy ผ่าน workflow `.github/workflows/deploy-pages.yml`  
- เพิ่ม secrets: **`BIG5_WEBHOOK_URL`** (จำเป็น) และ **`BIG5_WEBHOOK_TOKEN`** (ถ้าใช้ token)  
- ทุกครั้งที่ deploy ระบบจะเขียน `assets/submission-config.js` จาก secrets (ไม่ต้อง commit URL จริง)  

ทดสอบในเครื่อง: แก้ `assets/submission-config.js` เป็น `enabled: true` และใส่ URL (ระวังอย่า commit ลง repo สาธารณะ)

## หมายเหตุ CORS

บราว์เซอร์อาจอ่าน response จากสคริปต์ไม่ได้; โค้ดจะลอง CORS ก่อน แล้ว fallback เป็น `no-cors` หากแถวถูกเพิ่มใน Sheet แม้ UI จะไม่ยืนยัน

## เอกสารเพิ่มเติม

- `guide.md` — คู่มือผู้สอน ข้อจำกัด นโยบายอ้างอิง และภาคผนวกบรรณานุกรม
