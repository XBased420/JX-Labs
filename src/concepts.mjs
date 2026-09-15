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
      <div class="section-command" data-boot><span>C:\\JX_LABS&gt;</span><span>run concept_lab.exe</span></div>
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
    ['snacks', 'Hearth bread', 'Cultured butter, smoked salt', '$8', 'V'],
    ['snacks', 'Crispy squash blossoms', 'Goat cheese, sungold tomato', '$14', 'V'],
    ['snacks', 'Coal-kissed oysters', 'Charred jalapeño mignonette', '$18', 'GF'],
    ['fire', 'Ember-roasted carrots', 'Smoked labneh, pistachio, citrus', '$15', 'V GF'],
    ['fire', 'Half chicken', 'Charred lemon, warm herbs, pan jus', '$29', 'GF'],
    ['fire', 'Gulf redfish', 'Brown butter, caper, market greens', '$34', 'GF'],
    ['fire', '44 Farms bavette', 'Black garlic, embered onion, jus', '$39', 'GF'],
    ['garden', 'Little gem', 'Green goddess, radish, rye crumb', '$13', 'V'],
    ['garden', 'Beets from the coals', 'Blackberry, pecan, sheep’s milk', '$14', 'V GF'],
    ['garden', 'Woodland mushrooms', 'Soft polenta, sherry, parmesan', '$16', 'V GF'],
    ['sweet', 'Burnt honey panna cotta', 'Pear, rosemary sugar', '$11', 'GF'],
    ['sweet', 'Dark chocolate torte', 'Olive oil, sea salt, cocoa nib', '$12', 'V'],
    ['drinks', 'Vine spritz', 'Pear, rosemary, sparkling wine', '$13', ''],
    ['drinks', 'Copper old fashioned', 'Rye, burnt orange, walnut', '$16', ''],
    ['drinks', 'Zero-proof garden', 'Cucumber, mint, tonic', '$10', 'NA']
  ];
  return `<article class="concept-demo restaurant-demo" data-concept-demo="restaurant" hidden>
    <header class="restaurant-nav">
      <button type="button" class="restaurant-wordmark" data-restaurant-route="home" aria-label="Ember and Vine home">Ember <i>&amp;</i> Vine</button>
      <nav aria-label="Ember and Vine pages"><button type="button" data-restaurant-route="menu">Menu</button><button type="button" data-restaurant-route="story">Our table</button><button type="button" class="restaurant-reserve" data-restaurant-route="reserve">Find a table</button></nav>
    </header>

    <main class="restaurant-pages">
      <section class="restaurant-page restaurant-home" data-restaurant-page="home">
        <div class="restaurant-hero">
          <div class="restaurant-hero-copy"><p>Seasonal cooking in Oak Cliff</p><h2>Dinner should feel like a place you found.</h2><span>Fire-led plates, a thoughtful wine list, and a room built for staying awhile.</span><div><button type="button" class="restaurant-primary" data-restaurant-route="reserve">Reserve a table</button><button type="button" data-restaurant-route="menu">Explore tonight’s menu</button></div></div>
          <figure><img src="${asset('assets/concepts/ember-vine-interior-v2.jpg')}" alt="A warmly lit dining room with olive banquettes and an open hearth" width="1586" height="992"><figcaption>DINNER / TUE–SUN / 5–11</figcaption></figure>
        </div>
        <div class="restaurant-marquee" aria-label="Restaurant highlights"><div><span>OPEN HEARTH</span><i>◆</i><span>TEXAS GROWN</span><i>◆</i><span>WINE FOR THE TABLE</span><i>◆</i><span>BISHOP ARTS</span><i>◆</i><span>OPEN HEARTH</span><i>◆</i><span>TEXAS GROWN</span><i>◆</i></div></div>
        <section class="restaurant-signatures">
          <header><p>Tonight at Ember</p><h3>Start with the fire.</h3><button type="button" data-restaurant-route="menu">View full menu <span>↗</span></button></header>
          <figure class="restaurant-dish"><img src="${asset('assets/concepts/ember-vine-dish-v2.jpg')}" alt="Ember-roasted carrots over smoked labneh" width="1448" height="1086"><figcaption><span>01 / From the coals</span><strong>Ember-roasted carrots</strong><small>Smoked labneh, pistachio, charred citrus</small></figcaption></figure>
          <div class="restaurant-tonight"><article><span>02</span><h4>Gulf redfish</h4><p>Brown butter, caper, market greens</p><b>$34</b></article><article><span>03</span><h4>44 Farms bavette</h4><p>Black garlic, embered onion, jus</p><b>$39</b></article></div>
        </section>
        <section class="restaurant-gather"><div><p>Private tables</p><h3>Bring the people.<br>We’ll tend the fire.</h3><span>Our hearth room hosts seated dinners for up to 28, with family-style menus shaped around the season.</span><button type="button" data-restaurant-route="story">Explore private dining</button></div></section>
      </section>

      <section class="restaurant-page restaurant-menu" data-restaurant-page="menu" hidden>
        <header class="restaurant-page-intro"><div><p>From the kitchen</p><h2>A changing menu,<br>grounded in fire.</h2></div><p>Our menu follows what is growing nearby and what belongs over flame. Ask your server about tonight’s market plates.</p></header>
        <div class="restaurant-menu-layout"><aside><p>Dinner menu</p><div class="restaurant-filters" role="group" aria-label="Menu category"><button type="button" class="active" data-menu-filter="all" aria-pressed="true">All</button><button type="button" data-menu-filter="snacks" aria-pressed="false">To begin</button><button type="button" data-menu-filter="fire" aria-pressed="false">From the fire</button><button type="button" data-menu-filter="garden" aria-pressed="false">Field &amp; garden</button><button type="button" data-menu-filter="sweet" aria-pressed="false">Sweet</button><button type="button" data-menu-filter="drinks" aria-pressed="false">Drinks</button></div><small>V — Vegetarian<br>GF — Gluten friendly<br>NA — No alcohol</small></aside>
          <div class="restaurant-menu-list"><ul>${menu.map(([category, name, description, price, note]) => `<li data-menu-item="${category}"><div><strong>${name}</strong><span>${description}</span></div><small>${note}</small><b>${price}</b></li>`).join('')}</ul><p>Menu and prices are part of this fictional concept and may change with the imaginary harvest.</p></div>
        </div>
        <section class="restaurant-menu-callout"><img src="${asset('assets/concepts/ember-vine-dish-v2.jpg')}" alt="A seasonal dish prepared over fire" width="1448" height="1086" loading="lazy"><div><p>Leave room for one more</p><h3>Let us cook for the table.</h3><span>A four-course, family-style menu is available nightly for the whole table.</span><b>$68 per guest</b><button type="button" data-restaurant-route="reserve">Book dinner</button></div></section>
      </section>

      <section class="restaurant-page restaurant-booking" data-restaurant-page="reserve" hidden>
        <header class="restaurant-page-intro"><div><p>Reservations</p><h2>Your table<br>is waiting.</h2></div><p>Choose a date, party size, and time. This interactive example stops before collecting any personal information.</p></header>
        <div class="restaurant-reservation-shell">
          <div class="restaurant-reservation-controls">
            <fieldset><legend>1 / Choose a night</legend><div class="restaurant-date-options">${[0,1,2,3].map((offset, index) => `<button type="button" data-restaurant-date-offset="${offset}" aria-pressed="${index === 0}"><small>${index === 0 ? 'Tonight' : 'Upcoming'}</small><strong>Loading</strong></button>`).join('')}</div></fieldset>
            <fieldset><legend>2 / Party size</legend><div class="restaurant-party-stepper"><button type="button" data-restaurant-party="minus" aria-label="Remove one guest">−</button><output id="restaurant-party-count" aria-live="polite">2 guests</output><button type="button" data-restaurant-party="plus" aria-label="Add one guest">+</button></div><small>For groups of 7 or more, please inquire about our hearth room.</small></fieldset>
            <fieldset><legend>3 / Available times</legend><div class="restaurant-time-options">${['5:00 PM','5:30 PM','6:15 PM','7:45 PM','8:30 PM','9:15 PM'].map((time,index) => `<button type="button" data-restaurant-time="${time}" aria-pressed="${index === 2}">${time}</button>`).join('')}</div></fieldset>
          </div>
          <aside class="restaurant-reservation-summary"><p>Your evening</p><h3 id="restaurant-reservation-date">Tonight</h3><dl><div><dt>Guests</dt><dd id="restaurant-reservation-guests">2 guests</dd></div><div><dt>Time</dt><dd id="restaurant-reservation-time">6:15 PM</dd></div><div><dt>Location</dt><dd>Ember &amp; Vine<br>Bishop Arts, Dallas</dd></div></dl><button type="button" id="restaurant-hold-table">Hold this table</button><small>No payment is taken when you reserve.</small><div class="restaurant-confirmation" id="restaurant-confirmation" role="status" aria-live="polite" hidden><strong>Table held—for the demo.</strong><span>This is a concept experience, so no reservation was sent and no personal information was collected.</span></div></aside>
        </div>
        <section class="restaurant-booking-note"><span>◆</span><p>Running late? Celebrating something? A real reservation flow can collect notes after a table is selected—without slowing down the first decision.</p></section>
      </section>

      <section class="restaurant-page restaurant-story" data-restaurant-page="story" hidden>
        <section class="restaurant-story-hero"><figure><img src="${asset('assets/concepts/ember-vine-interior-v2.jpg')}" alt="Ember and Vine’s candlelit hearth room" width="1586" height="992"><figcaption>THE HEARTH ROOM / BISHOP ARTS</figcaption></figure><div><p>Our table</p><h2>A neighborhood room, lit by fire.</h2><span>Ember &amp; Vine began with a simple idea: good cooking should carry the warmth of the people and place behind it.</span></div></section>
        <section class="restaurant-story-body"><blockquote>“Come for dinner. Leave with a new favorite table.”</blockquote><div><p>The menu is rooted in North Texas seasons, small farms, and the kind of food that gets better when it is passed around. Our open hearth does the heavy lifting; smoke, flame, and patience do the rest.</p><p>The room is polished but never precious. Come in from the neighborhood, order one more plate, and stay until the candles burn low.</p><dl><div><dt>Hours</dt><dd>Tue–Thu 5–10<br>Fri–Sun 5–11</dd></div><div><dt>Find us</dt><dd>408 W. Eighth Street<br>Dallas, Texas</dd></div><div><dt>Hospitality</dt><dd>Walk-ins welcome<br>Reservations encouraged</dd></div></dl></div></section>
        <section class="restaurant-private"><p>Gather at the hearth</p><h3>Private dinners,<br>without the private-room feeling.</h3><span>Host 12–28 guests around a shared table with a seasonal menu, dedicated service, and a view of the open fire.</span><button type="button" data-demo-message="Private dining inquiry opened — demonstration only.">Inquire about your date</button></section>
      </section>
    </main>
    <footer class="restaurant-footer"><button type="button" class="restaurant-wordmark" data-restaurant-route="home">Ember <i>&amp;</i> Vine</button><div><button type="button" data-restaurant-route="menu">Menu</button><button type="button" data-restaurant-route="story">Our table</button><button type="button" data-restaurant-route="reserve">Reservations</button></div><span>Bishop Arts / Dallas, Texas</span></footer>
  </article>`;
}

function renderEvents(asset) {
  return `<article class="concept-demo events-demo" data-concept-demo="events" hidden>
    <header class="events-nav">
      <button type="button" class="events-wordmark" data-event-route="home" aria-label="NightShift Audio home"><span>NS</span>/AUDIO</button>
      <nav aria-label="NightShift Audio navigation"><button type="button" data-event-route="home" aria-current="page">Home</button><button type="button" data-event-route="mixes">Mixes</button><button type="button" data-event-route="events">Events</button><button type="button" data-event-route="book">Book</button></nav>
      <button type="button" class="events-date" data-event-route="book">Check a date</button>
    </header>
    <main>
      <section class="event-page event-home" data-event-page="home">
        <section class="events-hero">
          <img src="${asset('assets/concepts/nightshift-audio.jpg')}" alt="A cobalt-lit DJ booth at a live event" width="1600" height="1000">
          <div class="events-overlay"><p>DJ / MC / Event production</p><h2>Make the room<br>move as one.</h2><div class="event-actions"><button type="button" class="event-primary" data-event-preview aria-pressed="false"><span>▶</span> Preview the energy</button><button type="button" data-event-route="book">Build your night</button></div></div>
          <div class="event-deck" aria-hidden="true"><span class="event-platter"><i></i></span><div class="event-wave">${Array.from({ length: 22 }, (_, index) => `<i style="--wave:${(index % 8) + 2}"></i>`).join('')}</div><small>LIVE REEL / 00:<b id="event-reel-time">00</b></small></div>
          <span class="events-stamp">NO DEAD AIR<br>NO GENERIC SETS</span>
        </section>
        <section class="events-proof"><p>Built for</p><div><span>Weddings</span><span>Brand events</span><span>Nightlife</span><span>Private parties</span></div></section>
        <section class="event-manifesto"><div><p>The NightShift method</p><h3>Read the room.<br>Then raise it.</h3></div><div><p>A packed floor is not an accident. Every set begins with the people, the timeline, and the moments that cannot miss.</p><dl><div><dt>01</dt><dd>Plan the arc</dd></div><div><dt>02</dt><dd>Protect the moments</dd></div><div><dt>03</dt><dd>Move with the room</dd></div></dl><button type="button" data-event-route="events">See the experience</button></div></section>
        <section class="events-close"><div><p>Saturday, 11:48 PM</p><h3>The timeline is handled.<br>The floor is full.</h3></div><button type="button" data-event-route="book">Check your date</button></section>
      </section>

      <section class="event-page event-mixes" data-event-page="mixes" hidden>
        <header class="event-page-intro"><div><p>Open-format, room-first programming</p><h2>Find your<br>frequency.</h2></div><p>Four sample directions—not rigid playlists. Choose a lane and NightShift builds the transitions around your crowd.</p></header>
        <div class="event-mix-grid">
          <button type="button" data-event-mix="Golden hour" data-event-mix-meta="Disco / R&amp;B / warm house" aria-pressed="false"><small>MIX 01 / 42:18</small><strong>Golden hour</strong><span>Disco, R&amp;B, warm house</span><i>Preview mix</i></button>
          <button type="button" data-event-mix="After dark" data-event-mix-meta="Hip-hop / club / edits" aria-pressed="false"><small>MIX 02 / 38:04</small><strong>After dark</strong><span>Hip-hop, club, edits</span><i>Preview mix</i></button>
          <button type="button" data-event-mix="Main character" data-event-mix-meta="Pop / throwbacks / singalongs" aria-pressed="false"><small>MIX 03 / 46:32</small><strong>Main character</strong><span>Pop, throwbacks, singalongs</span><i>Preview mix</i></button>
          <button type="button" data-event-mix="Night drive" data-event-mix-meta="Afro / house / global rhythm" aria-pressed="false"><small>MIX 04 / 40:11</small><strong>Night drive</strong><span>Afro, house, global rhythm</span><i>Preview mix</i></button>
        </div>
        <aside class="event-player" id="event-player" aria-live="polite"><button type="button" data-event-preview aria-pressed="false" aria-label="Play selected NightShift mix">▶</button><div><small>Selected preview</small><strong id="event-player-title">Choose a mix</strong><span id="event-player-meta">Your selection will load here.</span></div><div class="event-progress"><i id="event-progress"></i></div><time id="event-player-time">00:00</time></aside>
        <section class="event-mix-note"><p>Need a clean edit? A cultural favorite? A hard no?</p><h3>Your music brief matters.</h3><span>Planning includes must-plays, do-not-plays, pronunciations, and the songs attached to the moments people will remember.</span><button type="button" data-event-route="book">Start your brief</button></section>
      </section>

      <section class="event-page event-experience" data-event-page="events" hidden>
        <header class="event-page-intro"><div><p>More than a playlist</p><h2>Every cue.<br>Covered.</h2></div><p>From doors open to final track, NightShift manages the room’s energy and the production underneath it.</p></header>
        <section class="event-timeline" aria-label="Event production timeline"><article><span>04:00 PM</span><div><small>Load-in</small><h3>Quiet setup. Clean room.</h3><p>Audio, lighting, backups, and cable paths are tested before guests arrive.</p></div></article><article><span>06:30 PM</span><div><small>Guest arrival</small><h3>The room finds its pulse.</h3><p>Volume and selections build around conversation instead of fighting it.</p></div></article><article><span>08:05 PM</span><div><small>Key moments</small><h3>Names right. Cues exact.</h3><p>Introductions, speeches, formal dances, and transitions stay on the same clock.</p></div></article><article><span>09:12 PM</span><div><small>Open floor</small><h3>No dead air.</h3><p>The plan becomes responsive: requests, generations, and energy all shape the next record.</p></div></article></section>
        <section class="event-production"><div><p>Production desk</p><h3>One team.<br>One signal path.</h3><span>Choose a service to see how it supports the night.</span></div><div class="event-production-controls" role="group" aria-label="Production services"><button type="button" data-event-service="Room-tuned sound keeps speeches clear and the dance floor full without punishing the tables."><strong>Sound</strong><span>Wireless microphones / room coverage / backup playback</span></button><button type="button" data-event-service="Lighting builds a visual arc from dinner warmth to a kinetic late-night room."><strong>Lighting</strong><span>Uplighting / dance-floor movement / scene changes</span></button><button type="button" data-event-service="Clear MC work keeps attention where it belongs and the timeline moving naturally."><strong>MC</strong><span>Introductions / announcements / timeline direction</span></button><p id="event-service-detail">Select a production service.</p></div></section>
        <section class="event-testimonial"><blockquote>“We never looked at the clock once. Every transition just happened.”</blockquote><span>Fictional client note / Full room package</span></section>
      </section>

      <section class="event-page event-book" data-event-page="book" hidden>
        <header class="event-page-intro"><div><p>Build the night</p><h2>Start with<br>the room.</h2></div><p>This interactive planner demonstrates a clear booking flow. No reservation or personal information is sent.</p></header>
        <section class="events-packages" id="events-packages"><header><p>Choose the coverage</p><h3>A clear starting point.<br>A set built for your room.</h3></header><div class="event-package-grid">
          <button type="button" data-event-package="Essential" data-event-price="1450" aria-pressed="false"><small>01</small><strong>Essential</strong><span>DJ set<br>Sound system<br>Planning call</span><b>Select package</b></button>
          <button type="button" class="featured" data-event-package="Full room" data-event-price="2350" aria-pressed="false"><small>02 / Most requested</small><strong>Full room</strong><span>DJ + MC<br>Sound and lighting<br>Timeline planning</span><b>Select package</b></button>
          <button type="button" data-event-package="Production" data-event-price="3600" aria-pressed="false"><small>03</small><strong>Production</strong><span>Full event audio<br>Lighting design<br>On-site support</span><b>Select package</b></button>
        </div></section>
        <section class="event-planner"><div><fieldset><legend>How long is the event?</legend><div class="event-duration-options"><button type="button" data-event-duration="4 hours" data-event-duration-price="0" aria-pressed="true">4 hours</button><button type="button" data-event-duration="6 hours" data-event-duration-price="350" aria-pressed="false">6 hours</button><button type="button" data-event-duration="8 hours" data-event-duration-price="650" aria-pressed="false">8 hours</button></div></fieldset><fieldset><legend>Add to the room</legend><div class="event-addon-options"><button type="button" data-event-addon="Ceremony audio" data-event-addon-price="350" aria-pressed="false">Ceremony audio <span>+$350</span></button><button type="button" data-event-addon="Room uplighting" data-event-addon-price="500" aria-pressed="false">Room uplighting <span>+$500</span></button><button type="button" data-event-addon="Cold spark exit" data-event-addon-price="750" aria-pressed="false">Cold spark exit <span>+$750</span></button></div></fieldset></div><aside class="event-plan-summary"><p>Your NightShift plan</p><h3 id="event-plan-package">Choose coverage</h3><dl><div><dt>Duration</dt><dd id="event-plan-duration">4 hours</dd></div><div><dt>Add-ons</dt><dd id="event-plan-addons">None selected</dd></div><div><dt>Starting at</dt><dd id="event-plan-total">Select a package</dd></div></dl><button type="button" id="event-hold-date" disabled>Hold a demo date</button><small>Demonstration only. No payment or event request is sent.</small><div class="event-confirmation" id="event-confirmation" hidden><strong>Date ready for your review.</strong><span>Your selections stayed inside this demo.</span></div></aside></section>
      </section>
    </main>
    <footer class="events-footer"><button type="button" class="events-wordmark" data-event-route="home"><span>NS</span>/AUDIO</button><nav><button type="button" data-event-route="mixes">Mixes</button><button type="button" data-event-route="events">Events</button><button type="button" data-event-route="book">Book</button></nav><span>Concept booking experience / 2026</span></footer>
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
