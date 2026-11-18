export type Review = { name:string; excerpt:string; source:'Google'|'Yelp'; url:string; date:string; approved:boolean };
// Add only client-cleared excerpts. Do not copy anonymous reviews or infer a rating.
export const reviews: Review[] = [];
export type Rating = {source:'Google'|'Yelp'; url:string; count:number; value:number; verifiedOn:string; approved:boolean};
export const ratings:Rating[] = [];
