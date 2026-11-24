# UI Lab (Selenium IDE & Cypress)

งานแล็บนี้เลือกทำ 2 เครื่องมือคือ Part 1 (Selenium IDE) กับ Part 4 (Cypress) โดยใช้ทดสอบหน้าฟอร์มของ Selenium และเคส QP-01 บนเว็บ QuickPizza ตั้งแต่ฝั่งลูกค้าไปจนถึงหน้าแอดมิน

## selenium-ide (Part 1)

ในโฟลเดอร์ `selenium-ide/` มีไฟล์ [ui-lab.side](selenium-ide/ui-lab.side) ที่เก็บเทสต์หน้าฟอร์มและ QP-01 ขั้น 1–5 กับไฟล์ Java ที่ export ออกมาชื่อ [QP01customerTest.java](selenium-ide/QP01customerTest.java) รวมถึงผลรันที่เซฟไว้ใน [side-runner.txt](selenium-ide/evidence/side-runner.txt)

เวลาจะรันให้เปิด PowerShell เข้าไปในโฟลเดอร์ `selenium-ide/` เพิ่มโฟลเดอร์ของ ChromeDriver ไว้หน้า `PATH` แล้วรันคำสั่งนี้

```powershell
$env:Path = (Split-Path $env:CHROMEDRIVER) + ";" + $env:Path
npx --yes selenium-side-runner@4.0.13 ui-lab.side
```

## cypress (Part 4)

ในโฟลเดอร์ `cypress/` มีไฟล์เทสต์ `web-form.cy.js` กับ `pizza-scenario.cy.js` (ทำ QP-01 ครบทั้ง 7 ขั้นและดักดู request จาก `/api/pizza`) กับคำสั่งล็อกอินแอดมินที่เขียนเพิ่มไว้ใน `cypress/support/commands.js` ส่วนหลักฐานการรันเก็บไว้ใน [cypress-runs.txt](cypress/evidence/cypress-runs.txt), [โฟลเดอร์รูปภาพ](cypress/cypress/screenshots/pizza-scenario.cy.js/) และ [โฟลเดอร์วิดีโอ](cypress/cypress/videos/)

รันครั้งแรกให้เข้าไปในโฟลเดอร์ `cypress/` แล้วลงแพ็กเกจด้วย `npm ci` จากนั้นสั่งรันทั้งสองไฟล์บน Chrome ด้วยคำสั่งนี้

```powershell
npx cypress run --browser chrome
```

รายละเอียดการเตรียมเครื่อง ผลการลองแต่ละขั้น และคำตอบคำถามท้ายแล็บอยู่ใน [RESULTS.md](RESULTS.md)
