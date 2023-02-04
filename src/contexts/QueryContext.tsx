import React, { FC, createContext, ReactNode } from "react";
import axios from "axios";
import * as URL from "../utils/Endpoints";

const axiosInstance = axios.create();

export const queryContext = createContext<any>({});
const Provider = queryContext.Provider;

const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const errorParser = (e: any) => {
    console.log(e);
  };
  const search = async (params: any) => {
    const url = URL.Search;
    return await axiosInstance.post(url, params).catch(errorParser);
  };

  return (
    <Provider
      value={{
        search,
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryProvider;
