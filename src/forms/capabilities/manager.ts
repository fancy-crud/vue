import type { FieldErrors, FormManager, FormMap, Handler, Notification, NotificationHandler, ObjectWithNormalizedFields, StatusCodeHandler } from '../axioma'
import { FormModes, NotificationType } from '../axioma'
import { FillWithRecordValues, GenerateFormData, HandleErrors, ResetFields } from './fields'
import { GetForeignKeyValues } from '@/http/axioma'

const forms = new Map<symbol, FormMap>()
const responseHandlers = new Map<symbol, StatusCodeHandler>()
const notificationHandlers = new Map<symbol, NotificationHandler>()

export class FormManagerHandler implements FormManager {
  constructor(private id: symbol) {}

  getForm(): FormMap {
    const form = forms.get(this.id)

    if (!form)
      throw new Error(`Unable to found form id(${String(this.id)})`)

    return form
  }

  addForm(form: FormMap) {
    forms.set(this.id, form)

    // TODO: Create default handlers
    this.setResponseHandler({
      400: (errors: any) => this.setErrors(errors),
    })
  }

  removeForm() {
    forms.delete(this.id)
    this.removeNotificationHandlers()
    this.removeResponseHandlers()
  }

  fillWithRecordValues(record: Record<string, unknown>) {
    const form = this.getForm()
    const fillWithRecordValues = new FillWithRecordValues()
    fillWithRecordValues.execute(form.fields, record)

    form.settings.lookupValue = String(record[form.settings.lookupField] || '')
  }

  resetFields() {
    const form = this.getForm()
    const reset = new ResetFields()

    reset.execute(form.fields, form.originalNormalizedFields)
  }

  getForeignKeyValues(fields?: ObjectWithNormalizedFields) {
    const form = fields ? { fields } : this.getForm()
    const getForeignKeyValues = new GetForeignKeyValues(httpService)

    getForeignKeyValues.execute({ ...form.fields })
  }

  getFormData(fields?: ObjectWithNormalizedFields) {
    const form = fields ? { fields } : this.getForm()

    const formData = new GenerateFormData()
    return formData.execute(form.fields)
  }

  setErrors(errors: FieldErrors) {
    const form = this.getForm()

    const handleErrors = new HandleErrors()
    handleErrors.execute(form.fields, errors)

    if (!form.settings.disableNotifications)
      this.pushNotification({ type: NotificationType.error, data: errors })
  }

  switchToCreateMode() {
    const form = this.getForm()

    form.settings.mode = FormModes.CREATE_MODE
  }

  switchToUpdateMode() {
    const form = this.getForm()

    form.settings.mode = FormModes.UPDATE_MODE
  }

  private getResponseHandlerFromMap() {
    if (!responseHandlers.get(this.id))
      responseHandlers.set(this.id, {})

    return responseHandlers.get(this.id)!
  }

  setResponseHandler(codes: StatusCodeHandler) {
    Object.assign(this.getResponseHandlerFromMap(), codes)
  }

  getResponseHandler(code: number): Handler | null {
    return this.getResponseHandlerFromMap()[code] || null
  }

  removeResponseHandlers() {
    responseHandlers.delete(this.id)
  }

  private getNotificationHandlerFromMap(): NotificationHandler {
    const handlers = notificationHandlers.get(this.id)

    if (!handlers) {
      notificationHandlers.set(this.id, {})
      return notificationHandlers.get(this.id)!
    }

    return handlers
  }

  setNotificationHandler(handler: NotificationHandler) {
    Object.assign(this.getNotificationHandlerFromMap(), handler)
  }

  pushNotification(notification: Notification) {
    const handler = this.getNotificationHandlerFromMap()[notification.type]

    if (!handler)
      return

    handler(notification)
  }

  removeNotificationHandlers() {
    notificationHandlers.delete(this.id)
  }
}
