# Contributing to manage-skills

Thank you for your interest in contributing to manage-skills! We welcome contributions from the community. Whether it's bug reports, feature requests, or code contributions, your help makes this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Adding New Technologies](#adding-new-technologies)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Commit Message Guidelines](#commit-message-guidelines)

## 💼 Code of Conduct

Be respectful and inclusive. We're a community working together to build something great.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- VS Code (for testing)

### Fork & Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/manage-skills.git
cd manage-skills

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/manage-skills.git
```

### Branch Naming

Create branches with descriptive names:
- `feature/add-python-django` - New feature
- `fix/detection-regex-error` - Bug fix
- `docs/update-readme` - Documentation
- `refactor/extract-service` - Code refactoring
- `test/add-edge-cases` - Testing

```bash
git checkout -b feature/your-feature-name
```

## 💻 Development Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Open extension in debug mode
# Press F5 in VS Code (or Run > Start Debugging)
```

## 🎯 Making Changes

### Project Structure

```
src/
├── models/              # Data models & interfaces
├── services/            # Business logic
│   ├── SkillsService.ts       # Core skills management
│   ├── DetectionService.ts    # Technology detection
│   └── InstallSkillService.ts # Installation logic
├── providers/           # VS Code UI providers
│   ├── BaseSkillTreeProvider.ts
│   ├── AvailableSkillsProvider.ts
│   └── SuggestedSkillsProvider.ts
├── config/              # Configuration
│   ├── config.ts
│   └── skills-map.ts    # Technology definitions
├── utils/               # Utilities
└── test/                # Tests
```

### Code Style

- Use TypeScript with strict mode enabled
- Follow existing naming conventions
- Use JSDoc comments for public APIs
- Maximum line length: 100 characters (soft limit)
- Prefer functional patterns over OOP where appropriate

### Example: Adding a Simple Fix

```typescript
// Before
function detectTechs(path: string) {
  // ...
}

// After - Add proper types and documentation
/**
 * Detects all technologies installed in a project
 * @param projectPath - Path to the project directory
 * @returns Array of detected technologies
 */
function detectTechnologies(projectPath: string): Technology[] {
  // ...
}
```

## ➕ Adding New Technologies

The easiest way to contribute! Add new technologies to `src/config/skills-map.ts`:

### Step 1: Add to SKILLS_MAP

```typescript
{
  id: "django",
  name: "Django",
  detect: {
    // Detection configuration (see below)
    packages: ["django"],
    configFiles: ["manage.py"],
  },
  skills: [
    "owner/repo/django-best-practices",
    "owner/repo/django-security",
  ],
  icon: "resources/icons/django.svg" // Optional
}
```

### Step 2: Detection Configuration

Choose the right detection method(s):

**packages** - Check package.json dependencies
```typescript
detect: { packages: ["react", "react-dom"] }
```

**packagePatterns** - Regex matching for packages
```typescript
detect: { packagePatterns: [/^@clerk\//] }
```

**configFiles** - Specific configuration files
```typescript
detect: { configFiles: ["next.config.js", "next.config.mjs"] }
```

**gems** - Ruby gems in Gemfile
```typescript
detect: { gems: ["rails", "rspec"] }
```

**configFileContent** - Pattern matching in config files
```typescript
detect: {
  configFileContent: {
    files: ["pyproject.toml", "requirements.txt"],
    patterns: ["django", "Django"]
  }
}
```

**scanGradleLayout** - Android/Java Gradle detection
```typescript
detect: {
  configFileContent: {
    scanGradleLayout: true,
    patterns: ["com.android.application"]
  }
}
```

### Step 3: Find Skills from skills.sh

Visit [skills.sh](https://skills.sh) and search for skills related to your technology:
```typescript
skills: [
  "owner/repo/skill-name",
  "owner/repo/another-skill"
]
```

### Step 4: Test

```bash
# Make sure detection works
npm test

# Or test manually:
# 1. Create a test project with the technology
# 2. Open in VS Code
# 3. Run the extension and verify detection
```

### Example: Adding Vue.js

```typescript
{
  id: "vue",
  name: "Vue.js",
  detect: {
    packages: ["vue"],
    configFiles: ["vue.config.js", "vitest.config.ts"]
  },
  skills: [
    "vuejs-ai/skills/vue-best-practices",
    "vuejs-ai/skills/vue-composition-api",
    "vuejs-ai/skills/vue-performance"
  ],
  icon: "resources/icons/vue.svg"
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/test/extension.test.ts

# Run with grep pattern
npm test -- --grep "Detection"

# Watch mode
npm test -- --watch
```

### Writing Tests

Add tests to `src/test/` directory:

```typescript
import * as assert from 'assert';
import { SkillsService } from '../services/SkillsService';

suite('SkillsService Tests', () => {
  let skillsService: SkillsService;

  setup(() => {
    skillsService = new SkillsService();
  });

  test('Should initialize with technologies', () => {
    const techs = skillsService.getAllTechnologies();
    assert.strictEqual(techs.length > 0, true);
  });

  test('Should detect installed technologies', () => {
    skillsService.detectTechnologies(__dirname + '/../../');
    const installed = skillsService.getInstalledTechnologies();
    assert.strictEqual(Array.isArray(installed), true);
  });
});
```

### Test Guidelines

- Test public APIs, not implementation details
- Include edge cases (empty strings, null, undefined)
- Use descriptive test names
- Aim for 80%+ code coverage

## 📤 Submitting Changes

### Before You Submit

1. **Update your branch with latest changes**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Compile TypeScript**
   ```bash
   npm run compile
   ```

5. **Test in VS Code**
   - Press F5 to run the extension in debug mode
   - Verify your changes work correctly

### Create Pull Request

Push to your fork:
```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub:
- Clear title: `Add Django technology` or `Fix detection regex`
- Detailed description of changes
- Reference any related issues: `Fixes #123`
- Include before/after if applicable

### PR Requirements

- ✅ All tests pass
- ✅ No linting errors
- ✅ Code is properly formatted
- ✅ TypeScript compiles without errors
- ✅ Commit messages follow guidelines
- ✅ PR description explains what and why

## 📝 Commit Message Guidelines

Follow conventional commit format:

```
type(scope): subject

body

footer
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Build, dependencies, etc.

### Examples

```
feat(detection): add Django technology detection

- Add Django to SKILLS_MAP with proper detection config
- Detect django in requirements.txt
- Detect manage.py file
- Add Django skills from django-ai/skills

Fixes #42
```

```
fix(install): handle missing workspace path gracefully

- Add validation for empty workspace path
- Show user-friendly error message
- Log details for debugging

Fixes #15
```

```
docs(readme): add example workflow for React projects
```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug template:

1. **Title**: Clear and descriptive
2. **Description**: What happened vs. what was expected
3. **Steps to reproduce**: Exact steps to recreate
4. **Environment**: OS, VS Code version, extension version
5. **Screenshots**: If applicable

Example:
```
Title: Detection fails for projects with monorepo structure

Description:
When using a monorepo with Yarn workspaces, the extension doesn't detect technologies in subdirectories.

Steps:
1. Create monorepo with yarn workspaces
2. Install React in packages/web/
3. Open project in VS Code
4. Extension doesn't detect React

Expected: React should be detected in workspace

Environment:
- OS: macOS 14.0
- VS Code: 1.90.0
- Extension: 0.1.0
```

## 💡 Suggesting Features

Use GitHub Discussions or Issues:

1. **Clear description** of the feature
2. **Why it's needed** - problem it solves
3. **Suggested implementation** (optional)
4. **Examples** if applicable

## 🤝 Getting Help

- **Questions?** Open a Discussion on GitHub
- **Need guidance?** Comment on related issues
- **Found an issue?** Open a bug report

## 📚 Additional Resources

- [skills.sh Documentation](https://skills.sh)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Architecture Documentation](ARCHITECTURE.md)

## 🙏 Thank You!

Your contributions make manage-skills better for everyone. Thank you for investing your time in improving this project!

---

**Happy contributing!** 🚀
