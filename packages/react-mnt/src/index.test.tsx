import React from 'react';
import { render, screen } from '@testing-library/react';

import mnt from './index';

interface ButtonProps {
  variant?: 'button' | 'link';
}

describe('mnt', () => {
  it('should create a component rendering the passed html tag', () => {
    const Button = mnt('button')``;
    render(<Button>mnt</Button>);
    const component = screen.getByRole('button');

    expect(component.tagName).toBe('BUTTON');
  });

  it('should create a polymorphic component that accept a "as" property', () => {
    const Button = mnt('button')``;
    render(<Button as='ul'>mnt</Button>);
    const component = screen.getByRole('list');

    expect(component.tagName).toBe('UL');
  });

  it('should create a component that accept and forward a ref of the DOM node', () => {
    const Button = mnt('button')``;
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>mnt</Button>);
    const component = ref.current;

    expect(component.tagName).toBe('BUTTON');
  });

  it('should render the component node with priority to "as" => "config.as" => "base element"', () => {
    const Button = mnt('button')``;
    const ButtonLink = mnt('button').params({ as: 'a' })``;

    // "as" takes priority
    const { rerender } = render(<ButtonLink as='ul'>mnt</ButtonLink>);
    const componentList = screen.getByRole('list');
    expect(componentList.tagName).toBe('UL');

    // 'params.as' takes priority
    rerender(<ButtonLink role='link'>mnt</ButtonLink>);
    const componentLink = screen.getByRole('link');
    expect(componentLink.tagName).toBe('A');

    // base element takes priority
    render(<Button>mnt</Button>);
    const component = screen.getByRole('button');
    expect(component.tagName).toBe('BUTTON');
  });

  describe('css classes', () => {
    it('should apply the passed classes', () => {
      const Button = mnt('button')`btn-color btn-size`;
      render(<Button>mnt</Button>);
      const component = screen.getByRole('button');

      expect(component.className).toBe('btn-color btn-size');
    });

    it('should interpolate a function that provides the component properties', () => {
      const Button = mnt('button')<ButtonProps>`
        ${props => (props.variant === 'button' ? 'btn-color' : 'link-color')}
      `;
      const { rerender } = render(<Button variant='button'>mnt</Button>);
      const component = screen.getByRole('button');

      expect(component.className).toBe('btn-color');

      rerender(<Button variant='link'>mnt</Button>);
      expect(component.className).toBe('link-color');
    });

    it('should respect the order for classes and interpolations', () => {
      const Button = mnt('button')<ButtonProps>`
        btn-before
        ${props => (props.variant === 'button' ? 'btn-color' : 'link-color')}
        btn-after
      `;
      const { rerender } = render(<Button variant='button'>mnt</Button>);
      const component = screen.getByRole('button');

      expect(component.className).toBe('btn-before btn-color btn-after');

      rerender(<Button variant='link'>mnt</Button>);
      expect(component.className).toBe('btn-before link-color btn-after');
    });
  });

  describe('params', () => {
    it('should accept an object of default attributes/properties', () => {
      const Button = mnt('button').params({ id: 'test-id' })``;
      render(<Button>mnt</Button>);
      const component = screen.getByRole('button');

      expect(component.id).toBe('test-id');
    });

    it('should accept a a function that provides the component properties', () => {
      const Button = mnt('button').params<ButtonProps>(props => ({
        id: props.variant === 'button' ? 'test-btn' : 'test-link'
      }))``;
      const { rerender } = render(<Button variant='button'>mnt</Button>);
      const component = screen.getByRole('button');

      expect(component.id).toBe('test-btn');

      rerender(<Button variant='link'>mnt</Button>);
      expect(component.id).toBe('test-link');
    });
  });

  describe('extends existing components', () => {
    it('should take a function component and extend its style and configuration', () => {
      const Button = (props: React.ComponentProps<'button'>) => (
        <button id='base-button' {...props} />
      );
      const StyledButton = mnt(Button)`btn-color`;
      render(<StyledButton>mnt</StyledButton>);
      const component = screen.getByRole('button');

      expect(component.id).toBe('base-button');
      expect(component.className).toBe('btn-color');
    });

    it('should take a MntComponent and extend its style and configuration', () => {
      const Button = mnt('button').params({ id: 'base-button' })``;
      const StyledButton = mnt(Button)`btn-color`;
      render(<StyledButton>mnt</StyledButton>);
      const component = screen.getByRole('button');

      expect(component.id).toBe('base-button');
      expect(component.className).toBe('btn-color');
    });
  });

  describe('typing', () => {
    it('should accept properties exclusively for the rendered DOM node', () => {
      const Button = mnt('button')<ButtonProps>``;
      const Text = mnt('label')``;

      //@ts-expect-error
      const button = <Button href='' />;
      const buttonAsLink = <Button as='a' href='' />;
      //@ts-expect-error
      const buttonWithWrongVariant = <Button variant='unexpected-value' />;
      const buttonWithVariant = <Button variant='link' />;

      const textAttrLabel = <Text as='a' href='test-id' style={{ '--rotation': '255%' }} />;

      expect(button).toBeTruthy();
      expect(buttonAsLink).toBeTruthy();
      expect(buttonWithWrongVariant).toBeTruthy();
      expect(buttonWithVariant).toBeTruthy();
      expect(textAttrLabel).toBeTruthy();
    });
  });
});
