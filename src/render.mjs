import { services, projects } from './content.mjs';
import { renderConceptLab } from './concepts.mjs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const stylesheetVersion = createHash('sha256').update(readFileSync('public/styles.css')).digest('hex').slice(0, 12);
const scriptVersion = createHash('sha256').update(readFileSync('public/site.js')).digest('hex').slice(0, 12);
const looksVersion = createHash('sha256').update(readFileSync('public/looks.css')).digest('hex').slice(0, 12);

// Selectable site looks. Each page load shuffles to a random look, never the same one twice in a row.
export const looks = [
  { id: 'terminal', name: 'Terminal', note: 'Retro computer', theme: '#050905' },
  { id: 'blueprint', name: 'Blueprint', note: 'Clean and precise', theme: '#f5f7fa' },
  { id: 'longread', name: 'Long Read', note: 'Editorial', theme: '#f6f6f2' },
  { id: 'poster', name: 'Poster', note: 'Bold and loud', theme: '#ffd43a' }
];
const lookBoot = `(function(d){d.classList.add('js');var t=${JSON.stringify(Object.fromEntries(looks.map(look => [look.id, look.theme])))},ids=${JSON.stringify(looks.map(look => look.id))},last=null;try{last=localStorage.getItem('jx-look-last');localStorage.removeItem('jx-look')}catch(e){}var pool=ids.filter(function(id){return id!==last}),l=pool[Math.floor(Math.random()*pool.length)]||'terminal';try{localStorage.setItem('jx-look-last',l)}catch(e){}d.setAttribute('data-look',l);if(l!=='terminal')d.classList.add('look-alt');var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t[l])})(document.documentElement)`;
const lookSwitch = () => `<div class="look-switch" id="look-switch"><button class="look-button" id="look-button" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="look-menu"><span class="look-label">Try another look</span><span class="look-current" id="look-current">Terminal</span><span class="look-caret" aria-hidden="true"></span></button><div class="look-menu" id="look-menu" role="menu" aria-labelledby="look-button" hidden>${looks.map(look => `<button type="button" role="menuitemradio" aria-checked="${look.id === 'terminal'}" tabindex="-1" data-look-option="${look.id}" data-theme-color="${look.theme}"><i class="look-swatch look-swatch-${look.id}" aria-hidden="true"></i><span>${escape(look.name)}</span><small>${escape(look.note)}</small></button>`).join('')}</div><span class="visually-hidden" id="look-status" role="status"></span></div>`;

export const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const cta = (label = 'Start a project', extraClass = '') => `<a class="terminal-button${extraClass ? ` ${extraClass}` : ''}" href="#booking">${label}</a>`;
const contact = (label = 'Email JX Labs') => `<a class="email-link text-link" href="#email-fallback">${label}</a>`;
const field = (id, label, options = {}) => `<div class="field ${options.wide ? 'wide' : ''}"><label for="${id}">${label}${options.required ? ' <span aria-hidden="true">*</span>' : ' <span class="optional">Optional</span>'}</label>${options.textarea ? `<textarea id="${id}" name="${id}" rows="5" maxlength="4000"` : `<input id="${id}" name="${id}" type="${options.type || 'text'}" maxlength="${options.max || 200}" ${options.autocomplete ? `autocomplete="${options.autocomplete}"` : ''}`} ${options.required ? 'required' : ''} aria-describedby="${id}-error" ${options.type === 'tel' ? 'inputmode="tel"' : ''}>${options.textarea ? '</textarea>' : ''}<span class="field-error" id="${id}-error"></span></div>`;
const select = (id, label, choices, required = false) => `<div class="field"><label for="${id}">${label}${required ? ' <span aria-hidden="true">*</span>' : ' <span class="optional">Optional</span>'}</label><select id="${id}" name="${id}" ${required ? 'required' : ''} aria-describedby="${id}-error"><option value="">${required ? 'Pick what feels closest' : 'Choose if you like'}</option>${choices.map(choice => `<option>${escape(choice)}</option>`).join('')}</select><span class="field-error" id="${id}-error"></span></div>`;

export function renderPage({ settings, site, base = '/' }) {
  const asset = path => `${base}${path}`;
  const canonical = `${site}${base.startsWith('/') ? base : '/'}`;
  const ready = Boolean(settings.endpoint && settings.bookingEnabled);
  const config = JSON.stringify({ endpoint: settings.endpoint, bookingEnabled: settings.bookingEnabled, analyticsToken: settings.analyticsToken }).replace(/</g, '\\u003c');
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'LocalBusiness', '@id': `${canonical}#business`, name: settings.brand, url: canonical, areaServed: ['Dallas', 'Carrollton', 'Dallas–Fort Worth'], description: 'Websites and booking systems for small businesses and creatives in DFW and remotely.' },
    ...services.map(([name]) => ({ '@type': 'Service', name, provider: { '@id': `${canonical}#business` }, areaServed: 'Dallas–Fort Worth' }))
  ] };
  const estimateOptions = [
    { id: 'one-page', group: 'foundation', name: services[0][0], description: services[0][1], oneTime: settings.pricesApproved ? settings.prices.onePage : 0 },
    { id: 'multi-page', group: 'foundation', name: services[1][0], description: services[1][1], oneTime: settings.pricesApproved ? settings.prices.multiPage : 0 },
    { id: 'redesign', group: 'foundation', name: services[3][0], description: services[3][1], custom: true },
    { id: 'booking-addon', group: 'addon', name: services[2][0], description: services[2][1], oneTime: settings.pricesApproved ? settings.prices.booking : 0 },
    { id: 'maintenance', group: 'addon', name: services[4][0], description: services[4][1], monthly: settings.pricesApproved ? settings.prices.maintenance : 0 },
    { id: 'domain-hosting', group: 'addon', name: services[5][0], description: services[5][1], custom: true },
    { id: 'ai-automation', group: 'addon', name: services[6][0], description: services[6][1], custom: true },
    { id: 'google-profile', group: 'addon', name: services[7][0], description: services[7][1], custom: true }
  ];
  const estimateOption = option => `<div class="estimate-option"><input id="estimate-${option.id}" type="${option.group === 'foundation' ? 'radio' : 'checkbox'}" name="${option.group === 'foundation' ? 'site-foundation' : `addon-${option.id}`}" value="${escape(option.name)}" data-estimate-option data-label="${escape(option.name)}"${option.oneTime ? ` data-one-time="${option.oneTime}"` : ''}${option.monthly ? ` data-monthly="${option.monthly}"` : ''}${option.custom ? ' data-custom="true"' : ''}><label for="estimate-${option.id}"><span>${escape(option.name)}</span><small>${escape(option.description)}</small></label></div>`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>JX Labs — Websites &amp; booking systems</title><meta name="description" content="JX Labs builds websites and booking systems for small businesses, barbers, DJs, and artists in Dallas, Carrollton, and across DFW. Start a project.">
  ${!settings.launchReady ? '<meta name="robots" content="noindex, nofollow">' : ''}<link rel="canonical" href="${escape(canonical)}"><meta name="theme-color" content="#050905">
  <meta property="og:type" content="website"><meta property="og:title" content="JX Labs — Websites that pull their weight."><meta property="og:description" content="Websites and booking systems, built by JX Labs."><meta property="og:url" content="${escape(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="JX Labs — Websites that pull their weight"><meta name="twitter:description" content="Websites and booking systems for businesses and creatives.">
  <link rel="icon" type="image/svg+xml" href="${asset('favicon.svg')}"><link rel="preload" href="${asset('assets/fonts/space-grotesk-latin.woff2')}" as="font" type="font/woff2" crossorigin><link rel="preload" href="${asset('assets/fonts/manrope-latin.woff2')}" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${asset(`styles.css?v=${stylesheetVersion}`)}"><link rel="stylesheet" href="${asset(`looks.css?v=${looksVersion}`)}"><script>${lookBoot}</script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head>
  <body class="terminal-locked">
    <div class="login-screen" id="login-screen" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div class="login-housing">
        <p class="hardware-stamp">JX–77 / CIVIC INFORMATION SYSTEM</p>
        <div class="login-glass crt">
          <div class="login-status"><span class="terminal-only">JX LABS NETWORK ACCESS</span><span class="terminal-only">NODE: DFW–TX</span><span data-look-only="blueprint">JX LABS · DRAWING SET 2026</span><span data-look-only="blueprint">SHEET A-01 OF 07</span><span data-look-only="longread">Vol. 1 · Dallas–Fort Worth Edition</span><span data-look-only="longread" data-today="long"></span><span data-look-only="poster">JX LABS PRESENTS</span><span data-look-only="poster">DALLAS–FORT WORTH &amp; EVERYWHERE ELSE</span></div>
          <div class="login-masthead" data-look-only="longread" aria-hidden="true"><strong>The JX Labs Journal</strong><span>Websites · Booking systems · Practical automation</span></div>
          <span class="login-sticker" data-look-only="poster" aria-hidden="true">Doors<br>open</span>
          <div class="login-copy">
            <p class="login-command">C:\\JX_LABS\\PUBLIC&gt; authenticate visitor</p>
            <span class="login-dimension" data-look-only="blueprint" aria-hidden="true"><i></i><b>A-01 / WELCOME / SCALE 1:1</b><i></i></span>
            <p class="login-kicker" data-look-only="longread">Today’s edition</p>
            <p class="login-kicker" data-look-only="poster">One night only. Every night.</p>
            <h1 id="login-title">Welcome.</h1>
            <p>Click login to access.</p>
            <p class="login-sub" data-look-only="blueprint">Your site plan is drawn up and ready for review. Log in to walk through the full set.</p>
            <p class="login-sub" data-look-only="longread">Inside: websites that pull their weight, the businesses we build for, and how to start a project of your own.</p>
            <p class="login-sub" data-look-only="poster">Websites, booking systems &amp; AI tools. Live in DFW and wherever you are.</p>
            <div class="login-actions"><button class="terminal-button login-button" id="terminal-login" type="button" autofocus>Login</button><span class="login-stub" data-look-only="poster" aria-hidden="true"><b>Admit one</b><small>All ages · Free entry</small></span></div>
            <p class="login-hint">PUBLIC ACCESS / PROJECT RECORDS / SERVICE REQUESTS</p>
            <dl class="login-titleblock" data-look-only="blueprint"><div><dt>Project</dt><dd>JX Labs website</dd></div><div><dt>Drawn by</dt><dd>JX Labs</dd></div><div><dt>Date</dt><dd data-today="short">2026</dd></div><div><dt>Status</dt><dd>Open for review</dd></div></dl>
            <div class="login-contents" data-look-only="longread"><p>In this issue</p><ol><li><span>Our Portfolio</span><b>2</b></li><li><span>Concept Lab</span><b>3</b></li><li><span>Services &amp; Estimate</span><b>4</b></li><li><span>How It Works</span><b>5</b></li><li><span>About JX Labs</span><b>6</b></li><li><span>Start a Project</span><b>7</b></li></ol></div>
            <p class="login-lineup" data-look-only="poster" aria-label="Featuring our services">${services.map(([name], index) => `<span class="lineup-${index < 3 ? 'top' : 'rest'}">${escape(name)}</span>`).join('<i aria-hidden="true">★</i>')}</p>
          </div>
          <div class="login-marquee" data-look-only="poster" aria-hidden="true"><div>${Array.from({ length: 8 }, () => '<span>Welcome</span><i>★</i><span>Come on in</span><i>★</i>').join('')}</div></div>
        </div>
        <div class="hardware-lights" aria-hidden="true"><span>POWER</span><i></i><span>DATA</span><i></i><b>PROPERTY OF JX LABS</b></div>
      </div>
    </div>

    <div class="terminal-app" id="terminal-app">
      <a class="skip-link" href="#main">Skip to terminal content</a>
      <div class="machine-shell">
        <p class="machine-stamp" data-boot>JX–77 / CIVIC INFORMATION SYSTEM</p>
        <div class="screen crt">
          <header class="system-bar" data-boot>
            <a class="wordmark" href="#home" aria-label="JX Labs home">JX Labs</a>
            <span class="system-title">JX LABS PUBLIC SERVICE TERMINAL</span>
            <span class="status"><i></i> AVAILABLE FOR NEW WORK</span>
            <button class="sound-toggle" id="sound-toggle" type="button" aria-pressed="true">SOUND: ON</button>
            <span class="clock" id="terminal-clock" aria-hidden="true">00:00:00</span>
            <div class="look-marquee" aria-hidden="true"><div>${[0, 1].map(() => services.map(([name]) => `<span>${escape(name)}</span><i>★</i>`).join('')).join('')}</div></div>
          </header>
          <div class="console-grid">
            <nav class="directory" aria-label="Main navigation" data-boot>
              <p>DIRECTORY</p>
              <a class="active" href="#home">HOME</a>
              <a href="#work">OUR PORTFOLIO</a>
              <a href="#concepts">CONCEPT LAB</a>
              <a href="#services">SERVICES &amp; ESTIMATE</a>
              <a href="#process">HOW IT WORKS</a>
              <a href="#about">ABOUT JX LABS</a>
              <a class="contract-link float-signal" href="#booking">START A PROJECT</a>
              ${lookSwitch()}
              <div class="machine-readout">
                <span>RESPONSE TIME</span><strong>&lt; 24 HOURS</strong>
                <span>SYSTEM STATE</span><strong>${ready ? 'ONLINE' : 'PREVIEW'}</strong>
              </div>
            </nav>

            <main id="main" class="console-content" tabindex="-1">
              <section id="home" class="hero terminal-view active" aria-labelledby="hero-title">
                <p class="boot-line" data-boot><span class="terminal-only">COMPANY TERMINAL ONLINE // TEAM: JX LABS</span><span class="look-only">WEBSITES / AI / AUTOMATION</span></p>
                <span class="look-sticker" aria-hidden="true"><span>DFW<br>&amp; beyond</span></span>
                <h1 id="hero-title" data-boot>Websites that pull their weight.</h1>
                <p class="hero-copy" data-boot>We build sites, booking systems, and practical automations for small businesses and creatives in DFW and beyond.</p>
                <div class="prompt-line" aria-hidden="true" data-boot><span>&gt;</span><span>run start_project.exe</span><b></b></div>
                <div data-boot>${cta('Open project request', 'float-signal')}</div>
                <div class="hero-readout" data-boot><span>DALLAS–FORT WORTH, TEXAS</span><a href="#work">View our portfolio ↓</a></div>
              </section>

              <section id="work" class="terminal-section terminal-view" aria-labelledby="work-title">
                <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>open portfolio.dir</span></div>
                <header class="section-head" data-boot><div><p>OUR PORTFOLIO</p><h2 id="work-title">Websites and systems built around real problems.</h2></div><p>Client work, active builds, and useful experiments—each with the problem, approach, and current status made clear.</p></header>
                <div class="projects">
                  ${projects.map((project, index) => `<details class="project" data-boot><summary><span class="record-number">${String(index + 1).padStart(2, '0')}</span><div><span class="project-category">${escape(project.category)}</span><h3>${escape(project.name)}</h3><p>${escape(project.line)}</p></div><span class="badge ${project.status === 'LIVE' ? 'live' : ''}">${escape(project.status)}</span><span class="expand-icon" aria-hidden="true">+</span></summary><div class="case-content"><div class="case-columns"><div><h4>THE PROBLEM</h4><p>${escape(project.problem)}</p></div><div><h4>WHAT WE BUILT</h4><p>${escape(project.built)}</p></div></div>${project.stack.length ? `<h4>TOOLS</h4><div class="chips">${project.stack.map(tool => `<span>${escape(tool)}</span>`).join('')}</div>` : ''}${project.screenshot ? `<img src="${asset(project.screenshot)}" alt="${escape(project.name)} website screenshot" width="1600" height="1000" loading="lazy" decoding="async">` : ''}${project.url ? `<a class="text-link" href="${escape(project.url)}" target="_blank" rel="noopener noreferrer">Visit live site ↗</a>` : ''}</div></details>`).join('')}
                </div>
                <aside class="concept-invite" data-boot><div><span>NEW / INTERACTIVE CONCEPTS</span><h3>Six industries. Six working systems.</h3><p>Step inside fictional businesses spanning hospitality, retail, field service, healthcare, and logistics.</p></div><a class="terminal-button" href="#concepts">Enter concept lab</a></aside>
              </section>

              ${renderConceptLab(asset)}

              <section id="services" class="terminal-section terminal-view" aria-labelledby="services-title">
                <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>run project_estimator.exe</span></div>
                <header class="section-head" data-boot><div><p>SERVICES &amp; ESTIMATE</p><h2 id="services-title">Choose what your project needs.</h2></div><p>Build a starting estimate in a few clicks. We’ll confirm the final scope, price, and schedule with you before any work begins.</p></header>
                <div class="estimator" data-boot>
                  <div class="estimate-builder">
                    <fieldset class="estimate-group"><legend>01 / CHOOSE A SITE FOUNDATION</legend><p>Select the closest starting point.</p><div class="estimate-options">${estimateOptions.filter(option => option.group === 'foundation').map(estimateOption).join('')}</div></fieldset>
                    <fieldset class="estimate-group"><legend>02 / ADD WHAT YOU NEED</legend><p>Select any extras that fit the project.</p><div class="estimate-options">${estimateOptions.filter(option => option.group === 'addon').map(estimateOption).join('')}</div></fieldset>
                  </div>
                  <aside class="estimate-output" id="estimate-output" data-deposit="${settings.pricesApproved ? settings.prices.deposit : 0}" aria-live="polite" aria-describedby="estimate-disclaimer">
                    <p class="estimate-status" id="estimate-status">AWAITING PROJECT INPUT</p>
                    <div><span>STARTING ESTIMATE</span><strong id="estimate-total">Choose a site type</strong></div>
                    <p class="estimate-deposit" id="estimate-deposit">Your estimated deposit will appear here.</p>
                    <p class="estimate-custom" id="estimate-custom" hidden>Some selections need a custom scope.</p>
                    <p class="estimate-disclaimer" id="estimate-disclaimer">This is a planning estimate, not a final quote. Your proposal will confirm the exact scope and price.</p>
                    <button class="terminal-button" id="estimate-start" type="button" disabled>Start a project</button>
                  </aside>
                </div>
              </section>

              <section id="process" class="terminal-section terminal-view" aria-labelledby="process-title">
                <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>run build_process.exe</span></div>
                <header class="section-head" data-boot><div><p>HOW IT WORKS</p><h2 id="process-title">One team. Four clear steps.</h2></div><p>You work directly with our team from the first message through launch.</p></header>
                <ol class="steps">
                  <li data-boot><span>01 / PROJECT REQUEST</span><h3>Share the goal.</h3><p>Tell us about your business, audience, and what is not working. A rough idea is enough.</p><b>REQUEST RECEIVED</b></li>
                  <li data-boot><span>02 / SCOPE &amp; PROPOSAL</span><h3>Get a clear plan.</h3><p>We ask follow-up questions and send the recommended scope, price, and schedule.</p><b>FIRST RESPONSE &lt; 24 HOURS</b></li>
                  <li data-boot><span>03 / BUILD &amp; REVIEW</span><h3>See the work take shape.</h3><p>After approval and the 50% deposit, we design, build, test, and send a review link.</p><b>SCHEDULE SET IN PROPOSAL</b></li>
                  <li data-boot><span>04 / LAUNCH &amp; SUPPORT</span><h3>Approve and go live.</h3><p>We finish the agreed revisions, publish the site, and explain what happens next.</p><b>FINAL APPROVAL → LAUNCH</b></li>
                </ol>
              </section>

              <section id="about" class="terminal-section terminal-view about" aria-labelledby="about-title">
                <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>read company_profile.txt</span></div>
                <div class="about-grid">
                  <div data-boot><p>ABOUT JX LABS</p><h2 id="about-title">JX Labs</h2><span class="operator-status">WEBSITES / AI / AUTOMATION</span><p class="about-reach">Anyone. Anywhere. Anyplace.</p><p class="about-flexibility">From a simple website to a custom automation, we adapt to your business, your budget, and the way you work—wherever you’re based.</p></div>
                  <div class="about-copy">
                    <p class="lead" data-boot>Creative technology. Within reach.</p>
                    <p data-boot><span class="about-initials">JX</span> Labs helps businesses look professional online and simplify the work behind the scenes. We bring together creative design, websites, and practical AI tools at affordable prices, with a special focus on local and small businesses. Wherever you are, we’re ready to help.</p>
                    <section class="about-block" aria-labelledby="about-mission" data-boot>
                      <h3 id="about-mission">Our mission</h3>
                      <p>Make modern technology accessible to businesses that want to grow. We help you put AI and the latest digital tools to work in ways that fit your goals, your day-to-day needs, and your budget.</p>
                    </section>
                    <section class="about-block" aria-labelledby="about-services" data-boot>
                      <h3 id="about-services">What we provide</h3>
                      <p>From your first website to tools that handle repetitive tasks, we build around what your business needs.</p>
                      <ul class="about-services">${services.map(([name]) => `<li>${escape(name)}</li>`).join('')}</ul>
                      <a class="text-link" href="#services">Explore services &amp; build an estimate →</a>
                    </section>
                    <section class="about-block" aria-labelledby="about-approach" data-boot>
                      <h3 id="about-approach">Creativity drives the work</h3>
                      <p>We believe better ideas lead to better results with AI. We experiment, ask thoughtful questions, and refine the details to give your business a look and experience of its own. When we use AI, we shape and review the output so the finished work feels natural, polished, and true to your brand.</p>
                    </section>
                    <section class="about-block" aria-labelledby="about-values" data-boot>
                      <h3 id="about-values">What you can expect</h3>
                      <dl class="about-values">
                        <div><dt>Affordability</dt><dd>Clear scope and options that respect your budget.</dd></div>
                        <div><dt>Creative design</dt><dd>A distinct identity shaped around your business.</dd></div>
                        <div><dt>Practical problem-solving</dt><dd>Useful solutions to the challenges you face every day.</dd></div>
                        <div><dt>Great service</dt><dd>Careful listening, clear communication, and support along the way.</dd></div>
                      </dl>
                    </section>
                    <div class="about-cta" data-boot>${cta('Let’s talk about your business')}</div>
                  </div>
                </div>
              </section>

              <section id="booking" class="terminal-section terminal-view booking-section" aria-labelledby="booking-title">
                <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>run new_contract.exe</span></div>
                <div class="booking-layout">
                  <div class="booking-intro" data-boot><p>START A PROJECT / INTAKE</p><h2 id="booking-title">What should we put online?</h2><p>Tell us about your business and what you need. You don’t need to know the technical terms.</p><p>We’ll reply within 24 hours with a few times to talk and a rough quote.</p>${contact('Rather send an email?')}<p class="email-fallback" id="email-fallback">Email: calipxj <span aria-label="at">[at]</span> gmail <span aria-label="dot">[dot]</span> com</p></div>
                  <div class="form-container" data-boot>${!ready ? '<div class="setup-notice" role="note">PREVIEW MODE // Requests are not connected yet. You can test the fields or email us.</div>' : ''}<form id="booking-form" novalidate><p class="form-key">FIELDS MARKED * ARE REQUIRED.</p><div class="form-grid">${field('name', 'Your name', { required: true, autocomplete: 'name' })}${field('email', 'Email', { required: true, type: 'email', autocomplete: 'email' })}${field('phone', 'Phone', { required: true, type: 'tel', autocomplete: 'tel', max: 30 })}${field('business', 'Business name', { required: true, autocomplete: 'organization' })}${field('type', 'Type of business')}${select('hasSite', 'Do you have a site now?', ['Yes', 'No', 'Sort of'])}${field('needs', 'What do you need?', { required: true, textarea: true, wide: true })}${select('budget', 'What budget feels comfortable?', ['Something simple — $100–$500', '$500–$1,000', '$1,000–$2,500', '$2,500+', 'Not sure yet — tell me what it should cost'], true)}${select('timeline', 'When are you thinking?', ['ASAP', 'Few weeks', 'Few months', 'Just exploring'])}${field('socials', 'Your Instagram / socials')}${field('source', 'How’d you find us?')}</div><div class="honeypot" aria-hidden="true" inert><label for="website">Leave this empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div><p class="small">Have photos or files? Email them after you submit.</p><p class="small">Your details are used only to respond to this request. Don’t include sensitive information.</p><div id="form-error" class="form-message" role="alert" hidden></div><button class="terminal-button submit" type="submit">Send project request</button><p class="small">A request starts a conversation. It doesn’t commit you to a project.</p><noscript><p>Please enable JavaScript to use the request form, or email us.</p></noscript></form><section id="form-success" class="form-success" hidden tabindex="-1" aria-labelledby="success-title"><span>NEXT STEP: CHECK YOUR INBOX</span><h3 id="success-title">Your request is on its way.</h3><p>Look for a confirmation email. Once it arrives, we have your request and will reply within 24 hours.</p>${contact('Email JX Labs')}<button class="text-button" id="send-another" type="button">Send another request</button></section></div>
                </div>
              </section>

              <footer class="footer" data-boot><a class="wordmark" href="#home">JX Labs</a><p>BUILT BY JX LABS</p><div>${contact()}<a href="#home">Back to top ↑</a></div></footer>
            </main>
          </div>
        </div>
        <div class="hardware-row" aria-hidden="true" data-boot><span>POWER</span><i></i><span>DATA</span><i></i><b>PROPERTY OF JX LABS</b></div>
      </div>
    </div>
    <script type="application/json" id="site-config">${config}</script><script defer src="${asset(`site.js?v=${scriptVersion}`)}"></script>
  </body></html>`;
}
