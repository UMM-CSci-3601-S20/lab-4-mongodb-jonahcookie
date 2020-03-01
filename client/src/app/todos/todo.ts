export interface Todo {
  _id: string;
  owner: string;
  body: string;
  category: string;
  status: boolean;
}

export type StatusType = "incomplete" | "complete" ;
