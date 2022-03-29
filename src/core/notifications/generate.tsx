import { h } from "tsx-dom"
import { NotificationProps } from "."

function createNotification(props: NotificationProps) {
  const { backgroundColor, textColor, message, icon, duration } = props
  let containerClass = 'card card-side shadow-lg transition-all duration-1000 animate__animated animate__fadeInRight'
  containerClass = `${containerClass} fixed top-5 right-5 max-w-xs sm:max-w-md w-full`

  const notification = (
    <div class={`${containerClass} ${ backgroundColor } ${ textColor }`}>
      <div class="flex items-center pl-8">
        <i class={`text-xl ${ icon }`}></i>
      </div>
      <div class="card-body">
        <div>
          <h2 class="mb-0 text-md font-bold">{ message }</h2>
        </div>
      </div>
    </div>
  )

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.className = notification.className.replace('animate__fadeInRight', 'animate__fadeOutRight')
    setTimeout(() => document.body.removeChild(notification), 1000)
  }, duration)
}

export const successNotification = (props?: Partial<NotificationProps>) => createNotification({
  backgroundColor: 'bg-green-400',
  textColor: 'text-white',
  icon: 'mdi mdi-check-circle',
  message: 'Se ha creado el elemento con éxito',
  duration: 4000,
  ...props
})

export const warningNotification = (props?: Partial<NotificationProps>) => createNotification({
  backgroundColor: 'bg-amber-500',
  textColor: 'text-white',
  icon: 'mdi mdi-close-circle',
  message: 'Algo intenta fallar',
  duration: 4000,
  ...props
})

export const errorNotification = (props?: Partial<NotificationProps>) => createNotification({
  backgroundColor: 'bg-red-400',
  textColor: 'text-white',
  icon: 'mdi mdi-close-circle',
  message: 'Ha ocurrido un error',
  duration: 4000,
  ...props
})
