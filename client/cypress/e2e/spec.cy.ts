/// <reference types="cypress" />

describe('web app', () => {
  it('can output font css', () => {
    cy.visit('localhost:5173')
    cy.get("input").last().focus().type("Inter")
    
    cy.get('#mantine-r1-0').click()

    cy.get("[data-checked=true]").contains("Latin")
    cy.get("button").last().click()
    cy.get("main").contains("Output")

    cy.get("button").contains("Download All")

    cy.get("pre").contains("latin")
  })
})