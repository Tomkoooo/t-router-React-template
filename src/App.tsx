import { DynamicRouter } from "@tomkoooo/t-router";
import routes from "./pages.config.json"
const App = () => {

  const pages = import.meta.glob('./pages/**/*.{tsx,jsx}'); 

  return (
    <div>
      <DynamicRouter pagesConfig={routes.Routes} pages={pages}/>
    </div>
  )
}

export default App