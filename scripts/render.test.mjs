import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import settings, { deployment } from '../site.config.mjs';
import { renderPage } from '../src/render.mjs';
test('repository subpath reaches every public asset', () => {
  const html = renderPage({ settings, site: 'https://xbased420.github.io', base: '/test-repo/' });
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#]+)"/g)) {
    assert.ok(match[1].startsWith('/test-repo/'), match[1]);
    assert.ok(existsSync(new URL('../public/' + match[1].slice('/test-repo/'.length), import.meta.url)));
  }
  assert.match(html, /https:\/\/xbased420.github.io\/test-repo\//);
});
test('custom domain and profile-repository deploy without base path', () => {
  assert.deepEqual(deployment({ ...settings, customDomain: 'xbased.dev' }), { site: 'https://xbased.dev', base: '/' });
  assert.equal(deployment(settings, 'XBased420/XBased420.github.io').base, '/');
  assert.equal(settings.repository, 'JX-Labs');
});
test('missing endpoint stays preview-only, and contains no unobfuscated email', () => {
  const html = renderPage({ settings: { ...settings, endpoint: '' }, ...deployment(settings) });
  assert.match(html, /Preview mode/i); assert.ok(!html.includes('calipxj@gmail.com'));
  assert.equal((html.match(/<details class="project/g) || []).length, 4);
  assert.equal((html.match(/data-estimate-option/g) || []).length, 8);
  assert.ok(!html.includes('tel:'));
  assert.match(html, /data-one-time="450"/);
  assert.match(html, /data-deposit="50"/);
  assert.doesNotMatch(html, /class="pricing"/);
});
test('configured endpoint enables booking without loading a challenge widget', () => {
  const html = renderPage({ settings: { ...settings, bookingEnabled: true }, ...deployment(settings) });
  const behavior = readFileSync(new URL('../public/site.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /Preview mode/i);
  assert.doesNotMatch(html, /turnstile|Spam protection/i);
  assert.match(behavior, /const ready = Boolean\(config\.endpoint && config\.bookingEnabled\)/);
  assert.doesNotMatch(behavior, /turnstile|challenges\.cloudflare\.com/i);
});
test('all input fields have labels and six are required', () => {
  const html = renderPage({ settings, ...deployment(settings) });
  for (const match of html.matchAll(/<(?:input|textarea|select) id="([^"]+)"/g)) assert.ok(html.includes(`for="${match[1]}"`));
  assert.equal((html.match(/ required /g) || []).length, 6);
});
test('fonts are genuine WOFF2 and styles honor reduced motion', () => {
  for (const name of ['manrope', 'space-grotesk']) assert.equal(readFileSync(new URL(`../public/assets/fonts/${name}-latin.woff2`, import.meta.url)).subarray(0, 4).toString(), 'wOF2');
  const styles = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /@keyframes signal-glow/);
  assert.match(styles, /\.terminal-app\{min-height:100dvh;padding:0\}/);
  assert.match(styles, /\.machine-shell\{width:100%;min-height:100dvh;margin:0;border:0/);
  assert.doesNotMatch(styles, /@keyframes signal-float[^}]*box-shadow/);
});
test('production shell requires an explicit login and exposes a sequenced boot', () => {
  const html = renderPage({ settings, ...deployment(settings) });
  const behavior = readFileSync(new URL('../public/site.js', import.meta.url), 'utf8');
  assert.match(html, /id="terminal-login"[^>]*>Login<\/button>/);
  assert.match(html, /<h1 id="login-title">Welcome\.<\/h1>/);
  assert.match(html, /<h1 id="hero-title" data-boot>Websites that pull their weight\.<\/h1>/);
  assert.match(html, /<p>Click login to access\.<\/p>/);
  assert.doesNotMatch(html, /Connection ready|No password required/);
  assert.match(html, /id="terminal-app"/);
  assert.match(html, /<title>JX Labs — Websites &amp; booking systems/);
  assert.match(html, /aria-label="JX Labs home">JX Labs<\/a>/);
  assert.match(html, /BUILT BY JX LABS/);
  assert.match(html, /PROPERTY OF JX LABS/);
  assert.doesNotMatch(html, /XBased|x\[based\]|DFW \+ Remote/);
  assert.equal((html.match(/class="[^"]*terminal-view/g) || []).length, 7);
  assert.match(html, /id="sound-toggle"[^>]*aria-pressed="true"/);
  assert.match(html, /class="terminal-button float-signal" href="#booking">Open project request/);
  assert.match(html, /class="contract-link float-signal" href="#booking">START A PROJECT/);
  assert.match(html, />MY PORTFOLIO</);
  assert.match(html, />SERVICES &amp; ESTIMATE</);
  assert.match(html, />HOW IT WORKS</);
  assert.match(html, />ABOUT XAVIER</);
  assert.match(html, /id="estimate-total"/);
  assert.match(html, /id="estimate-start"/);
  assert.match(html, /extensive customer-service experience/);
  assert.doesNotMatch(html, /SELF-TAUGHT BUILDER|No degree, no big agency handoff/);
  assert.doesNotMatch(html, /github\.com\/XBased420/);
  assert.ok((html.match(/data-boot/g) || []).length >= 20);
  assert.match(behavior, /loginButton\.addEventListener\('click'/);
  assert.match(behavior, /AudioContext/);
  assert.match(behavior, /'sawtooth'/);
  assert.match(behavior, /updateEstimate/);
  assert.match(behavior, /Selected services:/);
  assert.match(behavior, /index \* 72/);
});
test('concept lab keeps three interactive industry sites inside the terminal', () => {
  const html = renderPage({ settings, ...deployment(settings) });
  const behavior = readFileSync(new URL('../public/site.js', import.meta.url), 'utf8');
  assert.match(html, />CONCEPT LAB</);
  assert.equal((html.match(/data-concept-demo=/g) || []).length, 3);
  assert.match(html, /Ember &amp; Vine/);
  assert.match(html, /NightShift Audio/);
  assert.match(html, /Common Thread Supply/);
  assert.match(html, /id="concept-frame"/);
  assert.match(html, /Build something like this/);
  assert.equal((html.match(/data-restaurant-page=/g) || []).length, 4);
  for (const page of ['home', 'menu', 'reserve', 'story']) assert.match(html, new RegExp(`data-restaurant-route="${page}"`));
  assert.match(html, /id="restaurant-hold-table"/);
  assert.match(html, /no reservation was sent and no personal information was collected/i);
  assert.doesNotMatch(html, /<form[^>]+restaurant/i);
  assert.match(behavior, /const openConcept/);
  assert.match(behavior, /const showRestaurantPage/);
  assert.match(behavior, /restaurantParty = Math\.max\(1, Math\.min\(8/);
  assert.match(behavior, /Demo table held\. No reservation or personal information was sent/);
  assert.match(behavior, /activateView\('booking'\)/);
  for (const name of ['ember-vine', 'ember-vine-interior-v2', 'ember-vine-dish-v2', 'nightshift-audio', 'common-thread-supply']) {
    assert.equal(readFileSync(new URL(`../public/assets/concepts/${name}.jpg`, import.meta.url)).subarray(0, 2).toString('hex'), 'ffd8');
  }
});
test('terminal design lab is a safe three-concept prototype', () => {
  const html = readFileSync(new URL('../public/terminal-lab.html', import.meta.url), 'utf8');
  const previewServer = readFileSync(new URL('./preview.mjs', import.meta.url), 'utf8');
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 3);
  assert.equal((html.match(/data-demo-form/g) || []).length, 2);
  assert.match(html, /Prototype forms do not send data/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.match(readFileSync(new URL('../public/terminal-lab.css', import.meta.url), 'utf8'), /prefers-reduced-motion:reduce/);
  assert.match(previewServer, /'\.html': 'text\/html; charset=utf-8'/);
});
