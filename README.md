# UI Lab | Selenium IDE และ Cypress

ใช้ **Selenium IDE (Part 1)** กับ **Cypress (Part 4)** ลองส่งแบบฟอร์มของ Selenium และทดสอบ QuickPizza ฝั่งลูกค้า ใน Cypress ทำ QP-01 ต่อถึงหน้าแอดมินเพื่อเทียบเครื่องมือกับคำแนะนำที่ลูกค้าเห็น

## Selenium IDE

โฟลเดอร์ `selenium-ide/` มี [ไฟล์ ui-lab.side](selenium-ide/ui-lab.side) สำหรับหน้าแบบฟอร์มและ QP-01 ขั้น 1–5 พร้อม [ตัวอย่าง Java ที่ส่งออก](selenium-ide/QP01customerTest.java) ใช้ Chrome และ Node.js 22 ขึ้นไป เปิด PowerShell ในโฟลเดอร์ `selenium-ide/` แล้วรัน

```powershell
npx.cmd --yes selenium-side-runner@4.0.13 -w 1 -c 'browserName=chrome' ui-lab.side
```

ถ้ามี ChromeDriver หลายรุ่น ให้เพิ่มโฟลเดอร์ของรุ่นที่ตรงกับ Chrome ไว้หน้า `PATH` ก่อนรัน ตัวอย่างนี้ใช้ตำแหน่งจาก `CHROMEDRIVER` ที่ตั้งไว้ใน Part 0

```powershell
$env:Path = (Split-Path -Parent $env:CHROMEDRIVER) + ';' + $env:Path
```

ดู [ผลรัน Side Runner](selenium-ide/evidence/side-runner.txt) ส่วนการอัดคลิกตามโจทย์ต้องใช้ [Selenium IDE ใน Firefox](https://addons.mozilla.org/firefox/addon/selenium-ide/) สถานะของขั้นนี้บันทึกไว้ในผลแล็บ

## Cypress

โฟลเดอร์ `cypress/` มีเทสต์หน้าแบบฟอร์มกับ QP-01 ครบเจ็ดขั้น คำสั่งล็อกอินแอดมินอยู่ใน `cypress/support/commands.js` ภายในโปรเจกต์ เปิด PowerShell ในโฟลเดอร์ `cypress/` ด้านนอก แล้วติดตั้งแพ็กเกจครั้งแรก

```powershell
npm.cmd ci
```

รันสองเทสต์ใน Chrome ด้วยคำสั่งนี้

```powershell
npx.cmd cypress run --browser chrome
```

ดู [ผลในเทอร์มินัลทั้งสองรอบ](cypress/evidence/cypress-runs.txt), [ภาพ QP-01 รอบล่าสุด](cypress/cypress/screenshots/pizza-scenario.cy.js/) และ [วิดีโอของสองเทสต์](cypress/cypress/videos/) หากรันใหม่ Cypress จะเก็บภาพและวิดีโอชุดล่าสุดไว้ในตำแหน่งเดิม

ผลการลองจากหน้าเว็บและคำตอบท้ายแล็บอยู่ใน [RESULTS.md](RESULTS.md)
