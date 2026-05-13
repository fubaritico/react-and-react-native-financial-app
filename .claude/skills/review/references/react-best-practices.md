# React Best Practices — Review Rules

## Critical Violations (REACT-0xx)

### REACT-001: Inline arrow function as callback prop
- **Files**: All `*.tsx` (components, screens, pages)
- **Check**: No inline arrow functions passed as callback props in JSX
- **Forbidden**: `<Child onPress={() => doSomething(item)} />` — creates a new function reference every render
- **Required**: Declare the handler as a `useCallback` expression and pass it by name
  ```tsx
  const handlePress = useCallback(() => {
    doSomething(item)
  }, [item])

  <Child onPress={handlePress} />
  ```
- **For lists**: Create a wrapper component that receives the item and memoizes its own handler, or use a memoized factory
- **Exception**: One-shot config builders (e.g. modal action `onPress`) where the function is not a React prop rendered in a component tree
- **Rationale**: Inline arrows break `React.memo`, `useCallback` dependency chains, and cause unnecessary re-renders in children
