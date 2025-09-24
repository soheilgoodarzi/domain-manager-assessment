export type Domain = {
  id: string
  domain: string
  isActive: boolean
  status: 1 | 2 | 3
  createdDate: string
}

export type CreateDomainInput = {
  domain: string | undefined;
  status: 1 | 2 | 3 | undefined;
  isActive: boolean | undefined;
};