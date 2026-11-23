/**
 * Founder Codex portable invention model, v0.1.
 * Pure functions: no network, credentials, or external side effects.
 */
export const SCHEMA = "starlight.codex/v1";
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
export function createInvention({title, note, author="founder"}) {
  if (!title?.trim() || !note?.trim()) throw new Error("Title and original note are required");
  const invention = {schema:SCHEMA,id:id(),title:title.trim(),originalNote:note.trim(),author,
    createdAt:now(),references:[],relations:[],missions:[],events:[]};
  return appendEvent(invention,"invention.created",{title:invention.title,originalNote:invention.originalNote},author);
}
export function appendEvent(invention,type,payload,actor="founder") {
  const copy=structuredClone(invention);
  const previous=copy.events.at(-1);
  copy.events.push({id:id(),sequence:copy.events.length+1,at:now(),actor,type,
    previousEventId:previous?.id??null,payload:structuredClone(payload)});
  return copy;
}
export function addReference(invention,{url,label,provider="external"},actor="founder") {
  const parsed=new URL(url);
  if(parsed.protocol!=="https:") throw new Error("References must use HTTPS");
  if(parsed.username||parsed.password) throw new Error("Credentials in URLs are forbidden");
  const reference={id:id(),url:parsed.href,label:label?.trim()||parsed.hostname,provider,verified:false};
  const copy=structuredClone(invention);copy.references.push(reference);
  return appendEvent(copy,"reference.added",reference,actor);
}
export function recordDecision(invention,{statement,rationale,evidenceIds=[]},actor="founder") {
  if(!statement?.trim()||!rationale?.trim()) throw new Error("Decision and rationale required");
  return appendEvent(invention,"decision.recorded",{statement:statement.trim(),rationale:rationale.trim(),evidenceIds},actor);
}
export function createMission(invention,{brief,assignee="unassigned",budget=0},actor="founder") {
  if(!brief?.trim()||!Number.isFinite(budget)||budget<0) throw new Error("Invalid mission");
  const mission={id:id(),brief:brief.trim(),assignee,budget,status:"awaiting-evidence",evidence:[]};
  const copy=structuredClone(invention);copy.missions.push(mission);
  return appendEvent(copy,"mission.created",mission,actor);
}
export function submitEvidence(invention,missionId,{summary,sourceUrls=[]},actor="agent") {
  if(!summary?.trim()) throw new Error("Evidence summary required");
  sourceUrls.forEach(url=>{const u=new URL(url);if(u.protocol!=="https:"||u.username||u.password)throw new Error("Invalid evidence URL")});
  const copy=structuredClone(invention),mission=copy.missions.find(m=>m.id===missionId);
  if(!mission||mission.status!=="awaiting-evidence") throw new Error("Mission cannot receive evidence");
  const evidence={id:id(),summary:summary.trim(),sourceUrls,actor,at:now()};
  mission.evidence.push(evidence);mission.status="awaiting-review";
  return appendEvent(copy,"mission.evidence-submitted",{missionId,evidence},actor);
}
export function reviewMission(invention,missionId,decision,actor="founder") {
  if(!["approved","rejected"].includes(decision))throw new Error("Invalid decision");
  const copy=structuredClone(invention),mission=copy.missions.find(m=>m.id===missionId);
  if(!mission||mission.status!=="awaiting-review"||!mission.evidence.length)throw new Error("Evidence required before review");
  mission.status=decision;
  return appendEvent(copy,"mission.reviewed",{missionId,decision},actor);
}
export function reconstruct(invention,sequence) {
  if(!Number.isInteger(sequence)||sequence<1||sequence>invention.events.length)throw new Error("Invalid revision");
  const events=invention.events.slice(0,sequence);
  const state={schema:SCHEMA,id:invention.id,title:"",originalNote:"",references:[],missions:[],decisions:[],events};
  for(const e of events){
    if(e.type==="invention.created"){state.title=e.payload.title;state.originalNote=e.payload.originalNote}
    if(e.type==="reference.added")state.references.push(e.payload);
    if(e.type==="decision.recorded")state.decisions.push(e.payload);
    if(e.type==="mission.created")state.missions.push(structuredClone(e.payload));
    if(e.type==="mission.evidence-submitted"){const m=state.missions.find(m=>m.id===e.payload.missionId);if(m){m.evidence.push(e.payload.evidence);m.status="awaiting-review"}}
    if(e.type==="mission.reviewed"){const m=state.missions.find(m=>m.id===e.payload.missionId);if(m)m.status=e.payload.decision}
  }
  return state;
}
export function exportBundle(invention) {
  if(invention.schema!==SCHEMA)throw new Error("Unsupported schema");
  const safe=structuredClone(invention);
  for(const ref of safe.references){const u=new URL(ref.url);if(u.username||u.password||u.protocol!=="https:")throw new Error("Unsafe reference")}
  return JSON.stringify({format:SCHEMA,exportedAt:now(),invention:safe},null,2);
}
