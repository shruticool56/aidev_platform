# AIDev Platform Enhancement Design Specification

## 1. Introduction

**Goal:** Enhance the existing `aidev_platform` frontend IDE towards the vision outlined in the provided `Architecture (1).txt` document. The implementation will strictly adhere to the constraint of using only frontend technologies: HTML, CSS, JavaScript, and TypeScript.

**Acknowledgement of Constraints:** The provided architecture describes a highly sophisticated, multi-layered system involving components like OS-level sandboxing, local AI model execution, secure backend execution environments, multi-agent orchestration, and core backend services (Git, Auth, persistent Memory Stores). Implementing the *full* scope and depth of this architecture purely within a frontend browser environment (HTML/CSS/JS/TS) is **not feasible**. Key functionalities requiring backend infrastructure or OS-level access cannot be replicated directly in the browser.

**Proposed Approach:** This enhancement will focus on:
*   Building out the **frontend IDE interface** to visually represent the concepts and workflows described in the architecture.
*   **Simulating or mocking** interactions with backend components and complex processes where possible using JavaScript/TypeScript logic running entirely within the browser.
*   Leveraging the existing React/TypeScript frontend structure.
*   Integrating with **external** LLM APIs directly from the frontend (requiring user-provided API keys and acknowledging potential CORS limitations).
*   Using browser storage (Local Storage) for basic state persistence and configuration.

The result will be an advanced IDE *interface* that mirrors the architectural concepts, providing a user experience aligned with the vision, but without the underlying backend power and true autonomy described.

## 2. High-Level Approach

*   **Enhance Existing UI:** Utilize and extend the current VSCode-like React components (Explorer, Editor, Chat, Menubar, Sidebar, Statusbar).
*   **Conceptual Alignment:** Structure new frontend code (TypeScript classes, modules, state) to conceptually mirror the architectural layers (Cognition Core, Agent OS, Execution Layer, etc.), even though the implementation will be browser-bound.
*   **Simulation & Mocking:** Implement simplified JS/TS logic to simulate:
    *   Task planning and decomposition.
    *   Agent selection and simulated communication (e.g., via an event bus or direct function calls within the frontend).
    *   Execution flow visualization.
    *   Basic file system operations using browser storage.
*   **External API Integration:** Implement UI for users to input API keys for external LLMs (e.g., OpenAI, Gemini, Claude). Use the `fetch` API in JavaScript to interact with these services directly from the browser. Users must be warned about storing keys in browser storage.
*   **State Management:** Use React Context API or a lightweight state management library (like Zustand) for managing the application's state.
*   **Persistence:** Utilize Browser Local Storage to save user configurations (like API keys, selected themes, basic project state) across sessions.

## 3. Detailed Design per Architectural Layer (Frontend Focus)

*   **🧠 Autonomous Cognition Core:**
    *   **UI:** Input fields for high-level tasks/goals.
    *   **Logic (TS):** Simple functions to break down input text into steps (e.g., split by newline, basic keyword identification). No deep semantic understanding.
    *   **UI:** Display the generated 
