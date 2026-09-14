export const concepts = [
  {
    id: 'restaurant',
    name: 'Ember & Vine',
    industry: 'Restaurant',
    line: 'A reservation-first neighborhood dining experience.',
    image: 'assets/concepts/ember-vine.jpg',
    interest: 'Restaurant / hospitality',
    request: 'I’m interested in a restaurant website inspired by the Ember & Vine concept.'
  },
  {
    id: 'events',
    name: 'NightShift Audio',
    industry: 'DJ & events',
    line: 'A high-energy booking site built around packages and availability.',
    image: 'assets/concepts/nightshift-audio.jpg',
    interest: 'DJ / events',
    request: 'I’m interested in a DJ or events website inspired by the NightShift Audio concept.'
  },
  {
    id: 'retail',
    name: 'Common Thread Supply',
    industry: 'Retail',
    line: 'An editorial storefront that makes a small collection feel substantial.',
    image: 'assets/concepts/common-thread-supply.jpg',
    interest: 'Retail / ecommerce',
    request: 'I’m interested in a retail website inspired by the Common Thread Supply concept.'
  }
];

const conceptCard = (concept, asset) => `<button class="concept-card concept-card-${concept.id}" type="button" data-open-concept="${concept.id}">
  <span class="concept-card-image"><img src="${asset(concept.image)}" alt="" width="960" height="640" loading="lazy" decoding="async"></span>
  <span class="concept-card-copy"><small>${concept.industry}</small><strong>${concept.name}</strong><span>${concept.line}</span><b>Open interactive concept</b></span>
</button>`;

export function renderConceptLab(asset) {
  const conceptConfig = JSON.stringify(concepts.map(({ id, name, interest, request }) => ({ id, name, interest, request }))).replace(/</g, '\\u003c');
  return `<section id="concepts" class="terminal-section terminal-view concept-lab" aria-labelledby="concepts-title">
    <div class="concept-catalog" id="concept-catalog">
      <div class="section-command" data-boot><span>C:\\XBASED&gt;</span><span>run concept_lab.exe</span></div>
      <header class="section-head" data-boot><div><p>CONCEPT LAB</p><h2 id="concepts-title" tabindex="-1">See what your business could become.</h2></div><p>Three fictional brands, built to show how the same web skills can solve very different business problems.</p></header>
      <p class="concept-disclaimer" data-boot>CONCEPT PROJECTS // These are original demonstrations, not client businesses.</p>
      <div class="concept-grid">${concepts.map(concept => conceptCard(concept, asset)).join('')}</div>
    </div>

    <div class="concept-viewer" id="concept-viewer" hidden>
      <div class="concept-toolbar">
        <button type="button" class="concept-tool concept-back" id="concept-back">← Concept lab</button>
        <strong id="concept-viewer-title" tabindex="-1">Concept preview</strong>
        <div class="concept-devices" role="group" aria-label="Preview size">
          <button type="button" class="concept-tool active" data-concept-device="desktop" aria-pressed="true">Desktop</button>
          <button type="button" class="concept-tool" data-concept-device="phone" aria-pressed="false">Phone</button>
        </div>
        <button type="button" class="concept-tool concept-restart" id="concept-restart">Restart</button>
        <button type="button" class="concept-tool concept-request" id="concept-request">Build something like this</button>
      </div>
      <div class="concept-stage">
        <div class="concept-frame" id="concept-frame">
          ${renderRestaurant(asset)}
          ${renderEvents(asset)}
          ${renderRetail(asset)}
        </div>
      </div>
      <p class="concept-toast" id="concept-toast" role="status" aria-live="polite" hidden></p>
    </div>
    <script type="application/json" id="concept-config">${conceptConfig}</script>
  </section>`;
}

function renderRestaurant(asset) {
  const menu = [
    ['dinner', 'Coal-roasted carrots', 'Labneh, pistachio, smoked honey', '$13'],
    ['dinner', 'Ember chicken', 'Charred lemon, warm herbs, pan jus', '$28'],
    ['dinner', 'River trout', 'Brown butter, caper, market greens', '$31'],
    ['drinks', 'Vine spritz', 'Pear, rosemary, sparkling wine', '$12'],
    ['drinks', 'Copper old fashioned', 'Rye, burnt orange, walnut', '$15'],
    ['drinks', 'Zero-proof garden', 'Cucumber, mint, tonic', '$9']
  ];
  return `<article class="concept-demo restaurant-demo" data-concept-demo="restaurant" hidden>
    <header class="restaurant-nav"><strong>Ember <i>&amp;</i> Vine</strong><div><button type="button" data-concept-scroll="restaurant-menu">Menu</button><button type="button" data-concept-scroll="restaurant-story">Our table</button><button type="button" class="restaurant-reserve" data-demo-message="Reservation request opened — demonstration only.">Reserve</button></div></header>
    <section class="restaurant-hero">
      <div class="restaurant-hero-copy"><p>Seasonal cooking in Oak Cliff</p><h2>Dinner should feel like a place you found.</h2><span>Fire-led plates, a short wine list, and a room built for staying awhile.</span><button type="button" data-concept-scroll="restaurant-menu">Explore tonight’s menu</button></div>
      <figure><img src="${asset('assets/concepts/ember-vine.jpg')}" alt="A candlelit table with ember-roasted food" width="1600" height="1000"><figcaption>DINNER / TUE–SUN / 5–11</figcaption></figure>
    </section>
    <section class="restaurant-menu" id="restaurant-menu">
      <div><p>From the kitchen</p><h3>A changing menu,<br>grounded in fire.</h3></div>
      <div><div class="restaurant-filters" role="group" aria-label="Menu category"><button type="button" class="active" data-menu-filter="all" aria-pressed="true">Everything</button><button type="button" data-menu-filter="dinner" aria-pressed="false">Dinner</button><button type="button" data-menu-filter="drinks" aria-pressed="false">Drinks</button></div>
      <ul>${menu.map(([category, name, description, price]) => `<li data-menu-item="${category}"><div><strong>${name}</strong><span>${description}</span></div><b>${price}</b></li>`).join('')}</ul></div>
    </section>
    <section class="restaurant-story" id="restaurant-story"><blockquote>“Come for dinner. Leave with a new favorite table.”</blockquote><div><h3>Made for the neighborhood.</h3><p>Ember &amp; Vine is a fictional restaurant concept designed around the decisions diners make first: what the food feels like, when the doors are open, and how quickly they can reserve a table.</p><dl><div><dt>Hours</dt><dd>Tue–Thu 5–10<br>Fri–Sun 5–11</dd></div><div><dt>Find us</dt><dd>Bishop Arts<br>Dallas, Texas</dd></div></dl></div></section>
    <footer class="restaurant-footer"><strong>Ember &amp; Vine</strong><button type="button" data-demo-message="Table request received — demonstration only.">Find a table</button></footer>
  </article>`;
}

function renderEvents(asset) {
  return `<article class="concept-demo events-demo" data-concept-demo="events" hidden>
    <header class="events-nav"><strong>NS/AUDIO</strong><span>Dallas / Available worldwide</span><button type="button" data-demo-message="Availability checker opened — demonstration only.">Check a date</button></header>
    <section class="events-hero"><img src="${asset('assets/concepts/nightshift-audio.jpg')}" alt="A cobalt-lit DJ booth at a live event" width="1600" height="1000"><div class="events-overlay"><p>DJ / MC / Event production</p><h2>Make the room<br>move as one.</h2><div class="event-wave" aria-hidden="true">${Array.from({ length: 18 }, (_, index) => `<i style="--wave:${(index % 7) + 2}"></i>`).join('')}</div><button type="button" data-concept-scroll="events-packages">Build your night</button></div><span class="events-stamp">NO DEAD AIR<br>NO GENERIC SETS</span></section>
    <section class="events-proof"><p>Built for</p><div><span>Weddings</span><span>Brand events</span><span>Nightlife</span><span>Private parties</span></div></section>
    <section class="events-packages" id="events-packages"><header><p>Choose the energy</p><h3>A clear starting point.<br>A set built for your room.</h3></header><div class="event-package-grid">
      <button type="button" data-event-package="Essential"><small>01</small><strong>Essential</strong><span>DJ set<br>Sound system<br>Planning call</span><b>Select package</b></button>
      <button type="button" class="featured" data-event-package="Full room"><small>02 / Most requested</small><strong>Full room</strong><span>DJ + MC<br>Sound and lighting<br>Timeline planning</span><b>Select package</b></button>
      <button type="button" data-event-package="Production"><small>03</small><strong>Production</strong><span>Full event audio<br>Lighting design<br>On-site support</span><b>Select package</b></button>
    </div><p class="event-selection" id="event-selection">Select a package to shape your request.</p></section>
    <section class="events-close"><div><p>Saturday, 11:48 PM</p><h3>The timeline is handled.<br>The floor is full.</h3></div><button type="button" data-demo-message="Date saved for review — demonstration only.">Check your date</button></section>
    <footer class="events-footer"><strong>NS/AUDIO</strong><span>Concept booking experience</span><span>© 2026</span></footer>
  </article>`;
}

function renderRetail(asset) {
  const products = [
    ['outerwear', 'Transit shell', 'Signal red', '$148'],
    ['tops', 'Heavyweight field tee', 'Paper white', '$48'],
    ['accessories', 'Utility carryall', 'Cobalt', '$72'],
    ['outerwear', 'Workshop overshirt', 'Ink', '$118'],
    ['tops', 'Grid knit', 'Chrome', '$88'],
    ['accessories', 'Five-panel cap', 'Signal red', '$38']
  ];
  return `<article class="concept-demo retail-demo" data-concept-demo="retail" hidden>
    <header class="retail-nav"><strong>COMMON<br>THREAD</strong><div><button type="button" data-concept-scroll="retail-shop">Shop</button><button type="button" data-concept-scroll="retail-story">Field notes</button></div><button type="button" class="retail-bag" id="retail-bag">Bag <span id="retail-bag-count">0</span></button></header>
    <section class="retail-hero"><div><p>DROP 04 / BUILT TO MOVE</p><h2>Daily uniform.<br>Harder working.</h2><button type="button" data-concept-scroll="retail-shop">Shop the drop</button></div><img src="${asset('assets/concepts/common-thread-supply.jpg')}" alt="An editorial arrangement of colorful streetwear and accessories" width="1600" height="1000"><b>COMMON GOODS<br>FOR UNCOMMON DAYS</b></section>
    <section class="retail-shop" id="retail-shop"><header><div><p>Current drop</p><h3>Six pieces. No filler.</h3></div><div class="retail-filters" role="group" aria-label="Product category"><button type="button" class="active" data-retail-filter="all" aria-pressed="true">All</button><button type="button" data-retail-filter="outerwear" aria-pressed="false">Outerwear</button><button type="button" data-retail-filter="tops" aria-pressed="false">Tops</button><button type="button" data-retail-filter="accessories" aria-pressed="false">Accessories</button></div></header>
      <div class="retail-products">${products.map(([category, name, color, price], index) => `<article data-retail-item="${category}"><button type="button" class="retail-product-art retail-art-${index + 1}" data-retail-add="${name}" aria-label="Add ${name} to bag"><img src="${asset('assets/concepts/common-thread-supply.jpg')}" alt="" width="800" height="800" loading="lazy"><span>${String(index + 1).padStart(2, '0')}</span><b>+</b></button><div><strong>${name}</strong><span>${color}</span><b>${price}</b></div></article>`).join('')}</div>
    </section>
    <section class="retail-story" id="retail-story"><img src="${asset('assets/concepts/common-thread-supply.jpg')}" alt="Streetwear pieces arranged in a bold editorial flat lay" width="1200" height="800" loading="lazy"><div><p>Field note 017</p><h3>Buy less.<br>Wear it harder.</h3><span>A fictional retail concept that treats a focused product line like an editorial story—without making the path to purchase complicated.</span></div></section>
    <aside class="retail-cart" id="retail-cart" hidden aria-labelledby="retail-cart-title"><button type="button" id="retail-cart-close" aria-label="Close bag">×</button><p>Your bag</p><h3 id="retail-cart-title">Good choice.</h3><div id="retail-cart-items">Your selected concept products will appear here.</div><button type="button" data-demo-message="Checkout reached — demonstration only.">Demo checkout</button></aside>
    <footer class="retail-footer"><strong>COMMON THREAD SUPPLY</strong><span>Concept storefront / Dallas</span></footer>
  </article>`;
}
