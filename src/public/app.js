const form = document.getElementById('schedule-form');
const feedback = document.getElementById('form-feedback');
const targetTypeInput = document.getElementById('targetType');
const targetValueField = document.getElementById('targetValueField');
const targetValueLabel = document.getElementById('targetValueLabel');
const targetHint = document.getElementById('targetHint');
const groupTools = document.getElementById('groupTools');
const groupPicker = document.getElementById('groupPicker');
const groupFetchHint = document.getElementById('groupFetchHint');
const refreshGroupsBtn = document.getElementById('refreshGroupsBtn');
const personalChatTools = document.getElementById('personalChatTools');
const personalChatPicker = document.getElementById('personalChatPicker');
const personalChatFetchHint = document.getElementById('personalChatFetchHint');
const refreshPersonalChatsBtn = document.getElementById('refreshPersonalChatsBtn');
const waStatus = document.getElementById('wa-status');
const waConnectedWrap = document.getElementById('wa-connected-wrap');
const waConnectedName = document.getElementById('waConnectedName');
const waConnectedPhone = document.getElementById('waConnectedPhone');
const waConnectedJid = document.getElementById('waConnectedJid');
const accountProfileAvatar = document.getElementById('accountProfileAvatar');
const accountProfileName = document.getElementById('accountProfileName');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileStatus = document.getElementById('profileStatus');
const profileDetails = document.getElementById('profileDetails');
const profileEmptyState = document.getElementById('profileEmptyState');
const waQrWrap = document.getElementById('wa-qr-wrap');
const waQrEmpty = document.getElementById('wa-qr-empty');
const waQrCaption = document.getElementById('wa-qr-caption');
const waQrImage = waQrWrap ? waQrWrap.querySelector('img.qr') : null;
const methodTabQr = document.getElementById('methodTabQr');
const methodTabPhone = document.getElementById('methodTabPhone');
const qrMethodPanel = document.getElementById('qr-method');
const phoneMethodPanel = document.getElementById('phone-method');
const scheduleTabCreate = document.getElementById('scheduleTabCreate');
const scheduleTabList = document.getElementById('scheduleTabList');
const scheduleCreatePanel = document.getElementById('schedule-create-panel');
const scheduleListPanel = document.getElementById('schedule-list-panel');
const scheduleAddButtonRowBtn = document.getElementById('scheduleAddButtonRowBtn');
const scheduleButtonRows = document.getElementById('scheduleButtonRows');
const sendForm = document.getElementById('send-form');
const sendFeedback = document.getElementById('send-feedback');
const sendTargetTypeInput = document.getElementById('sendTargetType');
const sendTargetValueField = document.getElementById('sendTargetValueField');
const sendTargetValueLabel = document.getElementById('sendTargetValueLabel');
const sendTargetHint = document.getElementById('sendTargetHint');
const sendTargetValueInput = document.getElementById('sendTargetValue');
const sendMessageTextInput = document.getElementById('sendMessageText');
const sendMediaTypeInput = document.getElementById('sendMediaType');
const sendMediaSourceInput = document.getElementById('sendMediaSource');
const sendMediaUrlInput = document.getElementById('sendMediaUrl');
const sendMediaUploadInput = document.getElementById('sendMediaUpload');
const sendMediaUploadHint = document.getElementById('sendMediaUploadHint');
const sendFileNameInput = document.getElementById('sendFileName');
const sendMediaSourceField = document.getElementById('sendMediaSourceField');
const sendMediaUrlField = document.getElementById('sendMediaUrlField');
const sendMediaUploadField = document.getElementById('sendMediaUploadField');
const sendFileNameField = document.getElementById('sendFileNameField');
const sendAddButtonRowBtn = document.getElementById('sendAddButtonRowBtn');
const sendButtonRows = document.getElementById('sendButtonRows');
const sendGroupTools = document.getElementById('sendGroupTools');
const sendGroupPicker = document.getElementById('sendGroupPicker');
const sendGroupFetchHint = document.getElementById('sendGroupFetchHint');
const sendRefreshGroupsBtn = document.getElementById('sendRefreshGroupsBtn');
const sendPersonalChatTools = document.getElementById('sendPersonalChatTools');
const sendPersonalChatPicker = document.getElementById('sendPersonalChatPicker');
const sendPersonalChatFetchHint = document.getElementById('sendPersonalChatFetchHint');
const sendRefreshPersonalChatsBtn = document.getElementById('sendRefreshPersonalChatsBtn');
const inboxRefreshBtn = document.getElementById('inboxRefreshBtn');
const inboxFeedback = document.getElementById('inboxFeedback');
const inboxConversationList = document.getElementById('inboxConversationList');
const inboxThreadTitle = document.getElementById('inboxThreadTitle');
const inboxThreadSubtitle = document.getElementById('inboxThreadSubtitle');
const inboxMessageList = document.getElementById('inboxMessageList');
const contactsRefreshBtn = document.getElementById('contactsRefreshBtn');
const contactSearch = document.getElementById('contactSearch');
const contactsSearchClear = document.getElementById('contactsSearchClear');
const contactsCount = document.getElementById('contactsCount');
const contactsFeedback = document.getElementById('contactsFeedback');
const contactsList = document.getElementById('contactsList');
const contactsTabSynced = document.getElementById('contactsTabSynced');
const contactsTabSaved = document.getElementById('contactsTabSaved');
const contactsSyncedPanel = document.getElementById('contacts-synced-panel');
const contactsSavedPanel = document.getElementById('contacts-saved-panel');
const savedContactAddBtn = document.getElementById('savedContactAddBtn');
const savedContactSearch = document.getElementById('savedContactSearch');
const savedContactSearchClear = document.getElementById('savedContactSearchClear');
const savedContactsCount = document.getElementById('savedContactsCount');
const savedContactsFeedback = document.getElementById('savedContactsFeedback');
const savedContactsList = document.getElementById('savedContactsList');
const savedContactForm = document.getElementById('savedContactForm');
const savedContactFormFeedback = document.getElementById('savedContactFormFeedback');
const savedContactIdInput = document.getElementById('savedContactId');
const savedContactNameInput = document.getElementById('savedContactName');
const savedContactPhoneInput = document.getElementById('savedContactPhone');
const savedContactCategoryInput = document.getElementById('savedContactCategory');
const savedContactNoteInput = document.getElementById('savedContactNote');
const savedContactSaveBtn = document.getElementById('savedContactSaveBtn');
const savedContactCancelBtn = document.getElementById('savedContactCancelBtn');
const sendComplexMenuWrap = document.getElementById('sendComplexMenuWrap');
const sendComplexMenuTrigger = document.getElementById('sendComplexMenuTrigger');
const sendComplexMenuDropdown = document.getElementById('sendComplexMenuDropdown');
const sendMenuToggleGroupTools = document.getElementById('sendMenuToggleGroupTools');
const sendMenuToggleHints = document.getElementById('sendMenuToggleHints');
const sendMenuThemeRadios = Array.from(document.querySelectorAll('input[name="sendMenuTheme"]'));
const commandComplexMenuWrap = document.getElementById('commandComplexMenuWrap');
const commandComplexMenuTrigger = document.getElementById('commandComplexMenuTrigger');
const commandComplexMenuDropdown = document.getElementById('commandComplexMenuDropdown');
const commandMenuToggleGuide = document.getElementById('commandMenuToggleGuide');
const commandButtonGuideModal = document.getElementById('commandButtonGuideModal');
const closeCommandButtonGuideModalBtn = document.getElementById('closeCommandButtonGuideModal');
const commandTabCreate = document.getElementById('commandTabCreate');
const commandTabList = document.getElementById('commandTabList');
const commandCreatePanel = document.getElementById('command-create-panel');
const commandListPanel = document.getElementById('command-list-panel');
const pairingPhoneInput = document.getElementById('pairingPhone');
const requestPairingBtn = document.getElementById('requestPairingBtn');
const pairingFeedback = document.getElementById('pairing-feedback');
const pairingCodeWrap = document.getElementById('pairing-code-wrap');
const pairingCodeValue = document.getElementById('pairing-code-value');
const botPermissionMode = document.getElementById('botPermissionMode');
const botPermissionHint = document.getElementById('botPermissionHint');
const botPermissionFeedback = document.getElementById('botPermissionFeedback');
const accountTargetTips = document.getElementById('account-target-tips');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarMenuBtn = document.getElementById('sidebarMenuBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const dashboardThemeInputs = Array.from(document.querySelectorAll('input[name="dashboardTheme"]'));
const topNavTitle = document.getElementById('topNavTitle');
const breadcrumbRoot = document.getElementById('breadcrumbRoot');
const breadcrumbPage = document.getElementById('breadcrumbPage');
const breadcrumbSectionSep = document.getElementById('breadcrumbSectionSep');
const breadcrumbSection = document.getElementById('breadcrumbSection');
const navItems = Array.from(document.querySelectorAll('.sidebar-nav a.nav-item'));
const settingsSubitems = Array.from(document.querySelectorAll('.nav-subitem'));
const settingsNavParent = document.querySelector('.nav-item-parent');
const settingsNavToggle = document.getElementById('settingsNavToggle');
const settingsNavSubmenu = document.getElementById('settingsNavSubmenu');
const pages = Array.from(document.querySelectorAll('.page[data-page]'));
const DEFAULT_PAGE_HASH = '#account';
const THEME_STORAGE_KEY = 'schedulebot-theme';
const schedulesById = new Map(
  (Array.isArray(window.__SCHEDULES__) ? window.__SCHEDULES__ : []).map((item) => [
    String(item.id),
    item,
  ])
);
const deletedMessageRecords = Array.isArray(window.__DELETED_MESSAGES__)
  ? window.__DELETED_MESSAGES__
  : [];

let hasLoadedGroups = false;
let hasLoadedPersonalChats = false;
let hasLoadedSendGroups = false;
let hasLoadedSendPersonalChats = false;
let hasLoadedInbox = false;
let hasLoadedContacts = false;
let isLoadingContacts = false;
let activeInboxChatId = '';
let inboxConversations = [];
let contacts = [];
let isWhatsAppReady = false;
let savedContacts = Array.isArray(window.__SAVED_CONTACTS__) ? window.__SAVED_CONTACTS__ : [];

const BOT_PERMISSION_HINTS = {
  everyone: 'All personal chats and groups can trigger automatic replies.',
  admins: 'Personal chats still receive replies; only group admins can trigger them.',
  owner: 'Only the WhatsApp account owner can trigger automatic replies.',
  off: 'Automatic replies are disabled for all chats.',
};

function updateBotPermissionHint(mode) {
  if (botPermissionHint) {
    botPermissionHint.textContent = BOT_PERMISSION_HINTS[mode] || BOT_PERMISSION_HINTS.everyone;
  }
}

if (botPermissionMode) {
  updateBotPermissionHint(botPermissionMode.value);
  botPermissionMode.addEventListener('change', async () => {
    const nextMode = botPermissionMode.value;
    botPermissionMode.disabled = true;
    updateBotPermissionHint(nextMode);
    if (botPermissionFeedback) {
      botPermissionFeedback.textContent = 'Saving permission...';
      botPermissionFeedback.style.color = '#5d645d';
    }

    try {
      const response = await fetch('/api/bot-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: nextMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save permission');
      botPermissionMode.value = data.mode;
      updateBotPermissionHint(data.mode);
      if (botPermissionFeedback) {
        botPermissionFeedback.textContent = 'Permission saved';
        botPermissionFeedback.style.color = '#136f63';
      }
    } catch (error) {
      if (botPermissionFeedback) {
        botPermissionFeedback.textContent = error.message;
        botPermissionFeedback.style.color = '#b42318';
      }
    } finally {
      botPermissionMode.disabled = false;
    }
  });
}

const PAGE_TITLE_MAP = {
  account: 'Account',
  profile: 'Profile',
  schedule: 'Schedule',
  'send-message': 'Send Message',
  inbox: 'Inbox',
  contacts: 'Contacts',
  'custom-commands': 'Custom Command',
  reminders: 'Reminders',
  'deleted-messages': 'Deleted Messages',
  settings: 'Settings',
};

function getActivePageKey() {
  const activePage = pages.find((page) => !page.hidden);
  return activePage ? String(activePage.getAttribute('data-page') || '') : '';
}

function getActiveAccountSectionLabel() {
  if (!methodTabQr || !methodTabPhone) return '';
  return methodTabPhone.classList.contains('active') ? 'Phone Number' : 'QR Code';
}

function getActiveScheduleSectionLabel() {
  if (!scheduleTabCreate || !scheduleTabList) return '';
  return scheduleTabList.classList.contains('active') ? 'Schedule List' : 'Create Schedule';
}

function getActiveCommandSectionLabel() {
  if (!commandTabCreate || !commandTabList) return '';
  return commandTabList.classList.contains('active') ? 'Command List' : 'Add Command';
}

function getActiveContactsSectionLabel() {
  if (!contactsTabSynced || !contactsTabSaved) return '';
  return contactsTabSaved.classList.contains('active') ? 'Saved Contacts' : 'Synced Contacts';
}

function updateTopBreadcrumb() {
  const activePageKey = getActivePageKey();
  const pageTitle = PAGE_TITLE_MAP[activePageKey] || 'Dashboard';

  let sectionTitle = '';
  if (activePageKey === 'account') sectionTitle = getActiveAccountSectionLabel();
  if (activePageKey === 'schedule') sectionTitle = getActiveScheduleSectionLabel();
  if (activePageKey === 'custom-commands') sectionTitle = getActiveCommandSectionLabel();
  if (activePageKey === 'contacts') sectionTitle = getActiveContactsSectionLabel();

  if (topNavTitle) topNavTitle.textContent = pageTitle;
  if (breadcrumbRoot) breadcrumbRoot.textContent = 'Dashboard';
  if (breadcrumbPage) breadcrumbPage.textContent = pageTitle;
  if (breadcrumbSection) {
    breadcrumbSection.textContent = sectionTitle;
    breadcrumbSection.hidden = !sectionTitle;
  }
  if (breadcrumbSectionSep) {
    breadcrumbSectionSep.hidden = !sectionTitle;
  }
}

function formatConnectedPhone(value) {
  const digits = String(value || '').replace(/\D+/g, '');
  if (!digits) return '-';

  // Prefer an international-style display while keeping unknown formats readable.
  if (digits.startsWith('60')) {
    const rest = digits.slice(2);
    if (rest.length >= 9) {
      return `+60 ${rest.slice(0, 2)}-${rest.slice(2, 5)} ${rest.slice(5)}`;
    }
    return `+60 ${rest}`.trim();
  }

  return `+${digits}`;
}

function setButtonLoading(button, isLoading, loadingLabel) {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalContent) {
      button.dataset.originalContent = button.innerHTML;
    }
    if (loadingLabel) {
      button.dataset.loadingLabel = loadingLabel;
      button.setAttribute('aria-label', loadingLabel);
    }
    button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    return;
  }

  button.classList.remove('is-loading');
  if (button.dataset.originalContent) {
    button.innerHTML = button.dataset.originalContent;
    delete button.dataset.originalContent;
  }
  delete button.dataset.loadingLabel;
  button.removeAttribute('aria-label');
  button.removeAttribute('aria-busy');
  button.disabled = false;
}

function applyTheme(theme) {
  const normalized = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', normalized);
  dashboardThemeInputs.forEach((input) => {
    input.checked = input.value === normalized;
  });
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch (error) {
    /* ignore storage errors */
  }
}

function initTheme() {
  let storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    storedTheme = null;
  }
  applyTheme(storedTheme === 'light' ? 'light' : 'dark');
}

initTheme();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
    syncSendMenuThemeState();
  });
}

dashboardThemeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) applyTheme(input.value);
  });
});

function isSidebarDialogMode() {
  return window.matchMedia('(max-width: 920px)').matches;
}

function syncSidebarDialogState() {
  if (!sidebar) return;
  if (isSidebarDialogMode()) {
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    sidebar.setAttribute('aria-hidden', String(!sidebar.classList.contains('open')));
    return;
  }
  sidebar.removeAttribute('role');
  sidebar.removeAttribute('aria-modal');
  sidebar.removeAttribute('aria-hidden');
}

function openSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  syncSidebarDialogState();
  window.requestAnimationFrame(() => sidebarCloseBtn?.focus());
}

function closeSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  const wasOpen = sidebar.classList.contains('open');
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  syncSidebarDialogState();
  if (wasOpen) sidebarMenuBtn?.focus();
}

function setActiveNavItemByHash(hash) {
  if (!navItems.length) return;
  navItems.forEach((item) => {
    const href = item.getAttribute('href') || '';
    item.classList.toggle('active', href === hash);
  });
  if (settingsNavParent) {
    settingsNavParent.classList.toggle('active', hash === '#settings');
  }
  setSettingsSubmenuOpen(hash === '#settings');
}

function setSettingsSubmenuOpen(isOpen) {
  if (!settingsNavToggle || !settingsNavSubmenu) return;
  settingsNavToggle.classList.toggle('is-open', isOpen);
  settingsNavToggle.setAttribute('aria-expanded', String(isOpen));
  settingsNavSubmenu.classList.toggle('is-open', isOpen);
  settingsNavSubmenu.setAttribute('aria-hidden', String(!isOpen));
}

function focusSettingsSection(sectionKey) {
  if (!sectionKey) return;
  const section = document.getElementById(`settings-${sectionKey}`);
  if (!section) return;
  window.requestAnimationFrame(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

function showPageByHash(hash) {
  if (!pages.length) return;

  const normalizedHash = String(hash || '').replace('#', '') || DEFAULT_PAGE_HASH.replace('#', '');
  const targetPage = pages.find((page) => page.getAttribute('data-page') === normalizedHash);
  const fallbackPage = pages.find((page) => page.getAttribute('data-page') === DEFAULT_PAGE_HASH.replace('#', ''));
  const pageToShow = targetPage || fallbackPage || pages[0];

  pages.forEach((page) => {
    page.hidden = page !== pageToShow;
    if (page !== pageToShow) {
      page.classList.remove('page-animate');
    }
  });

  pageToShow.classList.remove('page-animate');
  window.requestAnimationFrame(() => {
    pageToShow.classList.add('page-animate');
  });

  setActiveNavItemByHash(`#${pageToShow.getAttribute('data-page')}`);
  updateTopBreadcrumb();

  const pageKey = String(pageToShow.getAttribute('data-page') || '').trim();
  if (pageKey === 'inbox') {
    loadInboxConversations();
  }
  if (pageKey === 'contacts') {
    loadContacts();
  }
}

settingsSubitems.forEach((item) => {
  item.addEventListener('click', () => {
    closeSidebar();
    const sectionKey = item.dataset.settingsSection;
    if (window.location.hash !== '#settings') {
      window.location.hash = '#settings';
      window.requestAnimationFrame(() => focusSettingsSection(sectionKey));
      return;
    }
    focusSettingsSection(sectionKey);
  });
});

if (settingsNavToggle) {
  settingsNavToggle.addEventListener('click', () => {
    const isOpen = settingsNavToggle.getAttribute('aria-expanded') === 'true';
    setSettingsSubmenuOpen(!isOpen);
  });
}

function escapeContactHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function renderContacts() {
  if (!contactsList) return;
  const search = String(contactSearch?.value || '').trim().toLowerCase();
  if (contactsSearchClear) contactsSearchClear.hidden = !search;
  const filteredContacts = contacts.filter((contact) => {
    const searchable = `${contact.name || ''} ${contact.phone || ''} ${contact.id || ''}`.toLowerCase();
    return searchable.includes(search);
  });

  if (!filteredContacts.length) {
    contactsList.innerHTML = `<p class="muted">${search ? 'No contacts match your search.' : 'No personal chats found on this account.'}</p>`;
    if (contactsCount) contactsCount.textContent = search ? '0 shown' : '0 contacts';
    if (contactsFeedback && hasLoadedContacts) {
      contactsFeedback.textContent = search ? `No matches for “${contactSearch.value.trim()}”` : '0 contacts found';
    }
    return;
  }

  if (contactsCount) {
    contactsCount.textContent = search && filteredContacts.length !== contacts.length
      ? `${filteredContacts.length} shown`
      : `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`;
  }

  if (contactsFeedback && hasLoadedContacts) {
    contactsFeedback.textContent = search
      ? `${filteredContacts.length} of ${contacts.length} contact${contacts.length === 1 ? '' : 's'} shown`
      : `${contacts.length} contact${contacts.length === 1 ? '' : 's'} found`;
  }

  contactsList.innerHTML = filteredContacts.map((contact) => {
    const name = String(contact.name || contact.phone || 'Unnamed contact');
    const phone = String(contact.phone || 'Phone number unavailable');
    const id = String(contact.id || '');
    const initial = name.trim().charAt(0).toUpperCase() || '?';
    return `
      <article class="contact-item">
        <div class="contact-avatar" aria-hidden="true">${escapeContactHtml(initial)}</div>
        <div class="contact-main">
          <p class="contact-name">${escapeContactHtml(name)}</p>
          <p class="contact-phone">${escapeContactHtml(phone)}</p>
          <p class="contact-id">${escapeContactHtml(id)}</p>
        </div>
        <div class="contact-actions">
          <button type="button" class="btn btn-outline btn-sm" data-contact-send="${escapeContactHtml(id)}">Send message</button>
          <button type="button" class="contact-copy-btn" data-contact-copy="${escapeContactHtml(id)}" aria-label="Copy chat ID" title="Copy chat ID">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </article>`;
  }).join('');
}

async function loadContacts(force = false) {
  if (!contactsList || isLoadingContacts || (hasLoadedContacts && !force)) return;
  isLoadingContacts = true;
  if (contactsRefreshBtn) setButtonLoading(contactsRefreshBtn, true, 'Refreshing contacts');
  if (contactSearch) contactSearch.disabled = true;
  if (contactsFeedback) contactsFeedback.textContent = 'Loading contacts...';

  try {
    const response = await fetch('/api/whatsapp/personal-chats');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to load contacts');
    contacts = Array.isArray(data.chats) ? data.chats : [];
    hasLoadedContacts = true;
    renderContacts();
  } catch (error) {
    contacts = [];
    if (contactsList) contactsList.innerHTML = '<p class="muted">Contacts are unavailable right now.</p>';
    if (contactsFeedback) contactsFeedback.textContent = error.message;
  } finally {
    isLoadingContacts = false;
    if (contactsRefreshBtn) {
      setButtonLoading(contactsRefreshBtn, false);
      contactsRefreshBtn.disabled = false;
    }
    if (contactSearch) contactSearch.disabled = false;
  }
}

/* ---------- Saved Contacts ---------- */

function getInitialsFromContactName(name) {
  const clean = String(name || '').trim();
  if (!clean) return '?';
  const parts = clean.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0].toUpperCase());
  return initials.join('') || '?';
}

function resetSavedContactForm() {
  if (savedContactIdInput) savedContactIdInput.value = '';
  if (savedContactNameInput) savedContactNameInput.value = '';
  if (savedContactPhoneInput) savedContactPhoneInput.value = '';
  if (savedContactCategoryInput) savedContactCategoryInput.value = savedContactCategoryInput.options[0]?.value || '';
  if (savedContactNoteInput) savedContactNoteInput.value = '';
  if (savedContactFormFeedback) savedContactFormFeedback.textContent = '';
  if (savedContactSaveBtn) savedContactSaveBtn.textContent = 'Save Contact';
}

function openSavedContactForm(contact) {
  if (!savedContactForm) return;
  resetSavedContactForm();

  if (contact) {
    if (savedContactIdInput) savedContactIdInput.value = contact.id;
    if (savedContactNameInput) savedContactNameInput.value = contact.name || '';
    if (savedContactPhoneInput) savedContactPhoneInput.value = contact.phone || '';
    if (savedContactCategoryInput) savedContactCategoryInput.value = contact.category || '';
    if (savedContactNoteInput) savedContactNoteInput.value = contact.note || '';
    if (savedContactSaveBtn) savedContactSaveBtn.textContent = 'Update Contact';
  }

  savedContactForm.hidden = false;
  if (savedContactNameInput) savedContactNameInput.focus();
}

function closeSavedContactForm() {
  if (!savedContactForm) return;
  savedContactForm.hidden = true;
  resetSavedContactForm();
}

function renderSavedContacts() {
  if (!savedContactsList) return;

  const search = String(savedContactSearch?.value || '').trim().toLowerCase();
  if (savedContactSearchClear) savedContactSearchClear.hidden = !search;

  const filtered = savedContacts.filter((contact) => {
    const searchable = `${contact.name || ''} ${contact.phone || ''} ${contact.category || ''} ${contact.note || ''}`.toLowerCase();
    return searchable.includes(search);
  });

  if (savedContactsCount) {
    savedContactsCount.textContent = search && filtered.length !== savedContacts.length
      ? `${filtered.length} shown`
      : `${savedContacts.length} contact${savedContacts.length === 1 ? '' : 's'}`;
  }

  if (!filtered.length) {
    savedContactsList.innerHTML = `<p class="muted">${search ? 'No contacts match your search.' : 'No saved contacts yet. Click Add Contact to create one.'}</p>`;
    return;
  }

  savedContactsList.innerHTML = filtered.map((contact) => {
    const id = escapeContactHtml(contact.id);
    const name = escapeContactHtml(contact.name);
    const phone = escapeContactHtml(contact.phone);
    const category = escapeContactHtml(contact.category);
    const note = escapeContactHtml(contact.note || 'No note');

    return `
      <article class="contact-item" data-contact-id="${id}">
        <div class="contact-avatar">${escapeContactHtml(getInitialsFromContactName(contact.name))}</div>
        <div class="contact-main">
          <p class="contact-name">${name}</p>
          <p class="contact-phone">${phone} &middot; ${category}</p>
          <p class="contact-id">${note}</p>
        </div>
        <div class="contact-actions">
          <button type="button" class="btn btn-outline btn-sm btn-saved-contact-edit" data-id="${id}">Edit</button>
          <button type="button" class="btn btn-ghost btn-sm btn-saved-contact-delete" data-id="${id}">Delete</button>
        </div>
      </article>`;
  }).join('');
}

if (savedContactAddBtn) {
  savedContactAddBtn.addEventListener('click', () => {
    if (savedContactForm && !savedContactForm.hidden && !savedContactIdInput?.value) {
      closeSavedContactForm();
      return;
    }
    openSavedContactForm(null);
  });
}

if (savedContactCancelBtn) {
  savedContactCancelBtn.addEventListener('click', closeSavedContactForm);
}

if (savedContactSaveBtn) {
  savedContactSaveBtn.addEventListener('click', async () => {
    const payload = {
      name: String(savedContactNameInput?.value || '').trim(),
      phone: String(savedContactPhoneInput?.value || '').trim(),
      category: String(savedContactCategoryInput?.value || '').trim(),
      note: String(savedContactNoteInput?.value || '').trim(),
    };

    if (!payload.name || !payload.phone) {
      if (savedContactFormFeedback) savedContactFormFeedback.textContent = 'Name and phone number are required.';
      return;
    }

    const editingId = String(savedContactIdInput?.value || '').trim();
    setButtonLoading(savedContactSaveBtn, true, 'Saving contact');
    if (savedContactFormFeedback) savedContactFormFeedback.textContent = '';

    try {
      const response = await fetch(editingId ? `/api/contacts/${encodeURIComponent(editingId)}` : '/api/contacts', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save contact');

      if (editingId) {
        savedContacts = savedContacts.map((item) => (item.id === data.id ? data : item));
      } else {
        savedContacts = [...savedContacts, data];
      }

      renderSavedContacts();
      closeSavedContactForm();
    } catch (error) {
      if (savedContactFormFeedback) savedContactFormFeedback.textContent = error.message;
    } finally {
      setButtonLoading(savedContactSaveBtn, false);
    }
  });
}

if (savedContactSearch) {
  savedContactSearch.addEventListener('input', renderSavedContacts);
}

if (savedContactSearchClear) {
  savedContactSearchClear.addEventListener('click', () => {
    if (!savedContactSearch) return;
    savedContactSearch.value = '';
    savedContactSearch.focus();
    renderSavedContacts();
  });
}

if (savedContactsList) {
  savedContactsList.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('.btn-saved-contact-edit');
    if (editBtn) {
      const contact = savedContacts.find((item) => item.id === editBtn.dataset.id);
      if (contact) openSavedContactForm(contact);
      return;
    }

    const deleteBtn = event.target.closest('.btn-saved-contact-delete');
    if (deleteBtn) {
      const id = String(deleteBtn.dataset.id || '').trim();
      if (!id) return;

      const contact = savedContacts.find((item) => item.id === id);
      const confirmDelete = window.confirm(`Delete contact ${contact?.name || ''}?`);
      if (!confirmDelete) return;

      setButtonLoading(deleteBtn, true, 'Deleting contact');
      try {
        const response = await fetch(`/api/contacts/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!response.ok && response.status !== 204) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete contact');
        }
        savedContacts = savedContacts.filter((item) => item.id !== id);
        renderSavedContacts();
      } catch (error) {
        if (savedContactsFeedback) savedContactsFeedback.textContent = error.message;
        setButtonLoading(deleteBtn, false);
      }
    }
  });
}

renderSavedContacts();

if (contactsTabSynced) {
  contactsTabSynced.addEventListener('click', () => {
    setTabbedPanel(
      'create',
      { create: contactsTabSynced, list: contactsTabSaved },
      { create: contactsSyncedPanel, list: contactsSavedPanel }
    );
  });
}

if (contactsTabSaved) {
  contactsTabSaved.addEventListener('click', () => {
    setTabbedPanel(
      'list',
      { create: contactsTabSynced, list: contactsTabSaved },
      { create: contactsSyncedPanel, list: contactsSavedPanel }
    );
  });
}

setTabbedPanel(
  'create',
  { create: contactsTabSynced, list: contactsTabSaved },
  { create: contactsSyncedPanel, list: contactsSavedPanel }
);

function formatLocalDateTime(isoString) {
  const parsed = new Date(String(isoString || ''));
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(parsed);
}

function hydrateScheduleTimesToLocal() {
  document.querySelectorAll('.js-local-datetime').forEach((cell) => {
    const iso = cell.getAttribute('data-iso');
    const localText = formatLocalDateTime(iso);
    if (!localText) return;

    cell.textContent = localText;
    cell.title = String(iso || '');
  });
}

function renderProfileAvatar(element, initial, imageUrl) {
  if (!element) return;
  element.textContent = '';

  if (imageUrl) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      element.textContent = initial;
    }, { once: true });
    element.appendChild(image);
    return;
  }

  element.textContent = initial;
}

function renderWhatsAppState(state) {
  if (!state || !waStatus) return;

  const isReady = Boolean(state.ready);
  isWhatsAppReady = isReady;
  document.body.classList.toggle('wa-ready', isReady);
  const statusText = String(state.status || (isReady ? 'WhatsApp connected' : 'Initializing...'));
  const qrCodeDataUrl = typeof state.qrCodeDataUrl === 'string' ? state.qrCodeDataUrl : '';
  const connectedAccount = state.connectedAccount && typeof state.connectedAccount === 'object'
    ? state.connectedAccount
    : {};
  const connectedNameText = String(connectedAccount.displayName || '').trim() || '-';
  const connectedPhoneText = formatConnectedPhone(connectedAccount.phoneNumber);
  const connectedJidText = String(connectedAccount.jid || '').trim() || '-';
  const profilePictureUrl = String(connectedAccount.profilePictureUrl || '').trim();

  waStatus.textContent = statusText;
  waStatus.classList.remove('status-ok', 'status-warn');
  waStatus.classList.add(isReady ? 'status-ok' : 'status-warn');

  if (waConnectedWrap) {
    waConnectedWrap.hidden = !isReady;
  }

  if (waConnectedName) {
    waConnectedName.textContent = connectedNameText;
  }
  if (waConnectedPhone) {
    waConnectedPhone.textContent = connectedPhoneText;
  }
  if (waConnectedJid) {
    waConnectedJid.textContent = connectedJidText;
  }

  const avatarInitial = connectedNameText !== '-' ? connectedNameText.trim().charAt(0).toUpperCase() : '?';
  if (accountProfileAvatar) {
    renderProfileAvatar(accountProfileAvatar, avatarInitial, isReady ? profilePictureUrl : '');
  }
  if (accountProfileName) {
    accountProfileName.textContent = isReady ? connectedNameText : 'Not connected';
  }
  if (profileAvatar) {
    renderProfileAvatar(profileAvatar, avatarInitial, isReady ? profilePictureUrl : '');
  }
  if (profileName) {
    profileName.textContent = isReady ? connectedNameText : 'Not connected';
  }
  if (profileStatus) {
    profileStatus.classList.remove('is-ready', 'is-waiting');
    profileStatus.classList.add(isReady ? 'is-ready' : 'is-waiting');
    profileStatus.lastChild.textContent = isReady ? 'Connected' : 'Not connected';
  }
  if (profileDetails) {
    profileDetails.hidden = !isReady;
  }
  if (profileEmptyState) {
    profileEmptyState.hidden = isReady;
  }

  if (methodTabPhone) {
    methodTabPhone.disabled = isReady;
  }

  if (pairingPhoneInput) {
    pairingPhoneInput.disabled = isReady;
  }

  if (requestPairingBtn) {
    requestPairingBtn.disabled = isReady;
  }

  if (pairingFeedback && isReady) {
    pairingFeedback.textContent = 'Pairing via phone number is disabled while WhatsApp is connected.';
    pairingFeedback.style.color = '#5d645d';
  }

  if (accountTargetTips) {
    accountTargetTips.hidden = isReady;
  }

  if (waQrWrap && waQrImage && waQrEmpty) {
    if (isReady) {
      waQrImage.removeAttribute('src');
      waQrWrap.hidden = true;
      waQrEmpty.hidden = true;
      if (waQrCaption) {
        waQrCaption.textContent = '';
      }
    } else if (qrCodeDataUrl) {
      waQrImage.src = qrCodeDataUrl;
      waQrWrap.hidden = false;
      waQrEmpty.hidden = true;
      if (waQrCaption) {
        waQrCaption.textContent = 'Scan this QR code from WhatsApp to connect the bot.';
      }
    } else {
      waQrImage.removeAttribute('src');
      waQrWrap.hidden = true;
      waQrEmpty.hidden = false;
      if (waQrCaption) {
        waQrCaption.textContent = '';
      }
    }
  }

  const pairingCode = typeof state.pairingCode === 'string' ? state.pairingCode : '';
  if (pairingCodeWrap && pairingCodeValue) {
    if (pairingCode) {
      pairingCodeValue.textContent = pairingCode;
      pairingCodeWrap.hidden = false;
    } else {
      pairingCodeValue.textContent = '';
      pairingCodeWrap.hidden = true;
    }
  }

  if (isReady) {
    setActiveConnectionMethod('qr');
  }
}

function setActiveConnectionMethod(method) {
  if (!methodTabQr || !methodTabPhone || !qrMethodPanel || !phoneMethodPanel) return;

  const isPhone = method === 'phone';
  methodTabQr.classList.toggle('active', !isPhone);
  methodTabPhone.classList.toggle('active', isPhone);
  qrMethodPanel.hidden = isPhone;
  phoneMethodPanel.hidden = !isPhone;
  updateTopBreadcrumb();
}

function setTabbedPanel(activeTabKey, tabs, panels) {
  const hasCreateTab = Boolean(tabs.create);
  const hasListTab = Boolean(tabs.list);
  const hasCreatePanel = Boolean(panels.create);
  const hasListPanel = Boolean(panels.list);

  if (!hasCreateTab || !hasListTab || !hasCreatePanel || !hasListPanel) return;

  const isList = activeTabKey === 'list';
  tabs.create.classList.toggle('active', !isList);
  tabs.list.classList.toggle('active', isList);
  tabs.create.setAttribute('aria-selected', String(!isList));
  tabs.list.setAttribute('aria-selected', String(isList));

  panels.create.hidden = isList;
  panels.list.hidden = !isList;
  updateTopBreadcrumb();
}

if (methodTabQr) {
  methodTabQr.addEventListener('click', () => setActiveConnectionMethod('qr'));
}

if (methodTabPhone) {
  methodTabPhone.addEventListener('click', () => {
    if (isWhatsAppReady) return;
    setActiveConnectionMethod('phone');
  });
}

if (scheduleTabCreate) {
  scheduleTabCreate.addEventListener('click', () => {
    setTabbedPanel(
      'create',
      { create: scheduleTabCreate, list: scheduleTabList },
      { create: scheduleCreatePanel, list: scheduleListPanel }
    );
  });
}

if (scheduleTabList) {
  scheduleTabList.addEventListener('click', () => {
    setTabbedPanel(
      'list',
      { create: scheduleTabCreate, list: scheduleTabList },
      { create: scheduleCreatePanel, list: scheduleListPanel }
    );
  });
}

if (commandTabCreate) {
  commandTabCreate.addEventListener('click', () => {
    setTabbedPanel(
      'create',
      { create: commandTabCreate, list: commandTabList },
      { create: commandCreatePanel, list: commandListPanel }
    );
  });
}

if (commandTabList) {
  commandTabList.addEventListener('click', () => {
    setTabbedPanel(
      'list',
      { create: commandTabCreate, list: commandTabList },
      { create: commandCreatePanel, list: commandListPanel }
    );
  });
}

setTabbedPanel(
  'create',
  { create: scheduleTabCreate, list: scheduleTabList },
  { create: scheduleCreatePanel, list: scheduleListPanel }
);
setTabbedPanel(
  'create',
  { create: commandTabCreate, list: commandTabList },
  { create: commandCreatePanel, list: commandListPanel }
);

if (pairingPhoneInput) {
  pairingPhoneInput.addEventListener('input', () => {
    const rawValue = String(pairingPhoneInput.value || '');
    const digitsOnly = rawValue.replace(/\D+/g, '');
    const normalized = rawValue.startsWith('+') ? `+${digitsOnly}` : digitsOnly;
    if (pairingPhoneInput.value !== normalized) {
      pairingPhoneInput.value = normalized;
    }
  });
}

if (requestPairingBtn) {
  requestPairingBtn.addEventListener('click', async () => {
    if (isWhatsAppReady) {
      if (pairingFeedback) {
        pairingFeedback.textContent = 'Pairing via phone number is disabled while WhatsApp is connected.';
        pairingFeedback.style.color = '#b42318';
      }
      return;
    }

    const phoneNumber = pairingPhoneInput
      ? (() => {
        const rawValue = String(pairingPhoneInput.value || '').trim();
        const digitsOnly = rawValue.replace(/\D+/g, '');
        return rawValue.startsWith('+') ? `+${digitsOnly}` : digitsOnly;
      })()
      : '';
    if (pairingPhoneInput) {
      pairingPhoneInput.value = phoneNumber;
    }
    if (!phoneNumber) {
      if (pairingFeedback) {
        pairingFeedback.textContent = 'Please enter a phone number';
        pairingFeedback.style.color = '#b42318';
      }
      return;
    }

    setButtonLoading(requestPairingBtn, true, 'Requesting pairing code');
    if (pairingFeedback) {
      pairingFeedback.textContent = 'Requesting pairing code...';
      pairingFeedback.style.color = '#5d645d';
    }
    if (pairingCodeWrap) pairingCodeWrap.hidden = true;

    try {
      const response = await fetch('/api/whatsapp/pairing-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request pairing code');
      }

      if (pairingCodeValue && pairingCodeWrap) {
        pairingCodeValue.textContent = data.code || '';
        pairingCodeWrap.hidden = false;
      }
      if (pairingFeedback) {
        pairingFeedback.textContent = 'Pairing code generated, enter it in WhatsApp.';
        pairingFeedback.style.color = '#136f63';
      }
    } catch (error) {
      if (pairingFeedback) {
        pairingFeedback.textContent = error.message;
        pairingFeedback.style.color = '#b42318';
      }
    } finally {
      setButtonLoading(requestPairingBtn, false);
      requestPairingBtn.disabled = isWhatsAppReady;
    }
  });
}

async function refreshWhatsAppState() {
  if (!waStatus) return;

  try {
    const response = await fetch('/api/whatsapp/state');
    if (!response.ok) {
      throw new Error('Failed to fetch WhatsApp state');
    }

    const state = await response.json();
    renderWhatsAppState(state);
  } catch (error) {
    waStatus.textContent = 'Unable to refresh WhatsApp status';
    waStatus.classList.remove('status-ok');
    waStatus.classList.add('status-warn');
  }
}

function setGroupHint(text, color = '#5d645d') {
  if (!groupFetchHint) return;
  groupFetchHint.textContent = text;
  groupFetchHint.style.color = color;
}

function setSendGroupHint(text, color = '#5d645d') {
  if (!sendGroupFetchHint) return;
  sendGroupFetchHint.textContent = text;
  sendGroupFetchHint.style.color = color;
}

function setGroupPickerOptions(groups) {
  if (!groupPicker) return;

  const baseOption = '<option value="">Select a group...</option>';
  const optionHtml = groups
    .map((group) => {
      const safeId = String(group.id || '').replace(/"/g, '&quot;');
      const safeName = String(group.name || 'Untitled');
      return `<option value="${safeId}">${safeName}</option>`;
    })
    .join('');

  groupPicker.innerHTML = baseOption + optionHtml;
}

function setSendGroupPickerOptions(groups) {
  if (!sendGroupPicker) return;

  const baseOption = '<option value="">Select a group...</option>';
  const optionHtml = groups
    .map((group) => {
      const safeId = String(group.id || '').replace(/"/g, '&quot;');
      const safeName = String(group.name || 'Untitled');
      return `<option value="${safeId}">${safeName}</option>`;
    })
    .join('');

  sendGroupPicker.innerHTML = baseOption + optionHtml;
}

function setPersonalChatHint(text, color = '#5d645d') {
  if (!personalChatFetchHint) return;
  personalChatFetchHint.textContent = text;
  personalChatFetchHint.style.color = color;
}

function setSendPersonalChatHint(text, color = '#5d645d') {
  if (!sendPersonalChatFetchHint) return;
  sendPersonalChatFetchHint.textContent = text;
  sendPersonalChatFetchHint.style.color = color;
}

function setPersonalChatPickerOptions(chats) {
  if (!personalChatPicker) return;

  const baseOption = '<option value="">Select a personal chat...</option>';
  const optionHtml = chats
    .map((chat) => {
      const safeId = String(chat.id || '').replace(/"/g, '&quot;');
      const safeName = String(chat.name || chat.phone || 'Unnamed');
      const safePhone = String(chat.phone || '').trim();
      const label = safePhone ? `${safeName} (${safePhone})` : safeName;
      return `<option value="${safeId}">${label}</option>`;
    })
    .join('');

  personalChatPicker.innerHTML = baseOption + optionHtml;
}

function setSendPersonalChatPickerOptions(chats) {
  if (!sendPersonalChatPicker) return;

  const baseOption = '<option value="">Select a personal chat...</option>';
  const optionHtml = chats
    .map((chat) => {
      const safeId = String(chat.id || '').replace(/"/g, '&quot;');
      const safeName = String(chat.name || chat.phone || 'Unnamed');
      const safePhone = String(chat.phone || '').trim();
      const label = safePhone ? `${safeName} (${safePhone})` : safeName;
      return `<option value="${safeId}">${label}</option>`;
    })
    .join('');

  sendPersonalChatPicker.innerHTML = baseOption + optionHtml;
}

async function loadPersonalChats(force = false) {
  if (!personalChatPicker) return;
  if (hasLoadedPersonalChats && !force) return;

  personalChatPicker.disabled = true;
  if (refreshPersonalChatsBtn) setButtonLoading(refreshPersonalChatsBtn, true, 'Refreshing chats');
  setPersonalChatHint('Fetching personal chat list...', '#5d645d');

  try {
    const response = await fetch('/api/whatsapp/personal-chats');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch personal chats');
    }

    const chats = Array.isArray(data.chats) ? data.chats : [];
    setPersonalChatPickerOptions(chats);
    hasLoadedPersonalChats = true;

    if (chats.length) {
      setPersonalChatHint('Select a chat to auto-fill the destination ID.', '#5d645d');
    } else {
      setPersonalChatHint('No personal chats found on this account.', '#9f4f03');
    }
  } catch (error) {
    setPersonalChatPickerOptions([]);
    setPersonalChatHint(error.message, '#b42318');
  } finally {
    personalChatPicker.disabled = false;
    if (refreshPersonalChatsBtn) {
      setButtonLoading(refreshPersonalChatsBtn, false);
      refreshPersonalChatsBtn.disabled = false;
    }
  }
}

async function loadSendPersonalChats(force = false) {
  if (!sendPersonalChatPicker) return;
  if (hasLoadedSendPersonalChats && !force) return;

  sendPersonalChatPicker.disabled = true;
  if (sendRefreshPersonalChatsBtn) {
    setButtonLoading(sendRefreshPersonalChatsBtn, true, 'Refreshing chats');
  }
  setSendPersonalChatHint('Fetching personal chat list...', '#5d645d');

  try {
    const response = await fetch('/api/whatsapp/personal-chats');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch personal chats');
    }

    const chats = Array.isArray(data.chats) ? data.chats : [];
    setSendPersonalChatPickerOptions(chats);
    hasLoadedSendPersonalChats = true;

    if (chats.length) {
      setSendPersonalChatHint('Select a chat to auto-fill the destination ID.', '#5d645d');
    } else {
      setSendPersonalChatHint('No personal chats found on this account.', '#9f4f03');
    }
  } catch (error) {
    setSendPersonalChatPickerOptions([]);
    setSendPersonalChatHint(error.message, '#b42318');
  } finally {
    sendPersonalChatPicker.disabled = false;
    if (sendRefreshPersonalChatsBtn) {
      setButtonLoading(sendRefreshPersonalChatsBtn, false);
      sendRefreshPersonalChatsBtn.disabled = false;
    }
  }
}

async function loadGroups(force = false) {
  if (!groupPicker) return;
  if (hasLoadedGroups && !force) return;

  groupPicker.disabled = true;
  if (refreshGroupsBtn) setButtonLoading(refreshGroupsBtn, true, 'Refreshing groups');
  setGroupHint('Fetching group list...', '#5d645d');

  try {
    const response = await fetch('/api/whatsapp/groups');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch group list');
    }

    const groups = Array.isArray(data.groups) ? data.groups : [];
    setGroupPickerOptions(groups);
    hasLoadedGroups = true;

    if (groups.length) {
      setGroupHint('Select a group to auto-fill the ID.', '#5d645d');
    } else {
      setGroupHint('No groups found on this account.', '#9f4f03');
    }
  } catch (error) {
    setGroupPickerOptions([]);
    setGroupHint(error.message, '#b42318');
  } finally {
    groupPicker.disabled = false;
    if (refreshGroupsBtn) {
      setButtonLoading(refreshGroupsBtn, false);
      refreshGroupsBtn.disabled = false;
    }
  }
}

async function loadSendGroups(force = false) {
  if (!sendGroupPicker) return;
  if (hasLoadedSendGroups && !force) return;

  sendGroupPicker.disabled = true;
  if (sendRefreshGroupsBtn) setButtonLoading(sendRefreshGroupsBtn, true, 'Refreshing groups');
  setSendGroupHint('Fetching group list...', '#5d645d');

  try {
    const response = await fetch('/api/whatsapp/groups');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch group list');
    }

    const groups = Array.isArray(data.groups) ? data.groups : [];
    setSendGroupPickerOptions(groups);
    hasLoadedSendGroups = true;

    if (groups.length) {
      setSendGroupHint('Select a group to auto-fill the ID.', '#5d645d');
    } else {
      setSendGroupHint('No groups found on this account.', '#9f4f03');
    }
  } catch (error) {
    setSendGroupPickerOptions([]);
    setSendGroupHint(error.message, '#b42318');
  } finally {
    sendGroupPicker.disabled = false;
    if (sendRefreshGroupsBtn) {
      setButtonLoading(sendRefreshGroupsBtn, false);
      sendRefreshGroupsBtn.disabled = false;
    }
  }
}

function syncTargetInputContent() {
  if (!targetTypeInput || !targetValueLabel || !targetHint || !targetValueField) return;

  if (targetTypeInput.value === 'group') {
    targetValueField.hidden = false;
    targetValueLabel.textContent = 'Group ID (example: 1203630xxxx@g.us)';
    targetHint.textContent = 'You can enter 1203630xxxx only or with @g.us suffix';
    if (groupTools) groupTools.hidden = false;
    if (personalChatTools) personalChatTools.hidden = true;
    loadGroups();
    return;
  }

  targetValueField.hidden = false;
  targetValueLabel.textContent = 'Personal ID / Number (example: 62812xxxx@s.whatsapp.net)';
  targetHint.textContent = 'You can enter phone number only or with @s.whatsapp.net suffix';
  if (groupTools) groupTools.hidden = true;
  if (personalChatTools) personalChatTools.hidden = false;
  loadPersonalChats();
}

function syncSendTargetInputContent() {
  if (!sendTargetTypeInput || !sendTargetValueLabel || !sendTargetHint || !sendTargetValueField) return;

  if (sendTargetTypeInput.value === 'group') {
    sendTargetValueField.hidden = false;
    sendTargetValueLabel.textContent = 'Group ID (example: 1203630xxxx@g.us)';
    sendTargetHint.textContent = 'You can enter 1203630xxxx only or with @g.us suffix';
    if (sendGroupTools) sendGroupTools.hidden = false;
    if (sendPersonalChatTools) sendPersonalChatTools.hidden = true;
    applySendMenuGroupToolsVisibility();
    applySendMenuHintVisibility();
    loadSendGroups();
    return;
  }

  sendTargetValueField.hidden = false;
  sendTargetValueLabel.textContent = 'Personal ID / Number (example: 62812xxxx@s.whatsapp.net)';
  sendTargetHint.textContent = 'You can enter phone number only or with @s.whatsapp.net suffix';
  if (sendGroupTools) sendGroupTools.hidden = true;
  if (sendPersonalChatTools) sendPersonalChatTools.hidden = false;
  applySendMenuHintVisibility();
  loadSendPersonalChats();
}

function updateSendMediaFormFlow() {
  const selectedType = String(sendMediaTypeInput?.value || 'none').trim();
  const mediaSource = String(sendMediaSourceInput?.value || 'url').trim();
  const hasMedia = selectedType && selectedType !== 'none';
  const isDocument = selectedType === 'document';
  const useUpload = hasMedia && mediaSource === 'upload';

  if (sendMediaSourceField) {
    sendMediaSourceField.hidden = !hasMedia;
  }

  if (sendMediaUrlField) {
    sendMediaUrlField.hidden = !hasMedia || useUpload;
  }
  if (sendMediaUrlInput) {
    sendMediaUrlInput.required = hasMedia && !useUpload;
    if (!hasMedia || useUpload) {
      sendMediaUrlInput.value = '';
    }
  }

  if (sendMediaUploadField) {
    sendMediaUploadField.hidden = !hasMedia || !useUpload;
  }
  if (sendMediaUploadInput) {
    sendMediaUploadInput.required = hasMedia && useUpload;
    if (!hasMedia || !useUpload) {
      sendMediaUploadInput.value = '';
    }
  }

  if (sendMediaUploadHint) {
    sendMediaUploadHint.textContent = useUpload
      ? 'Choose a file to upload and send.'
      : 'Choose URL source or upload source for media.';
  }

  if (sendFileNameField) {
    sendFileNameField.hidden = !hasMedia || !isDocument;
  }
  if (sendFileNameInput && (!hasMedia || !isDocument)) {
    sendFileNameInput.value = '';
  }
}

async function uploadSendMediaFile(file, mediaType) {
  const formData = new FormData();
  formData.set('mediaFile', file);
  formData.set('mediaType', mediaType);

  const response = await fetch('/api/messages/upload-media', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload media file');
  }

  return data;
}

function setInboxFeedback(message, color = '#5d645d') {
  if (!inboxFeedback) return;
  inboxFeedback.textContent = message;
  inboxFeedback.style.color = color;
}

function formatInboxTime(isoString) {
  const parsed = new Date(String(isoString || ''));
  if (Number.isNaN(parsed.getTime())) return '--:--';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed);
}

function createInboxMediaPreview(item) {
  const type = String(item?.type || '').trim().toLowerCase();
  const mediaUrl = String(item?.mediaUrl || '').trim();
  const fileName = String(item?.fileName || '').trim();
  if (!type || !mediaUrl) return null;

  const wrap = document.createElement('div');
  wrap.className = 'inbox-media-wrap';

  if (type === 'image') {
    const image = document.createElement('img');
    image.className = 'inbox-media-image';
    image.src = mediaUrl;
    image.alt = fileName || 'Inbox image';
    image.loading = 'lazy';
    wrap.appendChild(image);
    return wrap;
  }

  if (type === 'video') {
    const video = document.createElement('video');
    video.className = 'inbox-media-video';
    video.controls = true;
    video.preload = 'metadata';
    video.src = mediaUrl;
    wrap.appendChild(video);
    return wrap;
  }

  if (type === 'audio' || type === 'voice') {
    const audio = document.createElement('audio');
    audio.className = 'inbox-media-audio';
    audio.controls = true;
    audio.preload = 'metadata';
    audio.src = mediaUrl;
    wrap.appendChild(audio);
    return wrap;
  }

  if (type === 'document') {
    const link = document.createElement('a');
    link.className = 'inbox-media-link';
    link.href = mediaUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = fileName || 'Open file';
    wrap.appendChild(link);
    return wrap;
  }

  return null;
}

function renderInboxMessages(messages) {
  if (!inboxMessageList) return;

  const rows = Array.isArray(messages) ? messages : [];
  inboxMessageList.innerHTML = '';

  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No messages in this conversation yet.';
    inboxMessageList.appendChild(empty);
    return;
  }

  rows.forEach((item) => {
    const wrap = document.createElement('div');
    wrap.className = `inbox-message-wrap${item.fromMe ? ' is-me' : ''}`;

    const bubble = document.createElement('article');
    bubble.className = 'inbox-message-bubble';

    const type = document.createElement('p');
    type.className = 'inbox-message-type';
    type.textContent = item.fromMe
      ? `sent • ${String(item.type || 'text').toUpperCase()}`
      : `received • ${String(item.type || 'text').toUpperCase()}`;
    bubble.appendChild(type);

    const text = document.createElement('p');
    text.className = 'inbox-message-text';
    text.textContent = String(item.text || '').trim() || '[No text]';
    bubble.appendChild(text);

    const mediaPreview = createInboxMediaPreview(item);
    if (mediaPreview) {
      bubble.appendChild(mediaPreview);
    }

    const time = document.createElement('p');
    time.className = 'inbox-message-time';
    time.textContent = formatInboxTime(item.timestamp);
    bubble.appendChild(time);

    wrap.appendChild(bubble);
    inboxMessageList.appendChild(wrap);
  });

  inboxMessageList.scrollTop = inboxMessageList.scrollHeight;
}

async function loadInboxMessages(chatId) {
  const cleanChatId = String(chatId || '').trim();
  if (!cleanChatId) return;

  activeInboxChatId = cleanChatId;

  const activeConversation = inboxConversations.find((item) => item.chatId === cleanChatId) || null;
  if (inboxThreadTitle) {
    inboxThreadTitle.textContent = activeConversation?.name || cleanChatId;
  }
  if (inboxThreadSubtitle) {
    const subtitle = activeConversation
      ? `${activeConversation.chatType} • ${cleanChatId}`
      : cleanChatId;
    inboxThreadSubtitle.textContent = subtitle;
  }

  renderInboxMessages([]);
  setInboxFeedback('Loading messages...', '#5d645d');

  try {
    const response = await fetch(`/api/inbox/conversations/${encodeURIComponent(cleanChatId)}/messages?limit=150`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch messages');
    }

    renderInboxMessages(Array.isArray(data.messages) ? data.messages : []);
    setInboxFeedback('Messages loaded.', '#5d645d');
  } catch (error) {
    renderInboxMessages([]);
    setInboxFeedback(error.message, '#b42318');
  }
}

function renderInboxConversations(conversations) {
  if (!inboxConversationList) return;

  const rows = Array.isArray(conversations) ? conversations : [];
  inboxConversationList.innerHTML = '';

  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No conversations yet.';
    inboxConversationList.appendChild(empty);
    return;
  }

  rows.forEach((conversation) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `inbox-conversation-item${conversation.chatId === activeInboxChatId ? ' is-active' : ''}`;

    const head = document.createElement('div');
    head.className = 'inbox-conversation-head';

    const name = document.createElement('p');
    name.className = 'inbox-conversation-name';
    name.textContent = conversation.name || conversation.chatId;
    head.appendChild(name);

    const time = document.createElement('p');
    time.className = 'inbox-conversation-time';
    time.textContent = formatInboxTime(conversation.lastTimestamp);
    head.appendChild(time);

    const preview = document.createElement('p');
    preview.className = 'inbox-conversation-preview';
    const prefix = conversation.lastMessageFromMe ? 'You: ' : '';
    preview.textContent = `${prefix}${conversation.lastMessageText || '[No preview]'}`;

    item.appendChild(head);
    item.appendChild(preview);
    item.addEventListener('click', () => {
      activeInboxChatId = conversation.chatId;
      renderInboxConversations(inboxConversations);
      loadInboxMessages(conversation.chatId);
    });

    inboxConversationList.appendChild(item);
  });
}

async function loadInboxConversations(force = false) {
  if (!inboxConversationList) return;
  if (hasLoadedInbox && !force) return;

  setInboxFeedback('Loading conversations...', '#5d645d');
  if (inboxRefreshBtn) {
    setButtonLoading(inboxRefreshBtn, true, 'Refreshing inbox');
  }

  try {
    const response = await fetch('/api/inbox/conversations');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch conversations');
    }

    inboxConversations = Array.isArray(data.conversations) ? data.conversations : [];
    hasLoadedInbox = true;
    renderInboxConversations(inboxConversations);

    if (!activeInboxChatId && inboxConversations.length) {
      activeInboxChatId = inboxConversations[0].chatId;
      renderInboxConversations(inboxConversations);
      await loadInboxMessages(activeInboxChatId);
    } else if (activeInboxChatId) {
      await loadInboxMessages(activeInboxChatId);
    } else {
      setInboxFeedback('No conversations yet.', '#5d645d');
    }
  } catch (error) {
    inboxConversations = [];
    renderInboxConversations([]);
    setInboxFeedback(error.message, '#b42318');
  } finally {
    if (inboxRefreshBtn) {
      setButtonLoading(inboxRefreshBtn, false);
      inboxRefreshBtn.disabled = false;
    }
  }
}

function closeSendComplexMenu() {
  if (!sendComplexMenuDropdown || !sendComplexMenuTrigger) return;
  sendComplexMenuDropdown.hidden = true;
  sendComplexMenuTrigger.setAttribute('aria-expanded', 'false');
  if (sendComplexMenuWrap) {
    sendComplexMenuWrap
      .querySelectorAll('.complex-menu-submenu.is-open')
      .forEach((submenu) => submenu.classList.remove('is-open'));
  }
}

function openSendComplexMenu() {
  if (!sendComplexMenuDropdown || !sendComplexMenuTrigger) return;
  sendComplexMenuDropdown.hidden = false;
  sendComplexMenuTrigger.setAttribute('aria-expanded', 'true');
}

function syncSendMenuThemeState() {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  sendMenuThemeRadios.forEach((radio) => {
    if (radio.value === currentTheme) {
      radio.checked = true;
    }
  });
}

function applySendMenuHintVisibility() {
  if (!sendMenuToggleHints) return;
  const showHints = sendMenuToggleHints.checked;
  [sendTargetHint, sendGroupFetchHint, sendPersonalChatFetchHint].forEach((node) => {
    if (!node) return;
    node.hidden = !showHints;
  });
}

function applySendMenuGroupToolsVisibility() {
  if (!sendMenuToggleGroupTools || !sendGroupTools || !sendTargetTypeInput) return;
  if (sendTargetTypeInput.value !== 'group') return;
  sendGroupTools.hidden = !sendMenuToggleGroupTools.checked;
}

function applySendTemplate(templateKey) {
  if (!sendMessageTextInput) return;

  const templates = {
    'template-reminder': 'Halo, ini pengingat pembayaran pengiriman Anda. Mohon selesaikan sebelum jam 18:00 hari ini. Terima kasih.',
    'template-arrival': 'Halo, paket Anda sudah tiba di hub terdekat. Silakan tunggu kurir kami untuk proses pengantaran.',
    'template-promo': 'Promo hari ini: diskon ongkir hingga 20% untuk pengiriman area tertentu. Balas pesan ini untuk detail.',
    'template-thanks': 'Terima kasih sudah menggunakan layanan kami. Jika ada kendala, balas pesan ini kapan saja.',
  };

  const selected = templates[templateKey];
  if (!selected) return;
  sendMessageTextInput.value = selected;
  sendMessageTextInput.focus();
}

async function handleSendMenuAction(action) {
  if (!action) return;

  if (action === 'new-message' || action === 'clear-form') {
    if (sendForm) {
      const currentType = String(sendTargetTypeInput?.value || 'group').trim() || 'group';
      sendForm.reset();
      clearButtonRowsFromContainer(sendButtonRows);
      if (sendTargetTypeInput) sendTargetTypeInput.value = currentType;
      syncSendTargetInputContent();
      updateSendMediaFormFlow();
      if (sendFeedback) {
        sendFeedback.textContent = '';
      }
    }
    closeSendComplexMenu();
    return;
  }

  if (action === 'save-draft') {
    if (sendFeedback) {
      sendFeedback.textContent = 'Draft is kept in the form. Submit when ready.';
      sendFeedback.style.color = '#5d645d';
    }
    closeSendComplexMenu();
    return;
  }

  if (action.startsWith('template-')) {
    applySendTemplate(action);
    closeSendComplexMenu();
    return;
  }

  if (action === 'refresh-targets') {
    const activeType = String(sendTargetTypeInput?.value || 'group').trim();
    if (activeType === 'group') {
      await loadSendGroups(true);
    } else {
      await loadSendPersonalChats(true);
    }
    closeSendComplexMenu();
    return;
  }

  if (action === 'copy-target') {
    const target = String(sendTargetValueInput?.value || '').trim();
    if (!target) {
      if (sendFeedback) {
        sendFeedback.textContent = 'Target value is empty.';
        sendFeedback.style.color = '#b42318';
      }
      closeSendComplexMenu();
      return;
    }

    try {
      await navigator.clipboard.writeText(target);
      if (sendFeedback) {
        sendFeedback.textContent = 'Target ID copied to clipboard.';
        sendFeedback.style.color = '#136f63';
      }
    } catch (error) {
      if (sendFeedback) {
        sendFeedback.textContent = 'Failed to copy target ID.';
        sendFeedback.style.color = '#b42318';
      }
    }

    closeSendComplexMenu();
    return;
  }

  if (action === 'send-now') {
    if (sendForm) sendForm.requestSubmit();
    closeSendComplexMenu();
  }
}

function closeCommandComplexMenu() {
  if (!commandComplexMenuDropdown || !commandComplexMenuTrigger) return;
  commandComplexMenuDropdown.hidden = true;
  commandComplexMenuTrigger.setAttribute('aria-expanded', 'false');
  if (commandComplexMenuWrap) {
    commandComplexMenuWrap
      .querySelectorAll('.complex-menu-submenu.is-open')
      .forEach((submenu) => submenu.classList.remove('is-open'));
  }
}

function openCommandComplexMenu() {
  if (!commandComplexMenuDropdown || !commandComplexMenuTrigger) return;
  commandComplexMenuDropdown.hidden = false;
  commandComplexMenuTrigger.setAttribute('aria-expanded', 'true');
}

function applyCommandMenuGuideVisibility() {
  const guide = document.getElementById('commandButtonsGuideHint');
  if (!guide || !commandMenuToggleGuide) return;
  guide.hidden = !commandMenuToggleGuide.checked;
}

function closeCommandButtonGuideModal() {
  if (!commandButtonGuideModal) return;
  commandButtonGuideModal.hidden = true;
  document.body.style.overflow = '';
}

function openCommandButtonGuideModal() {
  if (!commandButtonGuideModal) return;
  closeCommandComplexMenu();
  commandButtonGuideModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

async function handleCommandMenuAction(action, triggerValue) {
  if (!action) return;

  if (action === 'add-button-row') {
    if (addButtonRowBtn) addButtonRowBtn.click();
    closeCommandComplexMenu();
    return;
  }

  if (action === 'focus-trigger') {
    if (commandTriggerInput) {
      commandTriggerInput.focus();
      commandTriggerInput.select();
    }
    closeCommandComplexMenu();
    return;
  }

  if (action === 'reset-form') {
    resetCommandForm();
    closeCommandComplexMenu();
    return;
  }

  if (action === 'open-guide') {
    openCommandButtonGuideModal();
    return;
  }

  if (action === 'fill-trigger') {
    if (commandTriggerInput) {
      const normalized = normalizeCommandTrigger(triggerValue);
      commandTriggerInput.value = normalized;
      commandTriggerInput.focus();
      updateCommandFormFlow();
    }
    closeCommandComplexMenu();
  }
}

if (sendComplexMenuWrap && sendComplexMenuTrigger && sendComplexMenuDropdown) {
  sendComplexMenuTrigger.addEventListener('click', () => {
    const isOpen = !sendComplexMenuDropdown.hidden;
    if (isOpen) {
      closeSendComplexMenu();
    } else {
      openSendComplexMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!sendComplexMenuWrap.contains(event.target)) {
      closeSendComplexMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSendComplexMenu();
    }

    if (event.key === 'Enter' && event.ctrlKey) {
      const isSendPageOpen = !document.getElementById('send-message')?.hidden;
      if (isSendPageOpen && sendForm) {
        sendForm.requestSubmit();
      }
    }

    if (event.key === 'Escape' && event.shiftKey) {
      if (sendForm) {
        const currentType = String(sendTargetTypeInput?.value || 'group').trim() || 'group';
        sendForm.reset();
        clearButtonRowsFromContainer(sendButtonRows);
        if (sendTargetTypeInput) sendTargetTypeInput.value = currentType;
        syncSendTargetInputContent();
        updateSendMediaFormFlow();
      }
    }
  });

  sendComplexMenuWrap.querySelectorAll('[data-submenu-toggle]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const parentSubmenu = trigger.closest('.complex-menu-submenu');
      if (!parentSubmenu) return;
      parentSubmenu.classList.toggle('is-open');
    });
  });

  sendComplexMenuWrap.querySelectorAll('[data-send-menu-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = String(button.getAttribute('data-send-menu-action') || '').trim();
      await handleSendMenuAction(action);
    });
  });

  if (sendMenuToggleGroupTools) {
    sendMenuToggleGroupTools.addEventListener('change', applySendMenuGroupToolsVisibility);
    applySendMenuGroupToolsVisibility();
  }

  if (sendMenuToggleHints) {
    sendMenuToggleHints.addEventListener('change', applySendMenuHintVisibility);
    applySendMenuHintVisibility();
  }

  if (sendMenuThemeRadios.length) {
    syncSendMenuThemeState();
    sendMenuThemeRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;

        const selectedTheme = String(radio.value || 'system');
        if (selectedTheme === 'system') {
          const prefersLight = window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: light)').matches
            : false;
          applyTheme(prefersLight ? 'light' : 'dark');
        } else {
          applyTheme(selectedTheme);
        }
      });
    });
  }
}

if (commandComplexMenuWrap && commandComplexMenuTrigger && commandComplexMenuDropdown) {
  commandComplexMenuTrigger.addEventListener('click', () => {
    const isOpen = !commandComplexMenuDropdown.hidden;
    if (isOpen) {
      closeCommandComplexMenu();
    } else {
      openCommandComplexMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!commandComplexMenuWrap.contains(event.target)) {
      closeCommandComplexMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCommandComplexMenu();
    }
  });

  commandComplexMenuWrap.querySelectorAll('[data-submenu-toggle]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const parentSubmenu = trigger.closest('.complex-menu-submenu');
      if (!parentSubmenu) return;
      parentSubmenu.classList.toggle('is-open');
    });
  });

  commandComplexMenuWrap.querySelectorAll('[data-command-menu-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = String(button.getAttribute('data-command-menu-action') || '').trim();
      const triggerValue = String(button.getAttribute('data-trigger-value') || '').trim();
      await handleCommandMenuAction(action, triggerValue);
    });
  });

  if (commandMenuToggleGuide) {
    commandMenuToggleGuide.addEventListener('change', applyCommandMenuGuideVisibility);
    applyCommandMenuGuideVisibility();
  }
}

if (commandButtonGuideModal) {
  commandButtonGuideModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'command-button-guide') {
      closeCommandButtonGuideModal();
    }
  });
}

if (closeCommandButtonGuideModalBtn) {
  closeCommandButtonGuideModalBtn.addEventListener('click', closeCommandButtonGuideModal);
}

if (targetTypeInput) {
  targetTypeInput.addEventListener('change', syncTargetInputContent);
  syncTargetInputContent();
}

if (sendTargetTypeInput) {
  sendTargetTypeInput.addEventListener('change', syncSendTargetInputContent);
  syncSendTargetInputContent();
}

if (sendMediaTypeInput) {
  sendMediaTypeInput.addEventListener('change', updateSendMediaFormFlow);
}

if (sendMediaSourceInput) {
  sendMediaSourceInput.addEventListener('change', updateSendMediaFormFlow);
}

updateSendMediaFormFlow();

if (sidebarMenuBtn) {
  sidebarMenuBtn.addEventListener('click', openSidebar);
}

if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

if (contactsRefreshBtn) {
  contactsRefreshBtn.addEventListener('click', () => loadContacts(true));
}

if (contactSearch) {
  contactSearch.addEventListener('input', renderContacts);
}

if (contactsSearchClear) {
  contactsSearchClear.addEventListener('click', () => {
    if (!contactSearch) return;
    contactSearch.value = '';
    renderContacts();
    contactSearch.focus();
  });
}

if (contactsList) {
  contactsList.addEventListener('click', async (event) => {
    const sendButton = event.target.closest('[data-contact-send]');
    const copyButton = event.target.closest('[data-contact-copy]');

    if (sendButton) {
      const contactId = sendButton.getAttribute('data-contact-send') || '';
      if (sendTargetTypeInput) {
        sendTargetTypeInput.value = 'personal';
        syncSendTargetInputContent();
      }
      if (sendTargetValueInput) sendTargetValueInput.value = contactId;
      window.location.hash = '#send-message';
      return;
    }

    if (copyButton) {
      const contactId = copyButton.getAttribute('data-contact-copy') || '';
      try {
        await navigator.clipboard.writeText(contactId);
        if (contactsFeedback) contactsFeedback.textContent = 'Chat ID copied';
      } catch (error) {
        if (contactsFeedback) contactsFeedback.textContent = 'Unable to copy chat ID';
      }
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!isSidebarDialogMode() || !sidebar?.classList.contains('open')) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSidebar();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = Array.from(sidebar.querySelectorAll('a[href], button:not([disabled])'));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

syncSidebarDialogState();
window.addEventListener('resize', syncSidebarDialogState);

if (navItems.length) {
  navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = item.getAttribute('href') || '';
      window.history.pushState(null, '', hash);
      showPageByHash(hash);
      closeSidebar();
    });
  });

  showPageByHash(window.location.hash || DEFAULT_PAGE_HASH);
  document.documentElement.classList.remove('has-route-hash');
  window.addEventListener('hashchange', () => {
    showPageByHash(window.location.hash || DEFAULT_PAGE_HASH);
  });
  window.addEventListener('popstate', () => {
    showPageByHash(window.location.hash || DEFAULT_PAGE_HASH);
  });
}

if (groupPicker) {
  groupPicker.addEventListener('change', () => {
    const selected = String(groupPicker.value || '').trim();
    const targetValueInput = document.getElementById('targetValue');
    if (!targetValueInput || !selected) return;
    targetValueInput.value = selected;
  });
}

if (personalChatPicker) {
  personalChatPicker.addEventListener('change', () => {
    const selected = String(personalChatPicker.value || '').trim();
    const targetValueInput = document.getElementById('targetValue');
    if (!targetValueInput || !selected) return;
    targetValueInput.value = selected;
  });
}

if (sendGroupPicker) {
  sendGroupPicker.addEventListener('change', () => {
    const selected = String(sendGroupPicker.value || '').trim();
    if (!sendTargetValueInput || !selected) return;
    sendTargetValueInput.value = selected;
  });
}

if (sendPersonalChatPicker) {
  sendPersonalChatPicker.addEventListener('change', () => {
    const selected = String(sendPersonalChatPicker.value || '').trim();
    if (!sendTargetValueInput || !selected) return;
    sendTargetValueInput.value = selected;
  });
}

if (refreshGroupsBtn) {
  refreshGroupsBtn.addEventListener('click', () => {
    loadGroups(true);
  });
}

if (refreshPersonalChatsBtn) {
  refreshPersonalChatsBtn.addEventListener('click', () => {
    loadPersonalChats(true);
  });
}

if (sendRefreshGroupsBtn) {
  sendRefreshGroupsBtn.addEventListener('click', () => {
    loadSendGroups(true);
  });
}

if (sendRefreshPersonalChatsBtn) {
  sendRefreshPersonalChatsBtn.addEventListener('click', () => {
    loadSendPersonalChats(true);
  });
}

if (inboxRefreshBtn) {
  inboxRefreshBtn.addEventListener('click', () => {
    loadInboxConversations(true);
  });
}

if (waStatus) {
  refreshWhatsAppState();
  window.setInterval(refreshWhatsAppState, 5000);
}

hydrateScheduleTimesToLocal();

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const selectedType = String(formData.get('targetType') || '').trim();
    const targetValueRaw = String(formData.get('targetValue') || '').trim();

    const payload = {
      targetType: selectedType,
      targetValue: targetValueRaw,
      message: String(formData.get('message') || '').trim(),
      buttons: collectButtonsFromContainer(scheduleButtonRows),
      scheduleAt: String(formData.get('scheduleAt') || '').trim(),
      timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    };

    if (!payload.targetValue) {
      feedback.textContent = 'Target value is required.';
      feedback.style.color = '#b42318';
      return;
    }

    feedback.textContent = 'Saving schedule...';
    feedback.style.color = '#5d645d';
    setButtonLoading(submitBtn, true, 'Saving schedule');

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create schedule');
      }

      feedback.textContent = 'Schedule saved successfully';
      feedback.style.color = '#136f63';
      form.reset();
      clearButtonRowsFromContainer(scheduleButtonRows);
      syncTargetInputContent();
      setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      feedback.textContent = error.message;
      feedback.style.color = '#b42318';
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

if (sendForm) {
  sendForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = sendForm.querySelector('button[type="submit"]');

    const formData = new FormData(sendForm);
    const selectedMediaType = String(formData.get('mediaType') || 'none').trim();
    const selectedMediaSource = String(formData.get('mediaSource') || 'url').trim();
    const payload = {
      targetType: String(formData.get('targetType') || '').trim(),
      targetValue: String(formData.get('targetValue') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      buttons: collectButtonsFromContainer(sendButtonRows),
      mediaType: selectedMediaType,
      mediaUrl: String(formData.get('mediaUrl') || '').trim(),
      fileName: String(formData.get('fileName') || '').trim(),
    };

    if (selectedMediaType !== 'none' && selectedMediaSource === 'upload') {
      const selectedFile = sendMediaUploadInput?.files?.[0];
      if (!selectedFile) {
        if (sendFeedback) {
          sendFeedback.textContent = 'Please choose a media file to upload.';
          sendFeedback.style.color = '#b42318';
        }
        return;
      }

      try {
        if (sendFeedback) {
          sendFeedback.textContent = 'Uploading media file...';
          sendFeedback.style.color = '#5d645d';
        }
        const mediaKind = selectedMediaType === 'voice' ? 'audio' : selectedMediaType;
        const uploaded = await uploadSendMediaFile(selectedFile, mediaKind);
        payload.mediaUrl = String(uploaded.mediaUrl || '').trim();
        if (!payload.fileName) {
          payload.fileName = String(uploaded.fileName || '').trim();
        }
      } catch (error) {
        if (sendFeedback) {
          sendFeedback.textContent = error.message;
          sendFeedback.style.color = '#b42318';
        }
        return;
      }
    }

    if (selectedMediaType !== 'none' && !payload.mediaUrl) {
      if (sendFeedback) {
        sendFeedback.textContent = 'Media URL is required when media type is selected.';
        sendFeedback.style.color = '#b42318';
      }
      return;
    }

    if (selectedMediaType === 'voice') {
      payload.voiceNote = true;
    }

    const hasMedia = payload.mediaType && payload.mediaType !== 'none' && payload.mediaUrl;

    if (!payload.targetType || !payload.targetValue || (!payload.message && !payload.buttons.length && !hasMedia)) {
      if (sendFeedback) {
        sendFeedback.textContent = 'Target type, target value, and at least message, buttons, or media are required.';
        sendFeedback.style.color = '#b42318';
      }
      return;
    }

    if (sendFeedback) {
      sendFeedback.textContent = 'Sending message...';
      sendFeedback.style.color = '#5d645d';
    }
    setButtonLoading(submitBtn, true, 'Sending message');

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      if (sendFeedback) {
        sendFeedback.textContent = 'Message sent successfully';
        sendFeedback.style.color = '#136f63';
      }

      const selectedType = String(sendTargetTypeInput?.value || 'group').trim();
      sendForm.reset();
      clearButtonRowsFromContainer(sendButtonRows);
      if (sendTargetTypeInput) sendTargetTypeInput.value = selectedType || 'group';
      syncSendTargetInputContent();
      updateSendMediaFormFlow();
    } catch (error) {
      if (sendFeedback) {
        sendFeedback.textContent = error.message;
        sendFeedback.style.color = '#b42318';
      }
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

document.querySelectorAll('.btn-delete').forEach((button) => {
  button.addEventListener('click', async () => {
    const id = button.dataset.id;
    if (!id) return;

    const confirmDelete = window.confirm('Delete this schedule?');
    if (!confirmDelete) return;

    setButtonLoading(button, true, 'Deleting schedule');

    try {
      const response = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete schedule');
      }
      window.location.reload();
    } catch (error) {
      window.alert(error.message);
      setButtonLoading(button, false);
    }
  });
});

const scheduleViewModal = document.getElementById('scheduleViewModal');
const closeScheduleViewModalBtn = document.getElementById('closeScheduleViewModal');
const scheduleModalId = document.getElementById('scheduleModalId');
const scheduleModalType = document.getElementById('scheduleModalType');
const scheduleModalTarget = document.getElementById('scheduleModalTarget');
const scheduleModalTime = document.getElementById('scheduleModalTime');
const scheduleModalStatus = document.getElementById('scheduleModalStatus');
const scheduleModalMessage = document.getElementById('scheduleModalMessage');
const scheduleModalButtons = document.getElementById('scheduleModalButtons');
const scheduleModalFeedback = document.getElementById('scheduleModalFeedback');
const scheduleModalCloseBtn = document.getElementById('scheduleModalCloseBtn');
const scheduleModalDeleteBtn = document.getElementById('scheduleModalDeleteBtn');
let activeScheduleModalId = '';

function closeScheduleViewModal() {
  if (!scheduleViewModal) return;
  activeScheduleModalId = '';
  if (scheduleModalFeedback) {
    scheduleModalFeedback.textContent = '';
    scheduleModalFeedback.style.color = '#5d645d';
  }
  if (scheduleModalDeleteBtn) {
    setButtonLoading(scheduleModalDeleteBtn, false);
    scheduleModalDeleteBtn.disabled = false;
  }
  scheduleViewModal.hidden = true;
  document.body.style.overflow = '';
}

function openScheduleViewModal(item) {
  if (!scheduleViewModal || !item) return;
  activeScheduleModalId = String(item.id || '').trim();

  if (scheduleModalId) scheduleModalId.textContent = String(item.id || '-');
  if (scheduleModalType) {
    const type = String(item.targetType || '').trim();
    scheduleModalType.textContent = type === 'group' ? 'group' : 'personal';
  }
  if (scheduleModalTarget) scheduleModalTarget.textContent = String(item.targetValue || '-');
  if (scheduleModalTime) {
    const localTime = formatLocalDateTime(item.scheduleAt);
    scheduleModalTime.textContent = localTime || String(item.scheduleAt || '-');
  }
  if (scheduleModalStatus) scheduleModalStatus.textContent = String(item.status || '-');
  if (scheduleModalMessage) scheduleModalMessage.textContent = String(item.message || '-');
  if (scheduleModalButtons) {
    const buttons = Array.isArray(item.buttons) ? item.buttons : [];
    scheduleModalButtons.textContent = buttons.length ? JSON.stringify(buttons, null, 2) : '-';
  }
  if (scheduleModalFeedback) {
    scheduleModalFeedback.textContent = '';
    scheduleModalFeedback.style.color = '#5d645d';
  }
  if (scheduleModalDeleteBtn) {
    setButtonLoading(scheduleModalDeleteBtn, false);
    scheduleModalDeleteBtn.disabled = false;
  }

  scheduleViewModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.btn-view-schedule').forEach((button) => {
  button.addEventListener('click', () => {
    const id = String(button.dataset.id || '').trim();
    if (!id) return;

    const schedule = schedulesById.get(id);
    if (!schedule) return;

    openScheduleViewModal(schedule);
  });
});

if (scheduleViewModal) {
  scheduleViewModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'schedule-view') {
      closeScheduleViewModal();
    }
  });
}

if (closeScheduleViewModalBtn) {
  closeScheduleViewModalBtn.addEventListener('click', closeScheduleViewModal);
}

if (scheduleModalCloseBtn) {
  scheduleModalCloseBtn.addEventListener('click', closeScheduleViewModal);
}

if (scheduleModalDeleteBtn) {
  scheduleModalDeleteBtn.addEventListener('click', async () => {
    if (!activeScheduleModalId) return;

    const confirmDelete = window.confirm('Delete this schedule?');
    if (!confirmDelete) return;

    setButtonLoading(scheduleModalDeleteBtn, true, 'Deleting schedule');
    if (scheduleModalFeedback) {
      scheduleModalFeedback.textContent = 'Deleting schedule...';
      scheduleModalFeedback.style.color = '#5d645d';
    }

    try {
      const response = await fetch(`/api/schedules/${encodeURIComponent(activeScheduleModalId)}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete schedule');
      }

      if (scheduleModalFeedback) {
        scheduleModalFeedback.textContent = 'Schedule deleted';
        scheduleModalFeedback.style.color = '#136f63';
      }

      setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      if (scheduleModalFeedback) {
        scheduleModalFeedback.textContent = error.message;
        scheduleModalFeedback.style.color = '#b42318';
      }
      setButtonLoading(scheduleModalDeleteBtn, false);
      scheduleModalDeleteBtn.disabled = false;
    }
  });
}

/* ---------- Custom Commands ---------- */

const commandForm = document.getElementById('command-form');
const commandFeedback = document.getElementById('command-feedback');
const commandAdvancedFields = document.getElementById('command-advanced-fields');
const commandTriggerInput = document.getElementById('commandTrigger');
const commandMediaTypeInput = document.getElementById('commandMediaType');
const commandCategoryInput = document.getElementById('commandCategory');
const commandDescriptionInput = document.getElementById('commandDescription');
const commandResponseInput = document.getElementById('commandResponse');
const commandMediaSourceInput = document.getElementById('commandMediaSource');
const commandMediaUrlInput = document.getElementById('commandMediaUrl');
const commandMediaUploadInput = document.getElementById('commandMediaUpload');
const commandMediaUploadHint = document.getElementById('commandMediaUploadHint');
const commandFileNameInput = document.getElementById('commandFileName');
const commandMediaSourceField = document.getElementById('commandMediaSourceField');
const commandMediaUrlField = document.getElementById('commandMediaUrlField');
const commandMediaUploadField = document.getElementById('commandMediaUploadField');
const commandFileNameField = document.getElementById('commandFileNameField');
const commandResponseRuleHint = document.getElementById('commandResponseRuleHint');
const commandOriginalTrigger = document.getElementById('commandOriginalTrigger');
const commandSubmitBtn = document.getElementById('commandSubmitBtn');
const commandCancelBtn = document.getElementById('commandCancelBtn');
const addButtonRowBtn = document.getElementById('addButtonRowBtn');
const buttonRows = document.getElementById('buttonRows');

const commandsByTrigger = new Map(
  (Array.isArray(window.__CUSTOM_COMMANDS__) ? window.__CUSTOM_COMMANDS__ : []).map((item) => [
    item.trigger,
    item,
  ])
);

const commandListSearchInput = document.getElementById('commandListSearch');
const commandListSearchClear = document.getElementById('commandListSearchClear');
const commandListCategoryFilter = document.getElementById('commandListCategoryFilter');
const commandListGrid = document.getElementById('commandListGrid');
const commandListCards = Array.from(document.querySelectorAll('.command-card'));
const commandListCount = document.getElementById('commandListCount');
const commandListEmpty = document.getElementById('commandListEmpty');
const commandListNoResults = document.getElementById('commandListNoResults');

function filterCommandList() {
  if (!commandListGrid) return;

  const search = String(commandListSearchInput?.value || '').trim().toLowerCase();
  const category = String(commandListCategoryFilter?.value || '');
  if (commandListSearchClear) commandListSearchClear.hidden = !search;

  let visibleCount = 0;
  commandListCards.forEach((card) => {
    const matchesSearch = !search || String(card.dataset.search || '').includes(search);
    const matchesCategory = !category || card.dataset.category === category;
    const isVisible = matchesSearch && matchesCategory;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (commandListCount) {
    commandListCount.textContent = (search || category) && visibleCount !== commandListCards.length
      ? `${visibleCount} shown`
      : `${commandListCards.length} command${commandListCards.length === 1 ? '' : 's'}`;
  }

  if (commandListNoResults) {
    commandListNoResults.hidden = !(commandListCards.length && visibleCount === 0);
  }
  if (commandListEmpty) {
    commandListEmpty.hidden = commandListCards.length > 0;
  }
}

if (commandListSearchInput) {
  commandListSearchInput.addEventListener('input', filterCommandList);
}
if (commandListCategoryFilter) {
  commandListCategoryFilter.addEventListener('change', filterCommandList);
}
if (commandListSearchClear) {
  commandListSearchClear.addEventListener('click', () => {
    if (!commandListSearchInput) return;
    commandListSearchInput.value = '';
    commandListSearchInput.focus();
    filterCommandList();
  });
}
filterCommandList();

function buttonRowTemplate(button = {}, onChange = () => {}) {
  const row = document.createElement('div');
  row.className = 'button-row';

  let params = {};
  if (typeof button.buttonParamsJson === 'string') {
    try {
      params = JSON.parse(button.buttonParamsJson);
    } catch (error) {
      params = {};
    }
  }

  const name = button.name || 'quick_reply';
  const singleSelectSections = Array.isArray(params.sections)
    ? params.sections.filter((section) => section && typeof section === 'object')
    : [];
  const firstSingleSelectSection = singleSelectSections[0] || null;
  const firstSingleSelectRow = Array.isArray(params.sections)
    ? params.sections
      .flatMap((section) => (Array.isArray(section?.rows) ? section.rows : []))
      .find((item) => item && typeof item === 'object' && (item.id || item.title))
    : null;

  row.innerHTML = `
    <select class="btn-type-select">
      <option value="quick_reply">Quick Reply</option>
      <option value="cta_url">Open Link</option>
      <option value="cta_call">Call</option>
      <option value="cta_wa">WhatsApp</option>
      <option value="cta_copy">Copy Code</option>
      <option value="single_select">Single Select</option>
    </select>
    <input class="btn-label-input" placeholder="Button label" />
    <input class="btn-value-input" placeholder="Value (id / URL / phone)" />
    <button type="button" class="btn btn-ghost btn-sm btn-remove-row" aria-label="Remove button">&times;</button>
    <div class="single-select-editor" hidden>
      <div class="single-select-editor-head">
        <input class="single-select-section-title" placeholder="Section title (default: Options)" />
        <input class="single-select-highlight-label" placeholder="Highlight label (optional)" />
        <button type="button" class="btn btn-outline btn-sm btn-add-single-row">Add Row</button>
      </div>
      <div class="single-select-rows-editor"></div>
    </div>
  `;

  const typeSelect = row.querySelector('.btn-type-select');
  const labelInput = row.querySelector('.btn-label-input');
  const valueInput = row.querySelector('.btn-value-input');
  const removeBtn = row.querySelector('.btn-remove-row');
  const singleSelectEditor = row.querySelector('.single-select-editor');
  const singleSelectSectionTitleInput = row.querySelector('.single-select-section-title');
  const singleSelectHighlightLabelInput = row.querySelector('.single-select-highlight-label');
  const singleSelectRowsEditor = row.querySelector('.single-select-rows-editor');
  const addSingleRowBtn = row.querySelector('.btn-add-single-row');

  function setSingleSelectEditorVisible(isVisible) {
    const visible = Boolean(isVisible);
    if (singleSelectEditor) {
      singleSelectEditor.hidden = !visible;
      singleSelectEditor.setAttribute('aria-hidden', String(!visible));
    }
    row.classList.toggle('is-single-select', visible);
  }

  function buildSingleSelectRowEditor(rowData = {}) {
    const rowEditor = document.createElement('div');
    rowEditor.className = 'single-select-row-editor';
    rowEditor.innerHTML = `
      <input class="single-select-row-title" placeholder="Row title" />
      <input class="single-select-row-id" placeholder="Row id" />
      <input class="single-select-row-header" placeholder="Header (optional)" />
      <input class="single-select-row-description" placeholder="Description (optional)" />
      <button type="button" class="btn btn-ghost btn-sm btn-remove-single-row" aria-label="Remove single select row">&times;</button>
    `;

    const rowTitleInput = rowEditor.querySelector('.single-select-row-title');
    const rowIdInput = rowEditor.querySelector('.single-select-row-id');
    const rowHeaderInput = rowEditor.querySelector('.single-select-row-header');
    const rowDescriptionInput = rowEditor.querySelector('.single-select-row-description');
    const removeSingleRowBtn = rowEditor.querySelector('.btn-remove-single-row');

    rowTitleInput.value = String(rowData.title || '').trim();
    rowIdInput.value = String(rowData.id || '').trim();
    rowHeaderInput.value = String(rowData.header || '').trim();
    rowDescriptionInput.value = String(rowData.description || '').trim();

    rowTitleInput.addEventListener('input', onChange);
    rowIdInput.addEventListener('input', onChange);
    rowHeaderInput.addEventListener('input', onChange);
    rowDescriptionInput.addEventListener('input', onChange);
    removeSingleRowBtn.addEventListener('click', () => {
      rowEditor.remove();
      onChange();
    });

    return rowEditor;
  }

  function getExistingSingleSelectRows() {
    if (!singleSelectSections.length) return [];

    return singleSelectSections
      .flatMap((section) => (Array.isArray(section.rows) ? section.rows : []))
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const id = String(item.id || '').trim();
        const title = String(item.title || '').trim();
        if (!id || !title) return null;

        const header = String(item.header || '').trim();
        const description = String(item.description || '').trim();
        const rowData = { id, title };
        if (header) rowData.header = header;
        if (description) rowData.description = description;
        return rowData;
      })
      .filter(Boolean);
  }

  function ensureSingleSelectEditorRows() {
    if (!singleSelectRowsEditor) return;

    const existingRows = Array.from(singleSelectRowsEditor.querySelectorAll('.single-select-row-editor'));
    if (existingRows.length) return;

    const rowData = firstSingleSelectRow
      ? {
        id: String(firstSingleSelectRow.id || '').trim(),
        title: String(firstSingleSelectRow.title || '').trim(),
        header: String(firstSingleSelectRow.header || '').trim(),
        description: String(firstSingleSelectRow.description || '').trim(),
      }
      : {
        id: String(valueInput.value || '').trim(),
        title: String(labelInput.value || '').trim(),
      };

    singleSelectRowsEditor.appendChild(buildSingleSelectRowEditor(rowData));
  }

  typeSelect.value = name;
  labelInput.value = params.display_text || params.title || firstSingleSelectRow?.title || '';
  valueInput.value = params.id || params.url || params.phone_number || params.copy_code || firstSingleSelectRow?.id || '';
  singleSelectSectionTitleInput.value = String(firstSingleSelectSection?.title || 'Options').trim() || 'Options';
  singleSelectHighlightLabelInput.value = String(firstSingleSelectSection?.highlight_label || '').trim();

  const existingRows = getExistingSingleSelectRows();
  existingRows.forEach((rowData) => {
    singleSelectRowsEditor.appendChild(buildSingleSelectRowEditor(rowData));
  });

  function syncPlaceholder() {
    if (typeSelect.value === 'cta_url') {
      valueInput.placeholder = 'https://example.com';
      valueInput.hidden = false;
      setSingleSelectEditorVisible(false);
    } else if (typeSelect.value === 'cta_call') {
      valueInput.placeholder = '+60123456789';
      valueInput.hidden = false;
      setSingleSelectEditorVisible(false);
    } else if (typeSelect.value === 'cta_wa') {
      valueInput.placeholder = '60123456789';
      valueInput.hidden = false;
      setSingleSelectEditorVisible(false);
    } else if (typeSelect.value === 'cta_copy') {
      valueInput.placeholder = 'DISKAUN10';
      valueInput.hidden = false;
      setSingleSelectEditorVisible(false);
    } else if (typeSelect.value === 'single_select') {
      valueInput.placeholder = 'row_id atau JSON rows (contoh: [{"id":"id1","title":"Option 1"}])';
      valueInput.hidden = true;
      setSingleSelectEditorVisible(true);
      ensureSingleSelectEditorRows();
    } else {
      valueInput.placeholder = 'reply_id';
      valueInput.hidden = false;
      setSingleSelectEditorVisible(false);
    }
  }
  syncPlaceholder();
  typeSelect.addEventListener('change', () => {
    syncPlaceholder();
    onChange();
  });

  labelInput.addEventListener('input', onChange);
  valueInput.addEventListener('input', onChange);
  singleSelectSectionTitleInput.addEventListener('input', onChange);
  singleSelectHighlightLabelInput.addEventListener('input', onChange);
  addSingleRowBtn.addEventListener('click', () => {
    if (!singleSelectRowsEditor) return;
    singleSelectRowsEditor.appendChild(buildSingleSelectRowEditor());
    onChange();
  });
  removeBtn.addEventListener('click', () => {
    row.remove();
    onChange();
  });

  return row;
}

function addButtonRowToContainer(container, button = {}, onChange = () => {}) {
  if (!container) return;
  container.appendChild(buttonRowTemplate(button, onChange));
}

function addButtonRow(button) {
  addButtonRowToContainer(buttonRows, button, updateCommandSubmitState);
}

function clearButtonRows() {
  if (buttonRows) buttonRows.innerHTML = '';
}

function clearButtonRowsFromContainer(container) {
  if (container) container.innerHTML = '';
}

function parseSingleSelectRowsInput(rawValue, fallbackTitle) {
  const cleanValue = String(rawValue || '').trim();
  const cleanTitle = String(fallbackTitle || '').trim() || 'Option';
  if (!cleanValue) return [];

  if (cleanValue.startsWith('[')) {
    try {
      const parsed = JSON.parse(cleanValue);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const id = String(item.id || '').trim();
            const title = String(item.title || '').trim();
            const description = String(item.description || '').trim();
            const header = String(item.header || '').trim();
            if (!id || !title) return null;

            const row = { id, title };
            if (description) row.description = description;
            if (header) row.header = header;
            return row;
          })
          .filter(Boolean);
      }
    } catch (error) {
      // Fall back to single row input format when JSON is invalid.
    }
  }

  return [{ id: cleanValue, title: cleanTitle }];
}

function collectButtonsFromContainer(container) {
  if (!container) return [];

  return Array.from(container.querySelectorAll('.button-row'))
    .map((row) => {
      const type = row.querySelector('.btn-type-select').value;
      const label = row.querySelector('.btn-label-input').value.trim();
      const value = row.querySelector('.btn-value-input').value.trim();
      const singleSelectSectionTitleInput = row.querySelector('.single-select-section-title');
      const singleSelectHighlightLabelInput = row.querySelector('.single-select-highlight-label');
      const singleSelectRows = Array.from(row.querySelectorAll('.single-select-row-editor'));
      if (!label) return null;
      if (type !== 'single_select' && !value) return null;

      let params = { display_text: label };
      if (type === 'cta_url') {
        params.url = value;
        params.merchant_url = value;
      }
      else if (type === 'cta_call') params.phone_number = value;
      else if (type === 'cta_wa') params.phone_number = value;
      else if (type === 'cta_copy') params.copy_code = value;
      else if (type === 'single_select') {
        let rows = singleSelectRows
          .map((item) => {
            const title = String(item.querySelector('.single-select-row-title')?.value || '').trim();
            const id = String(item.querySelector('.single-select-row-id')?.value || '').trim();
            const header = String(item.querySelector('.single-select-row-header')?.value || '').trim();
            const description = String(item.querySelector('.single-select-row-description')?.value || '').trim();
            if (!id || !title) return null;

            const rowData = { id, title };
            if (header) rowData.header = header;
            if (description) rowData.description = description;
            return rowData;
          })
          .filter(Boolean);

        if (!rows.length) {
          rows = parseSingleSelectRowsInput(value, label);
        }
        if (!rows.length) return null;

        const sectionTitle = String(singleSelectSectionTitleInput?.value || '').trim() || 'Options';
        const highlightLabel = String(singleSelectHighlightLabelInput?.value || '').trim();
        const section = {
          title: sectionTitle,
          rows,
        };
        if (highlightLabel) {
          section.highlight_label = highlightLabel;
        }

        params = {
          title: label,
          sections: [section],
        };
      }
      else {
        params.id = value;
      }

      return { name: type, buttonParamsJson: JSON.stringify(params) };
    })
    .filter(Boolean);
}

function collectButtonsFromRows() {
  return collectButtonsFromContainer(buttonRows);
}

if (addButtonRowBtn) {
  addButtonRowBtn.addEventListener('click', () => addButtonRow());
}

if (scheduleAddButtonRowBtn) {
  scheduleAddButtonRowBtn.addEventListener('click', () => {
    addButtonRowToContainer(scheduleButtonRows);
  });
}

if (sendAddButtonRowBtn) {
  sendAddButtonRowBtn.addEventListener('click', () => {
    addButtonRowToContainer(sendButtonRows);
  });
}

function setCommandFeedback(message, color) {
  if (!commandFeedback) return;
  commandFeedback.textContent = message;
  commandFeedback.style.color = color || '#5d645d';
}

function getNormalizedMediaType() {
  if (!commandMediaTypeInput) return '';
  const selected = String(commandMediaTypeInput.value || '').trim();
  if (!selected || selected === 'none') return '';
  return selected;
}

function isMediaTypeStepReady() {
  if (!commandMediaTypeInput) return false;
  return Boolean(String(commandMediaTypeInput.value || '').trim());
}

function updateCommandSubmitState() {
  if (!commandSubmitBtn) return;

  const trigger = String(commandTriggerInput?.value || '').trim();
  const hasValidTrigger = Boolean(trigger) && trigger.startsWith('.');
  const selectedMediaType = String(commandMediaTypeInput?.value || '').trim();
  const hasMediaType = Boolean(selectedMediaType);
  const isNoMedia = selectedMediaType === 'none';
  const mediaSource = String(commandMediaSourceInput?.value || 'url');
  const hasResponse = Boolean(String(commandResponseInput?.value || '').trim());
  const hasMediaUrl = Boolean(String(commandMediaUrlInput?.value || '').trim());
  const hasUploadFile = Boolean(commandMediaUploadInput?.files && commandMediaUploadInput.files.length);
  const hasButtons = collectButtonsFromRows().length > 0;
  const hasMediaInput = isNoMedia
    ? false
    : mediaSource === 'upload'
      ? hasUploadFile || hasMediaUrl
      : hasMediaUrl;
  const requireResponseForMediaButtons = !isNoMedia && hasButtons;
  const isReady = hasValidTrigger
    && hasMediaType
    && (hasResponse || hasMediaInput)
    && (!requireResponseForMediaButtons || hasResponse);

  if (commandResponseRuleHint) {
    commandResponseRuleHint.hidden = !requireResponseForMediaButtons;
  }

  commandSubmitBtn.disabled = !isReady;
  commandSubmitBtn.classList.toggle('is-ready', isReady);
}

function updateCommandFormFlow() {
  const selectedMediaType = String(commandMediaTypeInput?.value || '').trim();
  const showAdvanced = Boolean(selectedMediaType);

  if (commandAdvancedFields) {
    commandAdvancedFields.hidden = !showAdvanced;
  }

  const isNoMedia = selectedMediaType === 'none';
  const isDocument = selectedMediaType === 'document';
  const mediaSource = String(commandMediaSourceInput?.value || 'url');
  const showMediaUrl = showAdvanced && !isNoMedia;
  const showFileName = showAdvanced && isDocument;
  const showMediaSource = showAdvanced && !isNoMedia;
  const useUpload = showMediaSource && mediaSource === 'upload';

  if (commandMediaSourceField) {
    commandMediaSourceField.hidden = !showMediaSource;
  }
  if (commandMediaUrlField) {
    commandMediaUrlField.hidden = !showMediaUrl || useUpload;
  }
  if (commandMediaUrlInput) {
    commandMediaUrlInput.required = showMediaUrl && !useUpload;
    if (!showMediaUrl || useUpload) {
      commandMediaUrlInput.value = '';
    }
  }

  if (commandMediaUploadField) {
    commandMediaUploadField.hidden = !showMediaUrl || !useUpload;
  }
  if (commandMediaUploadInput) {
    commandMediaUploadInput.required = showMediaUrl && useUpload;
    if (!showMediaUrl || !useUpload) {
      commandMediaUploadInput.value = '';
    }
  }
  if (commandMediaUploadHint) {
    commandMediaUploadHint.textContent = useUpload
      ? 'Choose a file to upload and use as media source.'
      : 'Choose URL source or upload source for media.';
  }

  if (commandFileNameField) {
    commandFileNameField.hidden = !showFileName;
  }
  if (commandFileNameInput && !showFileName) {
    commandFileNameInput.value = '';
  }

  updateCommandSubmitState();
}

function resetCommandForm() {
  if (!commandForm) return;
  commandForm.reset();
  clearButtonRows();
  if (commandOriginalTrigger) commandOriginalTrigger.value = '';
  if (commandTriggerInput) commandTriggerInput.disabled = false;
  if (commandSubmitBtn) commandSubmitBtn.textContent = 'Save Command';
  if (commandCancelBtn) commandCancelBtn.hidden = true;
  if (commandMediaSourceInput) commandMediaSourceInput.value = 'url';
  setCommandFeedback('');
  updateCommandFormFlow();
}

function normalizeCommandTrigger(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const withoutPrefix = raw.replace(/^[!.]+/, '').trim();
  if (!withoutPrefix) return '.';
  return `.${withoutPrefix}`;
}

function fillCommandForm(command) {
  if (!commandForm || !command) return;

  if (commandTriggerInput) commandTriggerInput.value = normalizeCommandTrigger(command.trigger || '');
  if (commandCategoryInput) commandCategoryInput.value = command.category || 'General';
  if (commandDescriptionInput) commandDescriptionInput.value = command.description || '';
  if (commandResponseInput) commandResponseInput.value = command.response || '';
  if (commandMediaTypeInput) commandMediaTypeInput.value = command.mediaType || 'none';
  if (commandMediaSourceInput) {
    commandMediaSourceInput.value = command.mediaUrl ? 'url' : 'upload';
  }
  if (commandMediaUrlInput) commandMediaUrlInput.value = command.mediaUrl || '';
  if (commandFileNameInput) commandFileNameInput.value = command.fileName || '';

  clearButtonRows();
  (command.buttons || []).forEach((button) => addButtonRow(button));

  if (commandOriginalTrigger) commandOriginalTrigger.value = command.trigger || '';
  if (commandTriggerInput) commandTriggerInput.disabled = true;
  if (commandSubmitBtn) commandSubmitBtn.textContent = 'Update Command';
  if (commandCancelBtn) commandCancelBtn.hidden = false;
  updateCommandFormFlow();

  setTabbedPanel(
    'create',
    { create: commandTabCreate, list: commandTabList },
    { create: commandCreatePanel, list: commandListPanel }
  );

  window.history.pushState(null, '', '#custom-commands');
  showPageByHash('#custom-commands');
  commandForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (commandCancelBtn) {
  commandCancelBtn.addEventListener('click', resetCommandForm);
}

if (commandTriggerInput) {
  commandTriggerInput.addEventListener('input', () => {
    const normalized = normalizeCommandTrigger(commandTriggerInput.value);
    if (commandTriggerInput.value !== normalized) {
      commandTriggerInput.value = normalized;
    }
    updateCommandFormFlow();
  });
}

if (commandMediaTypeInput) {
  commandMediaTypeInput.addEventListener('change', updateCommandFormFlow);
}

if (commandMediaSourceInput) {
  commandMediaSourceInput.addEventListener('change', updateCommandFormFlow);
}

if (commandResponseInput) {
  commandResponseInput.addEventListener('input', updateCommandSubmitState);
}

if (commandMediaUrlInput) {
  commandMediaUrlInput.addEventListener('input', updateCommandSubmitState);
}

if (commandMediaUploadInput) {
  commandMediaUploadInput.addEventListener('change', updateCommandSubmitState);
}

async function uploadCommandMediaFile(file, mediaType) {
  const formData = new FormData();
  formData.set('mediaFile', file);
  formData.set('mediaType', mediaType);

  const response = await fetch('/api/custom-commands/upload-media', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload media file');
  }

  return data;
}

if (commandForm) {
  commandForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = commandSubmitBtn || commandForm.querySelector('button[type="submit"]');

    const formData = new FormData(commandForm);
    const originalTrigger = commandOriginalTrigger ? commandOriginalTrigger.value : '';
    const isEditing = Boolean(originalTrigger);
    const selectedMediaType = String(formData.get('mediaType') || '').trim();
    const selectedMediaSource = String(formData.get('mediaSource') || 'url').trim();

    let mediaUrl = String(formData.get('mediaUrl') || '').trim();
    let fileName = String(formData.get('fileName') || '').trim();

    if (selectedMediaType && selectedMediaType !== 'none' && selectedMediaSource === 'upload') {
      const selectedFile = commandMediaUploadInput?.files?.[0];
      if (selectedFile) {
        setCommandFeedback('Uploading media file...', '#5d645d');
        const uploaded = await uploadCommandMediaFile(selectedFile, selectedMediaType);
        mediaUrl = String(uploaded.mediaUrl || '').trim();
        if (!fileName) {
          fileName = String(uploaded.fileName || '').trim();
        }
      }
    }

    const payload = {
      trigger: normalizeCommandTrigger(formData.get('trigger') || ''),
      category: String(formData.get('category') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      response: String(formData.get('response') || '').trim(),
      mediaType: getNormalizedMediaType(),
      mediaUrl,
      fileName,
      buttons: collectButtonsFromRows(),
    };

    setCommandFeedback(isEditing ? 'Updating command...' : 'Saving command...', '#5d645d');
    setButtonLoading(submitBtn, true, isEditing ? 'Updating command' : 'Saving command');

    try {
      const url = isEditing
        ? `/api/custom-commands/${encodeURIComponent(originalTrigger)}`
        : '/api/custom-commands';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save command');
      }

      setCommandFeedback(isEditing ? 'Command updated' : 'Command saved', '#136f63');
      setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      setCommandFeedback(error.message, '#b42318');
    } finally {
      setButtonLoading(submitBtn, false);
      updateCommandSubmitState();
    }
  });
}

const commandPreviewModal = document.getElementById('commandPreviewModal');
const closeCommandPreviewModalBtn = document.getElementById('closeCommandPreviewModal');
const commandPreviewViewport = document.getElementById('commandPreviewViewport');
const commandPreviewImage = document.getElementById('commandPreviewImage');
const commandPreviewVideo = document.getElementById('commandPreviewVideo');
const commandPreviewAudio = document.getElementById('commandPreviewAudio');
const commandPreviewDocument = document.getElementById('commandPreviewDocument');
const commandPreviewDocumentLink = document.getElementById('commandPreviewDocumentLink');
const commandPreviewBadge = document.getElementById('commandPreviewBadge');
const commandPreviewTitle = document.getElementById('commandPreviewTitle');
const commandPreviewDescription = document.getElementById('commandPreviewDescription');
const commandPreviewContent = document.getElementById('commandPreviewContent');
const commandPreviewMeta = document.getElementById('commandPreviewMeta');
const commandPreviewDeliveryHint = document.getElementById('commandPreviewDeliveryHint');
const commandPreviewButtons = document.getElementById('commandPreviewButtons');
const commandPreviewActionBtn = document.getElementById('commandPreviewActionBtn');
const commandPreviewIncomingText = document.getElementById('commandPreviewIncomingText');
const commandPreviewIncomingTime = document.getElementById('commandPreviewIncomingTime');
const commandPreviewOutgoingTime = document.getElementById('commandPreviewOutgoingTime');
const commandPreviewDateChip = document.getElementById('commandPreviewDateChip');
const commandPreviewStatusTime = document.querySelector('#commandPreviewModal .wa-status-time');

function closeCommandPreviewModal() {
  if (!commandPreviewModal) return;

  if (commandPreviewVideo) {
    commandPreviewVideo.pause();
    commandPreviewVideo.removeAttribute('src');
    commandPreviewVideo.load();
  }

  if (commandPreviewAudio) {
    commandPreviewAudio.pause();
    commandPreviewAudio.removeAttribute('src');
    commandPreviewAudio.load();
  }

  commandPreviewModal.hidden = true;
  document.body.style.overflow = '';
}

function parseButtonParams(button) {
  if (!button || typeof button !== 'object') return {};
  if (typeof button.buttonParamsJson !== 'string') return {};

  try {
    const parsed = JSON.parse(button.buttonParamsJson);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function resetCommandPreviewMedia() {
  if (commandPreviewImage) {
    commandPreviewImage.hidden = false;
  }

  if (commandPreviewVideo) {
    commandPreviewVideo.hidden = true;
  }

  if (commandPreviewAudio) {
    commandPreviewAudio.hidden = true;
  }

  if (commandPreviewDocument) {
    commandPreviewDocument.hidden = true;
  }
}

function truncatePreviewValue(value, maxLength = 42) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1)}...`;
}

function getButtonKindLabel(kind) {
  if (kind === 'cta_url') return 'Open Link';
  if (kind === 'cta_call') return 'Call';
  if (kind === 'cta_wa') return 'WhatsApp';
  if (kind === 'cta_copy') return 'Copy Code';
  if (kind === 'single_select') return 'Single Select';
  return 'Quick Reply';
}

function buildPreviewNowParts() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const day = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
  return { time, day };
}

function renderCommandPreviewMeta(command) {
  if (!commandPreviewMeta) return;

  const mediaType = String(command.mediaType || '').trim();
  const mediaUrl = String(command.mediaUrl || '').trim();
  const hasMedia = Boolean(mediaType && mediaUrl);
  const buttons = Array.isArray(command.buttons) ? command.buttons : [];
  const buttonCount = buttons.length;
  const category = String(command.category || '').trim() || 'General';

  const chips = [
    `Category: ${category}`,
    hasMedia ? `Media: ${mediaType}` : 'Media: none',
    buttonCount ? `Buttons: ${buttonCount}` : 'Buttons: none',
    hasMedia && buttonCount ? 'Delivery: 2 messages' : 'Delivery: 1 message',
  ];

  commandPreviewMeta.innerHTML = '';
  chips.forEach((text) => {
    const chip = document.createElement('span');
    chip.className = 'command-preview-meta-chip';
    chip.textContent = text;
    commandPreviewMeta.appendChild(chip);
  });
  commandPreviewMeta.hidden = false;
}

function renderCommandPreviewDeliveryHint(command) {
  if (!commandPreviewDeliveryHint) return;

  const mediaType = String(command.mediaType || '').trim();
  const mediaUrl = String(command.mediaUrl || '').trim();
  const hasMedia = Boolean(mediaType && mediaUrl);
  const hasButtons = Array.isArray(command.buttons) && command.buttons.length > 0;
  const hasResponse = Boolean(String(command.response || '').trim());

  if (hasMedia && hasButtons) {
    commandPreviewDeliveryHint.textContent = hasResponse
      ? 'Preview note: media + caption will send first, then buttons in a second message for WhatsApp compatibility.'
      : 'Warning: media + buttons without response text can cause unclear output. Add response text for better result.';
    commandPreviewDeliveryHint.hidden = false;
    return;
  }

  if (hasButtons && !hasMedia) {
    commandPreviewDeliveryHint.textContent = 'Preview note: this command sends one text message with interactive buttons.';
    commandPreviewDeliveryHint.hidden = false;
    return;
  }

  commandPreviewDeliveryHint.textContent = '';
  commandPreviewDeliveryHint.hidden = true;
}

function renderCommandPreviewButtons(command) {
  if (!commandPreviewButtons) return;

  commandPreviewButtons.innerHTML = '';
  const list = Array.isArray(command.buttons) ? command.buttons : [];
  if (!list.length) {
    commandPreviewButtons.hidden = true;
    return;
  }

  list.forEach((buttonItem) => {
    const params = parseButtonParams(buttonItem);
    const firstSingleSelectRow = Array.isArray(params.sections)
      ? params.sections
        .flatMap((section) => (Array.isArray(section?.rows) ? section.rows : []))
        .find((item) => item && typeof item === 'object' && (item.id || item.title))
      : null;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn wa-preview-chip';
    const kind = String(buttonItem.name || '').trim();
    const label = params.display_text || params.title || firstSingleSelectRow?.title || 'Button';
    button.textContent = `${getButtonKindLabel(kind)}: ${label}`;

    let metaValue = params.id || params.url || params.phone_number || params.copy_code || firstSingleSelectRow?.id || '';
    if (metaValue) {
      const valueSpan = document.createElement('span');
      valueSpan.className = 'command-preview-button-value';
      valueSpan.textContent = truncatePreviewValue(metaValue);
      button.appendChild(valueSpan);
    }

    if (kind === 'cta_url' && params.url) {
      button.addEventListener('click', () => window.open(params.url, '_blank', 'noopener'));
    } else if (kind === 'cta_call' && params.phone_number) {
      button.addEventListener('click', () => window.open(`tel:${params.phone_number}`, '_self'));
    } else if (kind === 'cta_wa' && params.phone_number) {
      const rawPhone = String(params.phone_number || '');
      const normalizedPhone = rawPhone.replace(/[^0-9]/g, '');
      if (normalizedPhone) {
        button.addEventListener('click', () => window.open(`https://wa.me/${normalizedPhone}`, '_blank', 'noopener'));
      }
    } else if (kind === 'cta_copy' && params.copy_code) {
      button.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(params.copy_code);
            button.textContent = 'Copied';
            setTimeout(() => {
              button.textContent = params.display_text || 'Button';
            }, 1200);
          }
        } catch (error) {
          // Ignore clipboard errors and keep button usable.
        }
      });
    }

    commandPreviewButtons.appendChild(button);
  });

  commandPreviewButtons.hidden = false;
}

function openCommandPreviewModal(command) {
  if (!commandPreviewModal || !command) return;

  const fallbackCover = 'https://avatar.vercel.sh/shadcn1';
  const mediaType = String(command.mediaType || '').trim();
  const mediaUrl = String(command.mediaUrl || '').trim();
  const mediaTypeLabel = mediaType ? mediaType.toUpperCase() : 'TEXT';
  const description = command.description
    ? String(command.description)
    : 'online';
  const textContent = String(command.response || '').trim();
  const { time, day } = buildPreviewNowParts();

  resetCommandPreviewMedia();

  if (commandPreviewImage) {
    commandPreviewImage.src = fallbackCover;
    commandPreviewImage.alt = mediaUrl
      ? `Media preview ${command.trigger || ''}`
      : 'Command cover';
  }

  if (mediaUrl && mediaType === 'image' && commandPreviewImage) {
    commandPreviewImage.src = mediaUrl;
    commandPreviewImage.hidden = false;
  }

  if (mediaUrl && mediaType === 'video' && commandPreviewVideo) {
    commandPreviewImage.hidden = true;
    commandPreviewVideo.src = mediaUrl;
    commandPreviewVideo.hidden = false;
  }

  if (mediaUrl && mediaType === 'audio' && commandPreviewAudio) {
    commandPreviewAudio.src = mediaUrl;
    commandPreviewAudio.hidden = false;
  }

  if (mediaUrl && mediaType === 'document' && commandPreviewDocument && commandPreviewDocumentLink) {
    commandPreviewDocument.hidden = false;
    commandPreviewDocumentLink.href = mediaUrl;
    commandPreviewDocumentLink.textContent = command.fileName || 'Open document';
  }

  if (commandPreviewBadge) {
    commandPreviewBadge.textContent = mediaTypeLabel;
  }

  if (commandPreviewStatusTime) {
    commandPreviewStatusTime.textContent = time;
  }

  if (commandPreviewDateChip) {
    commandPreviewDateChip.textContent = day;
  }

  if (commandPreviewIncomingText) {
    const incomingMessage = command.trigger
      ? `${String(command.trigger).trim()}${mediaUrl ? ' https://example.com/link' : ''}`
      : '!command';
    commandPreviewIncomingText.textContent = incomingMessage;
  }

  if (commandPreviewIncomingTime) {
    commandPreviewIncomingTime.textContent = time;
  }

  if (commandPreviewOutgoingTime) {
    commandPreviewOutgoingTime.textContent = `${time} ✓✓`;
  }

  if (commandPreviewTitle) {
    commandPreviewTitle.textContent = command.trigger || 'Command Preview';
  }

  if (commandPreviewDescription) {
    commandPreviewDescription.textContent = description;
  }

  if (commandPreviewContent) {
    if (textContent) {
      commandPreviewContent.textContent = textContent;
      commandPreviewContent.hidden = false;
    } else {
      commandPreviewContent.textContent = '';
      commandPreviewContent.hidden = true;
    }
  }

  renderCommandPreviewMeta(command);
  renderCommandPreviewDeliveryHint(command);
  renderCommandPreviewButtons(command);

  if (commandPreviewActionBtn) {
    commandPreviewActionBtn.onclick = () => {
      closeCommandPreviewModal();
    };
  }

  commandPreviewModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.btn-preview-command').forEach((button) => {
  button.addEventListener('click', () => {
    const trigger = button.dataset.trigger;
    if (!trigger) return;

    const command = commandsByTrigger.get(trigger);
    if (!command) return;

    openCommandPreviewModal(command);
  });
});

document.querySelectorAll('.btn-edit-command').forEach((button) => {
  button.addEventListener('click', () => {
    const trigger = button.dataset.trigger;
    if (!trigger) return;

    const command = commandsByTrigger.get(trigger);
    if (!command) return;

    fillCommandForm(command);
  });
});

document.querySelectorAll('.btn-delete-command').forEach((button) => {
  button.addEventListener('click', async () => {
    const trigger = String(button.dataset.trigger || '').trim();
    if (!trigger) return;

    const confirmDelete = window.confirm(`Delete command ${trigger}?`);
    if (!confirmDelete) return;

    setButtonLoading(button, true, 'Deleting command');

    try {
      const response = await fetch(`/api/custom-commands/${encodeURIComponent(trigger)}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete command');
      }
      window.location.reload();
    } catch (error) {
      window.alert(error.message);
      setButtonLoading(button, false);
    }
  });
});

if (commandPreviewModal) {
  commandPreviewModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'command-preview') {
      closeCommandPreviewModal();
    }
  });
}

if (closeCommandPreviewModalBtn) {
  closeCommandPreviewModalBtn.addEventListener('click', closeCommandPreviewModal);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && commandButtonGuideModal && !commandButtonGuideModal.hidden) {
    closeCommandButtonGuideModal();
    return;
  }

  if (event.key === 'Escape' && deletedConversationModal && !deletedConversationModal.hidden) {
    closeDeletedConversationModal();
    return;
  }

  if (event.key === 'Escape' && commandPreviewModal && !commandPreviewModal.hidden) {
    closeCommandPreviewModal();
    return;
  }

  if (event.key === 'Escape' && scheduleViewModal && !scheduleViewModal.hidden) {
    closeScheduleViewModal();
  }
});

const clearDeletedMessagesBtn = document.getElementById('clearDeletedMessagesBtn');
const deletedConversationModal = document.getElementById('deletedConversationModal');
const closeDeletedConversationModalBtn = document.getElementById('closeDeletedConversationModal');
const deletedConversationModalCloseBtn = document.getElementById('deletedConversationModalCloseBtn');
const deletedConversationModalTitle = document.getElementById('deletedConversationModalTitle');
const deletedConversationModalSubtitle = document.getElementById('deletedConversationModalSubtitle');
const deletedConversationModalAvatar = document.getElementById('deletedConversationModalAvatar');
const deletedConversationModalMessages = document.getElementById('deletedConversationModalMessages');
const deletedConversationModalStatusTime = document.getElementById('deletedConversationModalStatusTime');

function getDeletedConversationLabel(item) {
  if (!item || typeof item !== 'object') return 'Unknown Chat';

  const chatId = String(item.chatId || '').trim();
  const chatName = String(item.chatName || '').trim();
  const senderName = String(item.senderName || '').trim();
  if (item.isGroup) return chatName || chatId || 'Unknown Group';
  return senderName || chatName || chatId || 'Unknown Contact';
}

function getDeletedMessagePreview(item) {
  if (!item || typeof item !== 'object') return '[No content]';
  if (item.mediaUrl) {
    const fileName = String(item.fileName || '').trim();
    const type = String(item.type || 'media').trim();
    return fileName || `[${type}]`;
  }
  const text = String(item.text || '').trim();
  return text || '[No content]';
}

function normalizeDeletedRecordStatus(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'partial') return 'partial';
  if (normalized === 'missing') return 'missing';
  return 'recovered';
}

function formatDeletedTimeOnly(isoString) {
  const parsed = new Date(String(isoString || ''));
  if (Number.isNaN(parsed.getTime())) return '--:--';

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed);
}

function formatDurationLabel(totalSeconds) {
  const seconds = Number(totalSeconds);
  if (!Number.isFinite(seconds) || seconds < 0) return '';

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function formatByteSizeLabel(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '';

  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function createDeletedMediaPreview(record) {
  const mediaUrl = String(record.mediaUrl || '').trim();
  if (!mediaUrl) return null;

  const type = String(record.type || '').trim().toLowerCase();
  const wrap = document.createElement('div');
  wrap.className = 'deleted-wa-media-wrap';

  if (type === 'image' || type === 'sticker') {
    const image = document.createElement('img');
    image.className = 'deleted-wa-media-image';
    image.src = mediaUrl;
    image.alt = type === 'sticker' ? 'Deleted sticker' : 'Deleted image';
    image.loading = 'lazy';
    wrap.appendChild(image);
    return wrap;
  }

  if (type === 'video') {
    const video = document.createElement('video');
    video.className = 'deleted-wa-media-video';
    video.controls = true;
    video.preload = 'metadata';
    video.src = mediaUrl;
    wrap.appendChild(video);
    return wrap;
  }

  if (type === 'audio' || type === 'voice') {
    const audio = document.createElement('audio');
    audio.className = 'deleted-wa-media-audio';
    audio.controls = true;
    audio.preload = 'metadata';
    audio.src = mediaUrl;
    wrap.appendChild(audio);
    return wrap;
  }

  const link = document.createElement('a');
  link.className = 'deleted-wa-media-link';
  link.href = mediaUrl;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = getDeletedMessagePreview(record);
  wrap.appendChild(link);

  return wrap;
}

function createDeletedMessageBubble(record) {
  const bubbleWrap = document.createElement('div');
  bubbleWrap.className = 'deleted-wa-message-wrap';

  const bubble = document.createElement('article');
  bubble.className = 'wa-user-bubble deleted-wa-message-bubble';

  const sender = document.createElement('p');
  sender.className = 'deleted-wa-sender';
  sender.textContent = String(record.senderName || record.senderId || 'Unknown sender').trim();
  bubble.appendChild(sender);

  if (record.mediaUrl) {
    const mediaPreview = createDeletedMediaPreview(record);
    if (mediaPreview) {
      bubble.appendChild(mediaPreview);
    }

    const fallbackLink = document.createElement('a');
    fallbackLink.className = 'deleted-wa-media-link';
    fallbackLink.href = String(record.mediaUrl);
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener';
    fallbackLink.textContent = `Open file: ${getDeletedMessagePreview(record)}`;
    bubble.appendChild(fallbackLink);
  }

  const text = String(record.text || '').trim();
  if (text) {
    const textEl = document.createElement('p');
    textEl.className = 'wa-user-text';
    textEl.textContent = text;
    bubble.appendChild(textEl);
  }

  if (!record.mediaUrl && !text) {
    const fallback = document.createElement('p');
    fallback.className = 'wa-user-text';
    fallback.textContent = '[No content]';
    bubble.appendChild(fallback);
  }

  const timeEl = document.createElement('span');
  timeEl.className = 'wa-incoming-time';
  timeEl.textContent = formatLocalDateTime(record.deletedAt) || formatDeletedTimeOnly(record.deletedAt);
  bubble.appendChild(timeEl);
  bubbleWrap.appendChild(bubble);

  return bubbleWrap;
}

function closeDeletedConversationModal() {
  if (!deletedConversationModal) return;
  deletedConversationModal.hidden = true;
  if (deletedConversationModalMessages) {
    deletedConversationModalMessages.innerHTML = '';
  }
  document.body.style.overflow = '';
}

function openDeletedConversationModal(chatId) {
  if (!deletedConversationModal || !deletedConversationModalMessages) return;

  const key = String(chatId || '').trim();
  if (!key) return;

  const records = deletedMessageRecords
    .filter((item) => String(item.chatId || '').trim() === key)
    .sort((a, b) => new Date(a.deletedAt).getTime() - new Date(b.deletedAt).getTime());
  if (!records.length) return;

  const latest = records[records.length - 1];
  const title = getDeletedConversationLabel(latest);

  if (deletedConversationModalTitle) {
    deletedConversationModalTitle.textContent = title;
  }
  if (deletedConversationModalSubtitle) {
    deletedConversationModalSubtitle.textContent = `${records.length} deleted message${records.length > 1 ? 's' : ''}`;
  }
  if (deletedConversationModalAvatar) {
    deletedConversationModalAvatar.textContent = String(title || '?').charAt(0).toUpperCase() || '?';
  }
  if (deletedConversationModalStatusTime) {
    deletedConversationModalStatusTime.textContent = formatDeletedTimeOnly(new Date().toISOString());
  }

  deletedConversationModalMessages.innerHTML = '';
  const dateChip = document.createElement('div');
  dateChip.className = 'wa-date-chip';
  dateChip.textContent = 'Deleted message records';
  deletedConversationModalMessages.appendChild(dateChip);

  records.forEach((record) => {
    deletedConversationModalMessages.appendChild(createDeletedMessageBubble(record));
  });

  deletedConversationModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.btn-open-deleted-conversation').forEach((button) => {
  button.addEventListener('click', () => {
    const chatId = String(button.dataset.chatId || '').trim();
    if (!chatId) return;
    openDeletedConversationModal(chatId);
  });
});

document.querySelectorAll('.btn-delete-deleted-conversation').forEach((button) => {
  button.addEventListener('click', async () => {
    const chatId = String(button.dataset.chatId || '').trim();
    if (!chatId) return;

    const confirmDelete = window.confirm('Delete all deleted-message records for this conversation?');
    if (!confirmDelete) return;

    setButtonLoading(button, true, 'Deleting conversation records');

    try {
      const response = await fetch(`/api/deleted-messages/chat/${encodeURIComponent(chatId)}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete conversation records');
      }
      window.location.reload();
    } catch (error) {
      window.alert(error.message);
      setButtonLoading(button, false);
    }
  });
});

if (deletedConversationModal) {
  deletedConversationModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'deleted-conversation') {
      closeDeletedConversationModal();
    }
  });
}

if (closeDeletedConversationModalBtn) {
  closeDeletedConversationModalBtn.addEventListener('click', closeDeletedConversationModal);
}

if (deletedConversationModalCloseBtn) {
  deletedConversationModalCloseBtn.addEventListener('click', closeDeletedConversationModal);
}

if (clearDeletedMessagesBtn) {
  clearDeletedMessagesBtn.addEventListener('click', async () => {
    const confirmClear = window.confirm('Clear all deleted message records?');
    if (!confirmClear) return;

    setButtonLoading(clearDeletedMessagesBtn, true, 'Clearing records');

    try {
      const response = await fetch('/api/deleted-messages', { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to clear records');
      }
      window.location.reload();
    } catch (error) {
      window.alert(error.message);
      setButtonLoading(clearDeletedMessagesBtn, false);
    }
  });
}

updateCommandFormFlow();

const reminderForm = document.getElementById('reminder-form');
const reminderFeedback = document.getElementById('reminderFeedback');
const reminderSaveBtn = document.getElementById('reminderSaveBtn');
const reminderList = document.getElementById('reminder-list');

function setReminderFeedback(message, isError = false) {
  if (!reminderFeedback) return;
  reminderFeedback.textContent = message;
  reminderFeedback.style.color = isError ? '#b42318' : '#136f63';
}

function renderReminderList(reminders) {
  if (!reminderList) return;
  if (!reminders.length) {
    reminderList.innerHTML = '<tr><td colspan="5" class="muted">No reminders yet</td></tr>';
    return;
  }

  reminderList.innerHTML = reminders.map((item) => `
    <tr data-reminder-id="${String(item.id).replace(/"/g, '&quot;')}">
      <td><strong>${String(item.name).replace(/</g, '&lt;')}</strong><br><span class="muted">${item.time}</span></td>
      <td>${item.date}</td>
      <td>${item.earlyDays.join(', ')}</td>
      <td>${item.targetChats.length} chat(s)</td>
      <td class="cell-action"><button type="button" class="btn btn-ghost btn-sm reminder-delete-btn" data-id="${encodeURIComponent(item.id)}">Delete</button></td>
    </tr>
  `).join('');
}

if (reminderForm) {
  reminderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setButtonLoading(reminderSaveBtn, true, 'Saving reminder');
    setReminderFeedback('Saving reminder...');

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('reminderName').value,
          date: document.getElementById('reminderDate').value,
          time: document.getElementById('reminderTime').value,
          earlyDays: document.getElementById('reminderEarlyDays').value,
          targetChats: document.getElementById('reminderTargetChats').value,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save reminder');
      const reminders = Array.isArray(window.__REMINDERS__) ? window.__REMINDERS__ : [];
      reminders.push(data);
      window.__REMINDERS__ = reminders;
      renderReminderList(reminders);
      reminderForm.reset();
      document.getElementById('reminderTime').value = '09:00';
      document.getElementById('reminderEarlyDays').value = '10';
      setReminderFeedback('Reminder saved');
    } catch (error) {
      setReminderFeedback(error.message, true);
    } finally {
      setButtonLoading(reminderSaveBtn, false);
    }
  });
}

if (reminderList) {
  reminderList.addEventListener('click', async (event) => {
    const button = event.target.closest('.reminder-delete-btn');
    if (!button) return;
    const id = decodeURIComponent(button.dataset.id || '');
    if (!window.confirm('Delete this reminder?')) return;
    setButtonLoading(button, true, 'Deleting');

    try {
      const response = await fetch(`/api/reminders/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete reminder');
      }
      window.__REMINDERS__ = (window.__REMINDERS__ || []).filter((item) => item.id !== id);
      renderReminderList(window.__REMINDERS__);
      setReminderFeedback('Reminder deleted');
    } catch (error) {
      setReminderFeedback(error.message, true);
      setButtonLoading(button, false);
    }
  });
}
