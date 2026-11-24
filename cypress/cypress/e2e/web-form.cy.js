describe('Selenium Web Form', () => {
  // กรอกข้อมูลหลายแบบและตรวจว่าหน้าถัดไปรับแบบฟอร์มแล้ว
  it('ส่งแบบฟอร์มแล้วเห็นข้อความ Received!', () => {
    cy.visit('https://www.selenium.dev/selenium/web/web-form.html')
    cy.title().should('eq', 'Web form')

    cy.get('#my-text-id').type('Order for two').should('have.value', 'Order for two')
    cy.get('[name="my-password"]').type('FormDemo22', { log: false })
    cy.get('[name="my-textarea"]').type('Please ring the bell.')
    cy.get('[name="my-disabled"]').should('be.disabled')
    cy.get('[name="my-readonly"]').should('have.attr', 'readonly')
    cy.get('[name="my-select"]').select('Two').should('have.value', '2')
    cy.get('[name="my-datalist"]').type('Seattle').should('have.value', 'Seattle')
    cy.get('[name="my-file"]').selectFile({
      contents: Cypress.Buffer.from('UI Lab form attachment'),
      fileName: 'form-note.txt',
      mimeType: 'text/plain',
    })
    cy.get('#my-check-2').check().should('be.checked')
    cy.get('#my-radio-2').check().should('be.checked')
    cy.get('#my-radio-1').should('not.be.checked')
    cy.get('[name="my-date"]').type('11/06/2026{esc}').should('have.value', '11/06/2026')

    cy.contains('button[type="submit"]', 'Submit').click()
    cy.title().should('eq', 'Web form - target page')
    cy.get('#message').should('have.text', 'Received!')
  })
})
