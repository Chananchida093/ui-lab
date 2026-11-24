# ผลแล็บ UI Testing

เครื่องมือที่เลือกทำ: Part 1 (Selenium IDE) และ Part 4 (Cypress)

## Part 0 เตรียมเครื่องและลองเล่นหน้าเว็บ

- Step 0.1 รุ่นของ Chrome: Google Chrome `158.0.8127.38` บน Windows 64-bit (ตอนเริ่มทำยังเป็น `157.0.8103.79` แล้ว Chrome อัปเดตเองระหว่างทำ เลยโหลดไดรเวอร์รุ่นใหม่มาเปลี่ยน)
- Step 0.3 รุ่นของ ChromeDriver: ChromeDriver `158.0.8127.88` แยกเก็บไว้นอกโฟลเดอร์งานที่ `C:\drivers\ui-lab-158.0.8127.88\chromedriver-win64\chromedriver.exe` แล้วตั้งตัวแปร `CHROMEDRIVER` ชี้ไปที่ไฟล์นี้
- ลองเช็กใน Console ของหน้าแบบฟอร์ม Selenium เจอ `#my-text-id` 1 ช่อง, `input[type=checkbox]` 2 ช่อง และ `//button[normalize-space()='Submit']` 1 ปุ่ม

### Step 0.4 Locator ที่ลองหาใน QuickPizza

| จุดบนหน้าเว็บ | Locator ที่ใช้ | จำนวนที่เจอ |
| --- | --- | --- |
| ปุ่ม Pizza, Please! | `//button[normalize-space()="Pizza, Please!"]` (หรือ `button[name="pizza-please"]`) | 1 |
| กล่องเลือก Excluded tools | `select[multiple]` (หรือ `select`) | 1 |
| ช่องติ๊ก Must be vegetarian | `input[type="checkbox"][id="default-checkbox"]` (หรือ `#default-checkbox`) | 1 |
| ช่อง Custom Pizza Name | `input#pizza-name` | 1 |
| ช่อง Max Calories per Slice | `//label[normalize-space()="Max Calories per Slice"]/preceding-sibling::input` | 1 |

ตอนลองค้น `#floating_filled` มันเจอพร้อมกัน 3 ช่องเลย เพราะช่องตัวเลขสามช่องด้านบนใช้ id เดียวกันหมด แล้วพอกดขอพิซซ่า `#pizza-name` ก็จะเจอ 2 จุดแทนเพราะหัวข้อตรงผลแนะนำใช้ id ซ้ำกับช่องกรอก เลยต้องเขียนเป็น `input#pizza-name` ให้เจาะจงแค่ช่องพิมพ์ชื่อ

### Step 0.5 ลองทำ QP-01 ด้วยมือ

รอบที่ลองกดเองใน Chrome ตั้งชื่อพิซซ่าว่า `Lab Pizza 20261124-205127` ใส่แคลอรีไม่เกิน `600` ตัด `Knife` ออก และติ๊ก `Must be vegetarian` เว็บแนะนำกลับมาเป็นเครื่องมือ `Pizza cutter` กับ `500` แคลอรีต่อชิ้น

| Step | สิ่งที่ทำ | สิ่งที่คาดว่าจะเจอ | สิ่งที่เจอจริง | Pass or fail |
| --- | --- | --- | --- | --- |
| 1 | เปิดหน้าแรก QuickPizza | เห็นหัวข้อ `Looking to break out of your pizza routine?` | ขึ้นหัวข้อ `Looking to break out of your pizza routine?` กลางหน้า | Pass |
| 2 | กดเปิดสวิตช์ Advanced | เห็นช่อง Max Calories per Slice, Excluded tools, Must be vegetarian และ Custom Pizza Name | ขึ้นมาครบทั้ง 4 ช่อง โดยช่องแคลอรีมีเลข `1000` ใส่อยู่ก่อนแล้ว | Pass |
| 3 | กรอก `600`, เลือก `Knife`, ติ๊ก vegetarian และพิมพ์ชื่อพิซซ่า | ทุกช่องแสดงค่าตามที่กรอก | ลบ `1000` แล้วใส่ `600` แทน ทุกช่องแสดงค่าตรงครบ | Pass |
| 4 | กดปุ่ม Pizza, Please! | ผลแนะนำแสดงชื่อเดิม เครื่องมือไม่ใช่ `Knife` และแคลอรีไม่เกิน 600 | ขึ้นชื่อ `Lab Pizza 20261124-205127`, `Tool: Pizza cutter` และ `Calories per slice: 500` | Pass |
| 5 | กดปุ่ม Love it! ตอนยังไม่ได้ล็อกอิน | เว็บแจ้งว่า `Please log in first.` | ขึ้นข้อความ `Please log in first.` ใต้ปุ่ม | Pass |
| 6 | เข้า `/admin` แล้วล็อกอินด้วย `admin` / `admin` | เห็นหัวข้อ `Latest pizza recommendations` | ล็อกอินเข้าไปแล้วเห็นหัวข้อ `Latest pizza recommendations` | Pass |
| 7 | ไล่หาชื่อพิซซ่าที่เพิ่งสร้างในรายการ | เจอแถวชื่อเดิมพร้อมเครื่องมือเดียวกับขั้น 4 | เจอแถว `Lab Pizza 20261124-205127 (tool=Pizza cutter, ingredients_number=7)` | Pass |

สังเกตว่าทั้งผลแนะนำในขั้น 4 กับรายการในหน้าแอดมินขั้น 7 ไม่ได้โผล่มาทันทีพร้อมหน้าเว็บ ต้องรอแป๊บหนึ่ง ตอนเอาไปเขียนเทสต์เลยต้องใส่คำสั่งรอไว้ทุกจุดพวกนี้

## Part 1: Selenium IDE

- รุ่นของ Firefox และ Node.js: Mozilla Firefox `160.0.1` (Selenium IDE `3.17.4`), Node.js `v22.12.0` และรันด้วย `selenium-side-runner@4.0.13`
- Step 1.4 ลองทำให้เทสต์พัง: เพิ่มคำสั่ง `waitForElementVisible` (`id=message`, `10000`), `assertTitle` (`Web form - target page`) และ `assertText` (`id=message`, `Received!`) แล้วลองลบ `!` ออกให้เหลือแค่ `Received` พอรันดูได้ข้อความแจ้งผิดกับบรรทัด `Tests:` ตามนี้ จากนั้นค่อยใส่ `!` กลับคืน
  - บรรทัดที่แจ้งผิด: `Actual value 'Received!' did not match 'Received' during assertText:id=message:Received`
  - บรรทัด `Tests:`: `Tests:       1 failed, 1 total` (ใช้เวลา `2.886 s`)
- Step 1.5 target ที่เลือกแทนปุ่ม Submit: เปลี่ยนจาก `css=.btn` เป็น `xpath=//button[@type='submit']` แล้วแก้คำสั่ง `open` เป็น URL เต็ม `https://www.selenium.dev/selenium/web/web-form.html` ที่ต้องเปลี่ยนเพราะ `css=.btn` เป็นคลาสไว้แต่งหน้าตาปุ่ม ซึ่งปุ่มอื่นบนหน้าก็ใช้คลาสนี้ได้ ถ้าหน้าเว็บมีปุ่มใหม่โผล่มาข้างบน เทสต์ก็จะไปกดปุ่มนั้นแทน
- Step 1.6 คำสั่งที่แก้ เพิ่ม และลบหลังจากอัดเทสต์:
  - แก้ (changed): แก้ `open` ให้เป็น URL เต็ม `https://quickpizza.grafana.com/`, แก้ปุ่มเปิด Advanced เป็น `xpath=//label[.//span[normalize-space()='Advanced']]`, แก้ช่อง Max Calories จาก `id=floating_filled` เป็น `xpath=//label[normalize-space()='Max Calories per Slice']/../input`, แก้ช่องชื่อพิซซ่าเป็น `css=input#pizza-name` และเปลี่ยนจากชื่อคงที่ `Lab Pizza test` มาใช้ตัวแปร `${pizzaName}` แทน
  - เพิ่ม (added): ใส่คำสั่งรอ `waitForElementVisible` (หัวข้อ `h1`, ช่องทั้ง 4 ของ Advanced, บรรทัด `Name:` และ `id=rate-result`) กับ `waitForElementPresent` รอตัวเลือก `Knife`, เพิ่ม `executeScript` กับ `echo` สำหรับสร้างและพิมพ์ชื่อพิซซ่าตามเวลา, แล้วเพิ่มคำสั่งเช็กค่า `assertText`, `assertValue`, `assertSelectedLabel`, `assertChecked`, `assertNotText`, `storeText`, `executeScript` และ `assert` เช็กว่าแคลอรีไม่เกิน 600 รวมทั้งหมด 29 คำสั่ง
  - ลบ (deleted): เอาคำสั่งคลิกซ้ำๆ ที่ติดมาตอนกดโฟกัสช่องกรอกออก
- Step 1.6 ชื่อพิซซ่าและผลรันทั้ง 2 รอบ (รันบน Chrome `158.0.8127.38` กับ ChromeDriver `158.0.8127.88`):

| รอบ | ชื่อพิซซ่าจาก `info: echo:` | บรรทัด `Tests:` | เวลารวม |
| --- | --- | --- | ---: |
| 1 | `Lab Pizza 20261124-234342` | `Tests:       2 passed, 2 total` | `9.191 s` |
| 2 | `Lab Pizza 20261124-234434` | `Tests:       2 passed, 2 total` | `9.297 s` |

ผลที่คัดมาจากเทอร์มินัลทั้งหมดเก็บไว้ใน [selenium-ide/evidence/side-runner.txt](selenium-ide/evidence/side-runner.txt)

- Step 1.7 บรรทัดใน `QP01customerTest.java` ที่ต้องแก้และเหตุผล: ในไฟล์ [selenium-ide/QP01customerTest.java](selenium-ide/QP01customerTest.java) บรรทัดที่ 68
  ```java
  driver.findElement(By.xpath("//label[normalize-space()=\'Max Calories per Slice\']/../input")).sendKeys("600");
  ```
  บรรทัดนี้สั่งพิมพ์ `600` ลงไปเลยโดยไม่ได้เรียก `.clear()` ล้างช่องก่อน แต่หน้า QuickPizza ใส่เลข `1000` ไว้ตั้งแต่เปิด Advanced แล้ว ถ้ารันโค้ดนี้ตรงๆ ค่าในช่องจะกลายเป็น `1000600` แทนที่จะเป็น `600` เลยต้องเติม `.clear()` ก่อนพิมพ์ใหม่

## Part 4: Cypress

- รุ่นของเครื่องมือ: `node --version` ได้ `v22.12.0`, `npm --version` ได้ `10.9.0`, `npx cypress version` ได้ `16.3.0` (ตอนแรกลง `16.2.1` แต่พอ Chrome อัปเดตเป็นรุ่น 158 แล้วรันไฟล์ที่สองต่อกัน Cypress 16.2.1 พังขึ้น `* is not a valid URL` เลยอัปเป็น `16.3.0` แล้วหาย)
- Step 4.3 ข้อความ error ตอนตั้งชื่อแท็บผิด: ลองแก้จาก `'Web form'` เป็น `'Web Form'` ตัว Cypress วนรอจนครบ 10 วินาทีแล้วแจ้งพังแบบนี้
  ```text
  Timed out retrying after 10000ms
  + expected - actual
  -'Web form'
  +'Web Form'
  ```
  พอแก้กลับเป็น `'Web form'` เทสต์ก็ผ่านปกติ
- Step 4.6 เครื่องมือและแคลอรีที่ได้จาก `POST /api/pizza`:
  - รอบ 1 ได้เครื่องมือ `Scissors` และ `550` แคลอรีต่อชิ้น
  - รอบ 2 ได้เครื่องมือ `Pizza cutter` และ `500` แคลอรีต่อชิ้น
  ทั้งสองรอบเช็กแล้วว่า request ส่ง `maxCaloriesPerSlice` เป็น `600` จริง ตอบกลับ status `200` และค่าที่โชว์บนหน้าเว็บตรงกับ JSON ที่เซิร์ฟเวอร์ส่งมา
- Step 4.7 บรรทัดที่เจอในหน้าแอดมิน: รอบล่าสุดเจอ `Lab Pizza 20261124-235135 (tool=Pizza cutter, ingredients_number=7)` (แถมในภาพเดียวกันยังเห็นพิซซ่าจากรอบแรก `Lab Pizza 20261124-235048 (tool=Scissors, ingredients_number=6)` อยู่ในรายการด้วย)
- Step 4.8 ผลรันทั้ง 2 รอบบน Chrome 158 (headless):

| รอบ | ผล | เวลา | ชื่อพิซซ่า | เครื่องมือ | แคลอรีต่อชิ้น |
| --- | --- | ---: | --- | --- | ---: |
| 1 | ผ่าน 2/2 (`All specs passed!`) | `00:16` | `Lab Pizza 20261124-235048` | `Scissors` | `550` |
| 2 | ผ่าน 2/2 (`All specs passed!`) | `00:16` | `Lab Pizza 20261124-235135` | `Pizza cutter` | `500` |

- Step 4.9 (Optional) ลองรันบนเบราว์เซอร์ที่สอง: ลองรันด้วย `npx cypress run --browser edge` บน Microsoft Edge 158 (`158.0.4370.33`, headless) ผ่านทั้ง 2 สเปกในเวลา `00:22` ได้พิซซ่าชื่อ `Lab Pizza 20261124-234956` เครื่องมือ `Pizza cutter` แคลอรี `450` จากนั้นค่อยมารันบน Chrome ซ้ำสองรอบเพื่อให้ภาพและวิดีโอที่เก็บส่งเป็นรอบของ Chrome ตามโจทย์

ดูข้อความจากเทอร์มินัลเต็มๆ ได้ที่ [cypress/evidence/cypress-runs.txt](cypress/evidence/cypress-runs.txt), [วิดีโอทั้งสองสเปก](cypress/cypress/videos/) และรูปของรอบล่าสุด 3 รูป: [หน้าผลแนะนำขั้น 4](cypress/cypress/screenshots/pizza-scenario.cy.js/qp01-step4-recommendation.png), [ข้อความให้ล็อกอินขั้น 5](cypress/cypress/screenshots/pizza-scenario.cy.js/qp01-step5-login-needed.png) และ [หน้ารายการแอดมินขั้น 7](cypress/cypress/screenshots/pizza-scenario.cy.js/qp01-step7-admin-list.png)

## Part B คำถามท้ายแล็บ

### 1. ทำไมช่อง Max Calories per Slice ต้องหาผ่านป้ายชื่อแทน id

ตอนเช็กใน Console ด้วย `$$("#floating_filled").length` มันคืนค่ากลับมา 3 ช่อง เพราะช่องตัวเลขทั้งสามช่องบนหน้าใช้ id `floating_filled` ซ้ำกันหมด เลยเอา id มาชี้ตรงๆ ไม่ได้ว่าจะพิมพ์ `600` ลงช่องไหน เทสต์ก็เลยต้องไปหาป้ายชื่อ `Max Calories per Slice` ก่อนแล้วค่อยขยับไปจับช่องกรอกที่อยู่ข้างๆ แทน ถ้าแก้หน้าเว็บได้จะตั้ง id แยกเฉพาะให้ช่องนี้ เช่น `max-calories-per-slice` แล้วผูก `for` ของป้ายชื่อเข้ากับ id นี้ด้วย แบบนี้คนเขียนเทสต์จะเรียกช่องจาก id ได้เลย และถึงอนาคตจะย้ายตำแหน่งช่องในฟอร์ม เทสต์ก็ยังไม่พัง

### 2. ขั้น 7 ของ QP-01 เป็น Test Oracle แบบไหน และช่วยจับบั๊กอะไรได้

การเอาเครื่องมือจากรายการหน้า `/admin` มาเทียบกับเครื่องมือที่ลูกค้าเห็นในขั้น 4 เรียกว่า consistency oracle เพราะเป็นการเช็กว่าข้อมูลตัวเดียวกันจากสองหน้าในระบบตรงกันหรือเปล่า อย่างในรูป [qp01-step7-admin-list.png](cypress/cypress/screenshots/pizza-scenario.cy.js/qp01-step7-admin-list.png) ของรอบ 2 หน้าลูกค้าแนะนำ `Pizza cutter` แล้วแถว `Lab Pizza 20261124-235135 (tool=Pizza cutter, ingredients_number=7)` ในหน้าแอดมินก็ขึ้น `Pizza cutter` เหมือนกัน ถ้าเว็บมีบั๊กประเภทแนะนำลูกค้าอย่างหนึ่งแต่เซฟลงระบบอีกอย่าง หรือหน้าแอดมินดึงเครื่องมือผิดแถวมาโชว์ การเช็กขั้นนี้ก็จะจับได้ทันที

### 3. จะเช็กยังไงว่าพิซซ่าที่ได้เป็นมังสวิรัติจริง

ใน QP-01 ตอนนี้เช็กแค่ว่าติ๊กช่อง `Must be vegetarian` แล้ว แต่ยังไม่ได้เช็กว่าพิซซ่าที่เว็บแนะนำไม่มีเนื้อสัตว์จริงๆ อย่างในรูป [qp01-step4-recommendation.png](cypress/cypress/screenshots/pizza-scenario.cy.js/qp01-step4-recommendation.png) รอบล่าสุดมีวัตถุดิบคือ Extra cheese, Extra virgin olive oil, Roma tomatoes, Mozzarella di bufala, Roasted red peppers, Mushrooms และ Cherry tomatoes ถ้าจะตรวจให้ชัวร์ก็ให้อ่านชื่อวัตถุดิบทั้งหมดในกล่อง `#recommendations` มาเทียบกับรายการวัตถุดิบที่บอกว่าอันไหนเป็นมังสวิรัติหรือมีเนื้อสัตว์ (หรือเช็กฟิลด์ `vegetarian` จากคำตอบของ `POST /api/pizza` ควบคู่กันไปด้วย) ซึ่งตรงนี้ต้องมีตารางข้อมูลวัตถุดิบของระบบหรือข้อมูลจาก API มาเป็นตัวอ้างอิง เพราะแค่ชื่ออย่างเดียวบางอย่างตัดสินไม่ได้ว่ามีส่วนผสมของเนื้อสัตว์ไหม

### 4. เปรียบเทียบ Selenium IDE กับ Cypress จากที่ลองใช้จริง

ตอนใช้ Selenium IDE ต้องใส่คำสั่งรอเองแทบทุกช่วง เช่น ต้องใส่ `waitForElementVisible` ก่อนเช็กหัวข้อ ช่อง Advanced และผลแนะนำ ส่วน Cypress ไม่ต้องมานั่งใส่คำสั่งรอเองทุกบรรทัด เพราะ `cy.get` กับ `.should` จะคอยเช็กซ้ำให้เองจนครบ 10 วินาที แถมดักรอ API ด้วย `cy.wait('@pizza')` ได้ด้วย ตอนทำ QP-01 ฝั่ง `.side` เสียเวลากว่าตรงต้องไล่จัดทีละแถวให้ครบ 29 คำสั่งและเขียนสคริปต์ย่อยแยกตัวเลขแคลอรี แต่ใน Cypress เขียนโค้ด JavaScript ทีเดียวจบแล้วอ่านไล่ตามขั้นง่ายกว่า ด้านผลรัน `selenium-side-runner` สรุปผ่านหรือพังให้ดูไวในเทอร์มินัล (ราว 9 วินาที) ส่วน Cypress ดูย้อนหลังง่ายกว่ามากเพราะได้ทั้งวิดีโอที่มีแถบคำสั่งเทียบกับหน้าเว็บและรูปแคปแยกไว้ให้เปิดเช็กได้เลย

### 5. ถ้าเป็น Project 2 จะเลือกใช้เครื่องมือไหน พร้อมเหตุผล 2 ข้อ

ถ้าทำ Project 2 จะเลือกใช้ Cypress เหตุผลแรกคือมันดักดูข้อมูลที่ส่งไปกลับกับเซิร์ฟเวอร์ด้วย `cy.intercept` ได้เหมือนตอนขั้น 4.6 ทำให้เช็กได้ทั้งว่าหน้าเว็บส่งค่า `600` ไปจริงและเอาคำตอบจากเซิร์ฟเวอร์มาเทียบกับหน้าเว็บได้เลย อีกเหตุผลคือไม่ต้องคอยเดาเวลาใส่คำสั่งรอเองเพราะตัวมันลองซ้ำให้ตามเวลาที่ตั้งไว้ และยังอัดวิดีโอกับแคปรูปตอนรันเก็บเป็นหลักฐานให้ทันที เวลามีเคสพังก็เปิดดูข้อความเทียบค่าจริงกับค่าที่คาดอย่างตอนลองชื่อแท็บ `Web Form` ได้ชัดเจน

### 6. (Part 1) ทำไม target ของปุ่ม Submit ที่ตัวอัดเลือกให้ถึงพังง่าย แล้วอันที่เปลี่ยนมาดีกว่ายังไง

ตอนอัดเทสต์ตัวอัดเลือก `css=.btn` มาให้ ซึ่ง `.btn` เป็นคลาสไว้แต่งหน้าตาปุ่ม ไม่ได้เจาะจงว่าเป็นปุ่ม Submit ถ้าวันหลังมีคนเพิ่มปุ่มใหม่ไว้ข้างบนแล้วใช้คลาส `.btn` เหมือนกัน เทสต์จะไปคลิกปุ่มแรกที่เจอแล้วกดผิดปุ่มทันที พอเปลี่ยนมาใช้ `xpath=//button[@type='submit']` จะมั่นคงกว่าเพราะดูจากหน้าที่ของปุ่มคือ `type="submit"` ต่อให้เปลี่ยนสีหรือเปลี่ยนชื่อคลาสของปุ่ม เทสต์ก็ยังหาปุ่มส่งฟอร์มเจอเหมือนเดิม

### 7. (Part 4) ทำไมใน Cypress ต้องเขียน QP-01 ไว้ในเทสต์เดียว ถ้าแยกขั้น 6–7 ออกไปจะเกิดอะไรขึ้น

ก่อนเริ่มแต่ละ `it` ใหม่ Cypress จะล้างคุกกี้ในเบราว์เซอร์ออกหมดเพื่อไม่ให้เทสต์เก่าปนกับเทสต์ใหม่ แต่ QuickPizza รันอยู่หลายเครื่องและใช้คุกกี้จำว่าเบราว์เซอร์นี้คุยอยู่กับเครื่องไหน ถ้าแยกขั้น 6 กับ 7 ออกไปเป็นอีกเทสต์ คุกกี้จะหายไปทำให้ตอนเข้าหน้า `/admin` อาจโดนส่งไปอีกเครื่องแล้วหาชื่อ `Lab Pizza` ที่เพิ่งสร้างไม่เจอ นอกจากนี้ตัวแปร alias อย่าง `@recommendedTool` ที่เก็บเครื่องมือจากขั้น 4 ก็ส่งข้ามไปอีก `it` ไม่ได้ด้วย เลยต้องเขียนขั้น 1 ถึง 7 ต่อกันในเทสต์เดียว
