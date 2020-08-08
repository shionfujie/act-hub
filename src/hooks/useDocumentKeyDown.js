import {useEffect} from 'react';

export default function useDocumentKeydown(handleKeydown) {
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
}
