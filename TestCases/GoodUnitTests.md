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

#### 3. Testing the Boundaries
Testing functions should explicitly test:
- The minimum valid value
- The maximum valid value
- One value just below the minimum 
- One value just above the maximum

#### 4. Invalid Input Testing
Test how the function handles completely inaccurate input that is out of bounds

Things like: 
- Passing a string when a number is expected
- Passing negative numbers when only positive are valid
- Passing the wrong data type entirely

#### 5. Null/Empty/Missing Input Testing
Test how the function handles absence of data:
- Null values
- Empty strings
- Empty collections (arrays, lists, dictionaries)
- Zero-length inputs
- Missing object properties
## Resources 
[JUnit Testing](https://www.vogella.com/tutorials/JUnit/article.html)


[Unit Testing Tutoria](https://www.jetbrains.com/help/clion/unit-testing-tutorial.html)


[Clean Code](https://nicolecarpenter.github.io/2016/03/17/clean-code-chapter-9-unit-tests.html)