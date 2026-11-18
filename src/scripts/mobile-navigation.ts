/** Responsive disclosure. CSS owns the motion; no animation dependency. */
function initMobileNavigation() {
  const header = document.querySelector<HTMLElement>('[data-navigation-header]');
  const trigger = header?.querySelector<HTMLButtonElement>('.mobile-toggle');
  const panel = header?.querySelector<HTMLElement>('#mobile-nav');
  const scrim = document.querySelector<HTMLElement>('.mobile-nav-scrim');
  if (!header || !trigger || !panel || !scrim) return;

  const mobile = matchMedia('(max-width: 1100px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const bottomBar = document.querySelector<HTMLElement>('.mobile-actions');
  let expanded = false;
  let hideTimer = 0;

  function fitToViewport() {
    if (!expanded) return;
    const viewport = window.visualViewport?.height ?? window.innerHeight;
    const bottom = bottomBar?.getBoundingClientRect().height ?? 0;
    const room = Math.floor(viewport - header!.getBoundingClientRect().bottom - bottom - 20);
    panel!.style.setProperty('--menu-room', `${Math.max(60, room)}px`);
  }

  function finishClose() {
    if (expanded) return;
    window.clearTimeout(hideTimer);
    panel!.hidden = true;
    scrim!.hidden = true;
    panel!.style.removeProperty('--menu-room');
  }

  function openMenu() {
    if (expanded || !mobile.matches) return;
    window.clearTimeout(hideTimer);
    expanded = true;
    const wasHidden = panel!.hidden;
    panel!.hidden = false;
    scrim!.hidden = false;
    panel!.inert = false;
    const root = document.documentElement;
    root.classList.toggle('mobile-menu-gutter', window.innerWidth > root.clientWidth);
    root.classList.add('mobile-menu-open');
    fitToViewport();
    // Commit the resting pose before the first reveal. Reopens during a close
    // instead transition from the current position, without a visual jump.
    if (wasHidden && !reducedMotion.matches) void panel!.offsetHeight;
    trigger!.setAttribute('aria-expanded', 'true');
    trigger!.setAttribute('aria-label', 'Close navigation');
    panel!.dataset.state = 'open';
    scrim!.dataset.state = 'open';
  }

  function closeMenu({ instant = false, returnFocus = false } = {}) {
    if (!expanded) {
      if (instant) finishClose();
      return;
    }
    expanded = false;
    const focusInPanel = panel!.contains(document.activeElement);
    trigger!.setAttribute('aria-expanded', 'false');
    trigger!.setAttribute('aria-label', 'Open navigation');
    if (returnFocus || focusInPanel) {
      const target = mobile.matches ? trigger : header!.querySelector<HTMLElement>('.brand');
      target?.focus({ preventScroll: true });
    }
    // Remove links from the tab order immediately, but let the surface exit
    // before setting hidden. The fallback also covers interrupted transitions.
    panel!.inert = true;
    panel!.dataset.state = 'closed';
    scrim!.dataset.state = 'closed';
    document.documentElement.classList.remove('mobile-menu-open', 'mobile-menu-gutter');
    window.clearTimeout(hideTimer);
    if (instant || reducedMotion.matches || !mobile.matches) finishClose();
    else hideTimer = window.setTimeout(finishClose, 180);
  }

  trigger.addEventListener('click', () => expanded ? closeMenu() : openMenu());
  panel.addEventListener('transitionend', event => {
    if (!expanded && event.target === panel && event.propertyName === 'transform') finishClose();
  });
  document.addEventListener('click', event => {
    if (!expanded || !(event.target instanceof Element)) return;
    if (event.target.closest('a') || !header.contains(event.target)) {
      closeMenu({ returnFocus: event.target === scrim });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      closeMenu({ returnFocus: true });
    }
  });
  // This is a disclosure: Tab and Shift+Tab may leave it, without a focus trap.
  document.addEventListener('focusin', event => {
    if (expanded && event.target instanceof Node && !header.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', fitToViewport, { passive: true });
  window.visualViewport?.addEventListener('resize', fitToViewport, { passive: true });
  mobile.addEventListener('change', event => { if (!event.matches) closeMenu({ instant: true }); });
  reducedMotion.addEventListener('change', event => { if (event.matches && !expanded) finishClose(); });
  window.addEventListener('pagehide', () => closeMenu({ instant: true }));
}

initMobileNavigation();
