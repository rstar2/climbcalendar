---
description: Create a new shared UI component
argument-hint: Component Name | Component Summery
---


## Context

Parse $ARGUMENTS to get the these values:

- [name] : Component Name from $ARGUMENTS, converted to PascalCase
- [summery]: Component Summery from $ARGUMENTS

## Task

Make a UI component using the provided [name] and [summery] , following these guidelines:

- Create the component file in `src/components/[name].tsx`
- Use ReactFunctionalComponent with name [name]
- Reference the [summery] when making the component

## Variants
