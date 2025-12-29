# Roadmap

## 1. Foundation & Stability (Q1-Q2)

Focus on solidifying the core architecture, improving performance, and increasing test coverage.

- **Refactoring & Cleanup**:
  - [ ] Standardize build tools across the monorepo (reduce reliance on mix of `ts-node`, `esbuild`, `tsc`).
  - [ ] Consolidate shared types between `cli`, `src/core`, and `webview-ui`.
  - [ ] Modularize `src/core/controller` to reduce the size of the main `Controller` class.
  - [ ] Refactor `src/core/prompts/system-prompt` to simplify variant management.

- **Testing Strategy**:
  - [ ] Increase unit test coverage for `src/services`.
  - [ ] Implement visual regression testing for `webview-ui`.
  - [ ] Add performance benchmarks for large context handling.
  - [ ] Improve e2e test reliability in `tests/e2e`.

- **Performance**:
  - [ ] Optimize startup time by lazy-loading heavy dependencies.
  - [ ] Improve memory usage during long-running tasks.
  - [ ] Optimize message passing between extension host and webview.

## 2. Enhanced Intelligence (Q2-Q3)

Empower Cline with better planning, memory, and context awareness.

- **Advanced Planning**:
  - [ ] Implement a hierarchical planning system (Act/Plan separation is a start, but deeper sub-task management is needed).
  - [ ] Add "Reflection" steps where Cline critiques its own plan before execution.

- **Memory & Context**:
  - [ ] Implement a persistent semantic memory (vector database) for cross-session knowledge.
  - [ ] Improve context window management using intelligent summarization.
  - [ ] Add "Project Knowledge Graph" to understand code dependencies and architecture.

- **Model Agnosticism**:
  - [ ] Abstract model capabilities better to support "Computer Use" on non-Anthropic models (via polyfills or other agents).
  - [ ] Dynamic prompt optimization based on the selected model's strengths.

## 3. Ecosystem Expansion (Q3-Q4)

Expand where and how Cline can be used.

- **Integrations**:
  - [ ] First-party MCP server marketplace/registry integration directly in the UI.
  - [ ] Deeper integration with VS Code features (Tasks, Debugger, Test Explorer).
  - [ ] Support for other editors (JetBrains, Neovim) via the Language Server Protocol (LSP) or similar standard.

- **Plugin System**:
  - [ ] Create a plugin architecture for Cline to allow third-party developers to add custom "skills" (beyond MCP).
  - [ ] UI extensions for plugins (custom views in the sidebar).

## 4. Autonomous Operations (Future)

Move towards fully autonomous software engineering agents.

- **Multi-Agent Systems**:
  - [ ] Orchestrate multiple specialized agents (Tester, Reviewer, Coder, Architect).
  - [ ] Implement "Swarm" mode for parallel task execution.

- **Long-Running Tasks**:
  - [ ] Enable Cline to run in a headless mode (CLI-first) for CI/CD pipelines.
  - [ ] "Overnight Mode": Give Cline a large task to work on while the user is away, with a detailed report upon return.

- **Self-Correction**:
  - [ ] Automated bug fixing loops (run tests -> fix -> rerun).
  - [ ] Proactive refactoring suggestions based on code metrics.
