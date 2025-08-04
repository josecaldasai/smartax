# 🚀 SmarTax AI - Plataforma de Gestión Fiscal Inteligente

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)

*Plataforma impulsada por IA para simplificar la gestión fiscal de PyMEs mexicanas*

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [📁 Estructura de Archivos](#-estructura-de-archivos)
- [🧩 Componentes Principales](#-componentes-principales)
- [📊 Módulos Funcionales](#-módulos-funcionales)
- [⚙️ Configuración del Proyecto](#️-configuración-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [📘 Guía de Desarrollo](#-guía-de-desarrollo)
- [🔧 Scripts Disponibles](#-scripts-disponibles)

---

## 🎯 Descripción del Proyecto

**SmarTax AI** es una plataforma web avanzada diseñada específicamente para PyMEs mexicanas, que utiliza inteligencia artificial para simplificar y automatizar la gestión fiscal. La aplicación proporciona herramientas integrales para el cumplimiento tributario, optimización fiscal y gestión documental.

### 🌟 Características Principales

- **Dashboard Inteligente**: Métricas fiscales en tiempo real con indicadores de salud fiscal
- **Asistente Virtual con IA**: Soporte inteligente para consultas fiscales
- **Gestión de Cumplimiento**: Seguimiento automatizado de obligaciones tributarias
- **Optimización Fiscal**: Recomendaciones personalizadas para ahorro de impuestos
- **Gestión Documental**: Organización y clasificación automática de documentos fiscales
- **Alertas Inteligentes**: Notificaciones proactivas sobre vencimientos y cambios regulatorios

---

## 🏗️ Arquitectura del Sistema

### 🔧 Stack Tecnológico

- **Frontend Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript para tipado estático
- **Styling**: Tailwind CSS para diseño responsivo
- **UI Components**: Componentes React personalizados
- **Estado**: React Hooks para manejo de estado local
- **Iconografía**: Lucide React para iconos consistentes

### 🏛️ Patrones de Arquitectura

- **Arquitectura por Capas**: Separación clara entre presentación, lógica y datos
- **Componentes Modulares**: Cada funcionalidad está encapsulada en componentes reutilizables
- **Separation of Concerns**: Tipos, datos mock y componentes en directorios separados
- **Responsive Design**: Diseño adaptativo para todos los dispositivos

---

## 📁 Estructura de Archivos

```
smartax/
├── 📄 README.md                    # Documentación principal del proyecto
├── 📄 package.json                 # Dependencias y scripts del proyecto
├── 📄 next.config.js              # Configuración de Next.js
├── 📄 tailwind.config.js          # Configuración de Tailwind CSS
├── 📄 tsconfig.json               # Configuración de TypeScript
├── 📄 smartax.txt                 # Especificaciones técnicas detalladas
├── 📄 .gitignore                  # Archivos excluidos del control de versiones
└── src/                           # Código fuente principal
    ├── app/                       # App Router de Next.js 14
    │   ├── 📄 layout.tsx          # Layout principal de la aplicación
    │   ├── 📄 page.tsx            # Página principal/landing
    │   └── 📄 globals.css         # Estilos globales y variables CSS
    ├── components/                # Componentes React organizados por funcionalidad
    │   ├── auth/                  # 🔐 Componentes de autenticación
    │   ├── dashboard/             # 📊 Componentes del dashboard principal
    │   ├── layout/                # 🎨 Componentes de layout (Header, Sidebar)
    │   ├── alerts/                # 🚨 Módulo de alertas y notificaciones
    │   ├── assistant/             # 🤖 Asistente virtual con IA
    │   ├── compliance/            # ✅ Módulo de cumplimiento fiscal
    │   ├── configuration/         # ⚙️ Módulo de configuración del sistema
    │   ├── documents/             # 📄 Módulo de gestión documental
    │   └── optimization/          # 📈 Módulo de optimización fiscal
    ├── lib/                       # Librerías y utilidades
    │   └── 📄 mockData.ts         # Datos de prueba para desarrollo
    └── types/                     # Definiciones de tipos TypeScript
        └── 📄 index.ts            # Tipos e interfaces del sistema
```

---

## 🧩 Componentes Principales

### 🎨 Layout Components (`src/components/layout/`)

#### `Header.tsx`
**Ubicación**: `src/components/layout/Header.tsx`
**Propósito**: Barra de navegación superior con funcionalidades principales
**Características**:
- Menú hamburguesa para dispositivos móviles
- Información del usuario y avatar
- Notificaciones en tiempo real
- Búsqueda global
- Botón de logout

#### `Sidebar.tsx`
**Ubicación**: `src/components/layout/Sidebar.tsx`
**Propósito**: Navegación lateral principal del sistema
**Características**:
- Navegación por módulos principales
- Indicadores de estado activo
- Diseño colapsible y responsivo
- Iconos intuitivos para cada sección
- Contador de notificaciones por módulo

### 📊 Dashboard Components (`src/components/dashboard/`)

#### `Dashboard.tsx`
**Ubicación**: `src/components/dashboard/Dashboard.tsx`
**Propósito**: Contenedor principal del dashboard
**Funcionalidades**:
- Estructura del layout del dashboard
- Gestión del estado de vista actual
- Coordinación entre componentes hijos

#### `DashboardContent.tsx`
**Ubicación**: `src/components/dashboard/DashboardContent.tsx`
**Propósito**: Contenido principal del dashboard con métricas
**Componentes incluidos**:
- Grid de métricas fiscales
- Indicador de salud fiscal
- Acciones rápidas
- Alertas recientes
- Calendario fiscal

#### `FiscalMetricsGrid.tsx`
**Ubicación**: `src/components/dashboard/FiscalMetricsGrid.tsx`
**Propósito**: Visualización de métricas fiscales clave
**Métricas mostradas**:
- Ingresos del período actual
- Gastos deducibles acumulados
- Impuestos por pagar
- Ahorro fiscal potencial
- Comparativas con períodos anteriores

#### `FiscalHealthIndicator.tsx`
**Ubicación**: `src/components/dashboard/FiscalHealthIndicator.tsx`
**Propósito**: Indicador visual del estado de salud fiscal
**Características**:
- Medidor circular con porcentaje
- Códigos de color (verde, amarillo, rojo)
- Recomendaciones basadas en el estado
- Histórico de tendencias

#### `FiscalCalendar.tsx`
**Ubicación**: `src/components/dashboard/FiscalCalendar.tsx`
**Propósito**: Calendario con fechas importantes fiscales
**Funcionalidades**:
- Vista mensual de obligaciones
- Marcadores para fechas de vencimiento
- Alertas visuales por proximidad
- Filtros por tipo de obligación

#### `QuickActions.tsx`
**Ubicación**: `src/components/dashboard/QuickActions.tsx`
**Propósito**: Accesos rápidos a funciones principales
**Acciones disponibles**:
- Generar reporte fiscal
- Subir documentos
- Consultar asesor IA
- Configurar alertas

#### `RecentAlerts.tsx`
**Ubicación**: `src/components/dashboard/RecentAlerts.tsx`  
**Propósito**: Panel de alertas recientes y notificaciones
**Tipos de alertas**:
- Vencimientos próximos
- Cambios regulatorios
- Documentos pendientes
- Oportunidades de ahorro

#### `PendingObligations.tsx`
**Ubicación**: `src/components/dashboard/PendingObligations.tsx`
**Propósito**: Lista de obligaciones fiscales pendientes
**Información mostrada**:
- Nombre de la obligación
- Fecha de vencimiento
- Estado actual
- Monto estimado

### 🔐 Authentication (`src/components/auth/`)

#### `LoginForm.tsx`
**Ubicación**: `src/components/auth/LoginForm.tsx`
**Propósito**: Formulario de autenticación de usuarios
**Características**:
- Validación de campos en tiempo real
- Soporte para recordar usuario
- Opciones de recuperación de contraseña
- Integración con autenticación 2FA
- Manejo de errores de autenticación

---

## 📊 Módulos Funcionales

### 🚨 Alerts Module (`src/components/alerts/AlertsModule.tsx`)
**Funcionalidad**: Centro de gestión de alertas y notificaciones
**Características principales**:
- Dashboard de alertas por prioridad
- Filtros por tipo (críticas, informativas, recordatorios)
- Configuración personalizada de notificaciones
- Historial de alertas procesadas
- Integración con email y SMS

### 🤖 Virtual Assistant (`src/components/assistant/VirtualAssistant.tsx`)
**Funcionalidad**: Asistente virtual impulsado por IA
**Capacidades**:
- Chat interactivo para consultas fiscales
- Respuestas basadas en regulaciones mexicanas
- Generación de recomendaciones personalizadas
- Soporte multimodal (texto, voz)
- Integración con base de conocimientos fiscal

### ✅ Compliance Module (`src/components/compliance/ComplianceModule.tsx`)
**Funcionalidad**: Gestión integral del cumplimiento fiscal
**Componentes incluidos**:
- Calendario de obligaciones fiscales
- Tracking automático de vencimientos
- Generación de reportes de cumplimiento
- Alertas proactivas de regulaciones
- Dashboard de riesgo de incumplimiento

### 📄 Documents Module (`src/components/documents/DocumentsModule.tsx`)
**Funcionalidad**: Sistema de gestión documental
**Características**:
- Subida y clasificación automática de documentos
- OCR para extracción de datos fiscales
- Organizador por categorías y períodos
- Búsqueda inteligente de documentos
- Validación de integridad documental

### 📈 Optimization Module (`src/components/optimization/OptimizationModule.tsx`)
**Funcionalidad**: Motor de optimización fiscal
**Análisis incluidos**:
- Identificación de deducciones aplicables
- Simulaciones de escenarios fiscales
- Recomendaciones de estrategias de ahorro
- Comparativas con empresas similares
- Reportes de oportunidades fiscales

### ⚙️ Configuration Module (`src/components/configuration/ConfigurationModule.tsx`)
**Funcionalidad**: Centro de configuración del sistema
**Opciones disponibles**:
- Configuración de perfil empresarial
- Personalización de dashboard
- Configuración de notificaciones
- Gestión de usuarios y permisos
- Configuración de integraciones

---

## ⚙️ Configuración del Proyecto

### 📄 Archivos de Configuración

#### `package.json`
**Propósito**: Gestión de dependencias y scripts del proyecto
**Dependencias principales**:
- `next`: Framework React para producción
- `react` & `react-dom`: Librería de UI
- `typescript`: Tipado estático
- `tailwindcss`: Framework CSS utilitario
- `lucide-react`: Librería de iconos

#### `next.config.js`
**Propósito**: Configuración específica de Next.js
**Configuraciones**:
- Optimizaciones de rendimiento
- Configuración de rutas
- Variables de entorno
- Configuración de imágenes

#### `tailwind.config.js`
**Propósito**: Personalización de Tailwind CSS
**Configuraciones**:
- Colores personalizados del tema
- Breakpoints responsivos
- Extensiones de utilidades
- Configuración de fuentes

#### `tsconfig.json`
**Propósito**: Configuración del compilador TypeScript
**Configuraciones**:
- Opciones de compilación estrictas
- Alias de paths para imports
- Configuración de JSX
- Reglas de tipado

### 📄 `smartax.txt`
**Propósito**: Documento maestro con especificaciones técnicas completas
**Contenido**:
- Requerimientos funcionales detallados (RF-01 a RF-50)
- Requerimientos no funcionales (RNF-01 a RNF-15)
- Casos de uso específicos (CU-01 a CU-20)
- Arquitectura técnica detallada
- Plan de implementación por fases

---

## 🚀 Instalación y Configuración

### 📋 Requisitos Previos

- **Node.js**: Versión 18.0 o superior
- **npm**: Versión 8.0 o superior (incluido con Node.js)
- **Git**: Para control de versiones

### 🔧 Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/josecaldasai/smartax.git
cd smartax
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

### 🌍 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:
```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=SmarTax AI
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Configuración de IA (futuro)
OPENAI_API_KEY=tu_api_key_aqui
AI_MODEL=gpt-4

# Configuración de base de datos (futuro)
DATABASE_URL=postgresql://usuario:password@localhost:5432/smartax

# Configuración de autenticación (futuro)
NEXTAUTH_SECRET=tu_secret_muy_seguro
NEXTAUTH_URL=http://localhost:3000
```

---

## 📘 Guía de Desarrollo

### 🏗️ Estructura de Componentes

Cada componente sigue la siguiente estructura:
```typescript
// Imports de dependencias
import React from 'react';
import { Icon } from 'lucide-react';

// Import de tipos
import { ComponentProps } from '@/types';

// Definición del componente
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Estado local
  const [estado, setEstado] = useState(valorInicial);

  // Efectos y lógica
  useEffect(() => {
    // Lógica del efecto
  }, [dependencias]);

  // Render del componente
  return (
    <div className="clases-tailwind">
      {/* Contenido del componente */}
    </div>
  );
}
```

### 📊 Datos Mock (`src/lib/mockData.ts`)

Contiene datos de prueba para desarrollo:
- **`mockUser`**: Datos del usuario actual
- **`mockFiscalMetrics`**: Métricas fiscales de ejemplo
- **`mockAlerts`**: Alertas de prueba
- **`mockObligations`**: Obligaciones fiscales simuladas
- **`mockDocuments`**: Documentos de ejemplo

### 🎯 Tipos TypeScript (`src/types/index.ts`)

Definiciones de tipos principales:
- **`User`**: Información del usuario
- **`FiscalMetric`**: Estructura de métricas fiscales
- **`Alert`**: Estructura de alertas
- **`Obligation`**: Obligaciones fiscales
- **`Document`**: Metadatos de documentos

### 🎨 Estilos y Tema

#### Paleta de Colores Principal:
- **Primario**: Blue-600 (#2563EB)
- **Secundario**: Emerald-500 (#10B981)  
- **Advertencia**: Amber-500 (#F59E0B)
- **Error**: Red-500 (#EF4444)
- **Éxito**: Green-500 (#22C55E)

#### Breakpoints Responsivos:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## 🔧 Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en modo turbo (más rápido)
npm run turbo
```

### Construcción
```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Calidad de Código
```bash
# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Formatear código
npm run format
```

### Testing (Futuro)
```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests e2e
npm run test:e2e
```

---

## 📈 Roadmap de Desarrollo

### 🚀 Fase 1: MVP (Actual)
- ✅ Estructura base del proyecto
- ✅ Componentes de UI principales  
- ✅ Dashboard con métricas mock
- ✅ Navegación y layout responsivo

### 🔄 Fase 2: Backend Integration
- [ ] API REST con Next.js API Routes
- [ ] Base de datos PostgreSQL
- [ ] Autenticación con NextAuth.js
- [ ] Sistema de roles y permisos

### 🤖 Fase 3: IA y Automatización
- [ ] Integración con OpenAI GPT-4
- [ ] OCR para procesamiento de documentos
- [ ] Machine Learning para recomendaciones
- [ ] Chatbot inteligente

### 📊 Fase 4: Analytics y Reportes
- [ ] Dashboard de analytics avanzado
- [ ] Generación automática de reportes
- [ ] Exportación a PDF y Excel
- [ ] Gráficos interactivos

### 🔗 Fase 5: Integraciones
- [ ] APIs del SAT (CFDI, RFCs)
- [ ] Bancos y instituciones financieras
- [ ] Sistemas contables existentes
- [ ] Notificaciones push y email

---

## 🤝 Contribución

### 🌟 Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### 📝 Convenciones de Código

- **Naming**: camelCase para variables, PascalCase para componentes
- **Files**: PascalCase para componentes React (.tsx)
- **Commits**: Usar conventional commits (feat:, fix:, docs:, etc.)
- **Comments**: En español para lógica de negocio, inglés para código técnico

---

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto:

- **📧 Email**: [jose.caldas@smartax.ai](mailto:jose.caldas@smartax.ai)
- **🐛 Issues**: [GitHub Issues](https://github.com/josecaldasai/smartax/issues)
- **📖 Wiki**: [Documentación Técnica](https://github.com/josecaldasai/smartax/wiki)

---

<div align="center">

**🚀 Desarrollado con ❤️ para PyMEs mexicanas**

*SmarTax AI - Transformando la gestión fiscal con inteligencia artificial*

![Made in Mexico](https://img.shields.io/badge/Made%20in-Mexico-green?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA5NzRGIi8+CjxyZWN0IHk9IjEzLjMzMzMiIHdpZHRoPSIyMCIgaGVpZ2h0PSI2LjY2NjY3IiBmaWxsPSIjQ0UxMTI2Ii8+Cjwvc3ZnPgo=)

</div>