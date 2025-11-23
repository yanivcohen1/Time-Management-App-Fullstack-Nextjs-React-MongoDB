describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/')
    cy.contains('Ship fast, stay organized, and keep every todo in sync.')
  })

  it('should navigate to login page', () => {
    cy.visit('/')
    cy.contains('Sign in').click()
    cy.url().should('include', '/login')
    cy.contains('Welcome back')
  })

  it('should navigate to register page', () => {
    cy.visit('/')
    cy.contains('Create an account').click()
    cy.url().should('include', '/register')
    cy.contains('Create your account')
  })

  it('should have login form elements', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.contains('Sign in').should('exist')
    cy.contains('Create one').should('exist')
  })

  it('should have register form elements', () => {
    cy.visit('/register')
    cy.get('input[type="text"]').should('exist') // name field
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.contains('Create account').should('exist')
    cy.contains('Sign in').should('exist')
  })
})