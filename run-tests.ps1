#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Playwright Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run tests with detailed reporter
npx playwright test tests/automationpanda_testing.spec.ts --reporter=list,html

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Test execution completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "View detailed HTML report: playwright-report/index.html" -ForegroundColor Yellow
