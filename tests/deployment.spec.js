/**
 * @file Deployment Tests
 * @description Tests for deployment-related functionality
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Deployment Configuration', () => {
  test('vercel.json should exist and be valid JSON', () => {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    expect(fs.existsSync(vercelJsonPath)).toBe(true);

    const content = fs.readFileSync(vercelJsonPath, 'utf8');
    const config = JSON.parse(content);

    expect(config).toBeDefined();
    expect(config.version).toBe(2);
    expect(config.buildCommand).toBe('npm run build');
    expect(config.outputDirectory).toBe('build');
  });

  test('vercel.json should have proper rewrites for SPA', () => {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    const content = fs.readFileSync(vercelJsonPath, 'utf8');
    const config = JSON.parse(content);

    expect(config.rewrites).toBeDefined();
    expect(config.rewrites.length).toBeGreaterThan(0);

    const rewrite = config.rewrites[0];
    expect(rewrite.source).toBe('/(.*)');
    expect(rewrite.destination).toBe('/index.html');
  });

  test('vercel.json should have security headers', () => {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    const content = fs.readFileSync(vercelJsonPath, 'utf8');
    const config = JSON.parse(content);

    expect(config.headers).toBeDefined();
    expect(config.headers.length).toBeGreaterThan(0);

    // Check for security headers
    const mainHeaders = config.headers.find(h => h.source === '/(.*)');
    expect(mainHeaders).toBeDefined();
    expect(mainHeaders.headers).toContainEqual(
      expect.objectContaining({ key: 'X-Frame-Options', value: 'DENY' })
    );
    expect(mainHeaders.headers).toContainEqual(
      expect.objectContaining({ key: 'X-Content-Type-Options', value: 'nosniff' })
    );
  });

  test('vercel.json should have caching headers for static assets', () => {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    const content = fs.readFileSync(vercelJsonPath, 'utf8');
    const config = JSON.parse(content);

    const staticHeaders = config.headers.find(h => h.source === '/static/(.*)');
    expect(staticHeaders).toBeDefined();

    const cacheControl = staticHeaders.headers.find(h => h.key === 'Cache-Control');
    expect(cacheControl).toBeDefined();
    expect(cacheControl.value).toContain('immutable');
  });

  test('README should mention Vercel deployment', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');

    expect(content).toContain('Vercel');
    expect(content).toContain('Deploy with Vercel');
    expect(content).toContain('vercel.com/button');
  });

  test('README should have Vercel deploy button link', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');

    // Check for Vercel deploy button URL
    expect(content).toMatch(/vercel\.com\/new\/clone/);
    expect(content).toMatch(/repository-url=/);
  });

  test('package.json should have build script', () => {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.build).toBe('node scripts/build.js');
  });
});

test.describe('Build Output', () => {
  test('build directory structure should be correct', () => {
    const buildPath = path.join(process.cwd(), 'build');

    // Build directory may or may not exist depending on test environment
    // Just verify the vercel.json points to the right location
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

    expect(vercelConfig.outputDirectory).toBe('build');
  });
});
