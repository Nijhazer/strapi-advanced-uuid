import { getTranslation, prefixPluginTranslations } from './utils/getTranslation';
import PLUGIN_ID from './pluginId';
import { Initializer } from './components/Initializer';
import InputIcon from './components/InputIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: "uuid",
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: getTranslation("form.label"),
        defaultMessage: "Advanced UUID",
      },
      intlDescription: {
        id: getTranslation("form.description"),
        defaultMessage: "Generates a UUID v4",
      },
      icon: InputIcon,
      components: {
        Input: async () => import("./components/Input"),
      },
        options: {
          base: [
            {
              intlLabel: {
                id: getTranslation("form.field.uuidFormat"),
                defaultMessage: "UUID Format"
              },
              name: "options.uuid-format",
              type: "text"
            },
            {
              intlLabel: {
                id: getTranslation("form.field.disableRegenerate"),
                defaultMessage: "Disable Regenerate"
              },
              name: "options.disable-regenerate",
              type: "checkbox",
              description: {
                id: 'form.field.disableRegenerate.description',
                defaultMessage: 'Disable regeneration in the UI',
              },
            }
          ],
          advanced: [
            {
              sectionTitle: {
                id: 'global.settings',
                defaultMessage: 'Settings',
              },
              items: [
                {
                  name: 'private',
                  type: 'checkbox',
                  intlLabel: {
                    id: 'form.attribute.item.privateField',
                    defaultMessage: 'Private field',
                  },
                  description: {
                    id: 'form.attribute.item.privateField.description',
                    defaultMessage: 'This field will not show up in the API response',
                  },
                },
              ],
            },
          ],
          validator: () => {},
        },
      });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
