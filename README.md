# React Router with Effect Endpoints issue reproduction

![issue happening](<Screenshot 2025-11-08 at 22.24.39.png>)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Issue description

When you modify any service and HMR does the module replacement, if you reload any page using the effect endpoints you get the error shown in the screenshot.

for example:

1. Start the development server
2. Open any page using the effect endpoints, for example `http://localhost:5173/api/images/test-id`
3. Modify `lib/api/service.ts`. For example change the `organizationId` to `organizationId2`. It is better to alternate between `undefined` and a string value
4. HMR does the module replacement
5. Reload any page using the effect endpoints, for example `http://localhost:5173/api/images/test-id`
6. You get the error shown in the screenshot
