import {business} from '@content/business';import {reviews,ratings} from '@content/reviews';import {offers} from '@content/offers';
const https=(s:string)=>{try{return new URL(s).protocol==='https:'}catch{return false}};
const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s));
const sourceAllowed=(source:'Google'|'Yelp',url:string)=>{if(!https(url))return false;const h=new URL(url).hostname;return source==='Yelp'?/^(www\.)?yelp\.com$/.test(h):/^(www\.|maps\.)?google\.com$|^maps\.app\.goo\.gl$|^g\.page$/.test(h)};
export function checkApprovals(){
 if(business.schedulerUrl&&!https(business.schedulerUrl))throw Error('Use a confirmed HTTPS scheduler URL.');
 if(business.showSmsOptIn&&!business.smsConsentText.trim())throw Error('Counsel-approved optional SMS wording is required.');
 if(business.showRatings&&(!ratings.length||ratings.some(r=>!r.approved||!validDate(r.verifiedOn)||!sourceAllowed(r.source,r.url)||!Number.isInteger(r.count)||r.count<1||r.value<1||r.value>5||Date.parse(r.verifiedOn)>Date.now()||Date.now()-Date.parse(r.verifiedOn)>90*86400000)))throw Error('Visible ratings require approved, current, dated sources.');
 for(const r of reviews){if(r.excerpt.includes('nn'))throw Error('Review contains the legacy nn formatting bug.');if(r.approved&&(!r.name.trim()||r.name.toLowerCase()==='yelp user'||!r.excerpt.trim()||!validDate(r.date)||!sourceAllowed(r.source,r.url)))throw Error('Approved reviews need attribution, text, date, and source link.')}
 for(const o of offers.filter(o=>o.approved))if(!o.title||!o.terms||!validDate(o.startsOn)||!validDate(o.endsOn)||Date.parse(o.startsOn)>Date.parse(o.endsOn)||!/^\/(?!\/)/.test(o.href))throw Error('Offers need terms, valid dates, and an internal destination.');
 if(business.video.approved&&(!business.video.captions||!business.video.transcript))throw Error('Add approved captions and transcript before publishing the video.');
}
