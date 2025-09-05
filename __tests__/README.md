# Testing Documentation

## Overview

This directory contains tests for the Polling App with QR Code Sharing project. The tests are organized by component and feature, following the same structure as the source code.

## Test Structure

- `__tests__/components/` - Tests for React components
- `__tests__/lib/` - Tests for utility functions and hooks

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (recommended during development):

```bash
npm run test:watch
```

To run a specific test file:

```bash
npm test -- PollResultChart
```

## Testing Approach

### Component Tests

Component tests verify that components render correctly and behave as expected. They test:

- Rendering with different props
- User interactions
- State changes
- Edge cases

### File and Documentation Anchors

Tests use special comment anchors to link them to the files they test:

```typescript
// #File: ComponentName.tsx
// #Docs: Description of what this test covers
```

These anchors help maintain the relationship between tests and the code they test.

## Test Conventions

1. **Test File Naming**: Test files should be named after the component or function they test, with a `.test.tsx` or `.test.ts` extension.

2. **Test Organization**: Use `describe` blocks to group related tests and `it` blocks for individual test cases.

3. **Mocking**: Use Jest's mocking capabilities to isolate components from their dependencies.

4. **Assertions**: Use Jest's expect API and Testing Library's custom matchers for assertions.

## Example Test

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

// #File: MyComponent.tsx
// #Docs: Tests for MyComponent

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```