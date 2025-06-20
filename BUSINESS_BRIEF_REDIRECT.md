# Business Brief Redirect Functionality

## Descripción

Esta funcionalidad permite que cuando el `current_question_index` de la respuesta del endpoint sea igual a 7, el usuario sea redirigido automáticamente a una nueva página (`/businessBrief`) donde el chat se convierte en una ventana emergente flotante.

## Componentes Creados

### 1. `BusinessBriefPage` (`/src/features/chatbot/components/BusinessBriefPage.tsx`)
- Página principal que se muestra después de la redirección
- Contiene información del brief y estadísticas
- Incluye un botón para abrir/cerrar el chat flotante
- Diseño responsive con cards informativas

### 2. `FloatingChat` (`/src/features/chatbot/components/FloatingChat.tsx`)
- Componente de chat flotante que se puede minimizar/maximizar
- Se posiciona en la esquina inferior derecha
- Mantiene la funcionalidad completa del chat original

### 3. `useBusinessBriefRedirect` (`/src/hooks/useBusinessBriefRedirect.ts`)
- Hook personalizado que maneja la lógica de redirección
- Detecta cuando `current_question_index === 7`
- Redirige automáticamente a `/businessBrief?sessionId=${session_id}`

### 4. `TestRedirectButton` (`/src/features/chatbot/components/TestRedirectButton.tsx`)
- Componente de prueba para simular la redirección
- Solo visible en modo desarrollo
- Permite probar la funcionalidad sin esperar a la pregunta 7

## Páginas Creadas

### `/businessBrief` (`/src/pages/businessBrief.astro`)
- Nueva página que usa el `DashboardLayout`
- Renderiza el componente `BusinessBriefPage`

## Modificaciones Realizadas

### `ChatSessionPage.tsx`
- **MÍNIMA MODIFICACIÓN**: Solo se agregó la lógica de redirección en el `onSuccess` del mutation
- Se mantiene toda la funcionalidad original intacta
- Solo se agrega la verificación de `current_question_index === 7` y la redirección

### `businessBrief.ts`
- Tipos ya estaban definidos correctamente
- No se requirieron modificaciones

## Cómo Funciona

1. **Flujo Normal**: El usuario interactúa con el chat normalmente hasta la pregunta 7
2. **Detección**: Cuando `current_question_index === 7`, se detecta la condición en el `onSuccess`
3. **Redirección**: Se redirige automáticamente a `/businessBrief?sessionId=${session_id}`
4. **Nueva Vista**: El usuario ve la página de business brief con el chat como ventana flotante
5. **Continuidad**: El chat mantiene toda la funcionalidad y el historial de la conversación

## Características del Chat Flotante

- **Posicionamiento**: Esquina inferior derecha
- **Tamaño**: 384px de ancho x 600px de alto (configurable)
- **Minimización**: Se puede minimizar a solo el header
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Funcionalidad Completa**: Mantiene todas las características del chat original

## Pruebas

### En Desarrollo
- Usar el botón "Probar Redirección (Q7)" en la página de business brief
- Este botón simula una respuesta con `current_question_index === 7`

### En Producción
- La redirección ocurre automáticamente cuando el endpoint devuelve `current_question_index: 7`

## Estructura de Archivos

```
src/
├── features/chatbot/components/
│   ├── BusinessBriefPage.tsx      # Página principal del brief
│   ├── FloatingChat.tsx           # Chat flotante
│   ├── TestRedirectButton.tsx     # Botón de prueba
│   └── ChatSessionPage.tsx        # Mínima modificación (solo onSuccess)
├── hooks/
│   └── useBusinessBriefRedirect.ts # Hook de redirección
├── pages/
│   └── businessBrief.astro        # Nueva página
└── lib/api/
    └── businessBrief.ts           # Sin cambios
```

## Modificación Mínima en ChatSessionPage

La única modificación realizada en `ChatSessionPage.tsx` fue agregar estas líneas en el `onSuccess` del mutation:

```typescript
// Verificar si current_question_index es 7 para redirigir
if (data.current_question_index === 7) {
  console.log('Redirigiendo a business brief page - current_question_index:', data.current_question_index);
  // Redirigir a la nueva página con el session_id como parámetro
  window.location.href = `/businessBrief?sessionId=${data.session_id}`;
  return; // Salir temprano para evitar agregar el mensaje
}
```

**No se modificó nada más del componente**, manteniendo toda su funcionalidad original intacta.

## Consideraciones Técnicas

- **Estado del Chat**: Se mantiene el `session_id` para continuar la conversación
- **URL Parameters**: Se pasa el `sessionId` como parámetro de URL
- **Responsive Design**: El chat flotante se adapta a diferentes tamaños
- **Performance**: La redirección es inmediata y no afecta el rendimiento
- **UX**: Transición suave entre la vista de chat completa y la vista de brief

## Próximos Pasos

1. **Contenido del Brief**: Implementar la lógica para mostrar el contenido detallado del brief
2. **Persistencia**: Guardar el estado del brief en base de datos
3. **Exportación**: Permitir exportar el brief como PDF o documento
4. **Compartir**: Funcionalidad para compartir el brief con otros usuarios 