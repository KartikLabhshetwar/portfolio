import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { expect, it } from 'vitest';
import { projects } from '../src/data/projects';

it('ships a readable local preview for every project with an image', async () => {
  for (const project of projects) {
    if (!project.image) continue;
    expect(project.image).toMatch(/^\/projects\/[\w-]+\.webp$/);
    const path = fileURLToPath(new URL(`../public${project.image}`, import.meta.url));
    const image = await sharp(path).metadata();
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
  }
});
