import {z} from 'zod';
import {createHash} from 'node:crypto';
import {serviceTypes,urgencies} from '../content/form-options.mjs';
const optionalText=(n)=>z.string().trim().max(n).optional().default('');
export const requestSchema=z.object({
 name:z.string().trim().min(2,'Enter your full name.').max(100),phone:z.string().trim().max(26).refine(v=>/^(1)?[2-9]\d{2}[2-9]\d{6}$/.test(v.replace(/[^\d]/g,''))&&!/[a-z]/i.test(v),'Enter a valid US phone number.'),
 zip:z.string().trim().regex(/^\d{5}$/,'Enter a five-digit ZIP code.'),service:z.enum(serviceTypes),urgency:z.enum(urgencies),description:z.string().trim().min(5,'Please add a short description.').max(1500),
 email:z.union([z.literal(''),z.string().trim().email().max(254)]).optional().default(''),address:optionalText(180),privacy:z.literal(true),sms:z.boolean().optional().default(false),website:optionalText(250),requestId:z.string().uuid()
}).strict();
const localLimits=new Map();
const json=(s,o,headers={})=>new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export async function handleRequest(req,ctx={}){
 const env=ctx.env||process.env, preview=ctx.preview===true, send=ctx.fetch||fetch;
 if(req.method!=='POST')return json(405,{error:'Use the service request form.'},{Allow:'POST'});
 const origin=req.headers.get('origin');let allowedOrigin;try{allowedOrigin=new URL(preview?req.url:env.SITE_URL).origin}catch{return json(503,{error:'Online requests are unavailable. Please call the office.'})}
 if(!origin||origin!==allowedOrigin)return json(403,{error:'Open the request form on this website and try again.'});
 if(!req.headers.get('content-type')?.split(';')[0].trim().toLowerCase().match(/^application\/json$/))return json(415,{error:'Use the service request form.'});
 if(Number(req.headers.get('content-length')||0)>12000)return json(413,{error:'Your request is too long.'});
 let data;try{const text=await req.text();if(Buffer.byteLength(text)>12000)return json(413,{error:'Your request is too long.'});data=JSON.parse(text)}catch{return json(400,{error:'Check the form and try again.'})}
 if(data?.website)return json(200,{ok:true,preview,message:preview?'Preview request complete.':'Request received.'});
 const parsed=requestSchema.safeParse(data);if(!parsed.success)return json(422,{error:'Please check the highlighted fields.',fields:Object.fromEntries(parsed.error.issues.map(i=>[i.path[0],i.message]))});
 const d=parsed.data;
 if(d.sms&&env.SMS_APPROVED!=='true')return json(422,{error:'Marketing messages are not enabled.'});
 const key=createHash('sha256').update((env.RATE_LIMIT_SALT||'local-preview')+':'+(ctx.ip||'local')).digest('hex');
 try{
  if(preview){const now=Date.now();for(const[k,v]of localLimits)if(v.until<now)localLimits.delete(k);const slot=localLimits.get(key)||{n:0,until:now+600000};slot.n++;localLimits.set(key,slot);if(slot.n>8)return json(429,{error:'Too many requests. Please call or try again in 10 minutes.'},{'Retry-After':'600'});}
  else{
   if(!env.RESEND_API_KEY||!env.MAIL_FROM||!env.OFFICE_EMAIL||!env.APPROVED_CONFIRMATION||!env.UPSTASH_REDIS_REST_URL||!env.UPSTASH_REDIS_REST_TOKEN||!env.RATE_LIMIT_SALT)return json(503,{error:'Online requests are temporarily unavailable. Please call the office.'});
   const rl=await send(env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',"local n=redis.call('INCR', KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n",1,'request:'+key]),signal:AbortSignal.timeout(7000)});
   if(!rl.ok)throw Error('limit store unavailable');const count=(await rl.json()).result;if(!Number.isInteger(count))throw Error('limit store unavailable');if(count>5)return json(429,{error:'Too many requests. Please call or try again in 10 minutes.'},{'Retry-After':'600'});
  }
  if(preview)return json(200,{ok:true,preview:true,reference:d.requestId.slice(0,8).toUpperCase(),message:'Your form is complete. This preview has not sent a service request or an email. To arrange a visit, call the office.'});
  const batch=[{from:env.MAIL_FROM,to:[env.OFFICE_EMAIL],subject:`Service request: ${d.service} — ${d.urgency}`,text:`Request ${d.requestId}\n\nName: ${d.name}\nPhone: ${d.phone}\nZIP: ${d.zip}\nService: ${d.service}\nUrgency: ${d.urgency}\n\n${d.description}\n\nEmail: ${d.email||'Not provided'}\nAddress: ${d.address||'Not provided'}\nPrivacy acknowledged: yes\nSMS opt-in: ${d.sms?'yes':'no'}`,...(d.email?{reply_to:d.email}:{})}];
  if(d.email)batch.push({from:env.MAIL_FROM,to:[d.email],subject:'Your plumbing service request',text:env.APPROVED_CONFIRMATION});
  const mail=await send('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':d.requestId},body:JSON.stringify(batch),signal:AbortSignal.timeout(15000)});
  if(!mail.ok)throw Error('mail unavailable');return json(200,{ok:true,preview:false,reference:d.requestId.slice(0,8).toUpperCase(),message:env.APPROVED_CONFIRMATION});
 }catch{return json(503,{error:'We could not confirm delivery. Your details are still in the form. Please try again or call the office.'})}
}
/** Local adapter only: no delivery, no storage, no logging of form details. */
export async function serveRequest(req,res){
 const base=(req.headers['x-forwarded-proto']==='https'?'https':'http')+'://'+(req.headers['x-forwarded-host']||req.headers.host);
 let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>12000){res.writeHead(413);res.end('Request too long');return}}
 try{const r=await handleRequest(new Request(base+'/api/request',{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})}),{preview:true,ip:req.socket.remoteAddress});res.writeHead(r.status,Object.fromEntries(r.headers));res.end(await r.text())}catch{res.writeHead(400);res.end('Invalid request')}
}
