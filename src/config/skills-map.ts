// ── Types ─────────────────────────────────────────────────────

export interface ConfigFileContentBlock {
  files?: string[];
  patterns: string[];
  scanGradleLayout?: boolean;
}

export interface DetectConfig {
  packages?: string[];
  packagePatterns?: RegExp[];
  configFiles?: string[];
  gems?: string[];
  configFileContent?: ConfigFileContentBlock | ConfigFileContentBlock[];
}

export interface Technology {
  id: string;
  name: string;
  detect: DetectConfig;
  skills: string[];
  icon?: string;
}

// ── Skills Map ────────────────────────────────────────────────

export const SKILLS_MAP: Technology[] = [
  {
    id: "react",
    name: "React",
    detect: {
      packages: ["react", "react-dom"],
    },
    skills: [
      "vercel-labs/agent-skills/vercel-react-best-practices",
      "vercel-labs/agent-skills/vercel-composition-patterns",
    ],
    icon: "resources/icons/react.svg"
  },
  {
    id: "nextjs",
    name: "Next.js",
    detect: {
      packages: ["next"],
      configFiles: ["next.config.js", "next.config.mjs", "next.config.ts"],
    },
    skills: [
      "vercel-labs/next-skills/next-best-practices",
      "vercel-labs/next-skills/next-cache-components",
      "vercel-labs/next-skills/next-upgrade",
    ],
    icon: "resources/icons/nextjs_icon_dark.svg"
  },
  {
    id: "vue",
    name: "Vue",
    detect: {
      packages: ["vue"],
    },
    skills: [
      "hyf0/vue-skills/vue-best-practices",
      "hyf0/vue-skills/vue-debug-guides",
      "antfu/skills/vue",
      "antfu/skills/vue-best-practices",
    ],
    icon: "resources/icons/vue.svg"
  },
  {
    id: "nuxt",
    name: "Nuxt",
    detect: {
      packages: ["nuxt"],
      configFiles: ["nuxt.config.js", "nuxt.config.ts"],
    },
    skills: ["antfu/skills/nuxt"],
    icon: "resources/icons/nuxt.svg"
  },
  {
    id: "pinia",
    name: "Pinia",
    detect: {
      packages: ["pinia"],
    },
    skills: ["vuejs-ai/skills/vue-pinia-best-practices"],
    icon: "resources/icons/pinia.svg"
  },
  {
    id: "svelte",
    name: "Svelte",
    detect: {
      packages: ["svelte", "@sveltejs/kit"],
      configFiles: ["svelte.config.js"],
    },
    skills: [
      "ejirocodes/agent-skills/svelte5-best-practices",
      "sveltejs/ai-tools/svelte-code-writer",
    ],
    icon: "resources/icons/svelte.svg"
  },
  {
    id: "angular",
    name: "Angular",
    detect: {
      packages: ["@angular/core"],
      configFiles: ["angular.json"],
    },
    skills: [
      "angular/skills/angular-developer",
      "angular/angular/reference-core",
      "angular/angular/reference-signal-forms",
      "angular/angular/reference-compiler-cli",
      "angular/angular/adev-writing-guide",
      "angular/angular/PR Review",
    ],
    icon: "resources/icons/angular.svg"
  },
  {
    id: "astro",
    name: "Astro",
    detect: {
      packages: ["astro"],
      configFiles: ["astro.config.mjs", "astro.config.js", "astro.config.ts"],
    },
    skills: ["astrolicious/agent-skills/astro"],
    icon: "resources/icons/astro-icon-dark.svg"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    detect: {
      packages: ["tailwindcss", "@tailwindcss/vite"],
      configFiles: ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs"],
    },
    skills: ["giuseppe-trisciuoglio/developer-kit/tailwind-css-patterns"],
    icon: "resources/icons/tailwindcss.svg"
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    detect: {
      configFiles: ["components.json"],
    },
    skills: ["shadcn/ui/shadcn"],
    icon: "resources/icons/shadcn-ui_dark.svg"
  },
  {
    id: "typescript",
    name: "TypeScript",
    detect: {
      packages: ["typescript"],
      configFiles: ["tsconfig.json"],
    },
    skills: ["wshobson/agents/typescript-advanced-types"],
    icon: "resources/icons/typescript.svg"
  },
  {
    id: "zod",
    name: "Zod",
    detect: {
      packages: ["zod"],
    },
    skills: ["pproenca/dot-skills/zod"],
    icon: "resources/icons/zod.svg"
  },
  {
    id: "supabase",
    name: "Supabase",
    detect: {
      packages: ["@supabase/supabase-js", "@supabase/ssr"],
    },
    skills: ["supabase/agent-skills/supabase-postgres-best-practices"],
    icon: "resources/icons/supabase.svg"
  },
  {
    id: "neon",
    name: "Neon Postgres",
    detect: {
      packages: ["@neondatabase/serverless"],
    },
    skills: ["neondatabase/agent-skills/neon-postgres"],
    icon: "resources/icons/neon.svg"
  },
  {
    id: "playwright",
    name: "Playwright",
    detect: {
      packages: ["@playwright/test", "playwright"],
      configFiles: ["playwright.config.ts", "playwright.config.js"],
    },
    skills: ["currents-dev/playwright-best-practices-skill/playwright-best-practices"],
    icon: "resources/icons/playwright.svg"
  },
  {
    id: "expo",
    name: "Expo",
    detect: {
      packages: ["expo"],
    },
    skills: [
      "expo/skills/building-native-ui",
      "expo/skills/native-data-fetching",
      "expo/skills/upgrading-expo",
      "expo/skills/expo-tailwind-setup",
      "expo/skills/expo-dev-client",
      "expo/skills/expo-deployment",
      "expo/skills/expo-cicd-workflows",
      "expo/skills/expo-api-routes",
      "expo/skills/use-dom",
    ],
    icon: "resources/icons/expo.svg"
  },
  {
    id: "react-native",
    name: "React Native",
    detect: {
      packages: ["react-native"],
    },
    skills: ["sleekdotdesign/agent-skills/sleek-design-mobile-apps"],
    icon: "resources/icons/react.svg"
  },
  {
    id: "dart",
    name: "Dart",
    detect: {
      configFiles: ["pubspec.yaml"],
    },
    skills: ["kevmoo/dash_skills/dart-best-practices"],
    icon: "resources/icons/dart.svg"
  },
  {
    id: "flutter",
    name: "Flutter",
    detect: {
      configFileContent: {
        patterns: ["flutter:"],
        files: ["pubspec.yaml"],
      },
    },
    skills: [
      "jeffallan/claude-skills/flutter-expert",
      "madteacher/mad-agents-skills/flutter-animations",
      "madteacher/mad-agents-skills/flutter-testing",
    ],
    icon: "resources/icons/flutter.svg"

  },
  {
    id: "kotlin-multiplatform",
    name: "Kotlin Multiplatform",
    detect: {
      configFileContent: {
        scanGradleLayout: true,
        patterns: [
          'kotlin("multiplatform")',
          "org.jetbrains.kotlin.multiplatform",
          'id("org.jetbrains.kotlin.multiplatform")',
          "kotlin-multiplatform",
        ],
      },
    },
    skills: [
      "Kotlin/kotlin-agent-skills/kotlin-tooling-cocoapods-spm-migration",
      "Kotlin/kotlin-agent-skills/kotlin-tooling-agp9-migration",
    ],
    icon: "resources/icons/kotlin.svg"
  },
  {
    id: "android",
    name: "Android",
    detect: {
      configFileContent: {
        scanGradleLayout: true,
        patterns: [
          "com.android.application",
          "com.android.library",
          'id("com.android.application")',
          'id("com.android.library")',
          "com.android.kotlin.multiplatform.library",
        ],
      },
    },
    skills: [
      "krutikJain/android-agent-skills/android-kotlin-core",
      "krutikJain/android-agent-skills/android-compose-foundations",
      "krutikJain/android-agent-skills/android-architecture-clean",
      "krutikJain/android-agent-skills/android-di-hilt",
      "krutikJain/android-agent-skills/android-gradle-build-logic",
      "krutikJain/android-agent-skills/android-coroutines-flow",
      "krutikJain/android-agent-skills/android-networking-retrofit-okhttp",
      "krutikJain/android-agent-skills/android-testing-unit",
    ],
    icon: "resources/icons/android-icon.svg"
  },
  {
    id: "remotion",
    name: "Remotion",
    detect: {
      packages: ["remotion", "@remotion/cli"],
    },
    skills: ["remotion-dev/skills/remotion-best-practices"],
    icon: "resources/icons/remotion.svg"
  },
  {
    id: "react-router",
    name: "React Router",
    detect: {
      packages: ["react-router", "@react-router/node", "@react-router/dev", "@react-router/serve"],
    },
    skills: [],
  },
  {
    id: "tanstack-start",
    name: "TanStack Start",
    detect: {
      packages: ["@tanstack/react-start", "@tanstack/start"],
    },
    skills: ["tanstack-skills/tanstack-skills/tanstack-start"],
    icon: "resources/icons/tanstack.svg"
  },
  {
    id: "chrome-extension",
    name: "Chrome Extension",
    detect: {
      configFileContent: {
        files: ["manifest.json"],
        patterns: ["manifest_version"],
      },
    },
    skills: ["mindrally/skills/chrome-extension-development"],
    icon: "resources/icons/chrome.svg"
  },
  {
    id: "clerk",
    name: "Clerk",
    detect: {
      packages: [
        "@clerk/nextjs",
        "@clerk/remix",
        "@clerk/astro",
        "@clerk/express",
        "@clerk/fastify",
        "@clerk/nuxt",
        "@clerk/vue",
        "@clerk/react",
        "@clerk/expo",
        "@clerk/tanstack-react-start",
        "@clerk/react-router",
        "@clerk/chrome-extension",
        "@clerk/backend",
      ],
      packagePatterns: [/^@clerk\//],
      configFileContent: [
        {
          files: ["Package.swift"],
          patterns: ["clerk/clerk-ios", "ClerkSDK"],
        },
        {
          scanGradleLayout: true,
          patterns: ["com.clerk"],
        },
      ],
    },
    skills: [
      "clerk/skills/clerk",
      "clerk/skills/clerk-setup",
      "clerk/skills/clerk-custom-ui",
      "clerk/skills/clerk-backend-api",
      "clerk/skills/clerk-orgs",
      "clerk/skills/clerk-webhooks",
      "clerk/skills/clerk-testing",
    ],
    icon: "resources/icons/clerk-icon-dark.svg"

  },
  {
    id: "better-auth",
    name: "Better Auth",
    detect: {
      packages: ["better-auth"],
    },
    skills: [
      "better-auth/skills/better-auth-best-practices",
      "better-auth/skills/email-and-password-best-practices",
      "better-auth/skills/organization-best-practices",
      "better-auth/skills/two-factor-authentication-best-practices",
    ],
    icon: "resources/icons/better-auth-dark.svg"
  },
  {
    id: "turborepo",
    name: "Turborepo",
    detect: {
      packages: ["turbo"],
      configFiles: ["turbo.json"],
    },
    skills: ["vercel/turborepo/turborepo"],
    icon: "resources/icons/turborepo-icon-dark.svg"
  },
  {
    id: "vite",
    name: "Vite",
    detect: {
      packages: ["vite"],
      configFiles: ["vite.config.js", "vite.config.ts", "vite.config.mjs"],
    },
    skills: ["antfu/skills/vite"],
    icon: "resources/icons/vite.svg"
  },
  {
    id: "azure",
    name: "Azure",
    detect: {
      packagePatterns: [/^@azure\//],
    },
    skills: [
      "microsoft/github-copilot-for-azure/azure-deploy",
      "microsoft/github-copilot-for-azure/azure-ai",
      "microsoft/github-copilot-for-azure/azure-cost-optimization",
      "microsoft/github-copilot-for-azure/azure-diagnostics",
    ],
    icon: "resources/icons/azure.svg"
  },
  {
    id: "vercel-ai",
    name: "Vercel AI SDK",
    detect: {
      packages: ["ai", "@ai-sdk/openai", "@ai-sdk/anthropic", "@ai-sdk/google"],
    },
    skills: ["vercel/ai/ai-sdk"],
    icon: "resources/icons/vercel_dark.svg"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    detect: {
      packages: ["elevenlabs"],
    },
    skills: ["inferen-sh/skills/elevenlabs-tts", "inferen-sh/skills/elevenlabs-music"],
  },
  {
    id: "vercel-deploy",
    name: "Vercel",
    detect: {
      configFiles: ["vercel.json", ".vercel"],
      packages: ["vercel", "@astrojs/vercel"],
    },
    skills: ["vercel-labs/agent-skills/deploy-to-vercel"],
    icon: "resources/icons/vercel_dark.svg"
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    detect: {
      packages: ["wrangler", "@cloudflare/workers-types", "@astrojs/cloudflare"],
      configFiles: ["wrangler.toml", "wrangler.json", "wrangler.jsonc"],
    },
    skills: [
      "cloudflare/skills/cloudflare",
      "cloudflare/skills/wrangler",
      "cloudflare/skills/workers-best-practices",
      "cloudflare/skills/web-perf",
      "openai/skills/cloudflare-deploy",
    ],
    icon: "resources/icons/cloudflare.svg"
  },
  {
    id: "cloudflare-durable-objects",
    name: "Durable Objects",
    detect: {
      configFileContent: {
        files: ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
        patterns: ["durable_objects"],
      },
    },
    skills: ["cloudflare/skills/durable-objects"],
    icon: "resources/icons/cloudflare.svg"
  },
  {
    id: "cloudflare-agents",
    name: "Cloudflare Agents",
    detect: {
      packages: ["agents"],
    },
    skills: [
      "cloudflare/skills/agents-sdk",
      "cloudflare/skills/building-mcp-server-on-cloudflare",
      "cloudflare/skills/sandbox-sdk",
    ],
    icon: "resources/icons/cloudflare.svg"
  },
  {
    id: "cloudflare-ai",
    name: "Cloudflare AI",
    detect: {
      packages: ["@cloudflare/ai"],
      configFileContent: {
        files: ["wrangler.json", "wrangler.jsonc"],
        patterns: ['"ai"'],
      },
    },
    skills: ["cloudflare/skills/building-ai-agent-on-cloudflare"],
    icon: "resources/icons/cloudflare.svg"
  },
  {
    id: "terraform",
    name: "Terraform",
    detect: {
      configFiles: [
        ".terraform.lock.hcl",
        "terraform.tfvars",
        "main.tf",
        "variables.tf",
        "outputs.tf",
      ],
    },
    skills: [
      "hashicorp/agent-skills/terraform-style-guide",
      "hashicorp/agent-skills/refactor-module",
      "hashicorp/agent-skills/terraform-stacks",
      "wshobson/agents/terraform-module-library",
    ],
    icon: "resources/icons/terraform.svg"
  },
  {
    id: "aws",
    name: "AWS",
    detect: {
      packagePatterns: [/^@aws-sdk\//, /^aws-cdk/],
    },
    skills: [],
    icon: "resources/icons/aws_dark.svg"
  },
  {
    id: "swiftui",
    name: "SwiftUI",
    detect: {
      configFiles: ["Package.swift"],
    },
    skills: [
      "avdlee/swiftui-agent-skill/swiftui-expert-skill",
      "avdlee/swift-concurrency-agent-skill",
      "avdlee/xcode-build-optimization-agent-skill",
      "avdlee/swift-testing-agent-skill",
      "avdlee/core-data-agent-skill",
    ],
    icon: "resources/icons/swift.svg"
  },
  {
    id: "oxlint",
    name: "oxlint",
    detect: {
      packages: ["oxlint"],
      configFiles: [".oxlintrc.json", "oxlint.config.ts"],
    },
    skills: ["delexw/claude-code-misc/oxlint"],
  },
  {
    id: "gsap",
    name: "GSAP",
    detect: {
      packages: ["gsap"],
    },
    skills: [
      "greensock/gsap-skills/gsap-core",
      "greensock/gsap-skills/gsap-scrolltrigger",
      "greensock/gsap-skills/gsap-performance",
      "greensock/gsap-skills/gsap-plugins",
      "greensock/gsap-skills/gsap-timeline",
      "greensock/gsap-skills/gsap-utils",
      "greensock/gsap-skills/gsap-frameworks",
    ],
  },
  {
    id: "threejs",
    name: "Three.js",
    detect: {
      packages: ["three"],
    },
    skills: [
      "cloudai-x/threejs-skills/threejs-animation",
      "cloudai-x/threejs-skills/threejs-fundamentals",
      "cloudai-x/threejs-skills/threejs-shaders",
      "cloudai-x/threejs-skills/threejs-geometry",
      "cloudai-x/threejs-skills/threejs-interaction",
      "cloudai-x/threejs-skills/threejs-materials",
      "cloudai-x/threejs-skills/threejs-postprocessing",
      "cloudai-x/threejs-skills/threejs-lighting",
      "cloudai-x/threejs-skills/threejs-textures",
      "cloudai-x/threejs-skills/threejs-loaders",
    ],
    icon: "resources/icons/threejs-dark.svg"
  },
  {
    id: "@react-three/fiber",
    name: "React Three Fiber",
    detect: {
      packages: ["@react-three/fiber"],
    },
    skills: [],
  },
  {
    id: "bun",
    name: "Bun",
    detect: {
      configFiles: ["bun.lockb", "bun.lock", "bunfig.toml"],
    },
    skills: ["https://bun.sh/docs"],
    icon: "resources/icons/bun.svg"
  },
  {
    id: "node",
    name: "Node.js",
    detect: {
      configFiles: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".nvmrc", ".node-version"],
    },
    skills: [
      "wshobson/agents/nodejs-backend-patterns",
      "sickn33/antigravity-awesome-skills/nodejs-best-practices",
    ],
    icon: "resources/icons/nodejs.svg"
  },
  {
    id: "express",
    name: "Express",
    detect: {
      packages: ["express"],
    },
    skills: [],
    icon: "resources/icons/expressjs_dark.svg"

  },
  {
    id: "go",
    name: "Go",
    detect: {
      configFiles: ["go.mod", "go.work"],
    },
    skills: [
      "affaan-m/everything-claude-code/golang-patterns",
      "affaan-m/everything-claude-code/golang-testing",
    ],
    icon: "resources/icons/golang_dark.svg"
  },
  {
    id: "deno",
    name: "Deno",
    detect: {
      configFiles: ["deno.json", "deno.jsonc", "deno.lock"],
    },
    skills: [
      "denoland/skills/deno-expert",
      "denoland/skills/deno-guidance",
      "denoland/skills/deno-frontend",
      "denoland/skills/deno-deploy",
      "denoland/skills/deno-sandbox",
      "mindrally/skills/deno-typescript",
    ],
    icon: "resources/icons/deno_dark.svg"
  },
  {
    id: "wordpress",
    name: "WordPress",
    detect: {
      configFiles: ["wp-config.php", "wp-login.php"],
      packagePatterns: [/^@wordpress\//],
      configFileContent: {
        files: ["composer.json", "style.css"],
        patterns: ["johnpbloch/wordpress", "wpackagist", "Theme Name:"],
      },
    },
    skills: [
      "wordpress/agent-skills/wp-plugin-development",
      "wordpress/agent-skills/wp-rest-api",
      "wordpress/agent-skills/wp-block-themes",
      "wordpress/agent-skills/wp-block-development",
      "wordpress/agent-skills/wp-performance",
      "wordpress/agent-skills/wordpress-router",
      "wordpress/agent-skills/wp-project-triage",
      "wordpress/agent-skills/wp-wpcli-and-ops",
    ],
    icon: "resources/icons/wordpress.svg"
  },
  {
    id: "java",
    name: "Java",
    detect: {
      configFiles: ["pom.xml"],
      configFileContent: {
        scanGradleLayout: true,
        patterns: [
          "sourceCompatibility",
          "targetCompatibility",
          "JavaVersion",
          'id("java")',
          "id 'java'",
          'id("java-library")',
          "id 'java-library'",
        ],
      },
    },
    skills: [
      "github/awesome-copilot/java-docs",
      "affaan-m/everything-claude-code/java-coding-standards",
    ],
    icon: "resources/icons/java.svg"
  },
  {
    id: "springboot",
    name: "Spring Boot",
    detect: {
      configFiles: [
        "src/main/resources/application.properties",
        "src/main/resources/application.yml",
        "src/main/resources/application.yaml",
      ],
      configFileContent: {
        files: ["pom.xml"],
        patterns: ["spring-boot-starter", "org.springframework.boot"],
      },
    },
    skills: ["github/awesome-copilot/java-springboot"],
  },
  {
    id: "prisma",
    name: "Prisma",
    detect: {
      packages: ["prisma", "@prisma/client"],
    },
    skills: [
      "prisma/skills/prisma-database-setup",
      "prisma/skills/prisma-client-api",
      "prisma/skills/prisma-cli",
      "prisma/skills/prisma-postgres",
    ],
    icon: "resources/icons/prisma_dark.svg"
  },
  {
    id: "stripe",
    name: "Stripe",
    detect: {
      packages: ["stripe", "@stripe/stripe-js", "@stripe/react-stripe-js"],
    },
    skills: ["stripe/ai/stripe-best-practices", "stripe/ai/upgrade-stripe"],
  },
  {
    id: "hono",
    name: "Hono",
    detect: {
      packages: ["hono"],
    },
    skills: ["yusukebe/hono-skill/hono"],
    icon: "resources/icons/hono.svg"
  },
  {
    id: "vitest",
    name: "Vitest",
    detect: {
      packages: ["vitest"],
      configFiles: ["vitest.config.ts", "vitest.config.js", "vitest.config.mts"],
    },
    skills: ["antfu/skills/vitest"],
    icon: "resources/icons/vitest.svg"
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    detect: {
      packages: ["drizzle-orm", "drizzle-kit"],
    },
    skills: ["bobmatnyc/claude-mpm-skills/drizzle-orm"],
    icon: "resources/icons/drizzle-orm_dark.svg"

  },
  {
    id: "nestjs",
    name: "NestJS",
    detect: {
      packages: ["@nestjs/core"],
    },
    skills: ["kadajett/agent-nestjs-skills/nestjs-best-practices"],
      icon: "resources/icons/nestjs.svg"
  },
  {
    id: "tauri",
    name: "Tauri",
    detect: {
      packages: ["@tauri-apps/api", "@tauri-apps/cli"],
      configFiles: ["src-tauri/tauri.conf.json"],
    },
    skills: ["nodnarbnitram/claude-code-extensions/tauri-v2"],
    icon: "resources/icons/tauri.svg"
  },
  {
    id: "electron",
    name: "Electron",
    detect: {
      packages: ["electron"],
      configFiles: [
        "electron-builder.yml",
        "electron-builder.json",
        "electron-builder.js",
        "forge.config.js",
        "forge.config.cjs",
        "forge.config.mjs",
        "forge.config.ts",
        "electron-vite.config.ts",
        "electron-vite.config.js",
        "electron-vite.config.mjs",
        "electron-vite.config.cjs",
      ],
    },
    skills: ["vercel-labs/agent-skills/electron-best-practices"],
    icon: "resources/icons/electron.svg"
  },
  {
    id: "rust",
    name: "Rust",
    detect: {
      configFiles: ["Cargo.toml"],
    },
    skills: ["apollographql/skills/rust-best-practices"],
    icon: "resources/icons/rust_dark.svg"
  },
  {
    id: "ruby",
    name: "Ruby",
    detect: {
      configFiles: ["Gemfile", "Gemfile.lock", ".ruby-version", ".ruby-gemset"],
    },
    skills: ["lucianghinda/superpowers-ruby/ruby"],
      icon: "resources/icons/ruby.svg"
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    detect: {
      gems: ["rails"],
      configFiles: ["config/routes.rb", "config/application.rb", "bin/rails"],
    },
    skills: [
      "sergiodxa/agent-skills/ruby-on-rails-best-practices",
      "lucianghinda/superpowers-ruby/rails-guides",
      "igmarin/rails-agent-skills/rails-stack-conventions",
      "igmarin/rails-agent-skills/rails-code-review",
      "igmarin/rails-agent-skills/rails-migration-safety",
      "igmarin/rails-agent-skills/rails-security-review",
      "ombulabs/claude-code_rails-upgrade-skill/rails-upgrade",
    ],
    icon: "resources/icons/ruby.svg"
  },
  {
    id: "redis-ruby",
    name: "Redis (Ruby)",
    detect: {
      gems: ["redis", "sidekiq", "resque", "redis-rails"],
    },
    skills: ["redis/agent-skills/redis-development"],
  },
  {
    id: "postgres-ruby",
    name: "PostgreSQL",
    detect: {
      gems: ["pg"],
    },
    skills: [],
    icon: "resources/icons/postgresql.svg"
   },
   {
     id: "sorbet",
    name: "Sorbet",
    detect: {
      gems: ["sorbet", "sorbet-runtime"],
      configFiles: ["sorbet/config"],
    },
    skills: [
      "DmitryPogrebnoy/ruby-agent-skills/generating-sorbet",
      "DmitryPogrebnoy/ruby-agent-skills/generating-sorbet-inline",
    ],
  },
  {
    id: "activeadmin",
    name: "ActiveAdmin",
    detect: {
      gems: ["activeadmin"],
    },
    skills: [],
   },
   {
     id: "devise",
    name: "Devise",
    detect: {
      gems: ["devise"],
    },
    skills: [],
     icon: "resources/icons/devise.svg"
   },
   {
    id: "sidekiq",
    name: "Sidekiq",
    detect: {
      gems: ["sidekiq"],
    },
    skills: ["igmarin/rails-agent-skills/rails-background-jobs"],
  },
  {
    id: "rspec",
    name: "RSpec",
    detect: {
      gems: ["rspec", "rspec-rails"],
      configFiles: [".rspec"],
    },
    skills: [
      "igmarin/rails-agent-skills/rspec-best-practices",
      "igmarin/rails-agent-skills/rspec-service-testing",
      "lucianghinda/superpowers-ruby/test-driven-development",
    ],
  },
  {
    id: "rubocop",
    name: "RuboCop",
    detect: {
      gems: ["rubocop", "rubocop-rails"],
      configFiles: [".rubocop.yml"],
    },
    skills: [],
    icon: "resources/icons/rubocop.svg"
  },
  {
    id: "php",
    name: "PHP",
    detect: {
      configFiles: ["composer.json", "composer.lock"],
    },
    skills: ["jeffallan/claude-skills/php-pro"],
    icon: "resources/icons/php_dark.svg"
  },
  {
    id: "laravel",
    name: "Laravel",
    detect: {
      configFiles: ["artisan", "bootstrap/app.php"],
      configFileContent: {
        files: ["composer.json"],
        patterns: ['"laravel/framework"', '"illuminate/'],
      },
    },
    skills: [
      "jeffallan/claude-skills/laravel-specialist",
      "affaan-m/everything-claude-code/laravel-patterns",
    ],
     icon: "resources/icons/laravel.svg"
   },
   {
    id: "python",
    name: "Python",
    detect: {
      configFiles: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
    },
    skills: ["inferen-sh/skills/python-executor", "wshobson/agents/python-testing-patterns"],
    icon: "resources/icons/python.svg"
  },
  {
    id: "fastapi",
    name: "FastAPI",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["fastapi", "FastAPI"],
      },
    },
    skills: [
      "wshobson/agents/fastapi-templates",
      "mindrally/skills/fastapi-python",
      "jezweb/claude-skills/fastapi",
    ],
    icon: "resources/icons/fastapi.svg"  
  },
  {
    id: "django",
    name: "Django",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["django", "Django"],
      },
    },
    skills: [
      "vintasoftware/django-ai-plugins/django-expert",
      "affaan-m/everything-claude-code/django-patterns",
      "affaan-m/everything-claude-code/django-security",
    ],
    icon: "resources/icons/django.svg"
  },
  {
    id: "flask",
    name: "Flask",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["flask", "Flask"],
      },
    },
    skills: ["jezweb/claude-skills/flask", "aj-geddes/useful-ai-prompts/flask-api-development"],
    icon: "resources/icons/flask-dark.svg"
  },
  {
    id: "pydantic",
    name: "Pydantic",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["pydantic", "Pydantic"],
      },
    },
    skills: ["bobmatnyc/claude-mpm-skills/pydantic"],
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["sqlalchemy", "SQLAlchemy"],
      },
    },
    skills: [
      "bobmatnyc/claude-mpm-skills/sqlalchemy-orm",
      "wispbit-ai/skills/sqlalchemy-alembic-expert-best-practices-code-review",
    ],
  },
  {
    id: "pytest",
    name: "Pytest",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["pytest", "Pytest"],
      },
    },
    skills: ["wshobson/agents/python-testing-patterns"],
    icon: "resources/icons/python.svg"
  },
  {
    id: "pandas",
    name: "Pandas",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["pandas", "Pandas"],
      },
    },
    skills: [
      "jeffallan/claude-skills/pandas-pro",
      "pluginagentmarketplace/custom-plugin-python/pandas-data-analysis",
    ],
    icon: "resources/icons/python.svg"
  },
  {
    id: "numpy",
    name: "NumPy",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["numpy", "NumPy", "numpy"],
      },
    },
    skills: [
      "pluginagentmarketplace/custom-plugin-python/machine-learning",
      "pluginagentmarketplace/custom-plugin-python/pandas-data-analysis",
    ],
    icon: "resources/icons/python.svg"
  },
  {
    id: "scikit-learn",
    name: "Scikit-Learn",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["scikit-learn", "scikit_learn", "sklearn"],
      },
    },
    skills: [
      "davila7/claude-code-templates/scikit-learn",
      "davila7/claude-code-templates/senior-data-scientist",
    ],
  },
  {
    id: "celery",
    name: "Celery",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["celery", "Celery"],
      },
    },
    skills: ["wshobson/agents/python-background-jobs"],
  },
  {
    id: "requests",
    name: "Requests",
    detect: {
      configFileContent: {
        files: ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"],
        patterns: ["requests", "Requests"],
      },
    },
    skills: ["affaan-m/everything-claude-code/python-patterns"],
  },
];

// ── Agent Folder Map ─────────────────────────────────────────

export const AGENT_FOLDER_MAP: Record<string, string> = {
  ".claude": "claude-code",
  ".cursor": "cursor",
  ".cline": "cline",
  ".codex": "codex",
  ".opencode": "opencode",
  ".antigravity": "antigravity",
  ".augment": "augment",
  ".copilot": "github-copilot",
  ".gemini": "gemini-cli",
  ".junie": "junie",
  ".amp": "amp",
  ".supermaven": "supermaven",
  ".codebuddy": "codebuddy",
  ".continue": "continue",
  ".kiro": "kiro-cli",
  ".bob": "ibm-bob",
  ".commandcode": "command-code",
  ".cortex": "cortex-code",
  ".crush": "crush",
  ".factory": "droid",
  ".goose": "goose",
  ".iflow": "iflow-cli",
  ".kilocode": "kilo-code",
  ".kode": "kode",
  ".mcpjam": "mcpjam",
  ".vibe": "mistral-vibe",
  ".mux": "mux",
  ".openhands": "openhands",
  ".pi": "pi",
  ".qoder": "qoder",
  ".qwen": "qwen-code",
  ".roo": "roo-code",
  ".trae": "trae",
  ".windsurf": "windsurf",
  ".zencoder": "zencoder",
  ".neovate": "neovate",
  ".pochi": "pochi",
  ".adal": "adal",
};

export const WEB_FRONTEND_EXTENSIONS: Set<string> = new Set([
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".vue",
  ".svelte",
  ".jsx",
  ".tsx",
  ".twig",
  ".tpl",
  ".ejs",
  ".hbs",
  ".pug",
  ".njk",
]);
