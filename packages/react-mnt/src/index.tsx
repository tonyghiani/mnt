import React, { ElementType, ForwardedRef } from 'react';
import isValidProp, { type ReactAcceptedProp } from 'react-props-check';

export interface MntProps<TAs = MntComponentType> {
  as?: TAs;
}

export type AnyFunction = (..._args: any) => any;

export type ParamsResult<Params extends MntParamsOrFactory> = Params extends AnyFunction
  ? ReturnType<AnyFunction>
  : Params;

export type ParamsTarget<
  Params extends MntParamsOrFactory,
  TDefault extends MntComponentType
> = ParamsResult<Params> extends { as: infer PAs }
  ? PAs extends MntComponentType
    ? PAs
    : TDefault
  : TDefault;

export interface Mnt<Target extends MntComponentType, TargetHtmlProps extends object> {
  <Props extends object = BaseObject>(
    ..._taggedStyle: TaggedStyle<Merge<TargetHtmlProps, Props>>
  ): MntComponent<Target, Merge<TargetHtmlProps, Props>>;

  params<
    Props extends object = BaseObject,
    _MergedProps extends object = Merge<TargetHtmlProps, Props>,
    _ParamsArg extends MntParamsOrFactory<_MergedProps> = MntParamsOrFactory<_MergedProps>,
    _ResolvedTarget extends MntComponentType = ParamsTarget<_ParamsArg, Target>
  >(
    _paramsFactory: _ParamsArg
  ): Mnt<
    _ResolvedTarget,
    _ResolvedTarget extends MntComponentType
      ? Merge<React.ComponentPropsWithRef<_ResolvedTarget>, Props>
      : _MergedProps
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
  _paramsFactory: MntParamsFactory<Props>;
  _elementType: Target;
  _isMnt: boolean;
}

export type MntParamsFactory<Props> = (_props: MntProps & Props) => MntProps & Partial<Props>;
export type MntParamsOrFactory<Props extends object = BaseObject> =
  | ReturnType<MntParamsFactory<Props>>
  | MntParamsFactory<Props>;

export type ClassesFactory<Props extends object> = (_props: Merge<Props, MntProps>) => string;
export type ClassesFactoryOrString<Props extends object> = ClassesFactory<Props> | string;

export type TaggedStyle<Props extends object> = [
  TemplateStringsArray,
  ...ClassesFactoryOrString<Props>[]
];

export type MntComponentType = ElementType | MntComponent;

export type MntComponentProps<
  TAs extends MntComponentType = MntComponentType,
  Props extends object = BaseObject,
  TAsProps extends object = MntComponentType extends TAs
    ? BaseObject
    : React.ComponentPropsWithRef<TAs>
> = Merge<Merge<Props, TAsProps>, MntProps<TAs>>;

export type Merge<A extends object, B extends object> = Omit<A, keyof B> & B;
export type BaseObject = {};

const isMnt = (arg: MntComponentType): arg is MntComponent => (arg as MntComponent)._isMnt === true;

/**
 * Creates a component factory function to enhance basic capabilities of a passed component.
 *
 * @example
 * // Usage example:
 * const Button = mnt('button')`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography)`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography).params({as: 'a'})`text-blue ${props => props.disabled && text-disabled}`;
 * const Button = mnt(BaseTypography).params((props) => ({as: props.variant}))`text-blue ${props => props.disabled && text-disabled}`;
 */
const mnt = <
  Target extends MntComponentType,
  TargetHtmlProps extends object = Target extends MntComponentType
    ? React.ComponentPropsWithRef<Target>
    : BaseObject
>(
  elementType: Target,
  params: MntParamsOrFactory<BaseObject> = {}
): Mnt<Target, TargetHtmlProps> => {
  const builder = <Props extends object = BaseObject>(
    ...taggedStyles: TaggedStyle<Merge<TargetHtmlProps, Props>>
  ) => {
    const classesFactory = getClasses(...taggedStyles);
    const paramsFactory = isFunction(params) ? params : () => params;

    if (isMnt(elementType)) {
      return mnt(elementType._elementType, props => ({
        ...elementType._paramsFactory(props),
        ...paramsFactory(props)
      }))<Props>`
          ${props => elementType._classesFactory(props)}
          ${props => classesFactory(props)}
        `;
    }

    return componentTemplate<Target, Merge<TargetHtmlProps, Props>>(
      elementType,
      classesFactory,
      paramsFactory
    );
  };

  builder.params = <
    Props extends object = BaseObject,
    _MergedProps extends object = Merge<TargetHtmlProps, Props>,
    _ParamsArg extends MntParamsOrFactory<_MergedProps> = MntParamsOrFactory<_MergedProps>,
    _ResolvedTarget extends MntComponentType = ParamsTarget<_ParamsArg, Target>
  >(
    params: _ParamsArg
  ) => {
    return mnt<
      _ResolvedTarget,
      _ResolvedTarget extends MntComponentType
        ? Merge<Merge<TargetHtmlProps, React.ComponentPropsWithRef<_ResolvedTarget>>, Props>
        : _MergedProps
    >(elementType as unknown as _ResolvedTarget, params);
  };

  return builder;
};

export default mnt;

const componentTemplate = <Target extends MntComponentType, Props extends object>(
  elementType: Target,
  classesFactory: ClassesFactory<Props>,
  paramsFactory: MntParamsFactory<Props>
) => {
  function Component<TAs extends MntComponentType>(
    componentProps: MntComponentProps<TAs, Props>,
    ref: ForwardedRef<MntComponentType extends TAs ? Target : TAs>
  ) {
    const { as: As, className, ...props } = componentProps;

    const params = paramsFactory(componentProps as Props);
    const { as: paramsAs, ...paramsRest } = params;
    const taggedClasses = classesFactory({ ...params, ...componentProps } as Props);

    const classes = [taggedClasses, className].filter(Boolean).join(' ').trim() || undefined;

    const cleanedParams = cleanProps(paramsRest);
    const cleanedProps = cleanProps(props);

    const TagName = As ?? paramsAs ?? elementType;
    return <TagName {...cleanedParams} {...cleanedProps} ref={ref} className={classes} />;
  }

  if (hasStaticProperty(elementType, 'displayName')) {
    Component.displayName = elementType.displayName || elementType.name;
  }

  const MntComponent = React.forwardRef(Component) as MntComponent<Target, Props>;

  MntComponent._classesFactory = classesFactory;
  MntComponent._paramsFactory = paramsFactory;
  MntComponent._elementType = elementType;
  MntComponent._isMnt = true;

  return MntComponent;
};

function getClasses<Props extends object = BaseObject>(
  ...taggedStyles: TaggedStyle<Props>
): ClassesFactory<Props> {
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

function isFunction(arg: unknown): arg is AnyFunction {
  return typeof arg === 'function';
}
