type Client = {
  id: string;
  firstName: string;
  lastName: string;
  cpf: string;
  accessCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatedClientResponse = {
  id: string;
  firstName: string;
  lastName: string;
  accessCode: string;
};

export type GetClientQuery = {
  firstName?: string;
  cpf?: string;
  isActive?: "true" | "false";
  page?: string;
  limit?: string;
};

export type GetAllClientsResponse = {
  data: Client[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
