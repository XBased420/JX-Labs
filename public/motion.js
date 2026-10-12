/*!
 * JX Labs motion layer (public/motion.js)
 *
 * Built on GSAP 3.15.0 (GreenSock standard no-charge license, https://gsap.com/standard-license)
 * and Lenis 1.3.26 (MIT, darkroom.engineering). Both are vendored, pinned, in public/vendor/.
 *
 * Several effects are adapted from React Bits (https://github.com/DavidHDev/react-bits),
 * MIT + Commons Clause License Condition v1.0, Copyright (c) 2026 David Haz:
 * DecryptedText / ScrambledText, TextType, SplitText, CountUp, Magnet, SpotlightCard,
 * ClickSpark and LetterGlitch, ported from React to plain JavaScript for this site.
 *
 * Everything here is an enhancement. If this file or a library fails to load, every
 * window.JXMotion hook returns false or null and public/site.js keeps its original behaviour.
 * With prefers-reduced-motion: reduce, nothing animates and native scrolling is untouched.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const no = () => false;
  const api = {
    timeline: () => null, bootStart: () => null, bootClear: no, scrollTop: no, unlock: no,
    viewShown: no, lookChanged: no, countEstimate: no
  };
  window.JXMotion = api;

  const { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(...[ScrollTrigger, SplitText, ScrambleTextPlugin, Flip].filter(Boolean));
  root.classList.add('motion-ready');

  const QUERIES = { motion: '(prefers-reduced-motion: no-preference)', fine: '(hover: hover) and (pointer: fine)' };
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const animated = () => !reduceQuery.matches;
  const look = () => root.dataset.look || 'terminal';
  const locked = () => document.body.classList.contains('terminal-locked');
  const cssVar = (name, fallback) => getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%*+=/';
  const currency = value => `$${Math.round(value).toLocaleString('en-US')}`;

  // =============================================================== Phase 1: Lenis smooth scroll
  // Mouse-wheel smoothing only; touch scrolling stays native (syncTouch off). One rAF driver:
  // GSAP's ticker runs Lenis, and Lenis feeds ScrollTrigger. Nested scrollers opt out with
  // data-lenis-prevent so they keep their own native scrolling.
  ['#concept-frame', '#look-menu', 'textarea'].forEach(selector => {
    document.querySelectorAll(selector).forEach(element => element.setAttribute('data-lenis-prevent', ''));
  });
  let lenis = null;
  const startLenis = () => {
    if (lenis || !window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    if (locked()) lenis.stop();
  };
  const stopLenis = () => { if (lenis) { lenis.destroy(); lenis = null; } };
  gsap.ticker.add(time => { if (lenis) lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  api.unlock = () => { if (lenis) lenis.start(); return Boolean(lenis); };
  api.scrollTop = () => {
    if (!lenis) return false;
    lenis.scrollTo(0, { immediate: true, force: true });
    return true;
  };
  api.timeline = () => (animated() ? gsap.timeline() : null);

  // =============================================================== Ported effects (React Bits)
  // Each effect takes an element plus options with defaults and returns its own cleanup.

  // DecryptedText / ScrambledText: text resolves out of terminal glyphs. The real text stays
  // available to screen readers through aria-label while the glyphs churn.
  const decryptText = (heading, { duration = 0.9, chars = GLYPHS, speed = 0.6 } = {}) => {
    if (!ScrambleTextPlugin) return null;
    const inked = heading.querySelector('.ink-word');
    if (!inked && heading.children.length) return null;
    // Scramble word by word so spaces (and therefore line breaks) never move.
    const original = heading.textContent;
    let targets;
    let unwrap = null;
    if (inked) targets = [...heading.querySelectorAll('.ink-word')];
    else {
      targets = [];
      heading.textContent = '';
      original.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { heading.append(part); return; }
        const word = document.createElement('span');
        word.className = 'motion-word';
        word.textContent = part;
        heading.append(word);
        targets.push(word);
      });
      unwrap = () => { heading.textContent = original; };
    }
    const label = heading.getAttribute('aria-label');
    heading.setAttribute('aria-label', original.replace(/\s+/g, ' ').trim());
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      if (unwrap) unwrap();
      if (label === null) heading.removeAttribute('aria-label'); else heading.setAttribute('aria-label', label);
    };
    const tl = gsap.timeline({ onComplete: restore });
    targets.forEach((target, index) => {
      tl.to(target, { duration: duration + index * 0.06, ease: 'none', scrambleText: { text: target.textContent, chars, revealDelay: duration * 0.3 + index * 0.06, speed, tweenLength: false } }, 0);
    });
    return restore;
  };

  // SplitText: letters slam in one by one, then the split is reverted.
  const slamText = (heading, { stagger = 0.022, duration = 0.5 } = {}) => {
    if (!SplitText) return null;
    const split = SplitText.create(heading, { type: 'words,chars', aria: 'auto', charsClass: 'motion-char' });
    gsap.from(split.chars, {
      yPercent: -115, rotation: () => gsap.utils.random(-14, 14), opacity: 0,
      duration, ease: 'back.out(2.4)', stagger: { each: stagger }, onComplete: () => split.revert()
    });
    return () => split.revert();
  };

  // TextType: types and deletes a list of lines, pausing while it can't be seen.
  const typeLoop = (element, { lines, typeSpeed = 0.045, deleteSpeed = 0.022, hold = 2.8, visible = () => true } = {}) => {
    let index = 0;
    let tween = null;
    let stopped = false;
    const next = () => {
      if (stopped) return;
      if (!visible()) { tween = gsap.delayedCall(1, next); return; }
      const from = element.textContent;
      index = (index + 1) % lines.length;
      const to = lines[index];
      const state = { n: from.length };
      tween = gsap.timeline({ delay: hold, onComplete: next })
        .to(state, { n: 0, duration: from.length * deleteSpeed, ease: 'none', onUpdate: () => { element.textContent = from.slice(0, Math.round(state.n)); } })
        .to(state, { n: to.length, duration: to.length * typeSpeed, ease: 'none', delay: 0.25, onUpdate: () => { element.textContent = to.slice(0, Math.round(state.n)); } });
    };
    next();
    return () => { stopped = true; if (tween) tween.kill(); element.textContent = lines[0]; };
  };

  // CountUp: a number climbs from its old value to its new one inside a longer string.
  // The animated digits are aria-hidden; the live region only ever holds the final text.
  const countUp = (element, { from, to, duration = 0.7 } = {}) => {
    const finalText = element.textContent;
    const money = currency(to);
    const at = finalText.indexOf(money);
    if (at < 0) return null;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const number = document.createElement('b');
    number.className = 'motion-count';
    number.textContent = currency(from);
    visual.append(finalText.slice(0, at), number, finalText.slice(at + money.length));
    const quiet = document.createElement('span');
    quiet.className = 'visually-hidden';
    quiet.textContent = finalText;
    element.replaceChildren(visual, quiet);
    const state = { v: from };
    // Only put the final text back if our digits are still showing; if site.js has written a
    // newer value in the meantime, that value wins.
    const finish = () => { if (element.contains(visual)) element.textContent = finalText; };
    return gsap.to(state, { v: to, duration, ease: 'power3.out', onUpdate: () => { number.textContent = currency(state.v); }, onComplete: finish });
  };

  // Magnet: an element leans toward the pointer. Uses quickTo on unitless CSS variables so it
  // composes with any transform animation the element already has (CSS `translate`).
  const magnet = (element, { strength = 0.22, maxX = 8, maxY = 6 } = {}) => {
    element.classList.add('motion-magnet');
    const toX = gsap.quickTo(element, '--mx', { duration: 0.45, ease: 'power3.out' });
    const toY = gsap.quickTo(element, '--my', { duration: 0.45, ease: 'power3.out' });
    const move = event => {
      if (element.disabled || locked()) return;
      const rect = element.getBoundingClientRect();
      toX(gsap.utils.clamp(-maxX, maxX, (event.clientX - (rect.left + rect.width / 2)) * strength));
      toY(gsap.utils.clamp(-maxY, maxY, (event.clientY - (rect.top + rect.height / 2)) * strength * 1.4));
    };
    const leave = () => { toX(0); toY(0); };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      gsap.set(element, { '--mx': 0, '--my': 0 });
      element.classList.remove('motion-magnet');
    };
  };

  // SpotlightCard: a soft light follows the pointer across a card. Colour comes from the
  // active look's CSS variables (see motion.css), so it matches all four looks.
  const spotlight = host => {
    const added = getComputedStyle(host).position === 'static';
    if (added) host.classList.add('motion-spot-host');
    const spot = document.createElement('jx-spot');
    spot.className = 'motion-spotlight';
    spot.setAttribute('aria-hidden', 'true');
    host.prepend(spot);
    const move = event => {
      const rect = host.getBoundingClientRect();
      spot.style.setProperty('--sx', `${event.clientX - rect.left}px`);
      spot.style.setProperty('--sy', `${event.clientY - rect.top}px`);
      spot.classList.add('is-on');
    };
    const leave = () => spot.classList.remove('is-on');
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      spot.remove();
      if (added) host.classList.remove('motion-spot-host');
    };
  };

  // ClickSpark: a one-shot burst of confetti squares from an element.
  const sparkBurst = (target, { count = 28, colors = [cssVar('--pink', '#ff3d7f'), cssVar('--blue', '#2b48ff'), cssVar('--phosphor', '#111111'), cssVar('--paper', '#ffffff')] } = {}) => {
    const rect = target.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.className = 'motion-sparks';
    canvas.setAttribute('aria-hidden', 'true');
    const ratio = Math.min(2, devicePixelRatio || 1);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    document.body.append(canvas);
    const context = canvas.getContext('2d');
    context.scale(ratio, ratio);
    const origin = { x: rect.left + rect.width / 2, y: rect.top + Math.min(rect.height / 2, 120) };
    const bits = Array.from({ length: count }, (_, index) => ({
      angle: (Math.PI * 2 * index) / count + Math.random() * 0.2, speed: 220 + Math.random() * 260,
      size: 4 + Math.random() * 6, color: colors[index % colors.length]
    }));
    const state = { t: 0 };
    gsap.to(state, { t: 1, duration: 0.85, ease: 'power2.out', onUpdate: () => {
      context.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach(bit => {
        const distance = bit.speed * state.t;
        context.globalAlpha = 1 - state.t;
        context.fillStyle = bit.color;
        context.fillRect(origin.x + Math.cos(bit.angle) * distance, origin.y + Math.sin(bit.angle) * distance + 90 * state.t * state.t, bit.size, bit.size);
      });
    }, onComplete: () => canvas.remove() });
  };

  // LetterGlitch: a dim, slowly changing field of glyphs on a canvas. Pauses when hidden.
  const glyphField = (host, { opacity = 1, density = 0.02, interval = 90, focus = null, active = () => true } = {}) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'motion-glyphs';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const context = canvas.getContext('2d');
    const charWidth = 11;
    const charHeight = 20;
    let cells = [];
    let columns = 0;
    let running = false;
    let last = 0;
    let palette = [];
    const draw = (all = false) => {
      if (all) context.clearRect(0, 0, canvas.width, canvas.height);
      cells.forEach((cell, index) => {
        if (!all && !cell.dirty) return;
        const x = (index % columns) * charWidth;
        const y = Math.floor(index / columns) * charHeight;
        context.clearRect(x, y, charWidth, charHeight);
        context.fillStyle = cell.color;
        context.fillText(cell.char, x, y);
        cell.dirty = false;
      });
    };
    const pick = list => list[(Math.random() * list.length) | 0];
    const size = () => {
      palette = [cssVar('--glass-light', '#0c1b0d'), cssVar('--glass-light', '#0c1b0d'), cssVar('--dim', '#72a875'), cssVar('--phosphor-soft', '#91ce8d')];
      const ratio = Math.min(2, devicePixelRatio || 1);
      const rect = host.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (focus) {
        // Keep the glyphs clear of the text: centre the mask's clear area on the focus element.
        const spot = focus.getBoundingClientRect();
        canvas.style.setProperty('--glyph-x', `${((spot.left + spot.width / 2 - rect.left) / rect.width) * 100}%`);
        canvas.style.setProperty('--glyph-y', `${((spot.top + spot.height / 2 - rect.top) / rect.height) * 100}%`);
      }
      context.font = `15px ${cssVar('--mono', 'monospace')}`;
      context.textBaseline = 'top';
      columns = Math.ceil(rect.width / charWidth);
      const rows = Math.ceil(rect.height / charHeight);
      cells = Array.from({ length: columns * rows }, () => ({ char: pick(GLYPHS), color: pick(palette) }));
      draw(true);
    };
    const frame = time => {
      if (!running) return;
      if (time - last > interval) {
        last = time;
        const count = Math.max(1, Math.floor(cells.length * density));
        for (let step = 0; step < count; step += 1) {
          const cell = pick(cells);
          cell.char = pick(GLYPHS);
          cell.color = pick(palette);
          cell.dirty = true;
        }
        draw();
      }
      requestAnimationFrame(frame);
    };
    canvas.style.opacity = String(opacity);
    const sync = () => {
      const on = active();
      canvas.hidden = !on;
      if (on && !running) { running = true; size(); requestAnimationFrame(frame); }
      if (!on) running = false;
    };
    const resize = new ResizeObserver(() => { if (running) size(); });
    resize.observe(host);
    document.addEventListener('visibilitychange', sync);
    sync();
    return { sync, destroy: () => { running = false; resize.disconnect(); document.removeEventListener('visibilitychange', sync); canvas.remove(); } };
  };

  // =============================================================== Phase 2: text in the boot
  const headingSelector = '#hero-title, .section-head h2, .booking-intro h2, .about-grid h2';
  const headingsIn = item => [...(item.matches(headingSelector) ? [item] : []), ...item.querySelectorAll(headingSelector)];
  const headingFx = heading => {
    if (!animated()) return null;
    if (look() === 'terminal') return decryptText(heading, { duration: heading.id === 'hero-title' ? 1.1 : 0.7 });
    if (look() === 'poster') return slamText(heading);
    return null;
  };

  // Terminal home prompt: cycles through the site's real section commands.
  const prompt = document.querySelector('.prompt-line span:nth-child(2)');
  const promptLines = ['run start_project.exe', 'open portfolio.dir', 'run concept_lab.exe', 'run project_estimator.exe', 'run build_process.exe', 'run new_contract.exe'];

  // =============================================================== Phase 3: boot hooks + reveals
  // site.js runs each boot on a GSAP timeline (api.timeline) and asks which items to type in now.
  // Items still below the fold wait (motion-pending) and type in as they scroll into view.
  // Everything a boot creates lives in one gsap.context, so leaving the section reverts it.
  let bootCtx = null;
  let pending = [];
  let revealTick = null;
  let revealInk = null;
  const belowFold = element => {
    const rect = element.getBoundingClientRect();
    return rect.height > 0 && rect.top > innerHeight * 0.94;
  };
  const reveal = (item, index) => {
    if (!item.classList.contains('motion-pending')) return;
    item.classList.remove('motion-pending');
    item.classList.add('motion-reveal');
    pending = pending.filter(other => other !== item);
    if (revealTick) revealTick(index);
    const work = () => {
      const cleanups = headingsIn(item).map(heading => {
        if (look() === 'longread' && revealInk) { revealInk(heading); return null; }
        return headingFx(heading);
      });
      gsap.delayedCall(0.9, () => item.classList.remove('motion-reveal'));
      return () => cleanups.forEach(cleanup => cleanup && cleanup());
    };
    if (bootCtx) bootCtx.add(work); else work();
  };
  const revealBatch = items => {
    items.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .forEach((item, index) => gsap.delayedCall(index * 0.072, () => reveal(item, index)));
  };
  document.addEventListener('focusin', event => {
    const item = event.target.closest?.('.motion-pending');
    if (item) reveal(item, 0);
  });

  // How It Works: each step's top rule draws in turn, 01 to 04, so the line reads correctly in
  // the four-, two- and one-column layouts. On a long (phone) page it follows the scroll; when
  // the whole list is already on screen it draws as the steps boot.
  const processLine = (view, timeline, start) => {
    const list = view.querySelector('ol.steps');
    if (!list) return undefined;
    const steps = [...list.children];
    if (steps.length < 2) return undefined;
    list.classList.add('motion-line');
    const state = { p: 0 };
    const paint = () => {
      steps.forEach((step, index) => {
        const amount = gsap.utils.clamp(0, 1, state.p * steps.length - index);
        step.style.setProperty('--step-p', amount.toFixed(4));
        step.classList.toggle('motion-step-on', amount >= 0.6);
      });
    };
    paint();
    // Follow the scroll when there is enough page to scroll through; the line finishes either
    // when the list's end reaches 60% of the screen or at the bottom of the page, whichever is
    // first. Otherwise it simply draws as the steps boot.
    const range = () => {
      const rect = list.getBoundingClientRect();
      const start = Math.max(0, rect.top + scrollY - innerHeight * 0.75);
      const end = Math.min(rect.bottom + scrollY - innerHeight * 0.6, ScrollTrigger.maxScroll(window));
      return { start, end };
    };
    const initial = range();
    if (list.getBoundingClientRect().bottom > innerHeight && initial.end - initial.start > 160) {
      gsap.to(state, { p: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: list, start: () => range().start, end: () => range().end, scrub: 0.6, invalidateOnRefresh: true } });
    } else {
      const draw = gsap.to(state, { p: 1, duration: 1.6, ease: 'power1.inOut', onUpdate: paint, paused: true });
      timeline.call(() => draw.play(), null, start);
    }
    return () => {
      list.classList.remove('motion-line');
      steps.forEach(step => { step.style.removeProperty('--step-p'); step.classList.remove('motion-step-on'); });
    };
  };

  api.bootStart = ({ view, items, chrome = [], tick, timeline, ink = null }) => {
    if (!animated() || !timeline) return null;
    api.bootClear();
    revealTick = tick;
    revealInk = ink;
    const chromeSet = new Set(chrome);
    const live = [];
    const later = [];
    items.forEach(item => (!chromeSet.has(item) && belowFold(item) ? later : live).push(item));
    bootCtx = gsap.context(() => {
      live.forEach((item, index) => {
        headingsIn(item).forEach(heading => timeline.call(() => bootCtx?.add(() => headingFx(heading)), null, (170 + index * 72) / 1000));
      });
      if (later.length) {
        later.forEach(item => item.classList.add('motion-pending'));
        pending = later;
        ScrollTrigger.batch(later, { start: 'top 92%', once: true, onEnter: revealBatch });
      }
      if (view.id === 'process') {
        const first = live.findIndex(item => item.matches('ol.steps li') || item.querySelector('ol.steps'));
        return processLine(view, timeline, (170 + Math.max(0, first) * 72) / 1000);
      }
      return undefined;
    });
    return live;
  };

  api.bootClear = () => {
    if (bootCtx) { bootCtx.revert(); bootCtx = null; }
    pending.forEach(item => item.classList.remove('motion-pending', 'motion-reveal'));
    pending = [];
    return true;
  };

  api.viewShown = () => { requestAnimationFrame(() => ScrollTrigger.refresh()); return true; };

  // =============================================================== Phase 4: conversion moments
  let countTween = null;
  api.countEstimate = ({ total, deposit, from, to, rate }) => {
    if (countTween) { countTween.forEach(tween => tween.kill()); countTween = null; }
    if (!animated() || !to || from === to) return false;
    const tweens = [countUp(total, { from, to })];
    if (rate) tweens.push(countUp(deposit, { from: from * rate / 100, to: to * rate / 100 }));
    countTween = tweens.filter(Boolean);
    return countTween.length > 0;
  };

  // Portfolio records open and close smoothly instead of snapping.
  document.querySelectorAll('details.project > summary').forEach(summary => {
    summary.addEventListener('click', event => {
      const details = summary.parentElement;
      const content = details.querySelector('.case-content');
      if (!animated() || !content) return;
      event.preventDefault();
      gsap.killTweensOf(content);
      const refresh = () => ScrollTrigger.refresh();
      if (details.open) {
        gsap.to(content, { height: 0, opacity: 0, overflow: 'hidden', duration: 0.32, ease: 'power2.inOut', onComplete: () => {
          details.open = false;
          gsap.set(content, { clearProps: 'height,opacity,overflow' });
          refresh();
        } });
      } else {
        details.open = true;
        gsap.fromTo(content, { height: 0, opacity: 0, overflow: 'hidden' }, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'height,opacity,overflow', onComplete: refresh });
      }
    });
  });

  // Concept Lab: the card photo grows into the concept viewer and shrinks back (GSAP Flip.fit).
  const conceptFrame = document.getElementById('concept-frame');
  const conceptViewer = document.getElementById('concept-viewer');
  const flyImage = (src, fromRect, toElement, { fadeIn = null, landOn = null } = {}) => {
    if (!Flip || !src || !fromRect?.width) return;
    const ghost = document.createElement('img');
    ghost.src = src;
    ghost.alt = '';
    ghost.className = 'motion-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    Object.assign(ghost.style, { left: `${fromRect.left}px`, top: `${fromRect.top}px`, width: `${fromRect.width}px`, height: `${fromRect.height}px` });
    document.body.append(ghost);
    if (landOn) gsap.set(landOn, { opacity: 0 });
    const done = () => { ghost.remove(); if (landOn) gsap.set(landOn, { clearProps: 'opacity' }); };
    const tl = gsap.timeline({ onComplete: done });
    tl.add(Flip.fit(ghost, toElement, { duration: 0.6, ease: 'power3.inOut', absolute: true, scale: false }), 0);
    if (fadeIn) tl.from(fadeIn, { opacity: 0, duration: 0.35, clearProps: 'opacity' }, 0.3);
    tl.to(ghost, { opacity: 0, duration: 0.25, ease: 'power1.out' }, landOn ? 0.55 : 0.42);
  };
  document.querySelectorAll('[data-open-concept]').forEach(card => {
    card.addEventListener('click', () => {
      if (!animated() || !conceptFrame) return;
      const image = card.querySelector('img');
      const from = image?.getBoundingClientRect();
      const src = image?.currentSrc || image?.src;
      requestAnimationFrame(() => { if (!conceptViewer?.hidden) flyImage(src, from, conceptFrame, { fadeIn: conceptFrame }); });
    }, true);
  });
  document.getElementById('concept-back')?.addEventListener('click', () => {
    if (!animated() || !conceptFrame || !conceptViewer) return;
    const id = conceptViewer.dataset.activeConcept;
    const from = conceptFrame.getBoundingClientRect();
    requestAnimationFrame(() => {
      const image = document.querySelector(`[data-open-concept="${id}"] img`);
      const to = image?.getBoundingClientRect();
      // Only fly back when the card is fully on screen; otherwise the photo would leave the page.
      if (to && to.width && to.top >= 0 && to.bottom <= innerHeight) flyImage(image.currentSrc || image.src, from, image, { landOn: image });
    });
  }, true);

  // Success screen: a short beat that matches the look.
  const success = document.getElementById('form-success');
  if (success) {
    new MutationObserver(() => {
      if (success.hidden || !animated()) return;
      const title = document.getElementById('success-title');
      if (look() === 'terminal' && title) decryptText(title, { duration: 0.9 });
      else if (look() === 'poster') sparkBurst(success);
      else gsap.from([...success.children], { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', stagger: 0.08, clearProps: 'opacity,transform' });
    }).observe(success, { attributes: true, attributeFilter: ['hidden'] });
  }

  // =============================================================== Phase 5: login glyph field
  const login = document.getElementById('login-screen');
  const glass = document.querySelector('.login-glass');
  let glyphs = { sync: no, destroy: no };

  // =============================================================== Media-query driven setup
  // gsap.matchMedia re-runs this whenever reduced-motion or pointer type changes, and its
  // cleanup removes everything the previous run added.
  const mm = gsap.matchMedia();
  mm.add(QUERIES, context => {
    const { motion, fine } = context.conditions;
    if (!motion) {
      stopLenis();
      api.bootClear();
      return undefined;
    }
    startLenis();
    const cleanups = [];
    if (prompt) cleanups.push(typeLoop(prompt, {
      lines: promptLines,
      visible: () => look() === 'terminal' && !document.hidden && !locked() && document.getElementById('home')?.classList.contains('active') && prompt.offsetParent !== null
    }));
    if (glass && login) {
      glyphs = glyphField(glass, { opacity: 0.13, focus: glass.querySelector('.login-copy'), active: () => look() === 'terminal' && !login.hidden && !document.hidden });
      const watch = new MutationObserver(() => glyphs.sync());
      watch.observe(login, { attributes: true, attributeFilter: ['hidden'] });
      cleanups.push(() => { watch.disconnect(); glyphs.destroy(); glyphs = { sync: no, destroy: no }; });
    }
    if (fine) {
      // Directory links scramble briefly on hover (Terminal look).
      document.querySelectorAll('.directory a').forEach(link => {
        if (link.children.length) return;
        const text = link.textContent;
        const hadLabel = link.hasAttribute('aria-label');
        if (!hadLabel) link.setAttribute('aria-label', text.trim());
        const go = () => {
          if (look() !== 'terminal' || locked() || !ScrambleTextPlugin) return;
          gsap.to(link, { duration: 0.45, overwrite: true, scrambleText: { text, chars: GLYPHS, speed: 1, revealDelay: 0.08, tweenLength: false } });
        };
        link.addEventListener('pointerenter', go);
        cleanups.push(() => { link.removeEventListener('pointerenter', go); gsap.killTweensOf(link); link.textContent = text; if (!hadLabel) link.removeAttribute('aria-label'); });
      });
      document.querySelectorAll('.float-signal, #estimate-start, .concept-request, #booking-form button[type=submit], .concept-invite .terminal-button')
        .forEach(element => cleanups.push(magnet(element)));
      document.querySelectorAll('.concept-card, .estimate-option label, details.project > summary')
        .forEach(host => cleanups.push(spotlight(host)));
    }
    return () => { cleanups.forEach(cleanup => cleanup && cleanup()); stopLenis(); };
  });

  api.lookChanged = () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
    glyphs.sync();
    return true;
  };
})();
