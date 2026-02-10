## What Makes Good Unit Tests

### 1. Pure Function Focus
Good unit tests verify functions with explicit inputs and outputs, not side effects. The test should be reducible to a single statement: "calling function X with input A should produce output B."

### 2. Fast Execution
Unit tests should execute in milliseconds. This means:
- No actual database connections
- No real network requests
- No file system operations
- No sleep or wait statements
- No external service dependencies

### 3. Isolated & Independent
Each test should stand alone:
- One test's success or failure doesn't affect others
- Tests can run in any order
- No shared state between tests
- Each test sets up its own data
- Tests clean up after themselves

## Ways to Test Functions

### The AAA Pattern (Arrange-Act-Assert)
Structure every test in three phases:

**Arrange:** Set up the test data and preconditions. Create the inputs you'll pass to the function.

**Act:** Execute the function being tested with those inputs.

**Assert:** Verify the output matches expectations.

### Test Categories

#### 1. Correct Path Testing
Test the most common, expected use case with valid, typical input. This verifies the function works for the scenario it was designed for.

Example scenario: Testing a function that formats phone numbers - verify it correctly formats a standard 10-digit phone number.

#### 2. Edge Case Testing
Test the boundaries of valid input ranges. These are technically valid but represent extremes.

## Resources 
(https://www.vogella.com/tutorials/JUnit/article.html)[JUnit Testing]
https://www.jetbrains.com/help/clion/unit-testing-tutorial.html[Unit Testing Tutorial]
https://nicolecarpenter.github.io/2016/03/17/clean-code-chapter-9-unit-tests.html[Clean Code]