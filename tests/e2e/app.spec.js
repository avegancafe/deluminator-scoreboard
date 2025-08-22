// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Deluminator Scoreboard App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should load the main page with correct title and elements', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check page title
    await expect(page).toHaveTitle('Deluminator Scoreboard');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /🔥 Deluminator Scoreboard 🔥/ })).toBeVisible();
    
    // Check leaderboard section
    await expect(page.getByRole('heading', { name: /🏆 Leaderboard/ })).toBeVisible();
    
    // Check report form section
    await expect(page.getByRole('heading', { name: /📝 Report Your Progress/ })).toBeVisible();
    
    // Check community impact section
    await expect(page.getByRole('heading', { name: /🌟 Community Impact/ })).toBeVisible();
  });

  test('should show empty state when no reports exist', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Should show empty state message
    await expect(page.getByText('No reports yet. Be the first to contribute!')).toBeVisible();
    
    // Should show zero values in stats
    await expect(page.getByText('Total Unalived: 0')).toBeVisible();
    await expect(page.locator('text=Active Contributors').locator('..').getByText('0')).toBeVisible();
  });

  test('should validate form inputs correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Submit button should be disabled initially
    await expect(submitButton).toBeDisabled();
    
    // Enter only name - button should still be disabled
    await nameInput.fill('John Doe');
    await expect(submitButton).toBeDisabled();
    
    // Enter only count (clear name first)
    await nameInput.clear();
    await countInput.fill('5');
    await expect(submitButton).toBeDisabled();
    
    // Enter both name and count - button should be enabled
    await nameInput.fill('John Doe');
    await countInput.fill('5');
    await expect(submitButton).toBeEnabled();
    
    // Test invalid count (zero)
    await countInput.fill('0');
    await expect(submitButton).toBeDisabled();
    
    // Test invalid count (negative)
    await countInput.fill('-1');
    await expect(submitButton).toBeDisabled();
    
    // Restore valid values
    await countInput.fill('5');
    await expect(submitButton).toBeEnabled();
  });

  test('should submit a report and update leaderboard', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Fill out the form
    await nameInput.fill('Alice Smith');
    await countInput.fill('12');
    
    // Submit the form
    await submitButton.click();
    
    // Should show success message
    await expect(page.getByText('🎉 Great work!')).toBeVisible();
    await expect(page.getByText('Your report has been added to the leaderboard.')).toBeVisible();
    
    // Form should be cleared
    await expect(nameInput).toHaveValue('');
    await expect(countInput).toHaveValue('');
    
    // Leaderboard should update
    await expect(page.getByText('Alice Smith')).toBeVisible();
    await expect(page.getByText('12').first()).toBeVisible();
    await expect(page.getByText('👑')).toBeVisible(); // Crown for first place
    
    // Stats should update
    await expect(page.getByText('Total Unalived: 12')).toBeVisible();
    await expect(page.locator('text=Active Contributors').locator('..').getByText('1')).toBeVisible();
    await expect(page.locator('text=Avg per Person').locator('..').getByText('12')).toBeVisible();
  });

  test('should handle multiple reports and rank correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Submit first report
    await nameInput.fill('Alice');
    await countInput.fill('10');
    await submitButton.click();
    await page.waitForTimeout(1000); // Wait for success message to appear and disappear
    
    // Submit second report with higher count
    await nameInput.fill('Bob');
    await countInput.fill('15');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Submit third report
    await nameInput.fill('Charlie');
    await countInput.fill('5');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Check leaderboard order (should be sorted by count descending)
    const leaderboardItems = page.locator('[data-testid="leaderboard-item"], .group').filter({
      has: page.locator('text=Alice, text=Bob, text=Charlie')
    });
    
    // Bob should be first (highest count)
    await expect(page.getByText('Bob')).toBeVisible();
    await expect(page.getByText('👑')).toBeVisible(); // Crown for first place
    
    // Check total stats
    await expect(page.getByText('Total Unalived: 30')).toBeVisible(); // 10 + 15 + 5
    await expect(page.locator('text=Active Contributors').locator('..').getByText('3')).toBeVisible();
    await expect(page.locator('text=Avg per Person').locator('..').getByText('10')).toBeVisible(); // 30/3
  });

  test('should accumulate scores for same user', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Submit first report
    await nameInput.fill('Alice');
    await countInput.fill('10');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Submit second report with same name
    await nameInput.fill('Alice');
    await countInput.fill('5');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should see Alice with accumulated score of 15
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('15').first()).toBeVisible();
    
    // Should still show only 1 contributor
    await expect(page.locator('text=Active Contributors').locator('..').getByText('1')).toBeVisible();
    await expect(page.getByText('Total Unalived: 15')).toBeVisible();
  });

  test('should persist data in localStorage', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Submit a report
    await nameInput.fill('Persistent User');
    await countInput.fill('25');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Verify data is visible
    await expect(page.getByText('Persistent User')).toBeVisible();
    await expect(page.getByText('25').first()).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Data should still be there
    await expect(page.getByText('Persistent User')).toBeVisible();
    await expect(page.getByText('25').first()).toBeVisible();
    await expect(page.getByText('Total Unalived: 25')).toBeVisible();
  });

  test('should show clear all scores functionality', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    
    // Add a report first
    await nameInput.fill('Test User');
    await countInput.fill('10');
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Clear button should be visible
    const clearButton = page.getByRole('button', { name: /Clear All Scores/ });
    await expect(clearButton).toBeVisible();
    
    // Click clear button
    await clearButton.click();
    
    // Should show confirmation modal
    await expect(page.getByText('Clear All Scores?')).toBeVisible();
    await expect(page.getByText('This action cannot be undone')).toBeVisible();
    
    // Cancel first
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Data should still be there
    await expect(page.getByText('Test User')).toBeVisible();
    
    // Try again and confirm
    await clearButton.click();
    await page.getByRole('button', { name: 'Clear All' }).click();
    
    // Should return to empty state
    await expect(page.getByText('No reports yet. Be the first to contribute!')).toBeVisible();
    await expect(page.getByText('Total Unalived: 0')).toBeVisible();
  });

  test('should show animated lanternflies in background', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check for SVG elements that represent the animated lanternflies
    const lanternflies = page.locator('svg').filter({ has: page.locator('ellipse, circle') });
    
    // Should have multiple animated lanternfly SVGs
    await expect(lanternflies).toHaveCount(6); // App creates 6 lanternflies
    
    // Check that they have animation classes
    const animatedElements = page.locator('.animate-fly-1, .animate-fly-2, .animate-fly-3');
    await expect(animatedElements.first()).toBeVisible();
  });

  test('should display pro tips section', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check for pro tips section
    await expect(page.getByText('💡 Pro Tips:')).toBeVisible();
    await expect(page.getByText('Look for red wings with black spots')).toBeVisible();
    await expect(page.getByText('Check tree bark and outdoor surfaces')).toBeVisible();
    await expect(page.getByText('Peak activity is late summer/early fall')).toBeVisible();
    await expect(page.getByText('Report helps track invasive species impact')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    
    // Main elements should still be visible
    await expect(page.getByRole('heading', { name: /🔥 Deluminator Scoreboard 🔥/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /🏆 Leaderboard/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /📝 Report Your Progress/ })).toBeVisible();
    
    // Form should be functional
    const nameInput = page.getByLabel('Your Name');
    const countInput = page.getByLabel('Number of Lanternflies Unalived Today');
    
    await nameInput.fill('Mobile User');
    await countInput.fill('7');
    
    const submitButton = page.getByRole('button', { name: /Submit Report/ });
    await expect(submitButton).toBeEnabled();
  });
});