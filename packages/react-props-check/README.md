# react-props-check

[![CI Status](https://img.shields.io/github/workflow/status/tonyghiani/react-props-check/CI)](https://github.com/tonyghiani/react-props-check/actions)
[![MIT License](https://img.shields.io/github/license/tonyghiani/react-props-check)](https://opensource.org/licenses/MIT)

`react-props-check` is a lightweight utility library designed to simplify prop validation in React applications. When working with React components, it's essential to ensure that your components receive the correct props to prevent unexpected issues during runtime. This package streamlines the process of validating React component props, helping you maintain code quality and reliability.

## Installation

You can install `react-props-check` via npm or yarn. Make sure you have Node.js and npm (or yarn) installed in your project before proceeding.

### Using npm

```bash
npm install react-props-check
```

### Using yarn

```bash
yarn add react-props-check
```

Once the package is installed, you can import it into your React application and start using it to validate props.

## Usage

`react-props-check` provides a simple and effective way to validate React component props. You can use it to check if a prop is one of the accepted properties defined in your application. Here's a basic example:

```javascript
import isValidProp from 'react-props-check';

const isValid = isValidProp('className'); // Check if 'className' is a valid React prop

if (isValid) {
  // Prop is valid, proceed with your logic
} else {
  // Prop is not valid, handle the error
}
```

## API Reference

### `isValidProp(property: ReactAcceptedProp | DataAttribute): boolean`

- `property` (ReactAcceptedProp | DataAttribute): The prop or data attribute to validate.

Returns `true` if the property is valid, `false` otherwise.

### DataAttribute

- `DataAttribute` is a string type representing data attributes in the format `data-{string}`.

### ReactAcceptedProp

- `ReactAcceptedProp` is an exported type that represents valid React props.

```javascript
import { ReactAcceptedProp } from 'react-props-check';
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. You are free to use and distribute this package under the terms of the MIT License.

For more information and advanced usage, please refer to the [official documentation](https://github.com/tonyghiani/react-props-check).
