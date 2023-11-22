import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "GlobalStyle";
import { Provider } from "react-redux";
import store from "redux/config/configStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
      <GlobalStyle />
      <ReactQueryDevtools initialIsOpen={false} />
    </Provider>
  </QueryClientProvider>
);
