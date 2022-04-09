import { h } from "tsx-dom"
import { render } from "uhtml"
import { shallowReactive, effect } from "@vue/reactivity"

type CB = () => any

let currentInstance: any

export function defineComponent(propDefs?: any, factory?: any, parent?: HTMLElement) {
  let _props: any = null
  let _bm: any = null
  let _bu: any = null
  let _u: any = null
  let _m: any = null
  let _um: any = null

  defineComponent.prototype.connectedCallback = function () {
    _m && _m.forEach((cb: CB) => cb())
  }
  defineComponent.prototype.disconnectedCallback = function () {
    _um && _um.forEach((cb: CB) => cb())
  }
  defineComponent.prototype.attributeChangedCallback = function (
    name: string,
    _: unknown,
    newValue: unknown
  ) {
    _props[name] = newValue
  }

  if (typeof propDefs === "function") {
    factory = propDefs
    propDefs = []
  }

  const props = (_props = shallowReactive({}))
  // currentInstance = this
  const template = factory.call(this, props) as any
  currentInstance = null
  _bm && _bm.forEach((cb: CB) => cb())

  let component = parent || <div></div>
  let isMounted = false

  effect(() => {
    if (isMounted) {
      _bu && _bu.forEach((cb: CB) => cb())
    }

    const xre = template()

    // if (xre && xre.template) {
    //   const dom = new DOMParser().parseFromString(xre.template.join(""), "text/html").body.children

    //   console.log(xre)
    //   component = dom[0] as any

    //   if (component) {
    //     component.append(...xre.values)
    //     render(component.cloneNode(false), component)
    //   }
    // } else {
    //   console.log(xre)
    // }
    render(component, xre)

    if (isMounted) {
      _u && _u.forEach((cb: CB) => cb())
    } else {
      isMounted = true
    }
  })

  return component
}

function createLifecycleMethod(name: string) {
  return (cb: CB) => {
    if (currentInstance) {
      ;(currentInstance[name] || (currentInstance[name] = [])).push(cb)
    }
  }
}

export const onBeforeMount = createLifecycleMethod("_bm")
export const onMounted = createLifecycleMethod("_m")
export const onBeforeUpdate = createLifecycleMethod("_bu")
export const onUpdated = createLifecycleMethod("_u")
export const onUnmounted = createLifecycleMethod("_um")

export * from "@vue/reactivity"
