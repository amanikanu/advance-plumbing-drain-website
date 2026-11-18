import {defineCollection,z} from 'astro:content';
import {glob} from 'astro/loaders';import {businessText} from './lib/business-text';
const faq=z.object({q:z.string(),a:z.string().transform(businessText)});
const services=defineCollection({loader:glob({pattern:'*.md',base:'./content/services'}),schema:z.object({title:z.string(),path:z.string(),intro:z.string(),description:z.string().max(159),group:z.enum(['plumbing','sewer','heater','commercial']),symptoms:z.array(z.string()),process:z.string(),cost:z.string(),faq:z.array(faq),serviceType:z.string(),city:z.string().default('San Francisco')})});
const locations=defineCollection({loader:glob({pattern:'*.md',base:'./content/locations'}),schema:z.object({title:z.string(),path:z.string(),description:z.string().max(159),intro:z.string(),faq:z.array(faq)})});
const blog=defineCollection({loader:glob({pattern:'*.md',base:'./content/blog'}),schema:z.object({title:z.string(),path:z.string(),description:z.string().max(159),date:z.string(),category:z.string(),tags:z.array(z.string()).default([])})});
export const collections={services,locations,blog};
