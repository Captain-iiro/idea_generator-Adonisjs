import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<{ default: any }>('../pages/**/*.tsx', { eager: true })
      const module = pages[`../pages/${name}.tsx`]
      return module.default
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
