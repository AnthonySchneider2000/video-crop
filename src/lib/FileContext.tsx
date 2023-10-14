import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for your context data
interface FileContextType {
  selectedFiles: File[];
  addSelectedFiles: (files: File[]) => void;
}

// Create a context with an initial value
const FileContext = createContext<FileContextType | undefined>(undefined);

// Create a custom hook to access the context
const useFileContext = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

// Define the FileProvider component
const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const addSelectedFiles = (files: File[]) => {
    setSelectedFiles(files);
  };

  return (
    <FileContext.Provider value={{ selectedFiles, addSelectedFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export { useFileContext, FileProvider };
