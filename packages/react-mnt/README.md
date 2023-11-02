# react-mnt

[![CI Status](https://img.shields.io/github/actions/workflow/status/tonyghiani/mnt/release.yml?style=for-the-badge&logo=github)](https://github.com/tonyghiani/mnt/actions)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://github.com/tonyghiani/mnt/blob/main/LICENSE)

`react-mnt` is a versatile utility library designed to enhance the capabilities of React components. It exposes a powerful `mnt` function that allows you to create component factory functions. With `mnt`, you can easily customize and extend the behavior of your React components, making it an invaluable tool for building flexible and dynamic UIs.

## Key Features

- 💡 **Polymorphism**: Achieve polymorphism by dynamically changing the component's underlying HTML element. This allows you to easily adapt your component to different use cases.

  **Usage Example**:

  ```javascript
  import mnt from 'react-mnt';

  // Create a link-like button using the 'as' property
  const LinkButton = mnt('button').params({ as: 'a' })`text-blue`;

  function App() {
    // Change the underline HTML element also on site
    return <LinkButton as='input' type='submit' />;
  }
  ```

- 🔄 **Forwarded Ref**: `react-mnt` ensures that your enhanced components maintain support for forwarded refs, making them seamlessly integrate with other libraries and components that rely on refs.

  **Usage Example**:

  ```javascript
  import mnt from 'react-mnt';

  // Create an enhanced button component that forwards refs
  const EnhancedButton = mnt('button')``;

  // Usage in a parent component
  function ParentComponent() {
    const buttonRef = React.createRef();
    return <EnhancedButton ref={buttonRef}>Click me!</EnhancedButton>;
  }
  ```

- 🚀 **Extend Existing Components**: You can enhance and build upon existing components, making it easy to extend the functionality of your favorite libraries or your own components.

  **Usage Example**:

  ```javascript
  import mnt from 'react-mnt';

  // Extend a base typography component with custom styles
  const BaseTypography = /* your base typography component */;
  const EnhancedTypography = mnt(BaseTypography)`text-blue`;
  ```

- 📚 **Strong Typing for Rendered Component**: `react-mnt` ensures strong typing for the rendered component, helping you catch type-related errors early in the development process.

  **Usage Example**:

  ```javascript
  import mnt from 'react-mnt';

  interface ButtonProps {
    variant?: 'primary' | 'secondary'
  }

  // Create an enhanced button component with strong typing
  const EnhancedButton = mnt('button')<ButtonProps>`text-blue`;

  // Usage with TypeScript
  function App() {
    // Suggests values for optional `variant` property
    return <LinkButton variant="primary" />;
  }
  ```

These highlighted features, accompanied by usage examples, showcase the power and flexibility of `react-mnt` for building robust and dynamic React components.

## Installation

You can install `react-mnt` via npm or yarn. Make sure you have Node.js and npm (or yarn) installed in your project before proceeding.

### Using npm

```bash
npm install react-mnt
```

### Using yarn

```bash
yarn add react-mnt
```

Once the package is installed, you can import it into your React application and start using the `mnt` function to create enhanced components.

## Usage

`react-mnt` introduces the `mnt` function, which provides a seamless way to enhance the capabilities of your React components. It allows you to modify component behavior and style by applying tagged styles and additional props.

### Basic Usage

```javascript
import mnt from 'react-mnt';

const EnhancedButton = mnt('button')`
  text-blue 
  ${props => props.disabled && 'text-disabled'}
`;
```

In the example above, `mnt` is used to enhance a `button` element by applying CSS classes based on tagged styles and props. This creates a more versatile and customized button component.

### Enhanced Component with Base Component

You can also use `mnt` with a base component to further extend its functionality.

```javascript
import mnt from 'react-mnt';

const BaseTypography = /* your base typography component */;
const EnhancedTypography = mnt(BaseTypography)`
  text-blue
  ${props => props.disabled && 'text-disabled'}
`;
```

Here, the `mnt` function is applied to a base typography component, allowing you to add custom styles and behavior.

### Advanced Usage with Parameters

`mnt` supports advanced usage where you can define parameters for your enhanced components.

```javascript
import mnt from 'react-mnt';

const EnhancedButton = mnt('button').params({ as: 'a' })`
  text-blue
  ${props => props.disabled && 'text-disabled'}
`;
```

In this example, the `params` method is used to specify additional parameters, such as changing the element type to 'a'. This is useful for creating link-like buttons with custom styles.

## API Reference

### `mnt<TElement, TElementHtmlProps>(elementType: TElement): MntComponent`

- `elementType` (TElement): The target element or component to enhance.

Returns a factory function for creating enhanced components.

Creates an enhanced component using the provided tagged styles.

### `mnt.params<Props>(params: MntParamsOrFactory<Props>)`

- `params` (MntParamsOrFactory): Additional parameters or a factory function to modify the component's behavior.

Returns an enhanced component with the specified parameters.

### Other Types and Utility Functions

- Various types and utility functions are exported, allowing you to work with component parameters, classes, and tagged styles.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/tonyghiani/mnt/blob/main/LICENSE) file for details. You are free to use and distribute this package under the terms of the MIT License.
