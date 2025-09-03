import { promises as fs } from 'fs';
import path from 'path';
import type { Lead } from '@/types/content';

const DATA_DIR = '.data';
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

interface LeadsData {
  leads: Lead[];
}

export async function saveLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
  const lead: Lead = {
    ...leadData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    let data: LeadsData = { leads: [] };

    try {
      const fileContent = await fs.readFile(LEADS_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty data
      console.log('Creating new leads file');
    }

    data.leads.push(lead);

    await fs.writeFile(LEADS_FILE, JSON.stringify(data, null, 2));

    return lead;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw new Error('Failed to save lead');
  }
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const fileContent = await fs.readFile(LEADS_FILE, 'utf-8');
    const data: LeadsData = JSON.parse(fileContent);
    return data.leads || [];
  } catch (error) {
    // File doesn't exist or is invalid
    return [];
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}