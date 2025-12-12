import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should register a new student', async ({ page }) => {
    // Navigate to register page
    await page.click('text=Registrar')
    await expect(page).toHaveURL('/register')

    // Fill registration form
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    
    // Select role
    await page.selectOption('select[name="role"]', 'student')

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/student/dashboard')
    
    // Check if user is logged in
    await expect(page.locator('text=John Doe')).toBeVisible()
  })

  test('should register a new mentor', async ({ page }) => {
    await page.click('text=Registrar')
    await expect(page).toHaveURL('/register')

    await page.fill('input[name="firstName"]', 'Jane')
    await page.fill('input[name="lastName"]', 'Smith')
    await page.fill('input[name="email"]', 'jane.smith@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    
    await page.selectOption('select[name="role"]', 'mentor')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/mentor/dashboard')
    await expect(page.locator('text=Jane Smith')).toBeVisible()
  })

  test('should register a new admin', async ({ page }) => {
    await page.click('text=Registrar')
    await expect(page).toHaveURL('/register')

    await page.fill('input[name="firstName"]', 'Admin')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    
    await page.selectOption('select[name="role"]', 'admin')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/admin/dashboard')
    await expect(page.locator('text=Admin User')).toBeVisible()
  })

  test('should login existing user', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to appropriate dashboard based on role
    await expect(page).toHaveURL(/\/(student|mentor|admin)\/dashboard/)
  })

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')

    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('should handle password reset flow', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')

    // Click forgot password link
    await page.click('text=Esqueci minha senha')
    await expect(page).toHaveURL('/forgot-password')

    // Fill email
    await page.fill('input[name="email"]', 'test@example.com')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show success message
    await expect(page.locator('text=Email enviado')).toBeVisible()
  })

  test('should logout user', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for dashboard to load
    await page.waitForURL(/\/(student|mentor|admin)\/dashboard/)

    // Click logout button
    await page.click('button[aria-label="Logout"]')

    // Should redirect to home page
    await expect(page).toHaveURL('/')
    
    // Check if user is logged out
    await expect(page.locator('text=Login')).toBeVisible()
  })

  test('should protect admin routes', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should protect mentor routes', async ({ page }) => {
    await page.goto('/mentor/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should protect student routes', async ({ page }) => {
    await page.goto('/student/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should redirect users based on role', async ({ page }) => {
    // Login as student
    await page.goto('/login')
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/student/dashboard')

    // Logout and login as admin
    await page.click('button[aria-label="Logout"]')
    await page.waitForURL('/')

    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/admin/dashboard')
  })
})
