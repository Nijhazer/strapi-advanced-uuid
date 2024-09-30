import type { Core } from '@strapi/strapi';
import pluginId from '../../admin/src/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'uuid',
    plugin: pluginId,
    type: 'uid',
  })
};