export const prefixBackendUrl = (path: string) => { 
  return path ? `${process.env.REACT_APP_BACKEND_URL}/images/${path}` : '';
}