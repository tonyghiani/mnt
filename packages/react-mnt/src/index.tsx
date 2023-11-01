import React, { ElementType, ForwardedRef } from 'react';
import isValidProp, { type ReactAcceptedProp } from 'react-props-check'

export interface MntProps {
  as?: MntComponentType;
}

export type AttrsResult<T> = T extends (..._args: any) => infer P
  ? P extends object
  ? P
  : never
  : T extends object
  ? T
  : never;

export type AttrsTarget<
  Config extends MntConfigOrFactory,
  FallbackTarget extends MntComponentType
> = AttrsResult<Config> extends { as: infer RuntimeTarget }
  ? RuntimeTarget extends MntComponentType
  ? RuntimeTarget
  : FallbackTarget
  : FallbackTarget;

export interface Mnt<Target extends MntComponentType, TargetHtmlProps extends object> {
  <Props extends object = BaseObject>(
    ..._taggedStyle: TaggedStyle<Assign<TargetHtmlProps, Props>>
  ): MntComponent<Target, Assign<TargetHtmlProps, Props>>;

  attrs<
    Props extends object = BaseObject,
    PrivateMergedProps extends object = Assign<TargetHtmlProps, Props>,
    PrivateAttrsArg extends
    MntConfigOrFactory<PrivateMergedProps> = MntConfigOrFactory<PrivateMergedProps>,
    PrivateResolvedTarget extends MntComponentType = AttrsTarget<PrivateAttrsArg, Target>
  >(
    _configFactory: PrivateAttrsArg
  ): Mnt<
    PrivateResolvedTarget,
    PrivateResolvedTarget extends MntComponentType
    ? Assign<React.ComponentPropsWithRef<PrivateResolvedTarget>, Props>
    : PrivateMergedProps
  >;
}

export interface MntComponent<
  Target extends MntComponentType = any,
  Props extends object = BaseObject
> extends React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props> & React.RefAttributes<unknown>
> {
  <TAs extends MntComponentType>(_props: MntComponentProps<TAs, Props>): React.ReactNode;

  _classesFactory: ClassesFactory<Props>;
  _configFactory: MntConfigFactory<Props>;
  _elementType: Target;
  _isMnt: boolean;
}

export type MntConfigFactory<Props> = (_props: MntProps & Props) => MntProps & Partial<Props>;
export type MntConfigOrFactory<Props extends object = BaseObject> =
  | (MntProps & Partial<Props>)
  | MntConfigFactory<Props>;

export type ClassesFactory<Props extends object> = (_props: Assign<Props, MntProps>) => string;
export type ClassesFactoryOrString<Props extends object> = ClassesFactory<Props> | string;

export type TaggedStyle<Props extends object> = [TemplateStringsArray, ...ClassesFactoryOrString<Props>[]];

export type MntComponentType = ElementType | MntComponent;

export type MntComponentProps<
  TAs extends MntComponentType = MntComponentType,
  Props extends object = BaseObject,
  TAsProps extends object = MntComponentType extends TAs
  ? BaseObject
  : React.ComponentPropsWithRef<TAs>
> = Assign<Assign<Props, TAsProps>, { as?: TAs }>;

export type Assign<A extends object, B extends object> = Omit<A, keyof B> & B;
export type BaseObject = {};

const isMnt = (arg: MntComponentType): arg is MntComponent => (arg as MntComponent)._isMnt === true;

/**
 * Creates a component factory function to enhance basic capabilities of a passed component.
 *
 * @example
 * // Usage example:
 * const Button = mnt('button')`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography)`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography).attrs({as: 'a'})`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography).attrs((props) => ({as: props.variant}))`text-blue ${props => props.disabled && text-disabled}`;
 */
const mnt = <
  Target extends MntComponentType,
  TargetHtmlProps extends object = Target extends MntComponentType
  ? React.ComponentPropsWithRef<Target>
  : BaseObject
>(
  elementType: Target,
  config: MntConfigOrFactory<BaseObject> = {}
): Mnt<Target, TargetHtmlProps> => {
  const builder = <Props extends object = BaseObject>(
    ...taggedStyles: TaggedStyle<Assign<TargetHtmlProps, Props>>
  ) => {
    const classesFactory = getClasses(...taggedStyles);
    const configFactory = isFunction(config) ? config : () => config;

    if (isMnt(elementType)) {
      return mnt(elementType._elementType, props => ({
        ...elementType._configFactory(props),
        ...configFactory(props)
      })) <Props>`
          ${props => elementType._classesFactory(props)}
          ${props => classesFactory(props)}
        `;
    }

    return componentTemplate<Target, Assign<TargetHtmlProps, Props>>(
      elementType,
      classesFactory,
      configFactory
    );
  };

  builder.attrs = <
    Props extends object = BaseObject,
    PrivateMergedProps extends object = Assign<TargetHtmlProps, Props>,
    PrivateAttrsArg extends
    MntConfigOrFactory<PrivateMergedProps> = MntConfigOrFactory<PrivateMergedProps>,
    PrivateResolvedTarget extends MntComponentType = AttrsTarget<PrivateAttrsArg, Target>
  >(
    config: PrivateAttrsArg
  ) => {
    return mnt<
      PrivateResolvedTarget,
      PrivateResolvedTarget extends MntComponentType
      ? Assign<Assign<TargetHtmlProps, React.ComponentPropsWithRef<PrivateResolvedTarget>>, Props>
      : PrivateMergedProps
    >(elementType as unknown as PrivateResolvedTarget, config);
  };

  return builder;
};

export default mnt;

const componentTemplate = <Target extends MntComponentType, Props extends object>(
  elementType: Target,
  classesFactory: ClassesFactory<Props>,
  configFactory: MntConfigFactory<Props>
) => {
  function Component<TAs extends MntComponentType>(
    componentProps: MntComponentProps<TAs, Props>,
    ref: ForwardedRef<unknown>
  ) {
    const { as: As, className, ...props } = componentProps;

    const config = configFactory(componentProps as Props)
    const { as: configAs, ...configRest } = config;
    const taggedClasses = classesFactory({ ...config, ...componentProps } as Props);

    const classes = [taggedClasses, className].filter(Boolean).join(' ').trim() || undefined;

    const cleanedConfig = cleanProps(configRest);
    const cleanedProps = cleanProps(props);

    const TagName = As ?? configAs ?? elementType;
    return <TagName {...cleanedConfig} {...cleanedProps} ref={ref} className={classes} />;
  }

  if (hasStaticProperty(elementType, 'displayName')) {
    Component.displayName = elementType.displayName || elementType.name;
  }

  const MntComponent = React.forwardRef(Component) as MntComponent<Target, Props>;

  MntComponent._classesFactory = classesFactory;
  MntComponent._configFactory = configFactory;
  MntComponent._elementType = elementType;
  MntComponent._isMnt = true;

  return MntComponent;
};

function getClasses<Props extends object = BaseObject>(...taggedStyles: TaggedStyle<Props>): ClassesFactory<Props> {
  return props => {
    const [statics, ...dynamics] = taggedStyles;
    const chunks = [];

    for (let i = 0; i < statics.length; i++) {
      const staticChunk = statics[i].trim();
      if (staticChunk) chunks.push(staticChunk);
      if (i < dynamics.length) {
        const classBuilder = dynamics[i];
        const dynamicClass = isFunction(classBuilder) ? classBuilder(props) : classBuilder;
        if (dynamicClass) chunks.push(dynamicClass.trim());
      }
    }

    return chunks.join(' ');
  };
}

function cleanProps<Props extends object>(props: Props) {
  const cleanedProps: Partial<Props> = {};

  for (const prop in props) {
    if (isValidProp(prop as ReactAcceptedProp)) cleanedProps[prop] = props[prop];
  }

  return cleanedProps;
}

function hasStaticProperty(input: unknown, propertyName: string): input is Function {
  return isFunction(input) && propertyName in input;
}

function isFunction(arg: unknown): arg is (..._args: any) => any {
  return typeof arg === 'function';
}
