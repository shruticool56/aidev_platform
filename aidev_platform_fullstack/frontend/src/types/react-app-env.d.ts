/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  // Basic types
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }, context?: any): ReactElement<any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  
  // State hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  
  // Types for events and elements
  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  
  export type ReactNode = 
    | ReactElement
    | string
    | number
    | boolean
    | null
    | undefined;
    
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: string | null;
  }
  
  export type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;
  
  export interface SVGAttributes<T> extends HTMLAttributes<T> {
    color?: string;
    height?: number | string;
    width?: number | string;
    xmlns?: string;
    viewBox?: string;
    stroke?: string;
    strokeWidth?: number | string;
    fill?: string;
  }

  export interface HTMLAttributes<T> {
    className?: string;
    onClick?: (event: any) => void;
    onChange?: (event: any) => void;
    value?: string | number;
    placeholder?: string;
    type?: string;
    id?: string;
    style?: any;
    title?: string;
    disabled?: boolean;
    children?: ReactNode;
    [prop: string]: any;
  }
  
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
    value?: string | number;
  }
  
  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    disabled?: boolean;
    form?: string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | number | readonly string[];
  }
  
  export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    cols?: number;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | number | readonly string[];
    wrap?: string;
  }
  
  export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | number | readonly string[];
  }
  
  export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | number | readonly string[];
  }
  
  export interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> {
    [key: string]: any;
  }
  
  export interface StatelessComponent<P = {}> {
    (props: P & { children?: ReactNode }, context?: any): ReactElement<any>;
  }
}

declare module 'lucide-react' {
  import React from 'react';
  
  interface IconProps extends React.SVGAttributes<SVGElement> {
    color?: string;
    size?: string | number;
  }
  
  export const X: React.FC<IconProps>;
  export const Bot: React.FC<IconProps>;
  export const Maximize2: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const ChevronDown: React.FC<IconProps>;
  export const Files: React.FC<IconProps>;
  export const Search: React.FC<IconProps>;
  export const GitBranch: React.FC<IconProps>;
  export const Play: React.FC<IconProps>;
  export const Package: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const File: React.FC<IconProps>;
  export const Folder: React.FC<IconProps>;
  export const ArrowLeft: React.FC<IconProps>;
  export const ArrowRight: React.FC<IconProps>;
  export const AlertTriangle: React.FC<IconProps>;
  export const XCircle: React.FC<IconProps>;
  export const FolderIcon: React.FC<IconProps>;
  export const FileIcon: React.FC<IconProps>;
} 