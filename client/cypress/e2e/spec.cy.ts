/// <reference types="cypress" />

describe('web app', () => {
  it('outputs css for font subsets', () => {
    cy.visit('/')
    cy.get("input").last().focus().type("Inter{downArrow}{enter}")

    cy.get("input[value=latin-ext]").parent().click()

    cy.get("[data-checked=true]").contains("Latin")
    cy.get("button").last().click()
    cy.get("main").contains("Output")

    cy.get("button").contains("Download All")

    cy.get('a').contains('latin').should('have.attr', 'href')
    cy.get('a').contains('latin-ext').should('have.attr', 'href')

    cy.get("pre").contains("/* latin */")
    cy.get("pre").contains("/* latin-ext */")
  })

  it('outputs italic fonts', () => {
    cy.visit('/')
    cy.get("input").last().focus().type("Inter Tight{downArrow}{enter}")

    cy.get("input[value=latin-ext]").parent().click()

    cy.get("label").contains("Italic").parent().click()

    cy.get("[data-checked=true]").contains("Latin")
    cy.get("button").last().click()
    cy.get("main").contains("Output")

    cy.get("button").contains("Download All")

    cy.get('a').contains('latin').should('have.attr', 'href')
    cy.get('a').contains('latin-ext').should('have.attr', 'href')

    cy.get("pre").should("contain.text", "/* latin */").and('contain.text', "normal")
    cy.get("pre").should("contain.text", "/* latin */").and('contain.text', "italic")
    cy.get("pre").should("contain.text", "/* latin-ext */").and('contain.text', "normal")
    cy.get("pre").should("contain.text", "/* latin-ext */").and('contain.text', "italic")
  })
})