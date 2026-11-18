/** Public business data. Never put mail-provider or rate-limit credentials here. */
export const business = {
  name: 'Advanced Plumbing & Drain, Inc.', shortName: 'Advanced Plumbing & Drain',
  url: 'https://advancedplumbingsf.com', phone: '(415) 744-4944', tel: '+14157444944',
  email: 'admin@advancedplumbingsf.com', license: '1009195',
  address: {street: '3450 Sacramento St #204', city:'San Francisco', region:'CA', zip:'94118'},
  hours: 'Open 24 hours, 7 days a week', areas: ['San Francisco', 'Daly City', 'South San Francisco', 'San Mateo County'],
  profiles: {google:'https://maps.google.com/?cid=849431968981256539', yelp:'https://www.yelp.com/biz/advanced-plumbing-and-drain-san-francisco', bbb:'https://www.bbb.org/us/ca/san-francisco/profile/plumber/advanced-plumbing-drain-inc-1116-874008', diamond:'https://www.diamondcertified.org/report/advanced-plumbing-and-drain/', facebook:'https://www.facebook.com/people/Advanced-Plumbing-and-Drain-Inc/100068700451249/', linkedin:'https://www.linkedin.com/company/advanced-plumbing-and-drain-inc/'},
  showAddress:true, showRatings:false, showSmsOptIn:false, smsConsentText:'',
  /** Only set these after the office approves the destination, wording, and marks. */
  schedulerUrl: '', approvedYears: null as number|null, credentialsApproved:false,
  video: {approved:false, url:'https://advancedplumbingsf.com/wp-content/uploads/2020/08/ADP_Branding_30_REV.mp4', captions:'', transcript:''},
  analytics:{gtmId:'', ga4Id:''}, announcement:{text:'', endDate:''},
  unconfirmed:{years:'over 20', freeEstimates:true, locallyOwned:true, mobileService:true, sameDayWaterHeaters:true,
    reviewFigures:[{source:'Google',count:480,rating:null,observed:'2026-11-17',verifiedOn:null},{source:'Yelp',count:215,rating:null,observed:'2026-11-17',verifiedOn:null}]}
} as const;
export const address = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.zip}`;
export const phoneLink = `tel:${business.tel}`;
