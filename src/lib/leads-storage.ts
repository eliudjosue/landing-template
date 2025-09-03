import type { Lead } from '@/types/lead';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

export function ensureDataDir() {
  const dataDir = path.dirname(LEADS_FILE);
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true });
  }
}

export function getLeads(): Lead[] {
  ensureDataDir();
  
  if (!existsSync(LEADS_FILE)) {
    return [];
  }

  try {
    const data = readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const leads = getLeads();
  
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };

  leads.push(newLead);
  
  ensureDataDir();
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  
  return newLead;
}

export function generateCSV(leads: Lead[]): string {
  const headers = ['ID', 'Nombre', 'Email', 'Mensaje', 'Fecha', 'IP', 'User Agent'];
  const rows = leads.map(lead => [
    lead.id,
    lead.name,
    lead.email,
    `"${lead.message.replace(/"/g, '""')}"`,
    lead.createdAt.toISOString(),
    lead.ip || '',
    `"${(lead.userAgent || '').replace(/"/g, '""')}"`
  ]);

  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}