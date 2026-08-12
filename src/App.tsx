import { useEffect } from 'react'
import './App.css'

type Principle = {
  id: string
  title: string
  body: string
  test: string
}

const principles: Principle[] = [
  { id: 'SLA-01', title: 'Human authorship', body: 'People remain the authors of goals, meaning, and consequential choices. Intelligence may propose and execute; it does not inherit moral responsibility.', test: 'Can a person understand, change, refuse, and recover from the system’s action?' },
  { id: 'SLA-02', title: 'Intelligence access', body: 'Advanced capability should widen participation in education, protection, invention, and economic life—not become a private utility for a cognitive elite.', test: 'Does the useful capability reach people beyond the already powerful?' },
  { id: 'SLA-03', title: 'Intelligence sovereignty', body: 'A person should direct their intelligence layer, inspect its memory, move their context, change providers, and leave without losing part of themselves.', test: 'Can context be corrected, deleted, exported, and used elsewhere?' },
  { id: 'SLA-04', title: 'Capability compounding', body: 'A good system leaves the person more able to think, decide, make, and protect—not merely more dependent on the next answer.', test: 'What durable capability remains when the system is removed?' },
  { id: 'SLA-05', title: 'Plural intelligence', body: 'No single lab, model, state, or philosophy can represent the full plurality of human values. Healthy ecosystems preserve meaningful choice.', test: 'Can multiple models, people, and institutions participate without one cognitive center?' },
  { id: 'SLA-06', title: 'Protection by design', body: 'Privacy, security, contestability, and recovery belong in the architecture. They are not settings added after trust has already been requested.', test: 'What happens when the system is wrong, compromised, or used against the person?' },
  { id: 'SLA-07', title: 'Creative and economic agency', body: 'People should retain provenance, ownership, audience relationships, reusable workflows, and a legible share of the value they create.', test: 'Who owns the catalog, the workflow, and the upside?' },
  { id: 'SLA-08', title: 'Intergenerational dignity', body: 'Systems that grow beside children carry a higher duty: minimal profiling, age-appropriate explanation, protection from attachment mechanics, and a path toward independence.', test: 'Does the system protect a young person’s right to grow and change?' },
  { id: 'SLA-09', title: 'Stewardship of life', body: 'Intelligence should strengthen the conditions for human and ecological flourishing. Capability without care is not progress.', test: 'Does the full system leave communities and living systems better able to endure?' },
]

const ventures = [
  { name: 'FrankX', domain: 'frankx.ai', title: 'The human point of responsibility', body: 'Essays, architectures, experiments, and public decisions under a named voice.', href: 'https://frankx.ai/the-future-we-choose' },
  { name: 'GenCreator', domain: 'gencreator.ai', title: 'Creative and economic agency', body: 'Creator systems that turn intention into inspectable, ownable work.', href: 'https://gencreator.ai/creator-sovereignty' },
  { name: 'Arcanea', domain: 'arcanea.ai', title: 'Imagination and cultural possibility', body: 'Worlds, stories, and creative protocols for futures worth choosing.', href: 'https://arcanea.ai/imagination-charter' },
]

const labs = [
  { name: 'Meta', emphasis: 'Personal superintelligence, open ecosystems, and global distribution', contribution: 'Make advanced intelligence personal and broadly available.' },
  { name: 'OpenAI', emphasis: 'Broad benefit, democratized capability, and human control', contribution: 'Build frontier systems and work to distribute their benefits.' },
  { name: 'Anthropic', emphasis: 'Capability thresholds and safeguards for catastrophic risk', contribution: 'Make rapid capability growth legible and governable.' },
  { name: 'Google DeepMind', emphasis: 'Responsible intelligence and scientific discovery', contribution: 'Apply frontier research to knowledge, science, and public benefit.' },
  { name: 'Starlight', emphasis: 'Human capability, portable context, plural intelligence, and culture', contribution: 'Build the constitutional and developmental layer across providers.' },
]

const buildLayers = [
  ['Academy', 'Learning systems for judgment, orchestration, architecture, and responsible practice.', 'In development'],
  ['Starlight Passport', 'Portable evidence of skills, work, agents, and trusted contribution.', 'In development'],
  ['Memory + protocols', 'User-directed context and interoperable intelligence interfaces.', 'Research'],
  ['AI Architect Mastery', 'Architecture and governance for people building intelligent systems.', 'Available'],
  ['Starlight Council', 'A high-trust table for builders shaping the intelligence age.', 'Horizon'],
  ['Constitutional research', 'Public frameworks for capability, sovereignty, safety, and shared intelligence.', 'Available'],
]

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Starlight Intelligence home"><span aria-hidden="true">S</span> Starlight Intelligence</a>
        <nav aria-label="Primary navigation">
          <a href="/constitution">Constitution</a>
          <a href="/perspectives/personal-superintelligence-for-everyone">Perspective</a>
          <a className="nav-action" href="#build">What we build</a>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <a className="wordmark" href="/"><span aria-hidden="true">S</span> Starlight Intelligence</a>
        <p>Intelligence in service of life.</p>
        <div><a href="https://frankx.ai">FrankX</a><a href="https://gencreator.ai">GenCreator</a><a href="https://arcanea.ai">Arcanea</a></div>
      </footer>
    </div>
  )
}

function Prism({ label = 'Constitutional signal' }: { label?: string }) {
  return (
    <div className="prism" aria-label={label} role="img">
      <span className="prism-input" />
      <span className="prism-core">S</span>
      <span className="prism-output prism-output-one" />
      <span className="prism-output prism-output-two" />
      <span className="prism-output prism-output-three" />
      <span className="prism-caption">ONE CONSTITUTION / MANY EXPRESSIONS</span>
    </div>
  )
}

function HomePage() {
  return (
    <Shell>
      <main id="content">
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">A mission house for the intelligence age</p>
            <h1>Intelligence<br/><em>in service of life.</em></h1>
            <p className="lede">We build the constitutional, educational, and creative systems that help people direct advanced intelligence without surrendering authorship.</p>
            <div className="actions"><a className="button primary" href="/constitution">Read the Accord</a><a className="text-link" href="#portfolio">Explore the mission house <span>↘</span></a></div>
          </div>
          <Prism />
        </section>

        <section className="statement-band">
          <p>The defining question is not whether machines become more capable.</p>
          <h2>It is whether people become more capable with them.</h2>
        </section>

        <section className="split-section" id="portfolio">
          <div className="section-intro"><p className="eyebrow">The portfolio</p><h2>One constitution.<br/>Three operating ventures.<br/>One accountable voice.</h2></div>
          <div className="venture-list">
            {ventures.map((venture, index) => (
              <a href={venture.href} className="venture-row" key={venture.name}>
                <span className="row-number">0{index + 1}</span><span><strong>{venture.name}</strong><small>{venture.domain}</small></span><span><b>{venture.title}</b>{venture.body}</span><span aria-hidden="true">↗</span>
              </a>
            ))}
            <a href="https://frankx.ai/the-future-we-choose" className="venture-row founder-row"><span className="row-number">04</span><span><strong>FrankX</strong><small>Founder signal</small></span><span><b>Named responsibility</b>A public voice that can take positions, show its work, and revise in the open.</span><span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="dark-section" id="build">
          <div className="section-intro"><p className="eyebrow">The work</p><h2>From principle<br/>to proof.</h2><p>A constitution matters when it changes what gets built, measured, and refused. Every initiative carries a status and an evidence obligation.</p></div>
          <div className="build-grid">
            {buildLayers.map(([name, body, status]) => <article key={name}><span>{status}</span><h3>{name}</h3><p>{body}</p></article>)}
          </div>
        </section>

        <section className="closing-callout">
          <p className="eyebrow">The invitation</p>
          <h2>Superintelligence may become abundant.<br/><em>Human direction will remain scarce.</em></h2>
          <p>We are building for the people, creators, families, educators, and institutions who intend to direct it well.</p>
          <a className="button primary" href="/constitution">Enter the constitution</a>
        </section>
      </main>
    </Shell>
  )
}

function ConstitutionPage() {
  return (
    <Shell>
      <main id="content" className="article-page">
        <header className="article-hero">
          <div><p className="eyebrow">The Starlight Accord · Version 1.0</p><h1>Intelligence<br/><em>in Service of Life</em></h1><p className="lede">A public constraint on what we are willing to build—and an invitation to test whether the work honors it.</p><div className="article-meta"><span>Published 12 August 2026</span><span>9 principles</span><span>Open for examination</span></div></div>
          <Prism label="One constitution refracted into nine principles" />
        </header>

        <section className="article-prose first-prose">
          <aside><p>THE SHORT ANSWER</p></aside>
          <div><p className="standfirst">Starlight Intelligence exists to turn advanced AI from concentrated technical capacity into distributed human capability.</p><p>We build the knowledge, systems, standards, education, and communities that help people direct intelligence without surrendering authorship, privacy, dignity, or responsibility.</p></div>
        </section>

        <section className="article-prose">
          <aside><p>THE PREMISE</p></aside>
          <div>
            <h2>Access is the beginning.<br/>Sovereignty is the standard.</h2>
            <p>The defining question of the intelligence age is not whether machines become more capable. They will. The defining question is whether people become more capable with them.</p>
            <p>A person does not become sovereign because an assistant can answer any question. Sovereignty requires the ability to choose the system, direct its purpose, protect and move personal context, understand consequential outputs, contest decisions, create original value, and leave without losing part of oneself.</p>
            <blockquote>After using a Starlight system, a person should be better able to think, decide, create, protect, and contribute.</blockquote>
            <p>We believe advanced intelligence should widen human possibility. It should give a child a patient teacher without replacing curiosity. It should give a creator a studio without dissolving authorship. It should give a founder a capable team without requiring institutional permission. It should give every person better protection against systems whose power would otherwise remain concentrated.</p>
            <p>We reject passive dependency and centralized benevolence as sufficient visions of the future. A healthy intelligence ecosystem needs many models, many builders, verifiable safeguards, portable context, accountable institutions, and people with the capacity to choose among them.</p>
          </div>
        </section>

        <section className="principles-section">
          <header><p className="eyebrow">The nine commitments</p><h2>A constitution written<br/>as product tests.</h2><p>Each principle carries a question that a team can answer with evidence.</p></header>
          <div className="principles-list">
            {principles.map((principle) => <article id={principle.id.toLowerCase()} key={principle.id}><span>{principle.id}</span><h3>{principle.title}</h3><p>{principle.body}</p><div><small>PRODUCT TEST</small>{principle.test}</div></article>)}
          </div>
        </section>

        <section className="article-prose">
          <aside><p>THE EVIDENCE RULE</p></aside>
          <div><h2>Promises need states.</h2><p>Every public initiative should be labeled <strong>available</strong>, <strong>in development</strong>, <strong>research</strong>, or <strong>horizon</strong>. Each product should name the principles it advances and show how a person can verify the claim.</p><p>For memory, that means export, correction, deletion, permission boundaries, and portability. For creator systems, it means provenance, approval gates, workflow ownership, and an audience relationship the creator can carry. For learning, it means acquired skill and independent performance—not completion theater.</p></div>
        </section>

        <section className="closing-callout constitution-close"><p className="eyebrow">A living accord</p><h2>Intelligence is becoming abundant.<br/><em>Direction, judgment, courage, imagination, and care are not.</em></h2><p>This is not a claim that every tension is solved. It is a public standard against which the work can be judged.</p><a className="button primary" href="/perspectives/personal-superintelligence-for-everyone">Read the cross-lab perspective</a></section>
      </main>
    </Shell>
  )
}

function PerspectivePage() {
  return (
    <Shell>
      <main id="content" className="article-page">
        <header className="perspective-hero">
          <p className="eyebrow">Starlight perspective · 12 August 2026</p>
          <h1>Personal superintelligence<br/><em>for everyone.</em></h1>
          <p className="lede">The frontier labs are building more intelligence. The next institution must build humanity’s capacity to use it well.</p>
        </header>

        <section className="article-prose first-prose"><aside><p>THE MOMENT</p></aside><div><p className="standfirst">Meta’s “The Future is for Everyone” is important because it connects a philosophy of individual empowerment to an actual portfolio.</p><p>Personal agents, private communication, creation and distribution, glasses, open models, affordable compute, infrastructure, and governance are presented as one delivery system for intelligence at planetary scale. That coherence raises the bar for every AI organization: the mission has to shape the products.</p><p>We agree with the direction. Advanced intelligence should favor invention over narrow automation, reach people beyond a technical elite, and create a balance of power that does not leave citizens structurally weaker than institutions.</p></div></section>

        <section className="lab-section"><header><p className="eyebrow">A plural ecosystem</p><h2>Different layers.<br/>Shared responsibility.</h2></header><div>{labs.map((lab, index) => <article key={lab.name}><span>0{index + 1}</span><h3>{lab.name}</h3><p>{lab.emphasis}</p><small>{lab.contribution}</small></article>)}</div></section>

        <section className="article-prose"><aside><p>THE EXTENSION</p></aside><div><h2>Access does not yet equal sovereignty.</h2><p>A free assistant can widen access. A sovereign intelligence layer goes further: people can inspect what it remembers, correct and delete memory, export their context, change providers, understand consequential actions, and recover after failure.</p><p>The most useful privacy mode cannot be the least capable one. Portability cannot stop at downloading a transcript. A constitution becomes real when it constrains the builder at the moment constraint becomes expensive.</p><blockquote>The future becomes everyone’s through authorship—not access alone.</blockquote><p>People need the capacity to formulate better questions, choose meaningful goals, create original work, protect their context, coordinate intelligence, build institutions, and remain responsible for consequences. That is the layer Starlight exists to build across providers.</p></div></section>

        <section className="article-prose"><aside><p>WHAT COMES NEXT</p></aside><div><h2>Build the missing institution.</h2><p>Between a frontier model and a flourishing person sits identity, memory, judgment, orchestration, protection, creation, ownership, culture, and community. No general-purpose assistant can decide those questions for everyone.</p><ul><li>Personal intelligence with portable, inspectable, user-directed memory.</li><li>A capability floor for education, protection, creation, and participation.</li><li>Multiple models and providers connected through open protocols.</li><li>Metrics for acquired human capability, not only labor removed.</li><li>Higher constitutional protections for children and asymmetric influence.</li><li>Public evidence for community and ecological impact.</li></ul><p>Meta, OpenAI, Anthropic, Google DeepMind, open-source communities, universities, public institutions, and smaller builders all have different work to do. The objective is not one benevolent cognitive center. It is an ecosystem in which people and communities retain meaningful direction.</p></div></section>

        <section className="sources"><p className="eyebrow">Primary sources</p><a href="https://www.meta.com/thefutureisforeveryone/">Meta · The Future is for Everyone ↗</a><a href="https://openai.com/index/built-to-benefit-everyone-our-plan/">OpenAI · Built to benefit everyone ↗</a><a href="https://www.anthropic.com/responsible-scaling-policy">Anthropic · Responsible Scaling Policy ↗</a><a href="https://deepmind.google/about/">Google DeepMind · About ↗</a></section>
      </main>
    </Shell>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  useEffect(() => {
    if (path === '/thefutureisforeveryone') window.location.replace('/constitution')
  }, [path])
  if (path === '/constitution') return <ConstitutionPage />
  if (path === '/perspectives/personal-superintelligence-for-everyone') return <PerspectivePage />
  return <HomePage />
}

export default App
