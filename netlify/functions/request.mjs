import {handleRequest} from '../../api/request.mjs';
const unavailable=()=>Response.json({error:'Online requests are temporarily unavailable. Please call the office.'},{status:503,headers:{'Cache-Control':'no-store'}});
export default async (request,context)=>{
 const preview=process.env.CONTEXT==='deploy-preview'||process.env.CONTEXT==='branch-deploy'||process.env.PUBLIC_REQUEST_MODE==='preview';
 if(!preview&&process.env.REQUEST_DELIVERY!=='live')return unavailable();
 return handleRequest(request,{ip:context.ip,env:process.env,preview});
};
export const config={path:'/api/request'};
