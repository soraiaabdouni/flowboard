
# FlowBoard - Copilot Instructions

## Project Context

FlowBoard is a full-stack web application for task
management and productivity tracking.

The goal is to develop a simple MVP with a modern
dashboard, Kanban board and task CRUD operations.

## Technology Stack

Frontend:
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

Backend:
- Node.js
- Fastify
- PostgreSQL

Language:
- JavaScript with ES Modules

## Architecture Rules

- Keep frontend and backend in separate directories.
- Use REST APIs for communication.
- Keep components small and reusable.
- Separate API calls from React UI components.
- Use parameterized SQL queries.
- Validate input on the backend.
- Use environment variables for secrets.

## Development Guidelines

- Prefer clear and simple implementations.
- Avoid unnecessary dependencies.
- Follow the existing project structure.
- Do not introduce features outside the MVP.
- Explain important technical decisions.
- Do not modify unrelated files.
- Prefer incremental development.

## AI Collaboration Rules

Before implementing complex changes:
1. Analyze the existing code.
2. Explain the proposed solution.
3. Identify files that need to change.
4. Implement only the requested functionality.
5. Suggest appropriate tests.
6. Explain how to validate the result.

## Communication

- Explain technical decisions in Brazilian Portuguese.
- Keep code identifiers in English.
- Do not assume that generated code is correct.
- Report uncertainties and unresolved errors.


## Frontend Guidelines

- Use React with JavaScript and JSX.
- Use Tailwind CSS v4 for styling.
- Use Recharts for dashboard visualizations.
- Use Lucide React for icons.
- Use React Router for navigation.
- Build reusable functional components.
- Avoid unnecessary dependencies.
- Keep API requests inside src/services/api.js.
- Handle loading, error and empty states.
- Use responsive layouts.
- Preserve the existing backend API contract.

## FlowBoard Visual Identity

- Modern and minimal SaaS interface.
- Light background: #F8F9FC.
- Primary color: violet (#7C3AED).
- White cards with subtle borders.
- Rounded corners and clean typography.
- Professional dashboard layout.
- Consistent spacing and visual hierarchy.

## Frontend Scope

Pages:
- Dashboard
- Tasks (Kanban)

Components:
- Sidebar
- StatCard
- StatusChart
- TaskCard
- KanbanBoard
- TaskForm

## Collaboration Rules

- Plan before complex modifications.
- Implement one feature at a time.
- Explain which files will change.
- Do not modify backend files during frontend tasks.
- Do not install dependencies without justification.
- Validate changes with npm run build and npm run lint.


## Current Phase: UI/UX Refinement

The FlowBoard MVP is already functional.

### Main Goal
Improve visual quality, usability, responsiveness
and accessibility without changing existing features.

### Preserve
- Existing API endpoints and HTTP contracts
- Task CRUD behavior
- Kanban status updates
- Dashboard calculations
- PostgreSQL integration
- React routes and navigation
- Existing component responsibilities

### Design Guidelines
- Modern, minimal and professional SaaS interface
- Primary violet: #7C3AED
- Background: #F8F9FC
- White cards with subtle borders and shadows
- Consistent spacing and typography
- Responsive layouts
- Clear visual feedback for interactions

### UX Guidelines
- Provide loading and empty states
- Show feedback after successful actions
- Display understandable error messages
- Prevent duplicate submissions
- Use accessible buttons and forms
- Respect reduced-motion preferences
- Avoid unnecessary animations

### AI Collaboration
- Inspect existing code before changing it
- Explain proposed changes
- Modify only files related to the request
- Prefer CSS and presentation changes
- Do not change business logic without approval
- Do not add dependencies without approval
- Run lint and build after changes
- Report any regression or unresolved issue
