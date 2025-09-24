export type Domain = {
  id: string|null
  domain: string
  isActive: boolean|null
  status: 1 | 2 | 3
  createdDate: string|null
}

export type CreateDomainInput = {
  domain: string | undefined;
  status: 1 | 2 | 3 | undefined;
  isActive: boolean | undefined;
};