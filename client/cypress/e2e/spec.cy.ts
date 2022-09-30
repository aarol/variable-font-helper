/// <reference types="cypress" />

describe('web app', () => {
  it('can output font css', () => {
    cy.visit('/')
    cy.get("input").last().focus().type("Inter")
    
    cy.get('#mantine-r1-0').click()

    cy.get("[data-checked=true]").contains("Latin")
    cy.get("button").last().click()
    cy.get("main").contains("Output")

    cy.get("pre").contains("latin")

    cy.get("button").contains("Download All")

    cy.get('a').contains('latin').should('have.attr', 'href')
  })
})