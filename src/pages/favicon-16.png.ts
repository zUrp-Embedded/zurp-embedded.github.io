// SOURCE: zurp-astronomics-site — /favicon-16.png: the tab icon, telescope crop, 16 × 16 px
// AUTHOR: engineer
// DATE: 2026-10-03
// STATUS: active
//
// Rendered at build time from src/assets/brand/Low_tech_DIY.png. Conventions and the crop: src/lib/site-icons.ts.
import type { APIRoute } from 'astro';
import { pngResponse, croppedIcon } from '../lib/site-icons';

export const GET: APIRoute = async () => pngResponse(await croppedIcon(16));
