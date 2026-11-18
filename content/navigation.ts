export const urls = {
  plumbing:'/plumbing-services-sf/', sewer:'/plumbing-services-sf/sewer-drain-repair/', heater:'/plumbing-services-sf/water-heater/', commercial:'/plumbing-services-sf/commercial-plumber/', emergency:'/plumbing-services-sf/24h-emergency-plumber/', detection:'/plumbing-services-sf/water-leak-detection/', leak:'/plumbing-services-sf/leak-repair-san-francisco-ca/', drain:'/plumbing-services-sf/drain-cleaning-san-francisco-ca/', daly:'/plumbers-in-daly-city-ca/', south:'/south-san-francisco-plumber/', areas:'/service-areas/', resources:'/resources/', reviews:'/reviews/', about:'/about-us/', contact:'/contact-us/', blog:'/blog/', privacy:'/privacy-policy/', terms:'/terms-of-service/', accessibility:'/accessibility/', media:'/media-room/', sitemap:'/sitemap/'
};
export const categories = [
 {name:'General plumbing',href:urls.plumbing,icon:'faucet',code:'01',description:'Leak detection, pipe repairs, toilets, and fixtures.',detail:'Explore plumbing services'},
 {name:'Sewer & drain',href:urls.sewer,icon:'pipe',code:'02',description:'Drain cleaning, hydro-jetting, and sewer line repair.',detail:'Explore sewer & drain'},
 {name:'Water heaters',href:urls.heater,icon:'heater',code:'03',description:'Water heater repair, installation, and replacement.',detail:'Explore water heaters'},
 {name:'Commercial plumbing',href:urls.commercial,icon:'building',code:'04',description:'Plumbing for businesses and multi-unit properties.',detail:'Explore commercial services'}
] as const;
export const areaLinks = [{name:'San Francisco',href:'/service-areas/#san-francisco'}, {name:'Daly City',href:urls.daly}, {name:'South San Francisco',href:urls.south}, {name:'San Mateo County',href:'/service-areas/#san-mateo-county'}];
export const footerNav = {
  Services: [...categories.map(c=>({name:c.name,href:c.href})),{name:'Emergency plumbing',href:urls.emergency},{name:'Leak detection',href:urls.detection}],
  'Service areas':areaLinks,
  Company:[{name:'About us',href:urls.about},{name:'Reviews',href:urls.reviews},{name:'Contact',href:urls.contact},{name:'Resources',href:urls.resources},{name:'Plumbing journal',href:urls.blog},{name:'Media room',href:urls.media}]
};
