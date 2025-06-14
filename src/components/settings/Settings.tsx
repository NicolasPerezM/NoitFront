import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, CreditCard, Bell, Mail, Sparkles } from 'lucide-react';

export default function SettingsInterface() {
  const [suggestions, setSuggestions] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Settings className="w-7 h-7 text-primary" />
          <h1 className="text-4xl font-bold">Ajustes</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-border mb-10">
            <TabsList className="bg-transparent h-auto p-0 justify-start gap-2">
              <TabsTrigger 
                value="profile" 
                className="relative bg-transparent rounded-lg px-6 py-3 text-muted-foreground data-[state=active]:text-foreground hover:text-foreground/80 font-medium transition-all duration-200 data-[state=active]:bg-accent/50 hover:bg-accent/30"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="general" 
                className="relative bg-transparent rounded-lg px-6 py-3 text-muted-foreground data-[state=active]:text-foreground hover:text-foreground/80 font-medium transition-all duration-200 data-[state=active]:bg-accent/50 hover:bg-accent/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="relative bg-transparent rounded-lg px-6 py-3 text-muted-foreground data-[state=active]:text-foreground hover:text-foreground/80 font-medium transition-all duration-200 data-[state=active]:bg-accent/50 hover:bg-accent/30"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Facturación
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8 mt-8">
            <div>
              <h2 className="text-4xl mb-8">Configuración del Perfil</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center justify-between p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div>
                  <h3 className="text-lg font-medium">Foto de Perfil</h3>
                  <p className="text-sm text-muted-foreground mt-2">¡Actualiza tu foto para personalizar tu perfil!</p>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                      NP
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Cambiar</Button>
                </div>
              </div>

              {/* Username */}
              <div className="p-6 bg-card rounded-lg border border-border mt-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Nombre de Usuario</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tu nombre de usuario puede ser editado en{' '}
                      <a href="#" className="text-primary hover:underline">vercel.com</a>
                    </p>
                  </div>
                  <Input 
                    value="nicolasperezm" 
                    className="w-64"
                    readOnly
                  />
                </div>
              </div>

              {/* Email */}
              <div className="p-6 bg-card rounded-lg border border-border mt-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Correo Electrónico</h3>
                    <p className="text-sm text-muted-foreground mt-2">Tu correo electrónico principal</p>
                  </div>
                  <Input 
                    value="nicolas@example.com" 
                    className="w-64"
                  />
                </div>
              </div>

              {/* Custom Instructions */}
              <div className="p-6 bg-card rounded-lg border border-border mt-4">
                <h3 className="text-lg font-medium mb-3">Instrucciones Personalizadas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ¿Qué te gustaría que v0 sepa sobre ti para mejorar sus respuestas?
                </p>
                <div className="bg-accent/50 border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground">
                    Las instrucciones personalizadas no están disponibles en el plan gratuito de v0.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-8 mt-8">
            <div>
              <h2 className="text-4xl mb-8">Configuración General</h2>
              
              {/* Suggestions */}
              <div className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Sugerencias</h3>
                      <p className="text-sm text-muted-foreground mt-2">Recibe sugerencias relevantes en el chat para refinar tu proyecto.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={suggestions} 
                    onCheckedChange={setSuggestions}
                  />
                </div>
              </div>

              {/* Sound Notifications */}
              <div className="p-6 bg-card rounded-lg border border-border mt-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Bell className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Notificaciones de Sonido</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Se reproducirá un sonido cuando v0 termine de responder y la ventana no esté enfocada.
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={soundNotifications} 
                    onCheckedChange={setSoundNotifications}
                  />
                </div>
              </div>

              {/* Email Notifications */}
              <div className="p-6 bg-card rounded-lg border border-border mt-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Notificaciones por Correo</h3>
                      <p className="text-sm text-muted-foreground mt-2">Recibe actualizaciones y anuncios por correo electrónico.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-8 mt-8">
            <div>
              <h2 className="text-4xl mb-8">Facturación y Suscripción</h2>
              
              {/* Current Plan */}
              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Plan Actual</CardTitle>
                      <CardDescription>Actualmente estás en el plan Gratuito</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Gratuito
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Créditos mensuales</span>
                      <span>200 / 200 utilizados</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div className="bg-destructive h-2.5 rounded-full w-full"></div>
                    </div>
                    <div className="flex justify-center">
                        <Button className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 py-6 text-lg font-semibold rounded-md shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-102 w-1/3 ">
                            Mejorar Plan
                        </Button>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-border mt-6 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Método de Pago</CardTitle>
                  <CardDescription>Administra tus métodos de pago</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="w-14 h-14 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-6">No hay método de pago agregado</p>
                    <Button variant="outline" className="h-11 text-base">
                      Agregar Método de Pago
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="border-border mt-6 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Historial de Facturación</CardTitle>
                  <CardDescription>Visualiza tus transacciones anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay historial de facturación disponible</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}