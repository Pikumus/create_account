import type { Options } from '@/features/Account/domain/models/OptionsInterface.ts'

export interface FieldInterface {
  title: string;
  name: string;
  placeholder: string;
  type: string;
  options?: Options[];
}
