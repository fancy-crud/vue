import { ComponentAttributes, ComponentChildren } from "tsx-dom"
import { Form, NormalizedFieldStructure } from '@/core'
import { AxiosResponse } from "axios"

export interface Control {
  field?: NormalizedFieldStructure,
  label?: string;
  children?: ComponentChildren;
  [key: string]: ComponentAttributes | ComponentChildren | NormalizedFieldStructure
}

export interface ControlWrapArgs {
  fieldKey: string;
  field: NormalizedFieldStructure;
  children?: ComponentChildren;
  [key: string]: ComponentAttributes | ComponentChildren | NormalizedFieldStructure
}

export interface Slots {
  [key: string]: any
}

export interface FFormAttributes {
  form: Form;
  children?: ComponentChildren;
  slots?: Slots;
  onCreate?: (response: AxiosResponse<unknown>) => void;
  onUpdate?: (response: AxiosResponse<unknown>) => void;
}

export interface FFormFooterAttributes {
  form: Form;
  resetFormTo: Form;
  slots: any;
  onCreate?: (response: AxiosResponse<unknown>) => void;
  onUpdate?: (response: AxiosResponse<unknown>) => void;
}

export interface GeneralMessageErrorProps {
  icon?: string;
  messageError?: string
}

// export interface FInputAttributes {
//   fieldKey: string;
//   field: NormalizedFieldStructure;
//   [key: string]: ComponentAttributes | ComponentChildren | NormalizedFieldStructure
// }
export interface FInputAttributes {
  fieldKey: string;
  field: NormalizedFieldStructure;
  children: ComponentChildren;
  errors: string[];
  hintText: string[];
  modelValue?: unknown | unknown[];
}

export interface FPaginationAttributes {
  pagination: {
    page: number;
    rowsPerPage: number;
    count: number;
  };
  onSelectPage?: (page: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}