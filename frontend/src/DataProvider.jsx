import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // One state per page
  const [videoData, setVideoData] = useState(null);
  const [widgetData, setWidgetData] = useState(null);
  const [ottData, setOttData] = useState(null);

  return (
    <DataContext.Provider
      value={{
        videoData, setVideoData,
        widgetData, setWidgetData,
        ottData, setOttData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
