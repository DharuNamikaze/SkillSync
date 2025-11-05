# Render.yaml Configuration Tests

This test suite validates the `render.yaml` configuration file for the SkillSync frontend deployment.

## Test Cases

### 1. Build Command Validation
- ✅ Validates that `buildCommand` is defined and is a string
- ✅ Ensures `npm install` is included in the build command
- ✅ Ensures `npm run build` is included in the build command
- ✅ **Actually runs the build** to verify it completes successfully

### 2. Static Publish Path Validation
- ✅ Validates that `staticPublishPath` is defined and is a string
- ✅ Ensures it points to `./dist` (Vite's default output directory)
- ✅ Verifies the dist directory exists after build
- ✅ Confirms the dist directory contains built assets including `index.html`

### 3. Service Type Validation
- ✅ Validates that `type` property is defined and is a string
- ✅ Ensures service type is configured as `"web"`
- ✅ Confirms it's not configured as other service types (worker, cron, etc.)

### 4. Environment Configuration Validation
- ✅ Validates that `env` property is defined and is a string
- ✅ Ensures environment is set to `"static"`
- ✅ Confirms it's not configured as other environment types (docker, node, etc.)

## Prerequisites

Install the required dependencies:

```bash
npm install
```

This will install:
- `vitest` - Testing framework
- `@vitest/ui` - Optional UI for test results
- `yaml` - YAML parser for reading render.yaml

## Running the Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

## Test Structure

The tests are organized into descriptive test suites:

```
render.yaml Configuration Tests
├── 1. Build Command Validation
│   ├── should have a valid buildCommand defined
│   ├── should include npm install in the buildCommand
│   ├── should include npm run build in the buildCommand
│   └── should successfully build the frontend application
├── 2. Static Publish Path Validation
│   ├── should have a staticPublishPath defined
│   ├── should point to the ./dist directory
│   ├── should point to a directory that exists after build
│   └── should contain built assets after build
├── 3. Service Type Validation
│   ├── should have a type property defined
│   ├── should be configured as "web" service type
│   └── should not be configured as other service types
├── 4. Environment Configuration Validation
│   ├── should have an env property defined
│   ├── should be set to "static" environment
│   └── should not be configured as other environment types
└── Additional Configuration Validation
    ├── should have a valid service name
    ├── should have all required fields for a static site
    └── should have valid YAML structure
```

## Important Notes

### Build Tests
Some tests actually execute the build command (`npm run build`). These tests:
- Have a 60-second timeout
- Create the `dist` directory with production assets
- Can be time-consuming (5-10 seconds typically)

### CI/CD Integration
When integrating with CI/CD:
1. Ensure Node.js is available in the CI environment
2. Run `npm install` before running tests
3. Consider caching `node_modules` for faster builds
4. The build tests will verify that the actual build succeeds

### Troubleshooting

If tests fail:

1. **Module not found errors**: Run `npm install` to install dependencies
2. **Build timeout**: Increase the timeout in `vitest.config.js`
3. **YAML parse errors**: Verify `render.yaml` has valid YAML syntax
4. **Missing dist directory**: The test will attempt to build automatically

## Example Output

```
✓ render.yaml Configuration Tests (15)
  ✓ 1. Build Command Validation (4)
    ✓ should have a valid buildCommand defined
    ✓ should include npm install in the buildCommand
    ✓ should include npm run build in the buildCommand
    ✓ should successfully build the frontend application
  ✓ 2. Static Publish Path Validation (4)
    ✓ should have a staticPublishPath defined
    ✓ should point to the ./dist directory
    ✓ should point to a directory that exists after build
    ✓ should contain built assets after build
  ✓ 3. Service Type Validation (3)
    ✓ should have a type property defined
    ✓ should be configured as "web" service type
    ✓ should not be configured as other service types
  ✓ 4. Environment Configuration Validation (3)
    ✓ should have an env property defined
    ✓ should be set to "static" environment
    ✓ should not be configured as other environment types
  ✓ Additional Configuration Validation (3)
    ✓ should have a valid service name
    ✓ should have all required fields for a static site
    ✓ should have valid YAML structure

Test Files  1 passed (1)
     Tests  15 passed (15)
  Start at  10:30:45
  Duration  8.42s
```

## Maintenance

When updating `render.yaml`:
1. Run the tests to ensure the configuration remains valid
2. Update tests if you intentionally change configuration structure
3. Add new tests for any additional configuration properties
