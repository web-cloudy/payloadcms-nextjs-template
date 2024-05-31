import { Field } from 'payload/types';
import { CustomSelectComponent } from '../component/CustomSelectComponent';

export const CustomSelectFields: Field = {
  name: 'customSelectField',
  type: 'json',
  admin: {
    components: {
      Field: CustomSelectComponent,
    },
  }
}