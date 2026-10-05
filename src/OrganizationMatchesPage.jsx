import React,{useState} from 'react';
import {ArrowRight,Building2,CheckCircle2,MapPin,Sparkles} from 'lucide-react';
import {getRatingSummary,matchListings} from './data/demoStore';

const price=(value)=>`₹${Math.round(value).toLocaleString('en-IN')}`;

export default function OrganizationMatchesPage({profile,data,routeTo}){
 const projects=data.projects;
 const [projectId,setProjectId]=useState(projects[0]?.id??'');
 const project=projects.find(item=>item.id===projectId);
 const ownListings=data.listings.filter(item=>item.owner_id===profile.id&&item.status==='AVAILABLE'&&item.available_quantity>0);
 const matches=project?matchListings(project,ownListings.map(listing=>{const rating=getRatingSummary(data.feedback,listing.owner_id);return {...listing,owner_name:rating?`${listing.owner_name} · ★ ${rating.average.toFixed(1)} (${rating.count})`:listing.owner_name}}),profile.location||project.location||''):[];
 const requiredCount=project?.requirements.reduce((sum,item)=>sum+item.quantity,0)??0;
 const allocated=project?.requirements.map(requirement=>{
  let remaining=requirement.quantity;
  let cost=0;
  for(const listing of matches.filter(item=>item.component_name.toLowerCase()===requirement.name.toLowerCase())){
   const quantity=Math.min(remaining,listing.available_quantity);
   cost+=quantity*listing.price_per_unit;
   remaining-=quantity;
   if(!remaining)break;
  }
  return {complete:remaining===0,cost};
 })??[];
 const componentTypes=allocated.filter(item=>item.complete).length;
 const coverage=requiredCount?Math.round(project.requirements.reduce((sum,requirement)=>sum+Math.min(requirement.quantity,matches.filter(item=>item.component_name.toLowerCase()===requirement.name.toLowerCase()).reduce((available,item)=>available+item.available_quantity,0)),0)/requiredCount*100):0;
 const bestReuseCost=allocated.reduce((sum,item)=>sum+item.cost,0);
 return <section className="workspacePage"><div className="workspaceSectionTitle"><div><div className="eyebrow">ORGANIZATION RESOURCE MATCHING</div><h2>Match resources to projects</h2><p>Review maker requirements against your own published listings with available quantity.</p></div><span className="demoDataBadge"><span/>DEMO DATA</span></div>{!projects.length?<div className="emptyState"><h3>No project requirements available</h3><p>Demo project requirements will appear here.</p></div>:<><div className="matchControls"><label>Project<select value={projectId} onChange={event=>setProjectId(event.target.value)}>{projects.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="matchBudget"><span>Project budget</span><strong>{price(project?.budget??0)}</strong></div></div><div className="feasibilityStrip"><div><span>PROJECT FEASIBILITY</span><strong>{coverage}%</strong></div><div><b>{componentTypes}/{project.requirements.length}</b><span>component types matched</span></div><div><b>{matches.length}</b><span>your available listings</span></div><div><b>{price(bestReuseCost)}</b><span>best reuse estimate</span></div></div><div className="matchCardList">{matches.map(listing=>{const rating=getRatingSummary(data.feedback,listing.owner_id);return <article className="marketListingCard" key={listing.id}><div className="marketListingHeader"><div><div className="marketListingName"><h3>{listing.component_name}</h3><span className="matchScore"><Sparkles size={14}/>{listing.match_score}% match</span></div><p>{listing.description}</p></div><div className="marketPrice"><strong>{listing.listing_type==='DONATE'?'DONATE':price(listing.price_per_unit)}</strong><span>{listing.available_quantity} available</span></div></div><div className="listingMeta"><span><Building2 size={14}/>{listing.owner_name}</span><span><MapPin size={14}/>{listing.location} · {listing.distance_km} km</span><span><CheckCircle2 size={14}/>{listing.condition}</span>{rating&&<span><Star size={14}/>{rating.average.toFixed(1)} · {rating.count} ratings</span>}<span className="statusPill status-available">AVAILABLE</span></div><p className="matchingReason">Recommended because it exactly matches a current maker requirement and has {listing.available_quantity} available unit(s).</p><div className="listingCardActions"><span className="listingFormNote">Organization listing · {listing.listing_type==='DONATE'?'donation':'sale'} · demo data</span><button className="secondary small" onClick={()=>routeTo('/project-requests')}>Review project requests <ArrowRight size={15}/></button></div></article>})}{!matches.length&&<div className="emptyState"><h3>No available organization listings match</h3><p>Publish available inventory first. Owned quantities that are not listed stay private and cannot be matched.</p></div>}</div></>}</section>;
}
