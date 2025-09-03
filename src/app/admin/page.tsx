'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Users, Mail, Calendar } from 'lucide-react';
import type { Lead } from '@/types/content';

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    }
    setAuthLoading(false);
  };

  // Load leads if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated]);

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (!response.ok) {
        throw new Error('Error al cargar leads');
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch {
      setError('Error de autenticación');
    }
  };

  const exportCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'Mensaje', 'IP', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        new Date(lead.createdAt).toLocaleString('es-ES'),
        `"${lead.name}"`,
        lead.email,
        `"${lead.message.replace(/"/g, '""')}"`,
        lead.ip || '',
        `"${lead.userAgent || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acceso Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  name="username"
                  type="text"
                  placeholder="Usuario"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="mt-2 text-gray-600">Gestión de leads y contactos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-gray-600">Total Leads</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <Mail className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{filteredLeads.length}</p>
                <p className="text-gray-600">Leads Filtrados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <Calendar className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => 
                    new Date(lead.createdAt) > new Date(Date.now() - 24*60*60*1000)
                  ).length}
                </p>
                <p className="text-gray-600">Últimas 24h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={exportCSV}
                disabled={filteredLeads.length === 0}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No se encontraron leads con esos criterios' : 'No hay leads aún'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Fecha</th>
                      <th className="text-left p-4 font-medium">Nombre</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Mensaje</th>
                      <th className="text-left p-4 font-medium">Info Técnica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                            </div>
                            <div className="text-gray-500">
                              {new Date(lead.createdAt).toLocaleTimeString('es-ES')}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{lead.name}</div>
                        </td>
                        <td className="p-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="p-4 max-w-md">
                          <div className="text-sm text-gray-900 line-clamp-3">
                            {lead.message}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {lead.ip && (
                              <Badge variant="outline" className="text-xs">
                                IP: {lead.ip}
                              </Badge>
                            )}
                            {lead.userAgent && (
                              <div className="text-xs text-gray-500 truncate max-w-32">
                                {lead.userAgent.split(' ')[0]}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}