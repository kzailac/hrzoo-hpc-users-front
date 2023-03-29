import React from 'react';
import { Outlet } from 'react-router-dom';
import HeadTitle from '../components/HeadTitle';
import { LinkTitles } from '../utils/link-titles';
import { RequestTypesToSelect, UrlToRequestType } from '../utils/request-types';


export const SharedData = React.createContext()


const Root = () => {
  return (
    <>
      <SharedData.Provider value={{
        linkTitles: LinkTitles,
        RequestTypesToSelect: RequestTypesToSelect,
        UrlToRequestType: UrlToRequestType
      }}>
        <HeadTitle />
        <Outlet />
      </SharedData.Provider>
    </>
  )
};

export default Root;