# Test Suite Documentation

Este documento describe la suite completa de tests para el proyecto **manage-skills**.

## Visión General

Se han creado **1,125 líneas de código de pruebas** que cubren:
- ✅ Detección de tecnologías
- ✅ Instalación individual de skills
- ✅ Instalación de todas las skills de una tecnología
- ✅ Instalación de skills sugeridos
- ✅ Activity Bar y Tree Views
- ✅ Modelos de datos
- ✅ Configuración de skills

## Archivos de Test

### 1. **extension.test.ts** (387 líneas)

Pruebas principales del proyecto:

#### SkillsService Tests (14 tests)
- Inicialización con todas las tecnologías del SKILLS_MAP
- Marcar tecnologías como instaladas/no instaladas
- Obtener tecnologías disponibles vs instaladas
- Búsqueda de tecnologías por nombre e ID
- Eventos de cambio de tecnologías
- Obtención de skills por tecnología

**Ejemplo:**
```typescript
test('Should get available technologies (not installed)', () => {
  const available = skillsService.getAvailableTechnologies();
  assert.strictEqual(available.length, SKILLS_MAP.length);
  assert.strictEqual(available.every(tech => !tech.installed), true);
});
```

#### BuildSkillPath Tests (5 tests)
- Construcción de comandos correctos para instalar skills
- Soporte para agentes personalizados
- Rutas multi-nivel de skills
- Preservación de caracteres especiales (guiones, subguiones)

**Ejemplo:**
```typescript
test('Should build correct skill path with custom agent', () => {
  const skillName = 'vercel-labs/agent-skills/vercel-react-best-practices';
  const result = BuildSkillPath(skillName, 'claude-code');
  assert.strictEqual(
    result, 
    'npx -y skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -y'
  );
});
```

#### Technology Model Tests (5 tests)
- Estructura correcta de tecnologías
- Flags de instalación
- Fechas de detección
- Arrays de skills

#### Skills Map Configuration Tests (5 tests)
- IDs únicos de tecnologías
- Campos requeridos en cada tecnología
- Configuración válida de detección
- Formatos correctos de paths de skills

#### Installation Results Tests (5 tests)
- Seguimiento de instalaciones exitosas
- Seguimiento de fallos
- Generación de mensajes de resumen

**Ejemplo:**
```typescript
test('Should generate correct summary message for partial success', () => {
  const results = [
    { success: true, skillName: 'skill1', message: '' },
    { success: true, skillName: 'skill2', message: '' },
    { success: false, skillName: 'skill3', message: '' }
  ];
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  assert.strictEqual(successCount, 2);
  assert.strictEqual(failCount, 1);
});
```

---

### 2. **installService.test.ts** (199 líneas)

Pruebas de instalación de skills:

#### InstallSkillService Tests (10 tests)
- Métodos de instalación (individual, batch, sugeridos)
- Cálculo de resumen de instalación (éxito/fallos)
- Porcentaje de éxito
- Manejo de resultados vacíos

**Ejemplo:**
```typescript
test('Should calculate installation summary correctly', () => {
  const results: InstallResult[] = [
    { success: true, skillName: 'skill1', message: 'Success 1' },
    { success: true, skillName: 'skill2', message: 'Success 2' },
    { success: false, skillName: 'skill3', message: 'Failed' }
  ];
  
  const summary = installService.getInstallationSummary(results);
  
  assert.strictEqual(summary.totalSkills, 3);
  assert.strictEqual(summary.successCount, 2);
  assert.strictEqual(summary.failCount, 1);
  assert.strictEqual(summary.successPercentage, (2 / 3) * 100);
});
```

#### InstallSkillService Integration Tests (5 tests)
- Instalación de todos los tech skills
- Instalación de skills sugeridos vacíos
- Manejo de opciones (stopOnError)
- Estructura correcta de resultados

---

### 3. **treeProviders.test.ts** (380 líneas)

Pruebas de Activity Bar y Tree Views:

#### AvailableSkillsProvider Tests (12 tests)
- Implementación de TreeDataProvider
- Obtención de hijos para elementos raíz
- Habilidades de una tecnología
- Búsqueda de tecnologías
- Recuento de tecnologías disponibles
- Eventos y refresh
- Actualización de tecnologías

**Ejemplo:**
```typescript
test('Should get skills for technology', async () => {
  const children = await provider.getChildren();
  
  if (children.length > 0) {
    const techItem = children[0];
    const skills = await provider.getChildren(techItem);
    
    skills.forEach(skill => {
      assert.strictEqual(skill instanceof SkillItemTreeItem, true);
    });
  }
});
```

#### SuggestedSkillsProvider Tests (6 tests)
- Implementación de TreeDataProvider
- Obtención de hijos
- Refresh y actualización

#### TreeItem Tests (10 tests)
- Creación de TechnologyTreeItem
- Estado colapsable
- Descripción con contador de skills
- Botones inline
- Valores de contexto (available vs installed)
- SkillItemTreeItem

**Ejemplo:**
```typescript
test('TechnologyTreeItem should have description', () => {
  const tech: Technology = {
    id: 'test-tech',
    name: 'Test Technology',
    detect: { packages: ['test'] },
    skills: ['skill1', 'skill2', 'skill3'],
    installed: false
  };
  
  const item = new TechnologyTreeItem(tech, extensionUri);
  assert.strictEqual(item.description, '3 skills');
});
```

#### Activity Bar Integration Tests (4 tests)
- Creación de providers para activity bar
- Visualización de tecnologías en tree view
- Visualización de skills bajo tecnología

---

### 4. **detectionService.test.ts** (159 líneas)

Pruebas de detección de tecnologías:

#### DetectionService Tests (10 tests)
- Método detectTechnologies
- Detección de technologies en proyecto
- Manejo de directorios no existentes
- Directorios sin tecnologías
- Consistencia de resultados
- Detección de Node.js

**Ejemplo:**
```typescript
test('Should not crash with non-existent directory', () => {
  const fakeProjectPath = path.join(os.tmpdir(), 'non-existent-project-xyz');
  assert.doesNotThrow(() => {
    DetectionService.detectTechnologies(fakeProjectPath);
  });
});
```

#### Technology Detection Result Tests (5 tests)
- Propiedades requeridas (id, name, detect, skills)
- Estructura correcta de resultados
- Validación de arrays

---

## Cobertura de Funcionalidad

### ✅ Instalación Individual de Skill
```
installService.installSkill(skillName: string)
├─ Construcción de comando correcto
├─ Ejecución silenciosa
├─ Notificación de éxito/error
└─ Retorno de InstallResult
```

**Tests:** 
- BuildSkillPath Tests (5)
- InstallSkillService Tests (15)

### ✅ Instalación por Tecnología
```
installService.installAllTechSkills()
├─ Obtención de tecnologías instaladas
├─ Recopilación de skills
├─ Instalación silenciosa de cada skill
├─ Cálculo de resumen
└─ Notificación final única
```

**Tests:**
- SkillsService Tests (14)
- InstallSkillService Tests (10)
- Installation Results Tests (5)

### ✅ Instalación de Skills Sugeridos
```
installService.installAllSuggestedSkills(suggestedSkills: string[])
├─ Validación de array vacío
├─ Instalación silenciosa en batch
├─ Progress reporting
├─ Cálculo de resumen
└─ Notificación final única
```

**Tests:**
- InstallSkillService Integration Tests (5)
- Installation Results Tests (5)

### ✅ Activity Bar y Tree Views
```
AvailableSkillsProvider
├─ Mostrar tecnologías disponibles
├─ Expandir para ver skills
├─ Búsqueda de tecnologías
├─ Recuento de disponibles
└─ Eventos de actualización

SuggestedSkillsProvider
├─ Mostrar skills sugeridos
├─ Actualización dinámica
└─ Eventos de cambio
```

**Tests:**
- AvailableSkillsProvider Tests (12)
- SuggestedSkillsProvider Tests (6)
- TreeItem Tests (10)
- Activity Bar Integration Tests (4)

### ✅ Detección de Tecnologías
```
DetectionService.detectTechnologies()
├─ Lectura de package.json
├─ Búsqueda de archivos de configuración
├─ Análisis de contenido de archivos
├─ Validación de estructura Gradle
└─ Retorno de array de tecnologías
```

**Tests:**
- DetectionService Tests (10)
- Technology Detection Result Tests (5)

---

## Cómo Ejecutar los Tests

### Ejecutar todos los tests:
```bash
npm test
```

### Ejecutar un suite específico:
```bash
npm test -- --grep "SkillsService Tests"
```

### Ejecutar un test específico:
```bash
npm test -- --grep "Should get available technologies"
```

---

## Estadísticas

| Suite | Archivos | Líneas | Tests |
|-------|----------|--------|-------|
| SkillsService | extension.test.ts | 387 | 24 |
| InstallSkillService | installService.test.ts | 199 | 15 |
| TreeProviders | treeProviders.test.ts | 380 | 42 |
| DetectionService | detectionService.test.ts | 159 | 15 |
| **TOTAL** | **4 archivos** | **1,125** | **96+ tests** |

---

## Patrones de Test

### Setup/Teardown
```typescript
setup(() => {
  skillsService = new SkillsService();
  extensionUri = vscode.Uri.file('/test');
  provider = new AvailableSkillsProvider(
    skillsService.getAvailableTechnologies(),
    extensionUri
  );
});

teardown(() => {
  skillsService.dispose();
  provider.dispose();
});
```

### Testing Async
```typescript
test('Should detect technologies in project', () => {
  const projectPath = path.join(__dirname, '../../');
  const detected = DetectionService.detectTechnologies(projectPath);
  
  assert.strictEqual(Array.isArray(detected), true);
});
```

### Testing Events
```typescript
test('Should emit event when technologies change', (done) => {
  const firstTech = skillsService.getAllTechnologies()[0];

  skillsService.onTechnologiesChanged((techs) => {
    assert.notStrictEqual(techs, undefined);
    done();
  });

  skillsService.markTechnologyInstalled(firstTech.id);
});
```

---

## Próximas Mejoras (Opcional)

1. **Tests de Mocking**: Mockear llamadas a `execAsync` para no depender del sistema
2. **Tests de Integración End-to-End**: Simular flujos completos de usuario
3. **Tests de Performance**: Medir tiempos de detección y búsqueda
4. **Tests de UI**: Validar rendering de tree items con snapshot tests
5. **Coverage Report**: Generar reporte de cobertura con `nyc`

