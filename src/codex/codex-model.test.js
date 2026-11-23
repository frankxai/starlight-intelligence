import {describe,it,expect} from "vitest";
import {createInvention,addReference,recordDecision,createMission,submitEvidence,reviewMission,reconstruct,exportBundle} from "./codex-model.js";
describe("Founder Codex contract",()=>{
 it("requires a note and preserves creation event",()=>{expect(()=>createInvention({title:"",note:""})).toThrow();const x=createInvention({title:"Wing",note:"Sketch"});expect(x.events[0].sequence).toBe(1)});
 it("rejects insecure and credential-bearing references",()=>{const x=createInvention({title:"A",note:"B"});expect(()=>addReference(x,{url:"http://example.com"})).toThrow();expect(()=>addReference(x,{url:"https://user:pass@example.com"})).toThrow()});
 it("reconstructs an earlier revision without later references",()=>{let x=createInvention({title:"A",note:"B"});x=recordDecision(x,{statement:"Build",rationale:"Evidence"});x=addReference(x,{url:"https://github.com/example/repo"});const prior=reconstruct(x,2);expect(prior.decisions).toHaveLength(1);expect(prior.references).toHaveLength(0)});
 it("requires evidence before approving missions",()=>{let x=createInvention({title:"A",note:"B"});x=createMission(x,{brief:"Research"});const id=x.missions[0].id;expect(()=>reviewMission(x,id,"approved")).toThrow();x=submitEvidence(x,id,{summary:"Reviewed",sourceUrls:["https://example.com"]});x=reviewMission(x,id,"approved");expect(reconstruct(x,x.events.length).missions[0].status).toBe("approved")});
 it("exports a versioned portable bundle",()=>{const x=createInvention({title:"A",note:"B"});expect(JSON.parse(exportBundle(x)).format).toBe("starlight.codex/v1")});
});
