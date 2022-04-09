import {
  normalizeFormFields,
  normalizeButtons,
  normalizeTitle,
  normalizeFormSettings,
  useRules,
  FormModes,
} from "@/core/form"
import locale from "@/locale"

describe("Tests for generate.ts", () => {
  it("Should normalize field structure", () => {
    const { requiredRule } = useRules()
    const fields = {
      text: { label: "Input text" },
      textRules: { label: "Input text", rules: ["required"] },
    }

    const normalizedFields = {
      text: {
        label: "Input text",
        inputType: "text",
        rules: [],
        errors: [],
        wasFocused: false,
        modelValue: null,
        showPassword: false,
      },
      textRules: {
        label: "Input text",
        inputType: "text",
        rules: [requiredRule({})],
        errors: [],
        wasFocused: false,
        modelValue: null,
        showPassword: false,
      },
    }

    expect(String(normalizeFormFields(fields))).toEqual(String(normalizedFields))
  })

  it("Should return normalized buttons structure", () => {
    // Values to test [ [ value, expectedResult ] ]
    const buttonsTest = [
      [
        // Value
        undefined,
        // Expected value
        {
          main: {
            label: {
              create: locale.t("Create new"),
              update: locale.t("Update record"),
            },
          },
          aux: {
            label: { create: locale.t("Cancel"), update: locale.t("Cancel") },
          },
        },
      ],
      [
        // Value
        {},

        // Expected value
        {
          main: {
            label: {
              create: locale.t("Create new"),
              update: locale.t("Update record"),
            },
          },
          aux: {
            label: { create: locale.t("Cancel"), update: locale.t("Cancel") },
          },
        },
      ],
      [
        // Value
        {
          main: {
            label: { create: "Crear elemento" },
          },
        },

        // Expected value
        {
          main: {
            label: {
              create: "Crear elemento",
              update: locale.t("Update record"),
            },
          },
          aux: {
            label: { create: locale.t("Cancel"), update: locale.t("Cancel") },
          },
        },
      ],
      [
        // Value
        {
          aux: {
            label: { create: "No Cancel", update: "No Cancel" },
          },
        },

        // Expected value
        {
          main: {
            label: {
              create: "Create new",
              update: "Update record",
            },
          },
          aux: {
            label: { create: "No Cancel", update: "No Cancel" },
          },
        },
      ],
      [
        // Value
        {
          aux: {
            label: {
              update: "No update",
            },
          },
        },

        // Expected value
        {
          main: {
            label: {
              create: locale.t("Create new"),
              update: locale.t("Update record"),
            },
          },
          aux: {
            label: {
              create: locale.t("Cancel"),
              update: "No update",
            },
          },
        },
      ],
    ]

    buttonsTest.forEach(([value, expectedResult]) => {
      const received = normalizeButtons(value)
      const expected = {
        ...expectedResult,
        aux: {
          ...expectedResult?.aux,
          class: received.aux.class,
        },
      }
      expect(received).toEqual(expected)
    })
  })

  it("Should return normalized title structure", () => {
    const titleTest = [
      [undefined, { create: "Create new element", update: "Update element" }],
      ["Form title", "Form title"],
      [{ create: "New form title" }, { create: "New form title", update: "Update element" }],
      [
        { update: "New update form title" },
        { create: "Create new element", update: "New update form title" },
      ],
      [
        { create: "New create form title", update: "New update form title" },
        { create: "New create form title", update: "New update form title" },
      ],
    ]

    titleTest.forEach(([value, expectedResult]) => {
      expect(normalizeTitle(value)).toEqual(expectedResult)
    })
  })

  it("Should return normalized form settings", () => {
    const title = normalizeTitle()
    const buttons = normalizeButtons()

    const settingsTest = [
      [
        { url: "items/" },
        {
          url: "items/",
          mode: FormModes.CREATE_MODE,
          title,
          buttons,
          lookupField: "id",
          isValid: false,
        },
      ],
      [
        { url: "items/", mode: FormModes.UPDATE_MODE },
        {
          url: "items/",
          mode: FormModes.UPDATE_MODE,
          title,
          buttons,
          lookupField: "id",
          isValid: false,
        },
      ],
      [
        { url: "items/", lookupField: "pk" },
        {
          url: "items/",
          mode: FormModes.CREATE_MODE,
          title,
          buttons,
          lookupField: "pk",
          isValid: false,
        },
      ],
    ]

    settingsTest.forEach(([value, expectedValue]) => {
      expect(normalizeFormSettings(value)).toEqual(expectedValue)
    })
  })
})
