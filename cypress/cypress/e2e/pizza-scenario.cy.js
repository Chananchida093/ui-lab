const HOME = 'https://quickpizza.grafana.com/'
const MAX_CALORIES = 600
const EXCLUDED_TOOL = 'Knife'
const PIZZA_INPUT = 'input[id="pizza-name"]'
const TOOL_LIST = 'select[multiple]'
const VEGETARIAN = 'input[type="checkbox"][id="default-checkbox"]'

function newPizzaName() {
  const date = new Date()
  const local = date.toLocaleString('sv-SE', { hour12: false })
  const [day, time] = local.split(' ')
  return 'Lab Pizza ' + day.replaceAll('-', '') + '-' + time.replaceAll(':', '')
}

describe('QP-01 การขอพิซซ่าจนถึงหน้าแอดมิน', () => {
  // ตรวจผลแนะนำตามเงื่อนไขและดูว่าแอดมินเห็นรายการเดียวกัน
  it('แสดงพิซซ่าชื่อเดิมพร้อมเครื่องมือที่ตรงกัน', () => {
    const name = newPizzaName()

    // ขั้น 1 เปิดหน้าแรก
    cy.visit(HOME)
    cy.get('h1').should('have.text', 'Looking to break out of your pizza routine?')

    // ขั้น 2 เปิด Advanced และรอให้ช่องกรอกขึ้น
    cy.contains('label', 'Advanced').click()
    cy.contains('label', 'Max Calories per Slice').siblings('input').as('calorieInput')
    cy.get('@calorieInput').should('be.visible')
    cy.get(TOOL_LIST).should('be.visible')
    cy.get(VEGETARIAN).should('be.visible')
    cy.get(PIZZA_INPUT).should('be.visible')

    // ขั้น 3 ใส่ค่าตามเคสแล้วอ่านค่ากลับจากหน้า
    cy.get('@calorieInput').clear()
    cy.get('@calorieInput').type(String(MAX_CALORIES)).should('have.value', String(MAX_CALORIES))
    cy.get(TOOL_LIST).select(EXCLUDED_TOOL)
    cy.get(TOOL_LIST).find('option[value="Knife"]').should('be.selected')
    cy.get(VEGETARIAN).check().should('be.checked')
    cy.get(PIZZA_INPUT).type(name).should('have.value', name)

    // ขั้น 4 เทียบผลที่หน้าเว็บแสดงกับผลตอบกลับของ API
    cy.intercept('POST', '/api/pizza').as('pizza')
    cy.contains('button', 'Pizza, Please!').click()
    cy.wait('@pizza').then(({ request, response }) => {
      expect(request.body.maxCaloriesPerSlice).to.equal(MAX_CALORIES)
      expect(response.statusCode).to.equal(200)
      const { pizza, calories } = response.body
      expect(pizza.tool).to.be.a('string').and.not.equal(EXCLUDED_TOOL)
      expect(calories).to.be.a('number').and.at.most(MAX_CALORIES)

      cy.contains('#recommendations p', 'Name:').should('have.text', 'Name: ' + name)
      cy.contains('#recommendations p', 'Tool:').should('have.text', 'Tool: ' + pizza.tool)
      cy.contains('#recommendations p', 'Calories per slice:')
        .should('have.text', 'Calories per slice: ' + calories)
      cy.wrap(pizza.tool, { log: false }).as('recommendedTool')
      cy.task('note', 'POST /api/pizza | ' + name + ' | ' + pizza.tool + ' | ' + calories)
    })
    cy.screenshot('qp01-step4-recommendation')

    // ขั้น 5 กดให้คะแนนตอนยังไม่ล็อกอิน
    cy.contains('button', 'Love it!').click()
    cy.get('#rate-result').should('have.text', 'Please log in first.')
    cy.screenshot('qp01-step5-login-needed')

    // ขั้น 6 เข้าแอดมินในเทสต์เดิม
    cy.adminLogin('admin', 'admin')
    cy.contains('h2', 'Latest pizza recommendations').should('be.visible')

    // ขั้น 7 ค้นตามชื่อ แล้วตรวจเครื่องมือจากบรรทัดที่เจอ
    cy.get('@recommendedTool').then((tool) => {
      cy.contains('li', name)
        .should('contain.text', '(tool=' + tool + ',')
        .invoke('text')
        .then((entry) => cy.task('note', 'Admin list | ' + entry.trim()))
    })
    cy.screenshot('qp01-step7-admin-list')
  })
})
