import { test, expect } from '@playwright/test'

test.describe('ELTx HUB Complete Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Complete user registration and login flow', async ({ page }) => {
    // Test student registration
    await page.click('text=Registrar')
    await expect(page).toHaveURL('/register')

    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'Student')
    await page.fill('input[name="email"]', 'student@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.selectOption('select[name="role"]', 'student')

    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/student/dashboard')

    // Test logout
    await page.click('[data-testid="logout-button"]')
    await expect(page).toHaveURL('/')

    // Test login
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')

    await page.fill('input[name="email"]', 'student@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/student/dashboard')
  })

  test('Mentor registration and dashboard access', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'Mentor')
    await page.fill('input[name="email"]', 'mentor@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.selectOption('select[name="role"]', 'mentor')

    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/mentor/dashboard')
  })

  test('Admin registration and dashboard access', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'Admin')
    await page.fill('input[name="email"]', 'admin@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.selectOption('select[name="role"]', 'admin')

    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('Password reset flow', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Esqueci minha senha')
    await expect(page).toHaveURL('/forgot-password')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Email enviado')).toBeVisible()
  })

  test('Route protection', async ({ page }) => {
    // Test protected routes without authentication
    await page.goto('/student/dashboard')
    await expect(page).toHaveURL('/login')

    await page.goto('/mentor/dashboard')
    await expect(page).toHaveURL('/login')

    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login')

    await page.goto('/admin/users')
    await expect(page).toHaveURL('/login')
  })

  test('Navigation and responsive design', async ({ page }) => {
    // Test desktop navigation
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=Explorar Cursos')).toBeVisible()
    await expect(page.locator('text=Login')).toBeVisible()
    await expect(page.locator('text=Registrar')).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })

  test('Form validation', async ({ page }) => {
    await page.goto('/register')

    // Test empty form submission
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Campo obrigatório')).toBeVisible()

    // Test invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Email inválido')).toBeVisible()

    // Test short password
    await page.fill('input[name="email"]', 'test@test.com')
    await page.fill('input[name="password"]', '123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Senha deve ter no mínimo 8 caracteres')).toBeVisible()
  })

  test('Profile management', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'student@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('/student/dashboard')

    // Navigate to profile
    await page.click('text=Perfil')
    await expect(page).toHaveURL('/profile')

    // Test profile update
    await page.fill('input[name="firstName"]', 'Updated')
    await page.fill('input[name="lastName"]', 'Name')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Perfil atualizado')).toBeVisible()
  })

  test('Error handling and toasts', async ({ page }) => {
    await page.goto('/login')

    // Test invalid credentials
    await page.fill('input[name="email"]', 'nonexistent@test.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('[data-testid="error-toast"]')).toBeVisible()
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible()
  })

  test('Loading states', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@test.com')
    await page.fill('input[name="password"]', 'password123')

    // Click login and check for loading state
    await page.click('button[type="submit"]')
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
  })
})
