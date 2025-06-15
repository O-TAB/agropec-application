
// @returns 
export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar os dados: ${response.status}`);
  }

  const data: T = await response.json();
  return data;
};




