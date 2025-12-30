# Actionable Tasks for Coding Agents

This file contains specific, actionable tasks optimized for an LLM to pick up and execute.

## Refactoring

- [ ] **Refactor `Controller.ts`**: `src/core/controller/index.ts` is a massive class. Split it into smaller services (e.g., `TaskService`, `StateService`, `ConfigService`).
- [ ] **Standardize Types**: Move duplicate type definitions found in `cli/pkg/common` and `src/shared` to a dedicated `packages/types` workspace if possible, or enforce strict imports.
- [ ] **Cleanup `system-prompt`**: `src/core/prompts/system-prompt` has complex variant logic. Analyze if `TemplateEngine` can be simplified or if we can use a lighter-weight templating library.
- [ ] **Promisify `fs`**: Ensure all file system operations use `fs/promises` consistently across the codebase.

## Testing

- [ ] **Unit Tests for `McpHub`**: Add comprehensive unit tests for `src/services/mcp/McpHub.ts`, mocking the connection and discovery logic.
- [ ] **Webview Tests**: Add component tests for `webview-ui/src/components/chat/ChatView.tsx` using React Testing Library.
- [ ] **CLI E2E**: Add more scenarios to `cli/e2e` covering complex interaction patterns (e.g., handling errors, timeouts).
- [ ] **Snapshots**: Update prompt snapshots in `src/core/prompts/system-prompt/__tests__/__snapshots__` if any logic changes.

## Features & Improvements

- [ ] **Better Error Handling**: Implement a centralized error handling service in `src/core/services/error` that categorizes errors (User, System, Network) and provides actionable advice.
- [ ] **Typed Message Passing**: Improve type safety for messages between Webview and Extension. currently it uses string literals. Create a discriminated union of all allowed messages.
- [x] **Logging**: Enhance `Logger.ts` to support log levels (DEBUG, INFO, WARN, ERROR) and file rotation.
- [ ] **Config Validation**: Add Zod schemas for all configuration objects (VS Code settings, `.clinerules`, etc.) to fail fast on invalid config.

## Documentation

- [ ] **Architecture Diagrams**: Generate Mermaid diagrams for the core data flow between Controller, Task, and Webview. Add to `CONTRIBUTING.md`.
- [ ] **API Docs**: Add JSDoc comments to all public methods in `src/core/api`.
- [ ] **MCP Guide**: Create a specific guide for users on how to write their own MCP servers for Cline.
