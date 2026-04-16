---
name: Add Technology
about: Add support for a new technology
title: "[TECH] Add support for "
labels: "tech-addition"
assignees: ''

---

## Technology Details
- **Technology Name**: [e.g., Django]
- **Package Manager**: [npm, pip, gem, gradle, etc.]

## Detection Method
<!-- How should this technology be detected? -->
- [ ] `packages` - npm/yarn packages
- [ ] `packagePatterns` - Regex patterns
- [ ] `configFiles` - Config file names
- [ ] `gems` - Ruby gems
- [ ] `configFileContent` - Search in files

**Detection Configuration**:
```typescript
detect: {
  // Your detection config
}
```

## Available Skills
<!-- Skills from skills.sh that should be suggested -->
- [Link to skill](https://skills.sh)
- [Link to skill](https://skills.sh)

## Icon
<!-- Optional: Link to icon SVG -->

## Example Project
<!-- Optional: Reference projects that use this tech -->

## Additional Notes
<!-- Any other relevant information -->
