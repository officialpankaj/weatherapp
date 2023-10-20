import { BrowserRouter } from "react-router-dom";
import WeatherApp from "./components/WeatherApp";
import { Provider } from "react-redux";
import store from "./Store/store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <WeatherApp />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
