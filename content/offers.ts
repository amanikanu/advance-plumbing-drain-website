/** Only publish office-approved offers with exact terms and a real expiry. */
export interface Offer {title:string;terms:string;href:string;startsOn:string;endsOn:string;approved:boolean}
export const offers:Offer[]=[];
