# CLAUDE.md - AI Assistant Guide for SmartStream

> **Last Updated:** 2025-11-22
> **Repository:** smartstream
> **Status:** Initial setup - repository contains minimal files

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Development Workflow](#development-workflow)
4. [Code Conventions](#code-conventions)
5. [Git Conventions](#git-conventions)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation Standards](#documentation-standards)
8. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Project Overview

### About SmartStream

SmartStream is a project in its initial setup phase. The repository is currently minimal with only foundational files in place.

### Current State

- **Initial Commit:** 3bf2ba7
- **Files Present:** README.md only
- **Branch Strategy:** Feature branches with `claude/` prefix for AI-assisted development
- **Technology Stack:** To be determined as project evolves

### Project Goals

*To be defined as the project develops. Update this section when requirements are clarified.*

---

## Repository Structure

### Current Structure

```
smartstream/
├── .git/              # Git repository metadata
└── README.md          # Project readme (minimal)
```

### Expected Future Structure

As the project develops, the following structure is recommended:

```
smartstream/
├── .github/           # GitHub workflows, issue templates, PR templates
├── docs/              # Additional documentation
├── src/               # Source code
│   ├── components/    # Reusable components (if UI project)
│   ├── services/      # Business logic and services
│   ├── utils/         # Utility functions
│   └── types/         # Type definitions (if TypeScript)
├── tests/             # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── config/            # Configuration files
├── scripts/           # Build and deployment scripts
├── .gitignore         # Git ignore patterns
├── package.json       # Dependencies (if Node.js project)
├── tsconfig.json      # TypeScript configuration (if applicable)
├── README.md          # Project documentation
└── CLAUDE.md          # This file
```

---

## Development Workflow

### Setting Up Development Environment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smartstream
   ```

2. **Install dependencies:**
   ```bash
   # Command will vary based on technology stack
   # npm install, pip install -r requirements.txt, etc.
   ```

3. **Configure environment:**
   ```bash
   # Copy environment template if exists
   # cp .env.example .env
   ```

### Feature Development

1. **Create a feature branch:**
   ```bash
   git checkout -b claude/feature-name-<session-id>
   ```

2. **Develop and test:**
   - Write code following conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push -u origin claude/feature-name-<session-id>
   ```

4. **Create pull request:**
   - Use GitHub PR templates
   - Ensure CI/CD checks pass
   - Request review from team

### Branch Naming Convention

- Feature branches: `claude/<feature-name>-<session-id>`
- Bug fixes: `claude/fix-<issue-name>-<session-id>`
- Experiments: `claude/experiment-<name>-<session-id>`

---

## Code Conventions

### General Principles

1. **Keep It Simple:** Avoid over-engineering; implement what's needed
2. **Don't Repeat Yourself (DRY):** Extract common patterns into reusable functions
3. **Single Responsibility:** Each function/class should have one clear purpose
4. **Meaningful Names:** Use descriptive variable, function, and file names
5. **Comments:** Add comments for complex logic, not obvious code

### Code Style

*Update this section based on project's chosen language and framework:*

- **Indentation:** Use consistent spacing (2 or 4 spaces, or tabs)
- **Line Length:** Keep lines under 80-100 characters when practical
- **Formatting:** Use automated formatters (Prettier, Black, gofmt, etc.)
- **Linting:** Follow linter rules configured in the project

### File Organization

- **One component per file:** Keep files focused and manageable
- **Co-locate related files:** Place tests, styles, and components together when it makes sense
- **Index files:** Use for clean imports but avoid barrel exports that hurt tree-shaking

### Error Handling

- **Validate at boundaries:** Check user input, external API responses
- **Trust internal code:** Don't add defensive checks for impossible scenarios
- **Meaningful errors:** Provide context in error messages
- **Fail fast:** Validate early and throw errors at the point of detection

### Security Best Practices

- **Input Validation:** Sanitize all external inputs
- **No Hardcoded Secrets:** Use environment variables for sensitive data
- **OWASP Awareness:** Follow OWASP Top 10 guidelines
- **Common Vulnerabilities:** Prevent XSS, SQL injection, CSRF, etc.
- **Dependencies:** Keep dependencies updated, audit for vulnerabilities

---

## Git Conventions

### Commit Messages

Follow the conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without functionality changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

**Examples:**
```
feat(auth): add user login functionality

Implement JWT-based authentication with refresh tokens.
Includes login, logout, and token refresh endpoints.

Closes #123
```

```
fix(api): handle null response from external service

Add null check before processing API response to prevent
crashes when service returns empty data.
```

### Pull Requests

**PR Title Format:**
```
[TYPE] Brief description of changes
```

**PR Description Template:**
```markdown
## Summary
Brief description of what this PR does and why.

## Changes
- Bullet point list of specific changes
- Each change should be clear and concise

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Related Issues
Closes #123
Related to #456

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

### Git Best Practices

- **Atomic commits:** Each commit should be a logical unit of change
- **Commit often:** Small, frequent commits are easier to review and revert
- **Pull before push:** Always sync with remote before pushing
- **Clean history:** Squash commits when appropriate before merging
- **Branch hygiene:** Delete branches after merging

---

## Testing Guidelines

### Testing Philosophy

- **Test behavior, not implementation:** Focus on what code does, not how
- **Write tests first:** Consider TDD when appropriate
- **Maintain test coverage:** Aim for meaningful coverage, not just high percentages
- **Fast tests:** Unit tests should run quickly

### Test Structure

```
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle expected input correctly', () => {
      // Arrange
      const input = ...

      // Act
      const result = methodName(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle edge cases', () => {
      // Test edge cases
    })
  })
})
```

### Test Categories

1. **Unit Tests:** Test individual functions and methods in isolation
2. **Integration Tests:** Test interactions between components/modules
3. **End-to-End Tests:** Test complete user workflows
4. **Performance Tests:** Test performance-critical paths when needed

### Running Tests

```bash
# Run all tests
npm test  # or pytest, go test, etc.

# Run specific test file
npm test -- path/to/test.spec.js

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

---

## Documentation Standards

### Code Documentation

**Functions/Methods:**
```javascript
/**
 * Calculates the total price including tax
 *
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 * @throws {Error} If basePrice or taxRate is negative
 */
function calculateTotalPrice(basePrice, taxRate) {
  // Implementation
}
```

**Complex Logic:**
```javascript
// Use the binary search algorithm here because the data is sorted
// and we need O(log n) performance for large datasets
const index = binarySearch(sortedArray, target)
```

### README Documentation

Keep README.md updated with:
- Project description and goals
- Installation instructions
- Usage examples
- Configuration options
- Contributing guidelines
- License information

### API Documentation

- Document all public APIs
- Include request/response examples
- List all endpoints with methods and parameters
- Document error responses
- Version API documentation

---

## AI Assistant Guidelines

### When Working on This Project

1. **Always read before modifying:**
   - Never propose changes to code you haven't read
   - Understand context before making suggestions
   - Check for existing patterns and conventions

2. **Follow the principle of least change:**
   - Only modify what's necessary
   - Don't refactor unrelated code
   - Avoid adding features that weren't requested
   - Don't add comments to unchanged code

3. **Security-first approach:**
   - Review code for common vulnerabilities
   - Never hardcode secrets or credentials
   - Validate external inputs
   - Use parameterized queries for databases

4. **Be explicit and precise:**
   - Provide file paths with line numbers for references
   - Explain technical decisions when they're not obvious
   - Ask for clarification when requirements are ambiguous

5. **Maintain consistency:**
   - Match existing code style and patterns
   - Use the same naming conventions
   - Follow established architecture patterns

### Common Tasks

**Adding a new feature:**
1. Read related existing code
2. Plan the implementation
3. Write tests first (TDD approach)
4. Implement the feature
5. Update documentation
6. Commit with descriptive message

**Fixing a bug:**
1. Reproduce the issue
2. Identify root cause
3. Write a failing test that captures the bug
4. Fix the bug
5. Verify test passes
6. Check for similar issues elsewhere
7. Commit with reference to issue number

**Refactoring:**
1. Ensure tests exist and pass
2. Make small, incremental changes
3. Run tests after each change
4. Commit frequently
5. Don't mix refactoring with feature work

### Communication Style

- Be concise and direct
- Avoid unnecessary superlatives and praise
- Focus on technical accuracy
- Provide objective analysis
- Disagree when necessary for correctness

### Git Operations for AI Assistants

**Pushing changes:**
```bash
# Always use -u flag for new branches
git push -u origin claude/<branch-name>

# Branch must start with 'claude/' and match session ID
# Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network errors
```

**Fetching/Pulling:**
```bash
# Prefer specific branches
git fetch origin <branch-name>
git pull origin <branch-name>

# Retry up to 4 times with exponential backoff on network errors
```

**Creating commits:**
- Never skip hooks (--no-verify) unless explicitly requested
- Never force push to main/master
- Avoid git commit --amend unless explicitly requested or fixing pre-commit hook issues
- Always check authorship before amending

---

## Project-Specific Notes

### Current Development Phase

The project is in its **initial setup phase**. When adding functionality:

1. **Establish foundation first:**
   - Set up build tools and configuration
   - Define project structure
   - Configure linting and formatting
   - Set up testing framework
   - Add CI/CD pipeline

2. **Document decisions:**
   - Update this file with technology choices
   - Document architectural decisions
   - Keep README.md current

3. **Set up development environment:**
   - Create .gitignore for chosen technology
   - Add environment variable templates
   - Configure IDE settings if needed
   - Add editor config files

### Technology Stack

*To be determined. Update this section when stack is chosen:*

- **Language:** TBD
- **Framework:** TBD
- **Database:** TBD
- **Testing:** TBD
- **Build Tools:** TBD
- **Deployment:** TBD

### Environment Variables

*Add environment variable documentation here as project develops.*

### Dependencies Management

*Add dependency management guidelines here (npm, pip, cargo, etc.).*

---

## Changelog

### 2025-11-22
- Initial CLAUDE.md creation
- Repository contains only README.md
- Established structure for future development
- Added comprehensive guidelines for AI assistants

---

## Questions or Updates?

This document should evolve with the project. When making significant architectural decisions or establishing new conventions, update this file to keep it current and useful for all contributors (human and AI).

For questions or suggestions about this document, open an issue or submit a PR with proposed changes.
