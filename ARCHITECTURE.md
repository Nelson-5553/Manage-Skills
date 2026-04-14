# Estructura del Proyecto - Manage Skills

## Descripción General
Este proyecto es una extensión de VS Code que permite gestionar las tecnologías detectadas en tu proyecto y visualizar sus skills asociados. La extensión analiza automáticamente el proyecto para detectar tecnologías instaladas (React, Node.js, TypeScript, etc.) y muestra los skills disponibles para cada una.

## Estructura de Carpetas

```
manage-skills/
├── src/
│   ├── models/           # Modelos de datos
│   │   ├── Skill.ts      # Interfaz base de Skills (legacy)
│   │   └── Technology.ts # Interfaz extendida de Tecnología
│   ├── services/         # Servicios centrales
│   │   ├── SkillsService.ts    # Gestor central de tecnologías
│   │   └── DetectionService.ts # Detecta tecnologías en proyectos
│   ├── providers/        # Providers para vistas VS Code
│   │   ├── BaseSkillTreeProvider.ts      # Clase base
│   │   ├── AvailableSkillsProvider.ts    # Muestra tecnologías disponibles
│   │   └── InstalledSkillsProvider.ts    # Muestra tecnologías detectadas
│   ├── config/           # Configuración del proyecto
│   │   ├── config.ts     # Constantes de configuración
│   │   └── skills-map.ts # Mapa de 100+ tecnologías con sus skills
│   ├── utils/            # Utilidades
│   │   └── common.ts     # Funciones comunes
│   ├── extension.ts      # Punto de entrada
│   └── test/             # Tests
├── resources/            # Recursos (íconos, imágenes)
├── package.json          # Configuración del proyecto
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Documentación principal
```

## Módulos Principales

### 1. **models/Skill.ts** (Legacy)
Define interfaces básicas de Skills para posible uso futuro.

### 2. **models/Technology.ts** ⭐ (Principal)
```typescript
interface Technology {
  id: string;                    // ID único (ej: "react", "nodejs")
  name: string;                  // Nombre legible (ej: "React")
  detect: DetectConfig;          // Cómo detectar la tecnología
  skills: string[];              // Array de skills asociados
  installed: boolean;            // Si está instalada en el proyecto
  detectedAt?: Date;            // Cuándo se detectó
}
```

### 3. **services/DetectionService.ts** 🔍 (Detección)
Analiza el proyecto para detectar tecnologías instaladas:
- Busca paquetes en `package.json`
- Busca archivos de configuración (tsconfig.json, etc.)
- Busca patrones en archivos (Gradle, etc.)
- Busca gemas en Gemfile (Ruby)

**Métodos principales:**
```typescript
DetectionService.detectTechnologies(projectPath)   // Retorna todas las detectadas
DetectionService.isTechnologyInstalled(path, tech) // Verifica una tecnología específica
```

### 4. **services/SkillsService.ts** 🎯 (Orquestación)
Gestor central que:
- Carga todas las tecnologías del `SKILLS_MAP`
- Ejecuta la detección en el proyecto
- Proporciona métodos para consultar y filtrar
- Emite eventos cuando hay cambios

**Métodos principales:**
```typescript
service.detectTechnologies(projectPath)     // Detecta tecnologías
service.getAvailableTechnologies()          // Retorna no detectadas
service.getInstalledTechnologies()          // Retorna detectadas
service.getTechnologySkills(id)             // Obtiene skills de una tech
service.searchTechnologies(query)           // Busca por nombre
```

### 5. **providers/BaseSkillTreeProvider.ts**
Clase base que implementa `TreeDataProvider` de VS Code:
- Gestiona eventos de cambios
- Define `TechnologyTreeItem` con iconos y tooltips
- Proporciona métodos de actualización

### 6. **providers/AvailableSkillsProvider.ts**
Muestra **tecnologías NO detectadas** en el proyecto:
- Filtra solo `installed === false`
- Permite búsqueda
- Convertidas a `TechnologyTreeItem` para VS Code

### 7. **providers/InstalledSkillsProvider.ts**
Muestra **tecnologías detectadas** en el proyecto:
- Filtra solo `installed === true`
- Permite búsqueda
- Muestra cuando fueron detectadas

### 8. **config/skills-map.ts** 📋 (Base de datos)
Contiene ~100 tecnologías con:
- ID y nombre
- Cómo detectarlas (paquetes, archivos, etc.)
- Array de skills asociados

Ejemplo:
```typescript
{
  id: "react",
  name: "React",
  detect: {
    packages: ["react", "react-dom"]
  },
  skills: [
    "vercel-labs/agent-skills/vercel-react-best-practices",
    "vercel-labs/agent-skills/vercel-composition-patterns"
  ]
}
```

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│ Workspace Abierto                                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │  DetectionService.ts    │
         │  (Escanea proyecto)     │
         └────────────┬────────────┘
                      │
         ┌────────────▼──────────────┐
         │ SKILLS_MAP (config)       │
         │ ~100 tecnologías          │
         └────────────┬──────────────┘
                      │
         ┌────────────▼──────────────┐
         │ SkillsService.ts          │
         │ (Almacena estado)         │
         └────────────┬──────────────┘
                      │
         ┌────────────▴──────────────┐
         │                           │
    ┌────▼─────────┐       ┌────────▼─────┐
    │ Available    │       │ Installed    │
    │ Provider     │       │ Provider     │
    └────┬─────────┘       └────────┬─────┘
         │                          │
    ┌────▼──────────────────────────▼───┐
    │ VS Code Tree Views                 │
    │ (Interfaz Visual)                  │
    └──────────────────────────────────┘
```

## Ciclo de Vida

1. **Activación de extensión**
   - Se crea `SkillsService`
   - Se cargan todas las tecnologías del `SKILLS_MAP`

2. **Detección**
   - Se obtiene la ruta del workspace
   - `DetectionService` analiza el proyecto
   - `SkillsService` marca las detectadas como `installed: true`

3. **Renderizado**
   - `AvailableSkillsProvider` muestra tecnologías no detectadas
   - `InstalledSkillsProvider` muestra las detectadas
   - VS Code renderiza ambas vistas

4. **Interacción**
   - Usuario puede buscar tecnologías
   - Usuario puede marcar manualmente como instalada/no instalada
   - El servicio emite eventos y los providers se actualizan

## Cómo Extender

### Agregar Nueva Tecnología al SKILLS_MAP
1. Abre `src/config/skills-map.ts`
2. Agrega entrada al array `SKILLS_MAP`:
```typescript
{
  id: "my-tech",
  name: "My Technology",
  detect: {
    packages: ["my-package"],
    configFiles: ["my-config.json"]
  },
  skills: ["owner/skills/my-skill"]
}
```

### Agregar Nuevo Método de Detección
1. Actualiza `DetectionService.ts`
2. Agrega método privado para el nuevo tipo de detección
3. Llama desde `isTechnologyInstalled()`

### Agregar Nuevo Comando
1. Registra en `extension.ts` > `registerCommands()`
2. Usa `skillsService` para lógica
3. Actualiza `package.json` si es necesario

## Consideraciones Técnicas

- **Type-safe**: TypeScript estricto (`"strict": true`)
- **Reactivo**: Basado en eventos de VS Code
- **Escalable**: Soporta 100+ tecnologías sin problemas
- **Modular**: Cada servicio tiene responsabilidad única
- **Async**: Usa Promises para operaciones asincrónicas

## Próximos Pasos

- [ ] Persistencia en almacenamiento local (extensión)
- [ ] Integración con APIs externas de skills
- [ ] UI expandible para ver detalles de skills
- [ ] Sincronización con otros editores
- [ ] Caché de detecciones
- [ ] Tests unitarios

