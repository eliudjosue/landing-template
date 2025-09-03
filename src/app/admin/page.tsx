'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Users, Calendar, Mail } from 'lucide-react';
import type { Lead } from '@/types/lead';

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password'}`),
        },
      });

      if (response.status === 401) {
        setError('Acceso no autorizado');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar los leads');
      }

      const data = await response.json();
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch('/api/admin/export', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password'}`),
        },
      });

      if (!response.ok) {
        throw new Error('Error al exportar');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error al exportar CSV');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando panel admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
          <p className="text-slate-600">Gestión de leads y contactos</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Leads
              </CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Este mes
              </CardTitle>
              <Calendar className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {leads.filter(lead => {
                  const leadDate = new Date(lead.createdAt);
                  const now = new Date();
                  return leadDate.getMonth() === now.getMonth() && 
                         leadDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Última semana
              </CardTitle>
              <Mail className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {leads.filter(lead => {
                  const leadDate = new Date(lead.createdAt);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return leadDate > weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button onClick={exportToCSV} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No hay leads registrados aún.
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                        <p className="text-slate-600">{lead.email}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-700 mb-3 leading-relaxed">
                      {lead.message}
                    </p>
                    
                    <Separator className="my-3" />
                    
                    <div className="text-xs text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>IP: {lead.ip || 'No disponible'}</div>
                      <div>Fecha: {new Date(lead.createdAt).toLocaleString('es-ES')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}