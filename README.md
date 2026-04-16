# manage-skills

**Automate skill installation for AI agents. Detect your project's tech stack and automatically install relevant skills for smarter AI assistance.**

## 🎯 What is manage-skills?

`manage-skills` is a VS Code extension that bridges the gap between your project's technology stack and AI agents. When you use an AI assistant (like Claude, OpenCode, or any other agent), the quality of its help depends on understanding your project's technologies and best practices.

This extension:

1. **🔍 Detects** your project's technology stack (React, Node.js, TypeScript, etc.)
2. **📦 Suggests** relevant skills from the [skills.sh](https://skills.sh) ecosystem
3. **⚡ Installs** skills automatically into your project
4. **🧠 Enriches** your AI agent with context about your tech stack

**Result**: Your AI agent knows your stack and can provide 100x better, more relevant assistance.

## 📊 How It Works

### Without manage-skills
```
Developer: "How do I optimize React performance?"
Agent: Generic answer about React optimization
❌ Missing context about YOUR specific stack
```

### With manage-skills
```
Step 1: Extension detects React + TypeScript + Next.js
Step 2: Installs relevant skills:
   - vercel-labs/agent-skills/vercel-react-best-practices
   - vercel-labs/agent-skills/vercel-composition-patterns
   - vercel-labs/next-skills/next-best-practices
Step 3: Developer asks question
Step 4: Agent uses installed skills for context
✅ Agent answers with YOUR stack in mind
```

## 🚀 Getting Started

### Installation

Install from VS Code Marketplace:
- Open VS Code
- Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
- Search for "manage-skills"
- Click Install

### First Use

1. Open your project in VS Code
2. Click the "Manage Skills" icon in the Activity Bar (left sidebar)
3. The extension automatically detects your tech stack
4. In the "Suggested Skills" panel, you'll see detected technologies
5. Click "Install All Suggested Skills" or install individual skills per technology

### Two Views

**Suggested Skills** (Main)
- Shows technologies detected in YOUR project
- Click to expand and see relevant skills
- One-click install all or pick individual skills

**Available Skills**
- Browse all ~100+ supported technologies
- Find skills for tech you're planning to use
- Install skills for upcoming projects

## 🛠️ Features

- ✅ **Automatic Detection**: Scans package.json, config files, Gemfile, and more
- ✅ **100+ Technologies**: React, Vue, Angular, Node.js, Python, Ruby, Go, Java, etc.
- ✅ **Smart Agent Detection**: Detects your AI agent and installs optimized skills
- ✅ **Batch Installation**: Install all skills for multiple technologies at once
- ✅ **Search**: Find technologies quickly
- ✅ **Activity Bar Integration**: Easy access from VS Code sidebar

## 📋 Supported Technologies

### Frontend
React, Vue, Angular, Svelte, Next.js, Nuxt, Astro, SvelteKit

### Styling
Tailwind CSS, PostCSS, Sass, Less, shadcn/ui, Styled Components

### Backend
Node.js, Express, Django, FastAPI, Flask, Rails, Sinatra, Go, Java, Spring

### Languages
JavaScript, TypeScript, Python, Ruby, Go, Java, C#, PHP, Rust, Kotlin

### Databases
PostgreSQL, MongoDB, MySQL, SQLite, Redis, Firebase, Supabase

### DevTools
Git, Docker, Kubernetes, Jenkins, GitHub Actions, GitLab CI

### Testing
Jest, Vitest, Mocha, Pytest, RSpec, JUnit, Playwright, Cypress

...and 50+ more! See full list in `SKILLS_MAP` configuration.

## 🎓 How Skills Work

Skills are AI-readable knowledge packages from [skills.sh](https://skills.sh). They contain:
- Best practices for a technology
- Common patterns and anti-patterns
- Performance optimization tips
- Security guidelines
- API references

When you install a skill, it's added to your project. When you ask your AI agent a question, it automatically reads these skills to provide context-aware answers.

## 💡 Example Workflows

### Workflow 1: New React Project
```
1. Create new React app: npx create-react-app my-app
2. Open in VS Code
3. Click "Manage Skills" extension
4. See "React" detected automatically
5. Click "Install All Suggested Skills"
6. Done! Now ask AI about React - it understands your stack
```

### Workflow 2: Migrating to Next.js
```
1. Add Next.js: npm install next
2. Extension detects Next.js
3. Install Next.js skills
4. Ask: "How do I migrate my pages to Next.js App Router?"
5. Agent understands Next.js best practices
```

### Workflow 3: Full Stack Setup
```
1. Project with: React + Node.js + PostgreSQL + Docker
2. Extension detects all 4
3. One click: "Install All Suggested Skills"
4. Installs skills for entire stack
5. AI agent now understands your complete architecture
```

## ⚙️ Configuration

### Detecting Your Agent

The extension automatically detects your AI agent:
- **OpenCode** → Installs agent-specific optimized skills
- **Claude** → Installs Claude-optimized skills
- **Other agents** → Installs universal skills

The detection happens automatically by checking standard agent folder structures.

### Manually Installing Skills

You can also:
1. Expand a technology to see individual skills
2. Click the download icon next to any skill
3. Install specific skills manually

### Adding New Technologies

See [CONTRIBUTING.md](CONTRIBUTING.md) to add support for new technologies.

## 🔧 How to Contribute

We'd love your help! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Adding new technologies
- Fixing detection logic
- Improving UI/UX
- Reporting bugs
- Suggesting features

## 📚 Resources

- [skills.sh Documentation](https://skills.sh) - Learn about the skills ecosystem
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Architecture Documentation](ARCHITECTURE.md) - Deep dive into how manage-skills works

## 🐛 Issues & Bugs

Found a bug? Have a suggestion? [Open an issue](https://github.com/yourusername/manage-skills/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

- Built with [Vercel's Skills Ecosystem](https://skills.sh)
- Icon designs by [your team]
- Contributors: [Community]

---

**Questions?** Check the [FAQ](#faq) or open a discussion.

## FAQ

**Q: Do I need to install skills to use manage-skills?**
A: No, but installing skills makes your AI agent much more helpful.

**Q: Can I use manage-skills without an AI agent?**
A: Yes, but the main benefit is giving your AI agent better context.

**Q: How often should I re-detect technologies?**
A: Automatically after you install new packages. You can also manually refresh.

**Q: Can I remove installed skills?**
A: Currently managed via `npx skills list` and `npx skills remove`. We're working on UI support.

**Q: Does it work with projects that have no package.json?**
A: Yes! We support Python (requirements.txt), Ruby (Gemfile), Java (gradle/maven), etc.

**Q: Is my code scanned/sent anywhere?**
A: No. The extension only reads your local files to detect technologies. No data is sent to any server.
