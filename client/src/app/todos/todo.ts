export interface Todo {
  _id: string;
  owner: string;
  body: string;
  category: string;
  status: StatusType;
}

export type StatusType = true|false ;
