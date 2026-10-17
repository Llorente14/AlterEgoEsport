import type { APIRoute } from 'astro';
import { robotsTxt } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(String(site ?? 'http://localhost')), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
