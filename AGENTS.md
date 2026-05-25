# SATI Frontend — Contexto Completo para Agentes IA

> **INSTRUCCIÓN OBLIGATORIA PARA LA IA:**  
> Este archivo es la fuente única de verdad sobre la arquitectura del frontend.  
> **CUALQUIER MODIFICACIÓN** que afecte la estructura del proyecto (nuevas rutas, nuevos componentes en `ui/`, nuevos hooks, nuevos endpoints, cambios en la navegación, cambios en tipos compartidos) **DEBE** reflejarse aquí inmediatamente después de realizada.  
> Si no se actualiza este archivo, el próximo agente trabajará con información desactualizada y cometerá errores.  
> **NO IGNORES ESTA INSTRUCCIÓN.**

---

## 1. Stack Tecnológico

| Propósito | Tecnología |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Lenguaje | TypeScript ~5.9 |
| CSS | Tailwind CSS 4 (vía `@tailwindcss/vite`) |
| Routing | react-router-dom v7 |
| HTTP Client | axios (con `withCredentials: true`) |
| Server State | @tanstack/react-query v5 |
| Formularios | react-hook-form + @hookform/resolvers + Zod |
| Notificaciones | react-hot-toast |
| Iconos | lucide-react |
| Headless UI | @headlessui/react v2 |
| Mapas | leaflet + react-leaflet |
| Google Auth | @react-oauth/google |
| Alias imports | `@/` → `src/` (vite.config.ts) |

**NO USAR:** Redux, Zustand, shadcn, Material UI, Bootstrap, Ant Design, Chakra, CSS Modules, styled-components.

---

## 2. Estructura de Carpetas (Completa)

```
src/
  App.tsx                              # Providers wrapper
  main.tsx                             # Entry point (BrowserRouter, Toaster)
  index.css                            # Tailwind + tokens CSS (light/dark)

  core/
    dominio/tipos/
      api.ts                           # TODOS los DTOs, interfaces, tipos, enums
      schemas.ts                       # Esquemas Zod para formularios
    aplicacion/
      contexto/
        AuthContext.tsx                 # Contexto de autenticación
        ReactQueryProvider.tsx          # Provider de React Query
        ThemeContext.tsx                # Contexto de tema (light/dark)
      hooks/
        useAuth.ts                     # Re-export de AuthContext
        useAuthQuery.ts                # AuthService + login/logout mutations
        useAuthState.ts                # useQuery para /usuarios/me
        useActiveLocationsQuery.ts     # Locations activas (array directo, pública)
        useAllCubiculosActivosQuery.ts # Todos los cubiculos activos (pública, sin filtro por sede)
        useCrearReservaMutation.ts     # Mutation para crear reservas
        useCubiculosPublicosQuery.ts   # Cubiculos activos públicos por location
        useCubiculosQuery.ts           # Queries de cubiculos por location
        useLocationMutations.ts        # CRUD de locations
        useLocationQueries.ts          # Queries de locations
        useLocationsWithActiveCubiculosQuery.ts  # Locations con al menos un cubiculo activo
        useLoginMutation.ts            # Mutation de login con toast
        useLogoutMutation.ts           # Mutation de logout con toast
        usePropietarioRegisterMutation.ts
        usePsicologoRegisterMutation.ts
        useReservasCalendarioQuery.ts  # Reservas por rango de fechas (calendario)
        useReservasQuery.ts            # Query de reservas con filtro opcional (FUTURA/PASADA/CANCELADA)
        useRoles.ts                    # Helper de roles (hasRole, isAdmin, etc.)
    infraestructura/
      api/api.ts                       # axios instance + TODOS los endpoints
      configuracion/config.ts          # appConfig, envVars
      leaflet/config.ts                # Configuración de mapas
      leaflet/geocoding.ts             # Geocoding nominatim
      utilidades/
        errorService.ts                # Manejo centralizado de errores
        toast.ts                       # Wrapper react-hot-toast

  presentation/
    components/
      common/
        Accordion.tsx
        EmptyState.tsx                 # Estado vacío reutilizable
        Modal.tsx
        PageHeader.tsx                 # Encabezado de página estándar
        ProtectedRoute.tsx             # Guard de rutas protegidas
      forms/
        LoginForm.tsx
        PsicologoRegisterForm.tsx
        PropietarioRegisterForm.tsx
      layouts/
        AdminNavigation.tsx            # Navegación admin (ADMIN/PROPIETARIO)
        AppLayout.tsx                  # Layout principal (Header + Sidebar + main)
        BrandSection.tsx               # Logo/marca en sidebar
        Header.tsx                     # Top header con dropdown perfil
        Layout.tsx
        MobileNavigation.tsx           # Bottom nav para móvil
        NavigationMenu.tsx             # Sidebar nav principal
        NavItem.tsx                    # Item de navegación sidebar
        sidebar-system.tsx
        Sidebar.tsx                    # Sidebar desktop
        index.ts
      locations/
        LocationCard.tsx
        LocationForm.tsx
        LocationMapPicker.tsx
        LocationModal.tsx
      cubiculos/
        CubiculoForm.tsx
        DisponibilidadManager.tsx
      reservas/
        BookingsCalendar.tsx            # Calendario reutilizable (props controladas, toolbar externo)
        calendar-dark.css               # Dark mode overrides para react-big-calendar
      ui/
        index.ts                       # Barrel export
        Badge.tsx                      # variants: default|success|warning|danger|info|outline
        Button.tsx                     # variants: primary|secondary|danger, prop isLoading
        Card.tsx                       # Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
        Dialog.tsx                     # Modal con overlay, title, description, footer
        Input.tsx                      # Con soporte error
        Label.tsx
        Select.tsx                     # Con soporte error
        Separator.tsx
        Skeleton.tsx                   # Con prop lines para multi-línea
        Switch.tsx
        Table.tsx                      # Table, THead, TBody, TR, TH, TD, TableToolbar
        Tabs.tsx                       # value, onValueChange, options: TabsOption[]
        Textarea.tsx
      index.ts

    pages/
      account/
        AccountHistoryPage.tsx
        AccountSummaryPage.tsx
        PaymentsPage.tsx
        SubscriptionManagementPage.tsx
      auth/
        LoginPage.tsx
      bookings/
        BookingsPage.tsx               # Calendario admin (grid vista)
        MyAppointmentsPage.tsx         # Mis Reservas (tabla con filtros real API)
        NewBookingPage.tsx             # Crear/editar reserva
        PruebaBookingsCalendar.tsx     # Prueba de calendario de reserva
      chat/
        ChatPage.tsx
      cubiculos/
        BuscarCubiculosPage.tsx
      dashboard/
        DashboardPage.tsx
      documents/
        DocumentsPage.tsx
      faq/
        FaqPage.tsx
      locations/
        LocationsPage.tsx
      logs/
        LogsPage.tsx
      not-found/
        NotFoundPage.tsx
      profile/
        ProfilePage.tsx
      rooms/
        RoomsPage.tsx
      settings/
        SettingsPage.tsx
      system/
        SystemConfigPage.tsx
        SystemMonitoringPage.tsx
      therapists/
        TherapistProfilePage.tsx
        TherapistsPage.tsx
      trust-level/
        TrustLevelPage.tsx
      tutorial/
        TutorialPage.tsx
      users/
        UsersManagementPage.tsx

  routes/
    index.tsx                          # ÚNICO archivo de rutas

  hooks/
    useAuth.ts                         # Re-export

  config/
    google.ts
  components/layout/
    Layout.tsx
    index.ts
```

---

## 3. Convenciones de Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes/páginas | `PascalCase.tsx` | `MyAppointmentsPage.tsx` |
| Hooks | `camelCase.ts` | `useReservasQuery.ts` |
| Utilidades | `camelCase.ts` | `toast.ts`, `errorService.ts` |
| Directorios de páginas | plural minúscula | `bookings/`, `account/`, `cubiculos/` |
| Directorios de features | singular minúscula | `ui/`, `common/`, `layouts/` |
| Tipos/Interfaces | `PascalCaseDTO` / `PascalCaseProps` | `ReservaDTO`, `PageHeaderProps` |
| Enums const | `PascalCase` con `as const` | `EstadoReserva` |
| Types de enums | `PascalCase` (mismo nombre) | `type EstadoReserva = ...` |
| Schemas Zod | `camelCaseSchema` | `loginSchema` |
| Tipos inferidos | `PascalCaseFormData` | `LoginFormData` |

---

## 4. Sistema de Autenticación

### Mecanismo
- **JWT vía HttpOnly cookies** (no se almacena en localStorage ni sessionStorage)
- axios configurado con `withCredentials: true` para enviar cookies automáticamente

### Flujo
1. **Login**: `POST /api/auth/login` → servidor setea cookie HttpOnly
2. **Verificación de sesión**: `GET /api/usuarios/me` vía React Query key `["auth", "user"]`
3. **Logout**: `POST /api/auth/logout` → invalida y limpia caché de React Query

### Contexto
```tsx
interface AuthContextType {
  user: UsuarioMeResponseDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isPsicologo: () => boolean;
  isPropietario: () => boolean;
  isAdmin: () => boolean;
}
```

### Roles disponibles
- `ADMIN`
- `PROPIETARIO`
- `PSICOLOGO`

**Nota:** PROPIETARIO tiene acceso total (bypass de `requiredRole` en `ProtectedRoute`).

### Protección de rutas
```tsx
<ProtectedRoute>
  <MiComponente />
</ProtectedRoute>
```
Si no autenticado → redirect a `/login`.  
Si `requiredRole` especificado y no tiene el rol → muestra "Access Denied".

---

## 5. Sistema de Consumo de API

### Cliente axios
```ts
// src/core/infraestructura/api/api.ts
export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
```

### Endpoints
Todos los endpoints se declaran en el objeto `authAPI` siguiendo el patrón de agrupación por recurso:

```ts
export const authAPI = {
  login, logout, me,
  psicologos: { register },
  propietarios: { register },
  locations: { getAll, getById, create, update, deactivate, activate },
  cubiculos: { getAllByLocation, getActiveByLocation, getById, create, update, activate, deactivate },
  disponibilidades: { getByCubiculo, create, update, delete, deleteAll },
  caracteristicas: { getAll },
  suscripciones: { getAll, getById, getOrdenadosPorPrecio, crear, actualizar, eliminar },
  reservas: { getByFilter, crear },
};
```

### Proxy de desarrollo (vite.config.ts)
```ts
server: {
  proxy: {
    "/api": { target: "http://localhost:8080", changeOrigin: true },
    "/nominatim": { target: "https://nominatim.openstreetmap.org", ... },
  },
}
```

### Patrón de hooks React Query

**Queries:**
```ts
export const useReservasQuery = (filtro?: FiltroTemporal) => {
  return useQuery({
    queryKey: ["reservas", filtro],
    queryFn: async (): Promise<ReservaDTO[]> => {
      const response = await authAPI.reservas.getByFilter(filtro);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,  // 5 minutos
  });
};
```

**Mutations:**
```ts
export const useCrearReservaMutation = () => {
  return useMutation({
    mutationFn: async (data: ReservaCreateRequestDTO) => {
      const res = await authAPI.reservas.crear(data);
      return res.data;
    },
    onSuccess: () => {
      showToast.success("¡Reserva creada exitosamente!");
    },
    onError: (error: any) => {
      const mensaje = error?.response?.data?.message ?? "Ocurrió un error";
      showToast.error(mensaje);
    },
  });
};
```

### Manejo de errores
- `showToast.success()`, `showToast.error()`, `showToast.info()` (react-hot-toast)
- `errorService.ts` con métodos `handleAuthError()` y `handleApiError()`

### Tipado de respuestas
Los DTOs se importan inline en `api.ts` vía `import("...")` para evitar circular dependencies:
```ts
apiClient.get<import("../../dominio/tipos/api").ReservaDTO[]>("/reservas", ...)
```

---

## 6. Sistema Visual

### Estilo
Minimalista, neutro, administrativo. Utility-first con Tailwind CSS 4.

### Sistema de colores (tokens CSS en `index.css`)

| Token | Light | Dark |
|---|---|---|
| `--primary` | blue-600 (37 99 235) | blue-400 (96 165 250) |
| `--bg-app` | gray-50 | gray-900 |
| `--bg-surface` | white | gray-800 |
| `--text-primary` | gray-900 | gray-100 |
| `--text-secondary` | gray-600 | gray-300 |
| `--border` | gray-200 | gray-700 |

### Clases semánticas utilitarias
```css
.bg-app, .bg-surface, .bg-surface-2, .bg-surface-3
.text-default, .text-secondary, .text-muted-foreground
.border-default
.bg-sidebar, .text-sidebar-foreground, .bg-sidebar-primary, etc.
```

### Dark mode
Clase `.dark` en `<html>`. Toggle via `ThemeContext`.

### Componentes UI disponibles (`src/presentation/components/ui/`)

| Componente | Props clave | Variantes |
|---|---|---|
| `Button` | `variant`, `isLoading` | `primary`, `secondary`, `danger` |
| `Badge` | `variant` | `default`, `success`, `warning`, `danger`, `info`, `outline` |
| `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter` | — | — |
| `Tabs` | `value`, `onValueChange`, `options: TabsOption[]` | — |
| `Dialog` | `open`, `onOpenChange`, `title`, `description`, `footer`, `maxWidthClassName` | — |
| `Table` + `THead` + `TBody` + `TR` + `TH` + `TD` + `TableToolbar` | — | — |
| `Input` | `error` | — |
| `Label` | — | — |
| `Select` | `error` | — |
| `Textarea` | — | — |
| `Switch` | `checked`, `onCheckedChange` | — |
| `Skeleton` | `lines` | — |
| `Separator` | — | — |

### Componentes comunes (`src/presentation/components/common/`)

| Componente | Props | Uso |
|---|---|---|
| `PageHeader` | `title`, `description?`, `right?` | Encabezado estándar de página |
| `EmptyState` | `title`, `description?`, `action?`, `icon?` | Estado sin datos |
| `ProtectedRoute` | `children`, `requiredRole?` | Guard de autenticación |
| `Modal` | — | Modal genérico |
| `Accordion` | — | Acordeón |

### Espaciados y layout
- Contenedor página: `<div className="space-y-6">`
- Grids: `grid-cols-1 lg:grid-cols-2 gap-4` o `gap-6`
- Cards: `p-4` content/header
- Títulos de página: `text-2xl md:text-3xl font-bold`
- Card titles: `text-base font-semibold`

### Responsividad
- Desktop: sidebar visible + main content
- Mobile: sidebar oculto, bottom navigation visible
- Tablas: `overflow-x-auto` para scroll horizontal
- Grids adaptativos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

---

## 7. Sistema de Routing

**Archivo único:** `src/routes/index.tsx`

### Estructura
```
Publicas (sin layout):
  /login          → LoginPage
  /auth           → redirect /login
  /faq            → FaqPage
  /tutorial       → TutorialPage

Aliases:
  /my-payments    → redirect /payments
  /account-settings → redirect /settings
  /edit-booking   → redirect /new-booking
  /admin/bookings → redirect /bookings

Protegidas (con <ProtectedRoute>):
  /dashboard               → DashboardPage
  /account-summary         → AccountSummaryPage
  /account-history         → AccountHistoryPage
  /payments                → PaymentsPage
  /payments-record         → SubscriptionManagementPage
  /logs                    → LogsPage
  /config                  → SystemConfigPage
  /bookings-rules          → SystemConfigPage
  /users                   → UsersListPage
  /settings                → SettingsPage
  /locations               → LocationsPage
  /cubiculos               → BuscarCubiculosPage
  /documents               → DocumentsPage
  /chat                    → ChatPage
  /my-bookings             → MyAppointmentsPage (ver sección 12)
  /new-booking             → NewBookingPage
  /bookings                → BookingsPage
  /rooms                   → RoomsPage
  /profile                 → ProfilePage
  /therapists              → TherapistsPage
  /therapist-profile       → TherapistProfilePage
  /system-config           → SystemConfigPage
  /users-management        → UsersListPage
  /monitoring              → MonitoringPage
  /trust-level             → TrustLevelPage
  /booking-calendar-test   → PruebaBookingsCalendarPage

Redirecciones:
  /          → redirect /dashboard
  *          → NotFoundPage
```

### Cómo agregar una nueva página
1. Crear archivo en `src/presentation/pages/<feature>/<NombrePage>.tsx`
2. Exportar como `export const NombrePage: React.FC`
3. Importar en `src/routes/index.tsx`
4. Agregar `<Route path="/ruta" element={<ProtectedRoute><NombrePage /></ProtectedRoute>} />`
5. Agregar `<NavItem>` en `NavigationMenu.tsx` (sidebar)
6. Si aplica, agregar en `MobileNavigation.tsx` (bottom nav)
7. **ACTUALIZAR ESTE ARCHIVO (FRONTEND_CONTEXT.md)**

---

## 8. Navegación

### Sidebar (desktop)
- `NavigationMenu.tsx`: "Inicio", "Mis Reservas" (icono CalendarCheck), "Mi Perfil", "Mis Documentos", "Mis Pagos", "Cubículos", "Ayuda y Soporte", "Prueba Calendario" (icono CalendarDays)
- `AdminNavigation.tsx`: Visible solo para ADMIN/PROPIETARIO — "Registro de Auditoría", "Gestionar Locaciones", "Gestionar Consultorios", "Gestionar Usuarios", etc.

### Bottom nav (mobile, `MobileNavigation.tsx`)
- 5 ítems en grid (`grid-cols-5`): Inicio, Reservas (CalendarCheck), Perfil, Ayuda, Ajustes

---

## 9. Capa de Dominio — Tipos y Schemas

### `src/core/dominio/tipos/api.ts`
Contiene TODOS los DTOs del backend:

**Auth:** `UsuarioLoginDTO`, `UsuarioLoginResponseDTO`, `UsuarioRegisterDTO`, `UsuarioRegisterResponseDTO`, `PsicologoRegisterRequestDTO`, `PsicologoRegisterResponseDTO`, `PropietarioRegisterRequestDTO`, `PropietarioRegisterResponseDTO`, `UsuarioInfoDTO`, `PsicologoInfoDTO`, `PropietarioInfoDTO`, `UsuarioMeResponseDTO`, `Usuario`

**Roles:** `RolNombre` (PSICOLOGO, PROPIETARIO, ADMIN), `DocumentationStatus` (PENDING, APPROVED, REJECTED), `UserRole`

**Locations:** `LocationCreateRequestDTO`, `LocationResponseDTO`

**Cubículos:** `CaracteristicaNombre` (18 características), `CaracteristicaDTO`, `CubiculoCreateRequestDTO`, `CubiculoUpdateRequestDTO`, `CubiculoResponse`, `DiaSemana`, `DisponibilidadCreateRequestDTO`, `DisponibilidadUpdateRequestDTO`, `DisponibilidadResponseDTO`

**Suscripciones:** `SuscripcionDTO`, `CrearSuscripcionRequest`

**Reservas:** `FiltroTemporal` ("FUTURA" | "PASADA" | "CANCELADA"), `EstadoReserva` (PENDIENTE, RECHAZADO, CONFIRMADA, CANCELADA, FINALIZADA), `ReservaCreateRequestDTO`, `ReservaDTO` (con `psicologoNombreCompleto`), `ReservaCreateResponseDTO`, `ReservaFilterRequestDTO` (con `filtroTemporal`), `PagoResponse`

**Paginación:** `BackendPage<T>`, `Page<T>`, `CubiculoPage`

**Utils:** `ApiResponse<T>`, `UserRole`

### `src/core/dominio/tipos/schemas.ts`
Schemas Zod: `loginSchema`, `usuarioRegisterSchema`, `psicologoRegisterSchema`, `propietarioRegisterSchema`, `locationCreateSchema`

---

## 11. Reglas para Futuros Cambios

### Al agregar una nueva página
1. Crear archivo en `presentation/pages/<feature>/`
2. Agregar ruta en `routes/index.tsx`
3. Agregar navegación en `NavigationMenu.tsx` y/o `MobileNavigation.tsx`
4. Si necesita datos del backend:
   - Agregar DTOs en `core/dominio/tipos/api.ts`
   - Agregar endpoint en `core/infraestructura/api/api.ts`
   - Crear hook en `core/aplicacion/hooks/`
5. **Actualizar este archivo**

### Al agregar un nuevo componente UI
- Crear en `presentation/components/ui/`
- Exportar en `presentation/components/ui/index.ts`
- Seguir el patrón de componentes funcionales con TypeScript
- Usar Tailwind classes, sin CSS modules
- **Actualizar este archivo** (sección 6)

### Estilos prohibidos
- ❌ Inline styles
- ❌ CSS modules
- ❌ glassmorphism
- ❌ gradientes exagerados
- ❌ animaciones exageradas
- ❌ componentes de librerías externas UI no listadas en sección 1

### Estilos requeridos
- ✅ Diseño limpio, administrativo, profesional
- ✅ Tailwind utility classes
- ✅ Componentes UI del proyecto
- ✅ Dark mode via tokens CSS
- ✅ Responsivo (mobile-first)

---

---

---

## 12. Estado del Proyecto — "Mis Reservas"

`MyBookingsPage.tsx` fue eliminada y reemplazada por `MyAppointmentsPage.tsx` que ahora se llama **"Mis Reservas"** con integración real al backend:

| Aspecto | Detalle |
|---|---|
| Ubicación | `src/presentation/pages/bookings/MyAppointmentsPage.tsx` |
| Ruta | `/my-bookings` (protegida) |
| API | `GET /api/reservas` → `ReservaDTO[]` (filtrable por `ReservaFilterRequestDTO`) |
| Hook | `useReservasQuery(filtro?)` en `core/aplicacion/hooks/` |
| Endpoint | `authAPI.reservas.getByFilter(params?)` en `api.ts` |
| Tipos | `FiltroTemporal`, `ReservaFilterRequestDTO` en `api.ts` |
| Sidebar | NavItem "Mis Reservas" con icono `CalendarCheck` |
| Mobile nav | 5 ítems: Inicio, Reservas (CalendarCheck), Perfil, Ayuda, Ajustes |

### Arquitectura de la página

```tsx
<PageHeader title="Mis Reservas" description="Gestiona tus reservas por estado." />
<Tabs value={tab} options={Todas|Futuras|Pasadas|Canceladas} />
<Card>
  <CardContent className="p-0">
    {isLoading ? <Skeleton lines={5} /> :
     !reservas.length ? <EmptyState title="No se encontraron reservas." /> :
     <Table>
       <THead>...</THead>
       <TBody>
         {reservas.map(r => <TR>
           <TD>Cubículo / Inicio / Fin / Estado / Creada / Notas</TD>
         </TR>)}
       </TBody>
     </Table>}
  </CardContent>
</Card>
```

### Columnas de tabla

| Columna | Dato | Formato |
|---|---|---|
| Consultorio | `r.cubiculoNombre` | Texto |
| Inicio | `r.inicio` | `10 May 2026, 14:00` |
| Fin | `r.fin` | `10 May 2026, 16:00` |
| Estado | `r.estadoReserva` | Badge coloreado |
| Creada | `r.createdAt` | `10 May 2026, 14:00` |
| Notas | `r.notas` | Truncado con `—` si vacío |

### Mapeo Badge → EstadoReserva

| EstadoReserva | Badge variant |
|---|---|
| CONFIRMADA | `success` |
| PENDIENTE | `warning` |
| CANCELADA | `danger` |
| RECHAZADO | `danger` |
| FINALIZADA | `info` |

### Filtros por Tabs

| Tab | Valor | Query param |
|---|---|---|
| Todas | `ALL` | No envía filtro |
| Futuras | `FUTURA` | `filtro=FUTURA` |
| Pasadas | `PASADA` | `filtro=PASADA` |
| Canceladas | `CANCELADA` | `filtro=CANCELADA` |

---*Última actualización: 22 Mayo 2026*  
*Mantenedor: equipo SATI*

> **Nota:** `BookingsCalendar.tsx` consulta sedes via `useActiveLocationsQuery`, cubiculos activos por sede via `useCubiculosPublicosQuery`, y reservas via `useReservasCalendarioQuery`. El formulario `ReservaForm` es independiente: obtiene cubiculos via `useAllCubiculosActivosQuery` y sedes via `useActiveLocationsQuery`. El calendario solo pre-selecciona campos via props (`defaultSedeId`, `defaultCubiculoId`, `defaultFecha`, etc.). Las flags `DEBUG_MOSTRAR_NOMBRES_DE_RESERVANTES` y `DEBUG_PERMITIR_EDICION` controlan visibilidad de nombres y edición respectivamente.
