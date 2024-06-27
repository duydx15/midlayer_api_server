import dataJson from "./list_operator.json"

export interface Operator {
  address: string;
  privateKey:string
}

export const listOperators:Operator[] = dataJson.listOperator