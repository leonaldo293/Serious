import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'student@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/student/dashboard')
  })

  test('student dashboard should display correct information', async ({ page }) => {
    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard do Aluno')
    
    // Check statistics cards
    await expect(page.locator('text=Cursos Ativos')).toBeVisible()
    await expect(page.locator('text=Aulas Concluídas')).toBeVisible()
    await expect(page.locator('text=Dias de Estudo')).toBeVisible()
    await expect(page.locator('text=Certificados')).toBeVisible()
    
    // Check recent courses section
    await expect(page.locator('text=Cursos Recentes')).toBeVisible()
    
    // Check achievements section
    await expect(page.locator('text=Conquistas')).toBeVisible()
  })

  test('mentor dashboard should display correct information', async ({ page }) => {
    // Logout and login as mentor
    await page.click('button[aria-label="Logout"]')
    await page.waitForURL('/')

    await page.goto('/login')
    await page.fill('input[name="email"]', 'mentor@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/mentor/dashboard')

    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard do Mentor')
    
    // Check statistics cards
    await expect(page.locator('text=Total de Alunos')).toBeVisible()
    await expect(page.locator('text=Cursos Criados')).toBeVisible()
    await expect(page.locator('text=Sessões Agendadas')).toBeVisible()
    await expect(page.locator('text=Avaliação Média')).toBeVisible()
    
    // Check recent students section
    await expect(page.locator('text=Alunos Recentes')).toBeVisible()
    
    // Check upcoming sessions
    await expect(page.locator('text=Próximas Sessões')).toBeVisible()
  })

  test('admin dashboard should display correct information', async ({ page }) => {
    // Logout and login as admin
    await page.click('button[aria-label="Logout"]')
    await page.waitForURL('/')

    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')

    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard Administrativo')
    
    // Check statistics cards
    await expect(page.locator('text=Total de Usuários')).toBeVisible()
    await expect(page.locator('text=Total de Cursos')).toBeVisible()
    await expect(page.locator('text=Receita Mensal')).toBeVisible()
    await expect(page.locator('text=Taxa de Crescimento')).toBeVisible()
    
    // Check charts
    await expect(page.locator('text=Crescimento de Usuários')).toBeVisible()
    await expect(page.locator('text=Receita Mensal')).toBeVisible()
    
    // Check recent activities
    await expect(page.locator('text=Atividades Recentes')).toBeVisible()
  })

  test('admin should be able to navigate to different admin sections', async ({ page }) => {
    // Login as admin
    await page.click('button[aria-label="Logout"]')
    await page.waitForURL('/')

    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')

    // Test navigation
    await page.click('text=Usuários')
    await expect(page).toHaveURL('/admin/users')
    
    await page.click('text=Cursos')
    await expect(page).toHaveURL('/admin/courses')
    
    await page.click('text=Programas')
    await expect(page).toHaveURL('/admin/programs')
    
    await page.click('text=Pagamentos')
    await expect(page).toHaveURL('/admin/payments')
    
    await page.click('text=Relatórios')
    await expect(page).toHaveURL('/admin/reports')
  })

  test('student should be able to access their profile', async ({ page }) => {
    // Click on profile link
    await page.click('text=Perfil')
    await expect(page).toHaveURL('/profile')
    
    // Check profile elements
    await expect(page.locator('text=Meu Perfil')).toBeVisible()
    await expect(page.locator('input[name="firstName"]')).toBeVisible()
    await expect(page.locator('input[name="lastName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('dashboard should be responsive', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if dashboard adapts to mobile
    await expect(page.locator('h1')).toBeVisible()
    
    // Check if sidebar collapses on mobile
    await expect(page.locator('.sidebar')).not.toBeVisible()
    
    // Check if mobile menu button appears
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible()
    
    // Click mobile menu
    await page.click('button[aria-label="Menu"]')
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('dashboard should load data correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[data-testid="stats-card"]', { timeout: 10000 })
    
    // Check if statistics are loaded
    const statsCards = page.locator('[data-testid="stats-card"]')
    await expect(statsCards).toHaveCount(4)
    
    // Check if charts are rendered
    await page.waitForSelector('[data-testid="chart"]', { timeout: 10000 })
    const charts = page.locator('[data-testid="chart"]')
    await expect(charts).toHaveCount(2)
  })

  test('dashboard should handle errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/user/stats', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })

    // Reload page
    await page.reload()

    // Should show error message
    await expect(page.locator('text=Erro ao carregar dados')).toBeVisible()
    
    // Should have retry button
    await expect(page.locator('button[Tentar Novamente]')).toBeVisible()
  })
})
