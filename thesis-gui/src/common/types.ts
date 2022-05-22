export interface Category{
  "name": string,
  "id": number,
}
export interface Categories{
  "categories": Category[],
}
export interface Question{
  "question": string,
  "correct": string,
  "answers": string[]
}
