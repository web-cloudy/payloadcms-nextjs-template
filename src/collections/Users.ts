import { CollectionConfig } from 'payload/types'
import { CustomSelectFields } from './CustomSelectFields'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    CustomSelectFields
    // Email added by default
    // Add more fields as needed
  ],
}

export default Users
