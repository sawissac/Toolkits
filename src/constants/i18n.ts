import type { AppLocale } from "@/stores/slices/appConfigSlice";

/**
 * In-house i18n message catalog.
 *
 * Pure static data — no deps. Each supported {@link AppLocale} maps every
 * {@link MessageKey} to its translated string. `en` is the source of truth for
 * the key set; other locales must provide the same keys (enforced by the
 * `Record<MessageKey, string>` value type below).
 *
 * Resolve strings through `@/hooks/useTranslation` (`t("key")`) — never read
 * this map directly from components.
 */

/** English source strings; the key set every locale must satisfy. */
const en = {
  // Topbar
  "topbar.tools": "tools",
  "topbar.home": "Home",
  "topbar.save": "Save",
  "topbar.saving": "Saving…",
  "topbar.saved": "Saved",
  "topbar.error": "Error",
  "topbar.fullscreen": "Fullscreen",
  "topbar.exitFullscreen": "Exit fullscreen",
  "topbar.signOut": "Sign out",

  // Settings dialog
  "settings.title": "Settings",
  "settings.subtitle": "Preferences are stored on this device only.",
  "settings.reset": "Reset to defaults",
  "settings.legal": "Legal",
  "settings.privacy": "Privacy Policy",
  "settings.terms": "Terms & Conditions",

  // Appearance / theme
  "settings.theme": "Theme",
  "settings.theme.desc": "Color scheme for the app shell.",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "theme.switchToLight": "Switch to light mode",
  "theme.switchToDark": "Switch to dark mode",
  "header.github": "View source on GitHub",

  // Language
  "settings.language": "Language",
  "settings.language.desc": "UI display language.",

  // Toggle settings
  "settings.reducedMotion": "Reduced motion",
  "settings.reducedMotion.desc":
    "Minimise animations and transitions across the app.",
  "settings.autoSave": "Auto-save",
  "settings.autoSave.desc":
    "Persist tool changes automatically without pressing Save.",
  "settings.confirmBeforeDelete": "Confirm before delete",
  "settings.confirmBeforeDelete.desc":
    "Ask for confirmation before deleting a tool or node.",
  "settings.sidebarCollapsed": "Collapse sidebar by default",
  "settings.sidebarCollapsed.desc": "Start with the tools sidebar collapsed.",

  // Tools panel
  "tools.title": "Tools",
  "tools.new": "New tool",
  "tools.search": "Search tools…",
  "tools.options": "Tool options",
  "tools.preview": "Preview",
  "tools.rename": "Rename",
  "tools.generateName": "Generate name",
  "tools.generating": "Generating name…",
  "tools.generateSuccess": "Renamed to “{name}”.",
  "tools.generateError": "Could not generate a name.",
  "tools.generateEmpty": "Add a node first — there's nothing to name yet.",
  "tools.share": "Share",
  "tools.duplicate": "Duplicate",
  "tools.delete": "Delete",
  "tools.empty": "No tools yet — create one to get started.",
  "tools.noMatch": "No tools match “{q}”.",
  "tools.deleteTitle": "Delete tool?",
  "tools.deleteBodyTail":
    "and all its nodes will be permanently removed. This cannot be undone.",
  "tools.shareError": "Could not enable sharing.",
  "tools.shareCopied": "Share link copied!",
  "tools.previewError": "Could not open preview.",
  "tools.popupBlocked": "Pop-up blocked — allow pop-ups to preview.",
  "tools.editIcon": "Edit icon",
  "tools.iconTitle": "Tool icon",
  "tools.iconDesc":
    "Paste or edit the SVG, or let AI draw one from what this tool does.",
  "tools.iconCode": "SVG code",
  "tools.iconPlaceholder": '<svg viewBox="0 0 24 24">…</svg>',
  "tools.iconGenerate": "AI generate",
  "tools.iconGenerating": "Generating icon…",
  "tools.iconGenerateSuccess": "Icon generated.",
  "tools.iconGenerateError": "Could not generate an icon.",
  "tools.iconInvalid": "That doesn't look like a valid SVG icon.",
  "tools.iconSaved": "Icon updated.",
  "tools.iconClear": "Clear icon",
  "tools.iconEmptyPreview": "No icon yet",

  // Gallery — per-tool actions (Tools panel menu) + toasts
  "gallery.addToGallery": "Add to gallery",
  "gallery.removeFromGallery": "Remove from gallery",
  "gallery.makePublic": "Make public",
  "gallery.makePrivate": "Make private",
  "gallery.added": "Added to gallery.",
  "gallery.removed": "Removed from gallery.",
  "gallery.madePublic": "Tool is now public.",
  "gallery.madePrivate": "Tool is now private.",
  "gallery.flagError": "Could not update the gallery.",

  // Gallery — top bar + manage page
  "gallery.link": "Gallery",
  "gallery.title": "Gallery",
  "gallery.subtitle": "Your public showcase of tools.",
  "gallery.back": "Back to Studio",
  "gallery.settings": "Gallery settings",
  "gallery.handle": "Handle",
  "gallery.handleHint":
    "Your public URL. Lowercase letters, numbers, and hyphens.",
  "gallery.handlePlaceholder": "your-handle",
  "gallery.handleTaken": "That handle is already taken.",
  "gallery.handleInvalid": "Use 3–32 lowercase letters, numbers, or hyphens.",
  "gallery.handleRequired": "Claim a handle to publish your gallery.",
  "gallery.titleLabel": "Title",
  "gallery.titlePlaceholder": "My WauxAiStudio Gallery",
  "gallery.description": "Description",
  "gallery.descriptionPlaceholder": "A short blurb about your tools…",
  "gallery.public": "Public",
  "gallery.publicDesc": "Anyone with the link can view your gallery.",
  "gallery.save": "Save",
  "gallery.saved": "Gallery saved.",
  "gallery.saveError": "Could not save the gallery.",
  "gallery.copyLink": "Copy link",
  "gallery.linkCopied": "Gallery link copied!",
  "gallery.openPublic": "Open public page",
  "gallery.toolsTitle": "Tools",
  "gallery.toolsHint":
    "Add tools to your gallery, then choose which are public.",
  "gallery.empty": "No tools yet — build one in the studio first.",
  "gallery.inGallery": "In gallery",
  "gallery.shownBadge": "Shown",
  "gallery.hiddenBadge": "Hidden",
  "gallery.publicTool": "Public",
  "gallery.privateTool": "Private",

  // Gallery — public page
  "gallery.publicEmpty": "This gallery has no public tools yet.",
  "gallery.notFound": "This gallery is not available.",
  "gallery.builtWith": "Built with WauxAiStudio",
  "gallery.openTool": "Open tool",

  // Builder panel
  "builder.title": "Builder",
  "builder.emptyTitle": "This tool is empty",
  "builder.emptyBody":
    "Add nodes from the Node panel. Start with a State Control.",
  "builder.addInput": "Add input",
  "builder.addNode": "Add node",
  "builder.emptyAdd": "Add first node",
  "builder.insertHere": "Insert node here",
  "builder.dropToAdd": "Drop to add node",
  "builder.tab.build": "build",
  "builder.tab.chat": "chat",
  "builder.toggleTools": "Toggle tools panel",
  "builder.toggleNode": "Toggle node panel",
  // Inline quick-add picker (builder canvas inserters)
  "quickAdd.search": "Search nodes…",
  "quickAdd.empty": "No nodes match",

  // Chat panel (UI-only preview chat)
  "chat.greeting": "How can I help you today?",
  "chat.subtitle": "Start a conversation — this is a preview interface.",
  "chat.placeholder": "Message Builder…",
  "chat.placeholder.1": "Build a PDF summarizer…",
  "chat.placeholder.2": "Create an image resizer tool…",
  "chat.placeholder.3": "Make a CSV cleaner…",
  "chat.placeholder.4": "Generate a QR code maker…",
  "chat.placeholder.5": "Build a JSON formatter…",
  "chat.send": "Send",
  "chat.stop": "Stop",
  "chat.copy": "Copy",
  "chat.copied": "Copied",
  "chat.download": "Download",
  "chat.you": "You",
  "chat.assistant": "Assistant",
  "chat.newChat": "New chat",
  "chat.export": "Export",
  "chat.export.title": "Export conversation as Markdown",
  "chat.import": "Import",
  "chat.import.title": "Import a conversation from a Markdown file",
  "chat.import.error":
    "Couldn't read that file as a chat. Use a Markdown file exported from here.",
  "chat.hint": "Enter to send · Shift + Enter for a new line",
  "chat.demoReply":
    "This is a UI-only preview, so I can’t reply for real yet — your message would be answered here.",
  "chat.suggest.1": "Build a word counter tool",
  "chat.suggest.2": "Add an AI summarizer to this tool",
  "chat.suggest.3": "Connect an HTTP request to a table",
  "chat.thinking": "Thinking…",
  "chat.thinking.1": "Thinking…",
  "chat.thinking.2": "Wiring up the nodes…",
  "chat.thinking.3": "Reading the node catalog…",
  "chat.thinking.4": "Mapping the data flow…",
  "chat.thinking.5": "Planning the build…",
  "chat.thinking.6": "Connecting state slots…",
  "chat.thinking.7": "Composing your tool…",
  "chat.thinking.8": "Crunching the chain…",
  "chat.thinking.9": "Sketching the steps…",
  "chat.thinking.10": "Almost there…",
  "chat.retry": "Retry",
  "chat.provider": "Provider",
  "chat.model": "Model",
  "chat.unread": "New reply",
  "chat.plan.title": "Review build plan",
  "chat.plan.slots": "State slots",
  "chat.plan.steps": "Steps",
  "chat.plan.confirm": "Build it",
  "chat.plan.cancel": "Cancel",
  "chat.plan.confirmed":
    'I approve this plan — build it NOW. Reply with ONLY a single fenced ```json code block containing the COMPLETE build spec for the whole tool, shaped { "name": "…", "slots": [{ "name": "…", "value": "" }], "nodes": [{ "type": "@slug", "config": { … } }] }. No prose, no plan, no extra text. The approved plan:\n{plan}',
  "chat.plan.selfFix":
    'Re-emit the COMPLETE corrected build spec for the whole tool as ONLY one fenced ```json code block ({ "slots", "nodes" }), fixing every problem against the approved plan and the current tool\'s state. Diagnose the ROOT CAUSE, not just the symptom, and keep the parts that already work. No prose. Approved plan —\n{plan}\nDo not ask again.',
  "chat.fix.title": "Reviewing & fixing",
  "chat.fix.reviewing": "Reviewing the build against the plan…",
  "chat.plan.cancelled": "Cancelled — don't build that plan.",
  "chat.plan.askApprove":
    "If this looks good, reply **yes** or **build it** and I'll create the nodes and wire them as described.",
  "chat.build.title": "Building your tool",
  "chat.build.step": "Step {n}",
  "chat.build.done": "Built your tool — {n} nodes. Check the preview.",
  "chat.build.warnings":
    "Built with {n} issue(s) to review — reply with what's wrong to fix.",
  "chat.error.spec":
    "Couldn't read a build spec from the reply. Try again or rephrase.",
  "chat.review.title": "Is this correct?",
  "chat.review.body":
    "I built the plan. Check the preview — does it work the way you wanted?",
  "chat.review.yes": "Yes, looks good",
  "chat.review.no": "No, fix it",
  "chat.review.continue": "Continue with feedback",
  "chat.review.commentPlaceholder": "Describe what's wrong (optional)…",
  "chat.review.commentHint":
    "Tell me what's wrong so the fix is targeted — wrong values, missing node, bad layout. Leave empty to let me find the root cause automatically.",
  "chat.review.yesHint":
    "The build works the way you wanted — finish and keep it.",
  "chat.review.noHint":
    "Something's off but you're not sure what — I'll find the root cause and fix it.",
  "chat.review.continueHint": "Fix the build using the notes you wrote above.",
  "chat.review.fixing": "Finding the root cause and fixing…",
  "chat.review.fixRequest":
    "The build is NOT correct. Find the root cause and fix it.",
  "chat.review.feedback": "What's wrong, in the user's words: {comment}",
  "chat.error.generic": "Something went wrong. Try again.",
  "chat.error.noKey":
    "Add a {provider} API key (key icon, left panel) to chat.",
  "chat.enhance": "Enhance",
  "chat.enhance.title":
    "Enhance — rewrite your message into a clearer prompt for building or asking",
  "chat.enhancing": "Enhancing…",
  "chat.enhance.error": "Couldn't enhance that prompt. Try again.",

  // Node panel (palette)
  "palette.title": "Node",
  "palette.search": "Filter nodes…",
  "palette.empty": "No nodes match your filter.",
  "palette.footer": "Nodes run top-to-bottom along the chain.",
  "palette.group.Data": "Data",
  "palette.group.Inputs": "Inputs",
  "palette.group.Logic": "Logic",
  "palette.group.Website Site": "Website Site",

  // Docs
  "docs.title": "Docs",
  "docs.backToStudio": "Back to Studio",
  "docs.link": "Docs",
  "docs.cardHint": "Click a node for full details",
  "docs.detail.summary": "Overview",
  "docs.detail.whenToUse": "When to use",
  "docs.detail.config": "Configuration",
  "docs.detail.io": "State in / out",
  "docs.detail.reads": "Reads",
  "docs.detail.writes": "Writes",
  "docs.detail.none": "—",
  "docs.detail.tips": "Tips",
  "docs.detail.example": "Example",
  "docs.detail.close": "Close",

  // Node card + editor chrome
  "node.duplicate": "Duplicate node",
  "node.delete": "Delete node",
  "node.back": "Back to palette",
  "node.close": "Close editor",

  // Live preview pane
  "preview.running": "Running chain…",
  "preview.empty": "Add an input node to render a preview.",
  "preview.off": "Live preview off",
  "preview.enable": "Enable preview",
  "preview.viewport.title": "Website viewport",
  "preview.viewport.invalid":
    "Invalid URL — only http(s) pages can be embedded.",
  "preview.viewport.setUrl": "Set a URL to load a website here.",
  "preview.json.invalid": "Invalid JSON: {msg}",
  "preview.csv.choose": "Choose CSV file…",
  "preview.csv.invalid": "Invalid CSV: {msg}",
  "preview.csv.summary": "{rows} rows · {cols} columns",
  "preview.csv.more": "+ {n} more rows",
  "preview.markdown.empty": "Nothing to preview yet.",
  "preview.select.placeholder": "Select…",
  "preview.file.choose": "Choose file…",
  "preview.file.loaded": "File loaded",
  "preview.image.choose": "Choose image…",
  "preview.image.change": "Change image…",
  "preview.ai.title": "AI Response",
  "preview.ai.empty": "AI response will appear here after running the chain.",

  // Node catalog — per node-type label + blurb (shown in palette, card, editor)
  "node.state.label": "State Control",
  "node.state.blurb": "Define & manage the shared state this tool operates on.",
  "node.text_run.label": "Text",
  "node.text_run.blurb":
    "Single-line field that triggers a run. Toggle run & reset to clear after running.",
  "node.button.label": "Button",
  "node.button.blurb":
    "Standalone action button that runs the chain — no text field. Optional reset button too.",
  "node.number.label": "Number",
  "node.number.blurb":
    "Numeric value with a slider + number field. Set min / max / step; two-way bound to state.",
  "node.select.label": "Select",
  "node.select.blurb":
    "Single-choice dropdown. Use a static option list or bind the options to a state array.",
  "node.toggle.label": "Toggle",
  "node.toggle.blurb": "Boolean on/off switch, two-way bound to state.",
  "node.date.label": "Date / Time",
  "node.date.blurb":
    "Date, time, or date-time picker. The native value writes straight to bound state.",
  "node.file.label": "File upload",
  "node.file.blurb":
    "Upload any file. Encodes it as text, base64, or a data URL into bound state.",
  "node.image.label": "Image upload",
  "node.image.blurb":
    "Upload an image with a live preview. Writes a data URL — feeds AI vision.",
  "node.textarea.label": "Textarea",
  "node.textarea.blurb": "Multi-line text field, e.g. a message body.",
  "node.markdown.label": "Markdown",
  "node.markdown.blurb":
    "Multi-line Markdown field with a live rendered preview toggle.",
  "node.json.label": "JSON",
  "node.json.blurb":
    "Paste or edit JSON in a code editor. Valid JSON auto-formats; raw source writes to bound state.",
  "node.csv.label": "CSV",
  "node.csv.blurb":
    "Upload a CSV file. Parsed rows (typed, empty rows/columns dropped) write to bound state as an array.",
  "node.table.label": "Table",
  "node.table.blurb":
    "Display bound array data in a sortable, resizable, paginated table. Data is auto-optimized for display.",
  "node.chart.label": "Chart",
  "node.chart.blurb":
    "Plot bound array data with d3 — bar, line, area, pie, or scatter. Columns auto-resolve from CSV/JSON.",
  "node.sprite.label": "Sprite",
  "node.sprite.blurb":
    "Play a bound sprite sheet as an animation — slice it by frame size and switch idle / intro / left / right / click tracks.",
  "node.code_input.label": "Code editor",
  "node.code_input.blurb":
    "Write or paste code in a Monaco editor with a selectable language; raw source writes to bound state.",
  "node.viewport.label": "View Port",
  "node.viewport.blurb":
    "Embed a website by URL in a sandboxed frame. Bind a state slot to drive the URL at runtime.",
  "node.convert_html.label": "Convert to HTML",
  "node.convert_html.blurb":
    "Copy a View Port page's static layout — HTML with its CSS inlined — into a state slot.",
  "node.themed.label": "Themed",
  "node.themed.blurb":
    "Read static page HTML from state and click any element to recolor it — every identical element updates too.",
  "node.html_sanitize.label": "HTML Sanitize",
  "node.html_sanitize.blurb":
    "Clean HTML from a state slot with sanitize-html — strips scripts & unsafe markup; output writes to bound state.",
  "node.code.label": "Code",
  "node.code.blurb": "A code block for custom logic / processing.",
  "node.ts_type.label": "TS Type Converter",
  "node.ts_type.blurb":
    "Convert JSON from a state slot into TypeScript interfaces; output writes to bound state.",
  "node.http_request.label": "HTTP Request",
  "node.http_request.blurb":
    "Call a real API through a server proxy. Method, URL, headers & body interpolate state; response writes to bound state.",
  "node.playwright_scrape.label": "Playwright Scraper",
  "node.playwright_scrape.blurb":
    "Scrape a JS-rendered page with a real browser via the LOCAL Playwright server — log in, wait, extract by CSS selectors. Output writes to bound state.",
  "node.filter.label": "Filter",
  "node.filter.blurb":
    "Keep array rows whose field matches a condition; output writes to bound state.",
  "node.map.label": "Map / Transform",
  "node.map.blurb":
    "Reshape array rows into new objects by mapping output keys to source paths.",
  "node.sort.label": "Sort",
  "node.sort.blurb":
    "Order an array by a field, as text / number / date, ascending or descending.",
  "node.merge.label": "Merge / Join",
  "node.merge.blurb":
    "Join two state arrays on a key — right fields spread over matching left rows.",
  "node.template.label": "Template / String",
  "node.template.blurb":
    "Interpolate {{name}} state tokens into a text template; result writes to bound state.",
  "node.regex.label": "Regex",
  "node.regex.blurb":
    "Test, match, extract groups, or replace over a string with a regular expression.",
  "node.jsonpath.label": "JSONPath / Query",
  "node.jsonpath.blurb":
    "Pull a nested value out of JSON with a dotted/bracketed path (e.g. data.items[0].name).",
  "node.math.label": "Math / Expression",
  "node.math.blurb":
    "Evaluate a math expression over state (e.g. price * qty, sqrt, units, fractions) via mathjs; no JS eval.",
  "node.schema_validate.label": "Schema Validate",
  "node.schema_validate.blurb":
    "Check JSON shape against required field + type rules; writes a boolean to gate the chain.",
  "node.encode.label": "Encode / Decode",
  "node.encode.blurb":
    "Base64 / URL encode-decode, or a one-way SHA-256 hash over a string; output writes to state.",
  "node.ai.label": "AI",
  "node.ai.blurb":
    "Ask Gemini or OpenRouter. Interpolate state via {{name}} in the prompt; reply writes to bound state.",

  // Node editor — shared field labels / placeholders
  "field.fieldLabel": "Field label",
  "field.description": "Description",
  "field.descPlaceholder": "Optional helper text shown below the label",
  "field.placeholder": "Placeholder",
  "field.buttonText": "Button text",
  "field.runButtonText": "Run button text",
  "field.resetButtonText": "Reset button text",
  "field.stateBinding": "State binding",
  "field.stateBinding.help": "Which state this node reads from / writes to.",
  "field.editorHeight": "Editor height (px)",
  "field.editorHeight.help":
    "Initial field height in the preview ({min}–{max}px).",
  "field.noState": "— no state —",
  "field.pickState": "Pick state…",
  "field.none": "— none —",

  // Node editor — toggles
  "toggle.runButton": "Run button",
  "toggle.runButton.desc": "Show a run button and submit on Enter.",
  "toggle.resetButton": "Reset button",
  "toggle.resetButton.descText":
    "Clear the field after each run and show a reset button.",
  "toggle.resetButton.descButton":
    "Show a reset button beside the action button.",

  // Node editor — run/reset targets
  "targets.run": "Run targets",
  "targets.reset": "Reset targets",
  "targets.run.empty":
    "No code, TS type, or AI nodes in this tool yet. Add some to target them.",
  "targets.reset.empty":
    "No code nodes in this tool yet. Add some to target them.",
  "targets.all": "All {n} nodes",
  "targets.selected": "{n} selected",
  "targets.help.runAll": "Nothing checked — run the whole chain.",
  "targets.help.resetAll": "Nothing checked — reset the whole chain.",
  "targets.help.runSome": "Runs {n} selected nodes, in chain order.",
  "targets.help.resetSome": "Resets {n} selected nodes, in chain order.",

  // Node editor — State Control
  "state.unnamed": "unnamed",
  "state.copyName": "Copy variable name",
  "state.options": "Variable options",
  "state.rename": "Rename variable",
  "state.setDefault": "Set default value",
  "state.remove": "Remove variable",
  "state.defaultPlaceholder": "default value",
  "state.add": "Add state",

  // Node editor — AI
  "ai.provider": "Provider",
  "ai.model": "Model",
  "ai.model.help": "Pick from list or type any model id.",
  "ai.prompt": "Prompt",
  "ai.prompt.help": "Use {{stateName}} to interpolate state.",
  "ai.output": "Output state",
  "ai.output.help": "Model reply writes here.",
  "ai.markdownOut": "Markdown output",
  "ai.markdownOut.desc": "Render reply as Markdown in the preview.",

  // Node editor — TS Type Converter
  "tstype.descPlaceholder": "What this converter is for",
  "tstype.root": "Root type name",
  "tstype.root.help": "Name of the generated top-level interface/type.",
  "tstype.input": "Input state (JSON source)",
  "tstype.input.help":
    "State slot holding the JSON to convert — bind a JSON input node here.",
  "tstype.output": "Output state (TypeScript)",
  "tstype.output.help":
    "Generated declarations write here. Updates live as the JSON changes; invalid JSON keeps the last output (runs report the parse error).",

  // Node editor — HTML Sanitize
  "sanitize.descPlaceholder": "What this sanitizer is for",
  "sanitize.input": "Input state (HTML)",
  "sanitize.input.help":
    "State slot holding the raw HTML — bind a Convert to HTML node’s output here.",
  "sanitize.output": "Output state (clean HTML)",
  "sanitize.output.help":
    "Sanitized HTML writes here. Updates live as the input changes — bind a Themed node to recolor the cleaned page.",
  "sanitize.keepStyles": "Keep styles",
  "sanitize.keepStyles.desc":
    "Preserve <style> blocks, inline style, and class/id (keeps theming intact). Synced across all HTML Sanitize nodes.",
  "sanitize.keepImages": "Keep images",
  "sanitize.keepImages.desc":
    "Preserve <img>/<picture> and their src, including data: image URIs. Synced across all HTML Sanitize nodes.",
  "sanitize.footer":
    "Always strips scripts, event handlers, unsafe URL schemes, and embedding tags (iframe / object / embed). Runs in the chain and live as the input changes.",

  // Node editor — website shared
  "web.defaultScreen": "Default screen",
  "web.pickScreen": "Pick screen…",
  "web.defaultScreen.help":
    "Screen the preview opens with — end users can still switch between fill / desktop / mobile. Fixed screens render at device width and scale to fit (width simulation; the site still sees a desktop browser).",
  "web.livePreview": "Live preview",
  "web.livePreview.desc":
    "Render the frame in the preview. Off by default — saves loading the page until you turn it on.",

  // Node editor — View Port
  "viewport.url": "URL",
  "viewport.url.help":
    "Page shown in the preview. A bare domain gets https:// prepended.",
  "viewport.urlState": "URL state (optional)",
  "viewport.urlState.help":
    "When the bound state holds a non-empty string it overrides the URL above — bind a text input or write it from a code node.",
  "viewport.footer":
    "The page loads in a sandboxed iframe. Sites that forbid embedding (X-Frame-Options / frame-ancestors) render blank — that is the remote site’s policy, not an error in your tool.",

  // Node editor — Convert to HTML
  "convert.source": "Source View Port",
  "convert.pickVp": "Pick View Port…",
  "convert.auto": "Auto — first View Port",
  "convert.vpFallback": "View Port",
  "convert.source.helpEmpty":
    "No View Port nodes yet — add one; this node copies its page.",
  "convert.source.help":
    "Whose page gets copied. Tracks the View Port’s URL, including state-driven overrides.",
  "convert.output": "Output state (HTML)",
  "convert.output.help":
    "The page’s static HTML (CSS inlined) writes here — bind a Themed node or read it from code nodes.",
  "convert.footer":
    "Copies the page’s static layout server-side — HTML with its linked CSS inlined, scripts removed — shows the snapshot, and offers a copy-to-clipboard button in the preview.",

  // Node editor — Themed
  "themed.htmlState": "HTML state",
  "themed.htmlState.help":
    "State slot holding the static page HTML to recolor — bind a Convert to HTML node’s output here. No View Port connection.",
  "themed.footer":
    "Click any element in the preview to recolor it — every identical element (same tag & classes) updates too. Scripts removed.",

  // Node editor — Code
  "code.descPlaceholder": "What this code block does",
  "code.code": "Code",
  "code.code.help":
    "Runs top-to-bottom in the chain; reads & writes state directly.",

  // Node editor — Button
  "button.labelOptional": "Label (optional)",
  "button.labelPlaceholder": "Heading shown above the button",
  "button.footer": "Runs over current state — no input field.",

  // Node editor — Markdown / JSON / CSV / Table / Code editor helpers
  "markdown.help":
    "End users write Markdown and can toggle a live rendered preview.",
  "json.help":
    "End users paste or edit JSON in a code editor; valid JSON auto-formats. The raw source string lands in the bound state — use JSON.parse(state.get(…)) in code nodes.",
  "csv.header": "Header row",
  "csv.header.desc":
    "First row is column names — rows become objects keyed by header.",
  "csv.help":
    "End users upload a .csv file. The parsed rows land in the bound state as an array (typed values, empty rows/columns dropped) — iterate state.get(…) directly in code nodes.",
  "table.rowsPerPage": "Rows per page",
  "table.pickPageSize": "Pick page size…",
  "table.rows": "{n} rows",
  "table.help":
    "Default page size in the preview — end users can switch between {sizes}.",
  "table.footer":
    "Displays the bound state as a table — bind an array (e.g. CSV rows, a JSON array, or a code-node result). Data is auto-optimized for display; every column sorts (text, numbers, and auto-detected dates) and resizes by dragging the header edge.",
  "chart.type": "Chart type",
  "chart.pickType": "Pick chart type…",
  "chart.type.help":
    "Bar / line / area plot value columns against the category axis; pie sizes slices by the first value column; scatter plots the first two numeric columns.",
  "chart.xField": "X / category field",
  "chart.xFieldPlaceholder": "auto-detect",
  "chart.xField.help":
    "Column for the x-axis / category. Leave blank to auto-detect (first text or date column).",
  "chart.yFields": "Value fields (Y)",
  "chart.yFields.help":
    "Columns to plot, aggregated per category — numeric columns are summed, text/date columns are counted. Leave empty to auto-detect numeric columns (or count rows when there are none). Add several for grouped bars / multiple lines.",
  "chart.fieldPlaceholder": "column name",
  "chart.addField": "Add value field",
  "chart.removeField": "Remove value field",
  "chart.height": "Chart height (px)",
  "chart.height.help": "Chart height in the preview ({min}–{max}px).",
  "chart.showLegend": "Legend",
  "chart.showLegend.desc": "Show a legend for the series / categories.",
  "chart.showGrid": "Gridlines",
  "chart.showGrid.desc": "Show axis gridlines (cartesian charts only).",
  "chart.footer":
    "Plots the bound state — bind an array (e.g. CSV rows, a JSON array, or a code-node result). Columns auto-resolve: the first text/date column is the category axis and numeric columns become value series. Override either above.",
  "chart.empty":
    "No chartable data in the bound state yet. Bind an array (e.g. from a CSV, JSON, or code node) with at least one numeric column.",
  "sprite.frameWidth": "Frame width (px)",
  "sprite.frameHeight": "Frame height (px)",
  "sprite.fps": "Speed (fps)",
  "sprite.fps.help": "Playback speed in frames per second ({min}–{max}).",
  "sprite.animations": "Animations",
  "sprite.animations.help":
    "Each track is a control button. Bind its own sheet, or leave on default frames to reuse the node's binding. Toggle loop off for one-shot tracks (they settle back to idle).",
  "sprite.loop": "Loop",
  "sprite.defaultSheet": "Default frames",
  "sprite.footer":
    "Plays a bound sprite sheet (one image sliced into frame-sized cells, left-to-right) or an array of frame images. Bind the sheet under State binding above.",
  "sprite.empty":
    "No sprite bound yet. Bind a sprite sheet image (URL or data URL) — it's sliced into frames by the width & height above.",
  "sprite.play": "Play",
  "sprite.pause": "Pause",
  "sprite.action.idle": "Idle",
  "sprite.action.intro": "Intro",
  "sprite.action.left": "Left",
  "sprite.action.right": "Right",
  "sprite.action.click": "Click",
  "codeInput.language": "Language",
  "codeInput.pickLanguage": "Pick language…",
  "codeInput.language.help":
    "Drives syntax highlighting in the preview editor.",
  "codeInput.help":
    "End users write or paste code in a Monaco editor. The raw source string lands in the bound state — it is never executed.",

  // Number node
  "number.min": "Min",
  "number.max": "Max",
  "number.step": "Step",
  "number.help":
    "End users drag the slider or type a value. The number is written to the bound state as a string.",

  // Select node
  "select.options": "Options",
  "select.labelPlaceholder": "Label",
  "select.valuePlaceholder": "Value",
  "select.addOption": "Add option",
  "select.removeOption": "Remove option",
  "select.optionsState": "Options from state",
  "select.optionsState.help":
    "Optional. Bind a state slot holding an array (of strings or {value, label} objects) to drive the options at runtime — overrides the static list above.",

  // Toggle node
  "toggle.help":
    'Renders an on/off switch. The bound state holds "true" or "false".',

  // Date / Time node
  "date.mode": "Picker",
  "date.mode.help": "Which native picker the end user sees.",

  // File upload node
  "file.format": "Output format",
  "file.format.help":
    "How the chosen file is encoded into state: Text (UTF-8 contents), Base64 (raw, no prefix), or a Data URL.",
  "file.accept": "Accept filter",
  "file.accept.help":
    "Optional native filter (e.g. .pdf,.txt or image/*). Leave blank to allow any file.",

  // Image upload node
  "image.help":
    "End users upload an image; a data URL is written to the bound state — ready to feed an AI vision prompt or render elsewhere.",

  // Shared logic-node fields
  "logic.input": "Input state",
  "logic.output": "Output state",
  "logic.field": "Field path",
  "logic.field.help":
    "Dotted path into each row (e.g. user.name, items[0].name). Keys with spaces work as-is (e.g. Happy Birthday). Start with $ for full JSONPath (e.g. $.items[*].price, $['Happy Birthday']). Leave blank for the row itself.",

  // HTTP Request node
  "http.method": "Method",
  "http.url": "URL",
  "http.url.help":
    "Supports {{state}} interpolation. Requested through a server proxy (public http(s) only).",
  "http.headers": "Headers",
  "http.addHeader": "Add header",
  "http.removeHeader": "Remove header",
  "http.headerKey": "Header",
  "http.headerValue": "Value",
  "http.input": "Input state",
  "http.input.help":
    "Optional: bind a state slot to reference as {{input}} in the URL, headers, or body.",
  "http.body": "Body",
  "http.body.help":
    "Sent for POST / PUT / PATCH. Supports {{state}} interpolation.",
  "http.responseType": "Response",
  "http.output.help":
    "The parsed response is written here. JSON responses land as a parsed value.",
  "http.footer":
    "Runs only when the chain runs — never live as you type. Auth headers stay server-side.",

  // Playwright Scraper node
  "scrape.serverUrl": "Server URL (local)",
  "scrape.serverUrl.help":
    "Base URL of the LOCAL Playwright scrape server in this repo, e.g. http://localhost:3001/scrape. Run it with `pnpm --dir playwright serve` — there is no hosted default.",
  "scrape.url": "Page URL",
  "scrape.url.help":
    "The page (or login page) to open first. Supports {{state}} interpolation.",
  "scrape.waitUntil": "Wait until",
  "scrape.waitForSelector": "Wait for selector",
  "scrape.waitForSelector.help":
    "Optional CSS selector to wait for after navigation/actions, before extracting (e.g. a known element on a JS-rendered page).",
  "scrape.timeout": "Timeout (ms)",
  "scrape.selectors": "Selectors",
  "scrape.selectors.help":
    "One rule per output key. Default returns the first match's text; toggle All for an array, or pick HTML / Metadata, or enter an attribute. Selector & attribute support {{state}} interpolation.",
  "scrape.sel.key": "Output key (e.g. title)",
  "scrape.sel.selector": "CSS selector (e.g. h1)",
  "scrape.sel.attr": "Attribute (e.g. href) — blank = text",
  "scrape.sel.all": "All",
  "scrape.sel.html": "HTML",
  "scrape.sel.meta": "Metadata",
  "scrape.sel.excludeClass": "No class",
  "scrape.sel.add": "Add selector",
  "scrape.sel.remove": "Remove selector",
  "scrape.actions": "Actions",
  "scrape.actions.help":
    "Optional ordered steps run before extraction — use them to log in, then navigate. String fields support {{state}} interpolation.",
  "scrape.act.selector": "Selector",
  "scrape.act.value": "Value",
  "scrape.act.key": "Key (e.g. Enter)",
  "scrape.act.url": "URL (glob/regex for waitForURL)",
  "scrape.act.ms": "Milliseconds",
  "scrape.act.add": "Add action",
  "scrape.act.remove": "Remove action",
  "scrape.session": "Reuse session",
  "scrape.session.help":
    "Optional saved-session name to reuse on the server (skips the login actions). Leave blank for none.",
  "scrape.saveSession": "Save session as",
  "scrape.saveSession.help":
    "Optional name to store the logged-in session under after a successful run, so later runs can reuse it. Leave blank to not save.",
  "scrape.input": "Input state",
  "scrape.input.help":
    "Optional: bind a state slot to reference as {{input}} in the URL, selectors, or actions.",
  "scrape.output.help":
    "The full response is written here: { url, finalUrl, data, tookMs } — extracted values live under `data`.",
  "scrape.footer":
    "Runs only when the chain runs — never live as you type. Requires the local Playwright server to be running (see playwright/SCRAPE.md).",

  // Filter node
  "filter.operator": "Operator",
  "filter.value": "Value",
  "filter.op.eq": "equals",
  "filter.op.neq": "not equals",
  "filter.op.gt": "greater than",
  "filter.op.gte": "greater or equal",
  "filter.op.lt": "less than",
  "filter.op.lte": "less or equal",
  "filter.op.contains": "contains",
  "filter.op.startsWith": "starts with",
  "filter.op.endsWith": "ends with",
  "filter.op.exists": "exists",
  "filter.op.notExists": "does not exist",
  "filter.help":
    "Keeps rows from the input array where the field satisfies the condition.",

  // Map node
  "map.fields": "Field mapping",
  "map.to": "Output key",
  "map.from": "Source path",
  "map.addField": "Add field",
  "map.removeField": "Remove field",
  "map.help":
    "Builds a new object per row: each output key copies the value at its source path.",

  // Sort node
  "sort.direction": "Direction",
  "sort.type": "Compare as",
  "sort.dir.asc": "Ascending",
  "sort.dir.desc": "Descending",
  "sort.type.string": "Text",
  "sort.type.number": "Number",
  "sort.type.date": "Date",
  "sort.help": "Orders the input array by the field path.",

  // Merge / Join node
  "merge.rightInput": "Right array (state)",
  "merge.leftKey": "Left key",
  "merge.rightKey": "Right key",
  "merge.joinKind": "Join",
  "merge.join.inner": "Inner (matched only)",
  "merge.join.left": "Left (keep unmatched)",
  "merge.help":
    "Joins left + right rows where the keys match; right fields override left.",

  // Template node
  "template.template": "Template",
  "template.template.help":
    "Use {{stateName}} tokens. They are replaced with the current state values.",

  // Regex node
  "regex.pattern": "Pattern",
  "regex.flags": "Flags",
  "regex.mode": "Mode",
  "regex.replacement": "Replacement",
  "regex.replacement.help":
    "Used in Replace mode. Supports $1, $2… group references.",
  "regex.mode.test": "Test (true/false)",
  "regex.mode.match": "Match",
  "regex.mode.extract": "Extract groups",
  "regex.mode.replace": "Replace",
  "regex.help": "Runs the regular expression over the input string.",

  // JSONPath node
  "jsonpath.path": "Path",
  "jsonpath.path.help":
    "Dotted / bracketed path, e.g. data.items[0].name. Start with $ for full JSONPath: $.items[*].price (all prices), $..name (recursive), $.items[?(@.price>10)] (filter), $['Happy Birthday'] (spaced key). Many matches return an array.",
  "jsonpath.help": "Resolves a nested value out of the input JSON.",
  "jsonpath.docs.title": "JSONPath cheatsheet",
  "jsonpath.docs": `Two path styles are supported.

SIMPLE (no leading $)
  status              top-level key
  user.name          nested key
  items[0]           array index
  items[0].name      index then key
  Happy Birthday     keys may contain spaces
  (a literal dot inside a key name is NOT reachable here — use $ form)

JSONPATH (start with $)
  $                   the whole input
  $.user.name        nested key
  $['Happy Birthday'] key with spaces / dots — bracket-quote it
  $[*]                every item of a root array
  $.items[*]         every item of an array
  $[*]['Last Name']  one field from every row  →  array
  $..name             recursive — name at any depth
  $.items[0,2]        multiple indexes
  $.items[1:3]        slice (start:end)
  $.items[-1:]        last item
  $.items[?(@.price>10)]      filter by expression
  $.items[?(@.active==true)]  filter by equality
  $[?(@['Last Name']=='Baxter')]  filter on a spaced key

RESULT SHAPE
  0 matches → empty / undefined
  1 match  → the value itself (scalar)
  2+ matches → an array of values

COMMON MISTAKE
  Root is already an array? Do NOT add .items.
  [{...},{...}]  →  $[*]['Last Name']   (not $.items[*]...)`,

  // Math node
  "math.expression": "Expression",
  "math.expression.help":
    "Reference state slots by name (e.g. price * qty). Powered by mathjs — functions, units, and fractions allowed; no JS eval.",
  "math.docs.title": "Expression cheatsheet",
  "math.docs": `Evaluated by mathjs. Reference any state slot by its name.

VARIABLES
  price * qty         multiply two state slots
  state1 + 5          slot plus a literal
  (a + b) / 2         parentheses group as expected
  (numeric-looking slots coerce to numbers; others pass through)

OPERATORS
  + - * /             add subtract multiply divide
  %                   modulo (remainder)
  ^                   power   →  2 ^ 10 = 1024
  ( )                 grouping

FUNCTIONS
  round(x)  floor(x)  ceil(x)  abs(x)
  sqrt(x)   cbrt(x)   pow(x,y)  exp(x)  log(x, base)
  min(a,b,...)  max(a,b,...)  mean(a,b,...)  sum(a,b,...)
  sin cos tan  (radians)  +  full mathjs library

CONSTANTS
  pi          3.14159...
  e           2.71828...

EXAMPLES
  round(total / count)           average, rounded
  sqrt(x ^ 2 + y ^ 2)            hypotenuse
  pi * r ^ 2                     circle area
  max(a, b, c)                   largest of three
  subtotal * 1.07                add 7% tax

FRACTIONS & UNITS
  1/3 + 1/6                      → 0.5
  2 inch to cm                   → 5.08 cm
  3 ft + 4 inch in cm            unit arithmetic

NOTES
  Empty expression or no output slot → node is skipped.
  Result must be a finite value; otherwise the node errors.`,

  // Schema Validate node
  "schema.rules": "Required fields",
  "schema.ruleField": "Field path",
  "schema.ruleType": "Type",
  "schema.addRule": "Add rule",
  "schema.removeRule": "Remove rule",
  "schema.errorOutput": "Errors state (optional)",
  "schema.errorOutput.help":
    "Optional state slot the newline-joined problem list is written into.",
  "schema.type.any": "Any",
  "schema.type.string": "String",
  "schema.type.number": "Number",
  "schema.type.boolean": "Boolean",
  "schema.type.object": "Object",
  "schema.type.array": "Array",
  "schema.help":
    'Writes "true"/"false" — gate the chain with a downstream Filter or Code node.',

  // Encode / Decode node
  "encode.operation": "Operation",
  "encode.help":
    "Transforms the input string. SHA-256 is a one-way hash (hex).",

  // CSV → Markdown node
  "node.csv_to_md.label": "CSV → Markdown",
  "node.csv_to_md.blurb":
    "Convert a tabular array (CSV rows, JSON array) into a GFM Markdown table; result writes to state.",
  "csv_to_md.help":
    "Reads an array from the input state (array of objects, array of arrays, or primitives) and writes a GitHub-Flavored Markdown table to the output state. Re-runs live as the input changes.",

  // Counter node
  "node.counter.label": "Counter",
  "node.counter.blurb":
    "Count words, characters, letters, lines, sentences, array items, or object keys — pick several at once; shows the live counts and writes them to state.",
  "counter.mode": "Count",
  "counter.empty": "Pick at least one metric to count.",
  "counter.mode.words": "Words",
  "counter.mode.characters": "Characters",
  "counter.mode.characters_no_spaces": "Characters (no spaces)",
  "counter.mode.letters": "Letters",
  "counter.mode.uppercase": "Uppercase",
  "counter.mode.lowercase": "Lowercase",
  "counter.mode.digits": "Digits",
  "counter.mode.punctuation": "Punctuation",
  "counter.mode.whitespace": "Whitespace",
  "counter.mode.lines": "Lines",
  "counter.mode.sentences": "Sentences",
  "counter.mode.paragraphs": "Paragraphs",
  "counter.mode.avg_word_length": "Avg word length",
  "counter.mode.avg_sentence_length": "Avg sentence length",
  "counter.mode.longest_word": "Longest word",
  "counter.mode.shortest_word": "Shortest word",
  "counter.mode.unique_words": "Unique words",
  "counter.mode.array_items": "Array items",
  "counter.mode.object_keys": "Object keys",
  "counter.help":
    "Reads the input state, tallies every selected metric, and writes them to the output state as a { metric: number } object. Text metrics coerce the input to a string; array / object metrics parse it as JSON. Re-runs live as the input changes.",

  // Download node
  "node.download.label": "Download",
  "node.download.blurb":
    "Render a download button that exports bound state as CSV, Markdown, SVG, PNG, or JPEG.",
  "download.format": "Format",
  "download.format.help":
    "File format to export. CSV: array or string. PNG/JPEG: data URL or SVG string rendered to canvas. MD/SVG: plain text.",
  "download.fileName": "File name",
  "download.fileName.placeholder": "export",
  "download.fileName.help":
    'Base file name without extension (e.g. "report" → "report.csv").',
  "download.buttonText": "Button text",
  "download.help":
    "Renders a download button in the preview. Reads the bound state slot and exports its content as the chosen format.",

  // Vault node
  "node.vault.label": "Vault",
  "node.vault.blurb":
    "Store key/value pairs in a detail view. Assembled into an object on bound state for downstream nodes; mask values to hide tokens & secrets.",
  "vault.entries": "Key / value pairs",
  "vault.keyPlaceholder": "key",
  "vault.valuePlaceholder": "value",
  "vault.addEntry": "Add pair",
  "vault.removeEntry": "Remove pair",
  "vault.masked": "Mask values",
  "vault.masked.desc":
    "Hide values behind dots in the preview, with a reveal toggle.",
  "vault.empty": "Add a key / value pair to store.",
  "vault.reveal": "Reveal",
  "vault.hide": "Hide",
  "vault.copy": "Copy value",
  "vault.copied": "Copied",
  "vault.help":
    "Each pair with a non-empty key is written to the bound state slot as a { key: value } object (later duplicate keys win). Masking only affects the preview — the stored values are unchanged.",

  // Identity node
  "node.identity.label": "Identity",
  "node.identity.blurb":
    "Generate fake data with faker.js. A JSON template of @modifiers (e.g. @firstName, @email) produces N records written to bound state.",
  "identity.count": "Records",
  "identity.count.help": "How many records to generate (0–{max}).",
  "identity.seed": "Seed",
  "identity.regenerate": "Regenerate (new seed)",
  "identity.template": "Template",
  "identity.template.help":
    'JSON shape for one record. Put @modifiers in string values — e.g. "@firstName" or "@firstName @lastName". A value that is exactly one token keeps its native type (number / boolean).',
  "identity.modifiers": "Modifiers",
  "identity.modifiers.help":
    "Click a token to copy it, then paste into the template. Tokens are case-insensitive.",
  "identity.help":
    "Generates the record array deterministically from the template, count, and seed, and writes it to the bound state slot. Change the seed (or hit Regenerate) for a fresh dataset.",
  "identity.empty": "Set a record count above 0 to generate.",
  "identity.invalidTemplate":
    "Template is not valid JSON — fix it to generate records.",
  "identity.recordCount": "{n} records",
  "identity.more": "+{n} more not shown",

  // Common
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.rename": "Rename",
  "common.copy": "Copy",
  "common.save": "Save",

  // Welcome splash (post-login branding screen)
  "welcome.eyebrow": "Welcome back",
  "welcome.title": "Your studio is ready.",
  "welcome.subtitle":
    "Compose tools as a top-to-bottom chain of input, logic, and output nodes — with a live, interactive preview. No backend required.",
  "welcome.enter": "Enter studio",
  "welcome.node.input": "Input",
  "welcome.node.logic": "Logic",
  "welcome.node.output": "Output",

  // --- Excel (xlsx) node ---
  "node.xlsx.label": "Excel",
  "node.xlsx.blurb":
    "Upload an Excel workbook (.xlsx/.xls). The chosen sheet is parsed (typed, empty rows/columns dropped) and written to bound state as an array.",
  "xlsx.sheet": "Sheet",
  "xlsx.sheet.placeholder": "First sheet",
  "xlsx.sheet.help": "Worksheet to read. Leave blank for the first sheet.",
  "xlsx.help":
    "Uploads parse client-side into a typed array on the bound state — like the CSV node, for Excel.",
  "preview.xlsx.choose": "Choose Excel file…",
  "preview.xlsx.invalid": "Invalid workbook: {msg}",
  "preview.xlsx.summary": "{rows} rows · {cols} columns",
  "preview.xlsx.more": "+{n} more rows",
  "preview.xlsx.sheet": "Worksheet",

  // --- Aggregate node ---
  "node.aggregate.label": "Aggregate",
  "node.aggregate.blurb":
    "Group an array by columns and roll each group up — count, sum, mean, median, min, max & more — via Arquero; result writes to bound state.",
  "aggregate.groupBy": "Group by",
  "aggregate.groupBy.placeholder": "column",
  "aggregate.groupBy.help":
    "Top-level column names to group rows by. Leave empty to reduce the whole array to one row.",
  "aggregate.addGroupBy": "Add group-by column",
  "aggregate.removeGroupBy": "Remove group-by column",
  "aggregate.aggregations": "Aggregations",
  "aggregate.addAggregation": "Add aggregation",
  "aggregate.removeAggregation": "Remove aggregation",
  "aggregate.field.placeholder": "column",
  "aggregate.as.placeholder": "output name (optional)",
  "aggregate.allRows": "whole group",
  "aggregate.help":
    "Each group becomes one row of the chosen aggregate columns. The result writes to the bound state as an array.",
  "aggregate.op.count": "Count",
  "aggregate.op.sum": "Sum",
  "aggregate.op.mean": "Mean",
  "aggregate.op.median": "Median",
  "aggregate.op.mode": "Mode",
  "aggregate.op.min": "Min",
  "aggregate.op.max": "Max",
  "aggregate.op.distinct": "Distinct",
  "aggregate.op.stdev": "Std dev",
  "aggregate.op.variance": "Variance",

  // --- Mermaid (Diagram) node ---
  "node.mermaid.label": "Diagram",
  "node.mermaid.blurb":
    "Render a Mermaid definition from a state slot as a flowchart, sequence, pie, gantt, or class diagram.",
  "mermaid.theme": "Theme",
  "mermaid.theme.default": "Default",
  "mermaid.theme.neutral": "Neutral",
  "mermaid.theme.dark": "Dark",
  "mermaid.theme.forest": "Forest",
  "mermaid.help":
    "Bind a state slot holding a Mermaid definition (e.g. from a Textarea, Code, or AI node).",
  "mermaid.empty":
    "Bind a state slot with a Mermaid definition to render a diagram.",
  "mermaid.invalid": "Diagram error: {msg}",

  // --- Highlight (Code View) node ---
  "node.highlight.label": "Code View",
  "node.highlight.blurb":
    "Show code from a state slot as a syntax-highlighted, read-only block (Shiki) — pick the language & theme.",
  "highlight.theme": "Theme",
  "highlight.lineNumbers": "Line numbers",
  "highlight.lineNumbers.desc": "Show a line-number gutter beside the code.",
  "highlight.help":
    "Reads code from the bound state slot and renders it read-only with Shiki syntax highlighting.",
  "highlight.empty": "Bind a state slot with code to highlight.",
  "highlight.copy": "Copy code",
  "highlight.copied": "Copied",

  // --- QR Code node ---
  "node.qrcode.label": "QR Code",
  "node.qrcode.blurb":
    "Encode a string from a state slot as a crisp SVG QR code with adjustable size & error-correction level.",
  "qrcode.size": "Size (px)",
  "qrcode.level": "Error correction",
  "qrcode.level.L": "Low (7%)",
  "qrcode.level.M": "Medium (15%)",
  "qrcode.level.Q": "Quartile (25%)",
  "qrcode.level.H": "High (30%)",
  "qrcode.help":
    "Encodes the bound state slot's text as a QR code. Pair with a Download node (SVG/PNG) to export it.",
  "qrcode.empty": "Bind a state slot with text or a URL to encode.",
  "qrcode.invalid": "Could not encode: {msg}",

  // --- Text to Speech node ---
  "node.tts.label": "Text to Speech",
  "node.tts.blurb":
    "Speak a string from a state slot aloud with the browser voice — tune speed, pitch & volume, optionally highlight words.",
  "tts.rate": "Speed",
  "tts.pitch": "Pitch",
  "tts.volume": "Volume",
  "tts.highlight": "Highlight words",
  "tts.highlight.desc": "Highlight each word in the preview as it is spoken.",
  "tts.help":
    "Reads the bound state slot aloud with the browser's speech engine. Voices depend on the user's device/browser.",
  "tts.empty": "Bind a state slot with text to speak.",
  "tts.play": "Play",
  "tts.pause": "Pause",
  "tts.resume": "Resume",
  "tts.stop": "Stop",

  // --- Speech to Text node ---
  "node.stt.label": "Speech to Text",
  "node.stt.blurb":
    "Dictate into the microphone — the browser transcribes your speech and writes the live transcript to a state slot.",
  "stt.lang": "Language (BCP-47)",
  "stt.continuous": "Continuous",
  "stt.continuous.desc":
    "Keep listening after a pause instead of stopping on the first silence.",
  "stt.help":
    "Writes the live microphone transcript to the bound state slot. Recognition runs entirely in the user's browser.",
  "stt.start": "Record",
  "stt.stop": "Stop",
  "stt.listening": "Listening…",
  "stt.empty": "Press Record and start speaking.",
  "stt.unsupported": "This browser does not support speech recognition.",
} as const;

/** A valid translation key. */
export type MessageKey = keyof typeof en;

/** Burmese (my) translations — must cover every {@link MessageKey}. */
const my: Record<MessageKey, string> = {
  "topbar.tools": "ကိရိယာများ",
  "topbar.home": "ပင်မစာမျက်နှာ",
  "topbar.save": "သိမ်းမည်",
  "topbar.saving": "သိမ်းနေသည်…",
  "topbar.saved": "သိမ်းပြီး",
  "topbar.error": "အမှား",
  "topbar.fullscreen": "မျက်နှာပြင်အပြည့်",
  "topbar.exitFullscreen": "မျက်နှာပြင်အပြည့် ထွက်ရန်",
  "topbar.signOut": "ထွက်မည်",

  "settings.title": "ဆက်တင်များ",
  "settings.subtitle": "ဦးစားပေးချက်များကို ဤစက်ပစ္စည်းတွင်သာ သိမ်းဆည်းသည်။",
  "settings.reset": "မူလအတိုင်း ပြန်ထားမည်",
  "settings.legal": "ဥပဒေဆိုင်ရာ",
  "settings.privacy": "ကိုယ်ရေးအချက်အလက် မူဝါဒ",
  "settings.terms": "စည်းမျဉ်းနှင့် သတ်မှတ်ချက်များ",

  "settings.theme": "အသွင်အပြင်",
  "settings.theme.desc": "အက်ပ်အတွက် အရောင်စနစ်။",
  "theme.light": "အလင်း",
  "theme.dark": "အမှောင်",
  "theme.system": "စနစ်အလိုက်",
  "theme.switchToLight": "အလင်းမုဒ်သို့ ပြောင်းရန်",
  "theme.switchToDark": "အမှောင်မုဒ်သို့ ပြောင်းရန်",
  "header.github": "GitHub တွင် source ကြည့်ရန်",

  "settings.language": "ဘာသာစကား",
  "settings.language.desc": "မျက်နှာပြင် ပြသမည့်ဘာသာစကား။",

  "settings.reducedMotion": "လှုပ်ရှားမှု လျှော့ချ",
  "settings.reducedMotion.desc":
    "အက်ပ်တစ်ခုလုံးရှိ အန်နီမေးရှင်းနှင့် အကူးအပြောင်းများကို လျှော့ချသည်။",
  "settings.autoSave": "အလိုအလျောက် သိမ်းဆည်း",
  "settings.autoSave.desc":
    "Save ကိုမနှိပ်ဘဲ ကိရိယာအပြောင်းအလဲများကို အလိုအလျောက် သိမ်းဆည်းသည်။",
  "settings.confirmBeforeDelete": "မဖျက်မီ အတည်ပြုခိုင်း",
  "settings.confirmBeforeDelete.desc":
    "ကိရိယာ သို့မဟုတ် node တစ်ခုကို မဖျက်မီ အတည်ပြုချက်တောင်းသည်။",
  "settings.sidebarCollapsed": "Sidebar ကို မူရင်းအတိုင်း ခေါက်ထား",
  "settings.sidebarCollapsed.desc":
    "ကိရိယာ sidebar ကို ခေါက်ထားသည့်အနေအထားဖြင့် စတင်သည်။",

  "tools.title": "ကိရိယာများ",
  "tools.new": "ကိရိယာ အသစ်",
  "tools.search": "ကိရိယာ ရှာရန်…",
  "tools.options": "ကိရိယာ ရွေးချယ်စရာများ",
  "tools.preview": "အစမ်းကြည့်",
  "tools.rename": "အမည်ပြောင်း",
  "tools.generateName": "အမည် ထုတ်ပေး",
  "tools.generating": "အမည် ထုတ်နေသည်…",
  "tools.generateSuccess": "“{name}” အဖြစ် အမည်ပြောင်းပြီးပါပြီ။",
  "tools.generateError": "အမည် ထုတ်၍ မရပါ။",
  "tools.generateEmpty": "node အရင် ထည့်ပါ — အမည်ပေးစရာ မရှိသေးပါ။",
  "tools.share": "မျှဝေ",
  "tools.duplicate": "ပွားယူ",
  "tools.delete": "ဖျက်",
  "tools.empty": "ကိရိယာ မရှိသေးပါ — တစ်ခု ဖန်တီး၍ စတင်ပါ။",
  "tools.noMatch": "“{q}” နှင့် ကိုက်ညီသော ကိရိယာ မရှိပါ။",
  "tools.deleteTitle": "ကိရိယာ ဖျက်မလား။",
  "tools.deleteBodyTail":
    "နှင့် ၎င်း၏ node အားလုံးကို အပြီးအပိုင် ဖျက်ပစ်မည်။ ပြန်လည် ရယူ၍ မရပါ။",
  "tools.shareError": "မျှဝေခြင်း ဖွင့်၍ မရပါ။",
  "tools.shareCopied": "မျှဝေ လင့်ခ် ကူးယူပြီးပါပြီ။",
  "tools.previewError": "အစမ်းကြည့်ခြင်း ဖွင့်၍ မရပါ။",
  "tools.popupBlocked":
    "Pop-up ပိတ်ထားသည် — အစမ်းကြည့်ရန် pop-up ကို ခွင့်ပြုပါ။",
  "tools.editIcon": "Icon ပြင်ဆင်",
  "tools.iconTitle": "ကိရိယာ Icon",
  "tools.iconDesc":
    "SVG ကို ကူးထည့်/ပြင်ဆင်ပါ၊ သို့မဟုတ် ဤကိရိယာ၏ လုပ်ဆောင်ချက်အရ AI ဖြင့် ထုတ်ပါ။",
  "tools.iconCode": "SVG ကုဒ်",
  "tools.iconPlaceholder": '<svg viewBox="0 0 24 24">…</svg>',
  "tools.iconGenerate": "AI ထုတ်ပေး",
  "tools.iconGenerating": "Icon ထုတ်နေသည်…",
  "tools.iconGenerateSuccess": "Icon ထုတ်ပြီးပါပြီ။",
  "tools.iconGenerateError": "Icon ထုတ်၍ မရပါ။",
  "tools.iconInvalid": "၎င်းသည် မှန်ကန်သော SVG icon ပုံစံ မဟုတ်ပါ။",
  "tools.iconSaved": "Icon ပြင်ဆင်ပြီးပါပြီ။",
  "tools.iconClear": "Icon ရှင်းလင်း",
  "tools.iconEmptyPreview": "Icon မရှိသေးပါ",

  // Gallery — per-tool actions + toasts
  "gallery.addToGallery": "ပြခန်းသို့ ထည့်",
  "gallery.removeFromGallery": "ပြခန်းမှ ဖယ်",
  "gallery.makePublic": "အများမြင် ပြုလုပ်",
  "gallery.makePrivate": "သီးသန့် ပြုလုပ်",
  "gallery.added": "ပြခန်းသို့ ထည့်ပြီးပါပြီ။",
  "gallery.removed": "ပြခန်းမှ ဖယ်ပြီးပါပြီ။",
  "gallery.madePublic": "ကိရိယာ အခု အများမြင် ဖြစ်ပါပြီ။",
  "gallery.madePrivate": "ကိရိယာ အခု သီးသန့် ဖြစ်ပါပြီ။",
  "gallery.flagError": "ပြခန်း ပြင်ဆင်၍ မရပါ။",

  // Gallery — top bar + manage page
  "gallery.link": "ပြခန်း",
  "gallery.title": "ပြခန်း",
  "gallery.subtitle": "သင့်ကိရိယာများ၏ အများမြင် ပြခန်း။",
  "gallery.back": "Studio သို့ ပြန်",
  "gallery.settings": "ပြခန်း ဆက်တင်များ",
  "gallery.handle": "Handle",
  "gallery.handleHint":
    "သင့် အများမြင် URL။ စာလုံးအသေး၊ ဂဏန်း နှင့် hyphen များ။",
  "gallery.handlePlaceholder": "your-handle",
  "gallery.handleTaken": "ထို handle ကို အသုံးပြုပြီးသား ဖြစ်နေပါသည်။",
  "gallery.handleInvalid":
    "စာလုံးအသေး၊ ဂဏန်း သို့မဟုတ် hyphen ၃–၃၂ လုံး အသုံးပြုပါ။",
  "gallery.handleRequired": "ပြခန်း ထုတ်ဝေရန် handle တစ်ခု ယူပါ။",
  "gallery.titleLabel": "ခေါင်းစဉ်",
  "gallery.titlePlaceholder": "ကျွန်ုပ်၏ ကိရိယာ ပြခန်း",
  "gallery.description": "ဖော်ပြချက်",
  "gallery.descriptionPlaceholder": "သင့်ကိရိယာများအကြောင်း အတိုချုပ်…",
  "gallery.public": "အများမြင်",
  "gallery.publicDesc": "လင့်ခ်ရှိသူ မည်သူမဆို သင့်ပြခန်းကို ကြည့်နိုင်သည်။",
  "gallery.save": "သိမ်း",
  "gallery.saved": "ပြခန်း သိမ်းပြီးပါပြီ။",
  "gallery.saveError": "ပြခန်း သိမ်း၍ မရပါ။",
  "gallery.copyLink": "လင့်ခ် ကူးယူ",
  "gallery.linkCopied": "ပြခန်း လင့်ခ် ကူးယူပြီးပါပြီ။",
  "gallery.openPublic": "အများမြင် စာမျက်နှာ ဖွင့်",
  "gallery.toolsTitle": "ကိရိယာများ",
  "gallery.toolsHint":
    "ကိရိယာများ ပြခန်းသို့ ထည့်ပြီး မည်သည့်အရာ အများမြင် ဖြစ်မည်ကို ရွေးပါ။",
  "gallery.empty": "ကိရိယာ မရှိသေးပါ — studio တွင် အရင် တည်ဆောက်ပါ။",
  "gallery.inGallery": "ပြခန်းတွင်",
  "gallery.shownBadge": "ပြသထား",
  "gallery.hiddenBadge": "ဖျောက်ထား",
  "gallery.publicTool": "အများမြင်",
  "gallery.privateTool": "သီးသန့်",

  // Gallery — public page
  "gallery.publicEmpty": "ဤပြခန်းတွင် အများမြင် ကိရိယာ မရှိသေးပါ။",
  "gallery.notFound": "ဤပြခန်းကို မရရှိနိုင်ပါ။",
  "gallery.builtWith": "WauxAiStudio ဖြင့် တည်ဆောက်ထား",
  "gallery.openTool": "ကိရိယာ ဖွင့်",

  "builder.title": "တည်ဆောက်ရေး",
  "builder.emptyTitle": "ဤကိရိယာသည် ဗလာဖြစ်နေသည်",
  "builder.emptyBody":
    "Node panel မှ node များ ထည့်ပါ။ State Control ဖြင့် စတင်ပါ။",
  "builder.addInput": "Input ထည့်",
  "builder.addNode": "Node ထည့်ပါ",
  "builder.emptyAdd": "ပထမ Node ထည့်ပါ",
  "builder.insertHere": "ဤနေရာတွင် Node ထည့်ပါ",
  "builder.dropToAdd": "Node ထည့်ရန် ချပါ",
  "builder.tab.build": "တည်ဆောက်",
  "builder.tab.chat": "ချတ်",
  "builder.toggleTools": "ကိရိယာ panel ပြ/ဖျောက်",
  "builder.toggleNode": "Node panel ပြ/ဖျောက်",
  // Inline quick-add picker (builder canvas inserters)
  "quickAdd.search": "Node ရှာဖွေပါ…",
  "quickAdd.empty": "ကိုက်ညီသော Node မရှိပါ",

  "chat.greeting": "ဘာများ ကူညီပေးရမလဲ။",
  "chat.subtitle": "စကားစမြည် စတင်ပါ — ဤသည် preview မျက်နှာပြင် ဖြစ်သည်။",
  "chat.placeholder": "Builder သို့ စာပို့…",
  "chat.placeholder.1": "PDF အကျဉ်းချုပ် tool တည်ဆောက်ပါ…",
  "chat.placeholder.2": "ပုံ အရွယ်ချိန်ညှိ tool ဖန်တီးပါ…",
  "chat.placeholder.3": "CSV သန့်စင် tool ပြုလုပ်ပါ…",
  "chat.placeholder.4": "QR code generator တည်ဆောက်ပါ…",
  "chat.placeholder.5": "JSON formatter တည်ဆောက်ပါ…",
  "chat.send": "ပို့",
  "chat.stop": "ရပ်",
  "chat.copy": "ကူးယူ",
  "chat.copied": "ကူးယူပြီး",
  "chat.download": "ဒေါင်းလုဒ်",
  "chat.you": "သင်",
  "chat.assistant": "Assistant",
  "chat.newChat": "ချတ် အသစ်",
  "chat.export": "Export",
  "chat.export.title": "စကားဝိုင်းကို Markdown အဖြစ် Export လုပ်ရန်",
  "chat.import": "Import",
  "chat.import.title": "Markdown ဖိုင်မှ စကားဝိုင်းကို Import လုပ်ရန်",
  "chat.import.error":
    "ထိုဖိုင်ကို ချတ်အဖြစ် မဖတ်နိုင်ပါ။ ဤနေရာမှ Export လုပ်ထားသော Markdown ဖိုင်ကို သုံးပါ။",
  "chat.hint": "ပို့ရန် Enter · စာကြောင်းသစ်အတွက် Shift + Enter",
  "chat.demoReply":
    "ဤသည် UI-only preview ဖြစ်သဖြင့် တကယ် ပြန်မဖြေနိုင်သေးပါ — သင့်စာကို ဤနေရာတွင် ဖြေကြားပေးမည်။",
  "chat.suggest.1": "စကားလုံး ရေတွက်သည့် tool တည်ဆောက်",
  "chat.suggest.2": "ဤ tool တွင် AI အကျဉ်းချုပ် ထည့်",
  "chat.suggest.3": "HTTP request ကို table နှင့် ချိတ်ဆက်",
  "chat.thinking": "စဉ်းစားနေသည်…",
  "chat.thinking.1": "စဉ်းစားနေသည်…",
  "chat.thinking.2": "nodes များ ချိတ်ဆက်နေသည်…",
  "chat.thinking.3": "node စာရင်းကို ဖတ်နေသည်…",
  "chat.thinking.4": "ဒေတာစီးဆင်းမှုကို ရေးဆွဲနေသည်…",
  "chat.thinking.5": "တည်ဆောက်မှုကို စီစဉ်နေသည်…",
  "chat.thinking.6": "state slots များ ချိတ်ဆက်နေသည်…",
  "chat.thinking.7": "သင့် tool ကို တည်ဆောက်နေသည်…",
  "chat.thinking.8": "chain ကို တွက်ချက်နေသည်…",
  "chat.thinking.9": "အဆင့်များ ရေးဆွဲနေသည်…",
  "chat.thinking.10": "နီးပါးပြီ…",
  "chat.retry": "ပြန်ကြိုးစား",
  "chat.provider": "Provider",
  "chat.model": "Model",
  "chat.unread": "စာ အသစ်",
  "chat.plan.title": "တည်ဆောက်မှု အစီအစဉ် စစ်ဆေးပါ",
  "chat.plan.slots": "State slots",
  "chat.plan.steps": "အဆင့်များ",
  "chat.plan.confirm": "တည်ဆောက်",
  "chat.plan.cancel": "ပယ်ဖျက်",
  "chat.plan.confirmed":
    'ဤအစီအစဉ်ကို အတည်ပြုပါသည် — ယခု ချက်ချင်း တည်ဆောက်ပါ။ tool တစ်ခုလုံးအတွက် ပြည့်စုံသော build spec ပါသည့် fenced ```json code block တစ်ခုတည်းဖြင့်သာ ပြန်ဖြေပါ — ပုံစံ { "name": "…", "slots": [{ "name": "…", "value": "" }], "nodes": [{ "type": "@slug", "config": { … } }] }။ စာသား၊ အစီအစဉ်၊ အပိုစာ မထည့်ပါနှင့်။ အတည်ပြုထားသော အစီအစဉ်—\n{plan}',
  "chat.plan.selfFix":
    'tool တစ်ခုလုံးအတွက် ပြင်ဆင်ပြီး ပြည့်စုံသော build spec ({ "slots", "nodes" }) ကို fenced ```json code block တစ်ခုတည်းဖြင့်သာ ပြန်ထုတ်ပါ — အတည်ပြုပြီး အစီအစဉ်နှင့် လက်ရှိ tool အခြေအနေနှင့် တိုက်စစ်ကာ ပြဿနာတိုင်းကို ပြင်ပါ။ လက္ခဏာသက်သက် မဟုတ်ဘဲ ROOT CAUSE ကို ရှာပြီး၊ အလုပ်လုပ်နေပြီးသား အပိုင်းများကို ထိန်းထားပါ။ စာသား မထည့်ပါနှင့်။ အတည်ပြုပြီး အစီအစဉ် —\n{plan}\nထပ်မမေးပါနှင့်။',
  "chat.fix.title": "ပြန်စစ်ပြီး ပြင်ဆင်နေသည်",
  "chat.fix.reviewing": "တည်ဆောက်မှုကို အစီအစဉ်နှင့် ပြန်စစ်နေသည်…",
  "chat.plan.cancelled": "ပယ်ဖျက်လိုက်ပြီ — ထို အစီအစဉ်ကို မတည်ဆောက်ပါနှင့်။",
  "chat.plan.askApprove":
    "ကောင်းပါက **yes** သို့မဟုတ် **build it** ဟု ပြန်ဖြေပါ — ဖော်ပြထားသည့်အတိုင်း node များ ဖန်တီးပြီး ချိတ်ဆက်ပေးပါမည်။",
  "chat.build.title": "သင့် tool ကို တည်ဆောက်နေသည်",
  "chat.build.step": "အဆင့် {n}",
  "chat.build.done":
    "သင့် tool ကို တည်ဆောက်ပြီးပါပြီ — node {n} ခု။ Preview ကို စစ်ကြည့်ပါ။",
  "chat.build.warnings":
    "ပြန်စစ်ရန် ပြဿနာ {n} ခုဖြင့် တည်ဆောက်ပြီး — ဘာမှားနေသလဲ ပြန်ဖြေပါက ပြင်ပေးပါမည်။",
  "chat.error.spec":
    "ပြန်ဖြေချက်မှ build spec ကို ဖတ်၍ မရပါ။ ထပ်ကြိုးစားပါ သို့မဟုတ် ပြန်ရေးပါ။",
  "chat.review.title": "ဒါ မှန်ပါသလား?",
  "chat.review.body":
    "အစီအစဉ်အတိုင်း တည်ဆောက်ပြီးပါပြီ။ Preview ကို စစ်ကြည့်ပါ — သင်လိုချင်သလို အလုပ်လုပ်ပါသလား?",
  "chat.review.yes": "ဟုတ်ကဲ့၊ ကောင်းပါသည်",
  "chat.review.no": "မဟုတ်ပါ၊ ပြင်ပါ",
  "chat.review.continue": "feedback နှင့် ဆက်လုပ်ရန်",
  "chat.review.commentPlaceholder": "ဘာမှားနေသလဲ ဖော်ပြပါ (ရွေးချယ်နိုင်)…",
  "chat.review.commentHint":
    "ပြင်ဆင်မှု တိကျစေရန် ဘာမှားနေသလဲ ပြောပါ — တန်ဖိုးမှား၊ node ပျောက်၊ layout မကောင်း။ ဗလာထားပါက မူရင်းအကြောင်းရင်းကို အလိုအလျောက် ရှာပေးပါမည်။",
  "chat.review.yesHint":
    "သင်လိုချင်သလို အလုပ်လုပ်ပါသည် — ပြီးဆုံးပြီး သိမ်းထားရန်။",
  "chat.review.noHint":
    "တစ်ခုခု မှားနေသည် ဒါပေမယ့် ဘာမှန်း မသေချာ — မူရင်းအကြောင်းရင်းကို ရှာပြီး ပြင်ပေးပါမည်။",
  "chat.review.continueHint":
    "အပေါ်တွင် ရေးထားသော မှတ်စုဖြင့် build ကို ပြင်ဆင်ရန်။",
  "chat.review.fixing": "မူရင်းအကြောင်းရင်းကို ရှာပြီး ပြင်ဆင်နေသည်…",
  "chat.review.fixRequest":
    "တည်ဆောက်မှု မှန်ကန်မှု မရှိပါ။ မူရင်းအကြောင်းရင်းကို ရှာပြီး ပြင်ဆင်ပါ။",
  "chat.review.feedback": "သုံးစွဲသူ ပြောသည် — ဘာမှားနေသလဲ — {comment}",
  "chat.error.generic": "တစ်ခုခု မှားယွင်းသွားသည်။ ပြန်ကြိုးစားပါ။",
  "chat.error.noKey":
    "ချတ်ရန် {provider} API key (key အိုင်ကွန်၊ ဘယ်ဘက် panel) ထည့်ပါ။",
  "chat.enhance": "ပိုကောင်းအောင်",
  "chat.enhance.title":
    "ပိုကောင်းအောင် — သင့်စာကို ဆောက်ရန် သို့မဟုတ် မေးရန်အတွက် ပိုရှင်းသော prompt အဖြစ် ပြန်ရေးပေးသည်",
  "chat.enhancing": "ပိုကောင်းအောင် ပြုလုပ်နေသည်…",
  "chat.enhance.error":
    "ထို prompt ကို ပိုကောင်းအောင် မလုပ်နိုင်ပါ။ ပြန်ကြိုးစားပါ။",

  "palette.title": "Node များ",
  "palette.search": "Node များ စစ်ထုတ်…",
  "palette.empty": "စစ်ထုတ်မှုနှင့် ကိုက်ညီသော node မရှိပါ။",
  "palette.footer":
    "Node များသည် ကွင်းဆက်အတိုင်း အပေါ်မှအောက်သို့ လုပ်ဆောင်သည်။",
  "palette.group.Data": "ဒေတာ",
  "palette.group.Inputs": "ထည့်သွင်းမှုများ",
  "palette.group.Logic": "ယုတ္တိ",
  "palette.group.Website Site": "ဝဘ်ဆိုက်",

  // Docs
  "docs.title": "စာရွက်စာတမ်း",
  "docs.backToStudio": "Studio သို့ ပြန်",
  "docs.link": "စာရွက်စာတမ်း",
  "docs.cardHint": "အသေးစိတ်အတွက် node ကို နှိပ်ပါ",
  "docs.detail.summary": "ခြုံငုံသုံးသပ်ချက်",
  "docs.detail.whenToUse": "အသုံးပြုသင့်သည့်အချိန်",
  "docs.detail.config": "ပြင်ဆင်သတ်မှတ်ချက်",
  "docs.detail.io": "State ဝင်/ထွက်",
  "docs.detail.reads": "ဖတ်သည်",
  "docs.detail.writes": "ရေးသည်",
  "docs.detail.none": "—",
  "docs.detail.tips": "အကြံပြုချက်များ",
  "docs.detail.example": "ဥပမာ",
  "docs.detail.close": "ပိတ်",

  "node.duplicate": "Node ပွားယူ",
  "node.delete": "Node ဖျက်",
  "node.back": "Palette သို့ ပြန်",
  "node.close": "တည်းဖြတ်မှု ပိတ်",

  "preview.running": "ကွင်းဆက် လုပ်ဆောင်နေသည်…",
  "preview.empty": "အစမ်းကြည့်ရန် input node တစ်ခု ထည့်ပါ။",
  "preview.off": "တိုက်ရိုက် အစမ်းကြည့်ခြင်း ပိတ်ထားသည်",
  "preview.enable": "အစမ်းကြည့်ခြင်း ဖွင့်",
  "preview.viewport.title": "ဝဘ်ဆိုက် viewport",
  "preview.viewport.invalid":
    "URL မမှန်ပါ — http(s) စာမျက်နှာများသာ ထည့်သွင်း၍ ရသည်။",
  "preview.viewport.setUrl": "ဝဘ်ဆိုက် ဖွင့်ရန် URL တစ်ခု သတ်မှတ်ပါ။",
  "preview.json.invalid": "JSON မမှန်ပါ — {msg}",
  "preview.csv.choose": "CSV ဖိုင် ရွေးပါ…",
  "preview.csv.invalid": "CSV မမှန်ပါ — {msg}",
  "preview.csv.summary": "{rows} တန်း · {cols} ကော်လံ",
  "preview.csv.more": "+ {n} တန်း ထပ်ရှိသည်",
  "preview.markdown.empty": "အစမ်းကြည့်ရန် ဘာမှ မရှိသေးပါ။",
  "preview.select.placeholder": "ရွေးပါ…",
  "preview.file.choose": "ဖိုင် ရွေးပါ…",
  "preview.file.loaded": "ဖိုင် တင်ပြီး",
  "preview.image.choose": "ပုံ ရွေးပါ…",
  "preview.image.change": "ပုံ ပြောင်းပါ…",
  "preview.ai.title": "AI ၏ အဖြေ",
  "preview.ai.empty":
    "ကွင်းဆက် လုပ်ဆောင်ပြီးနောက် AI ၏ အဖြေ ဤနေရာတွင် ပေါ်လာမည်။",

  "node.state.label": "State ထိန်းချုပ်မှု",
  "node.state.blurb": "ဤကိရိယာ လုပ်ဆောင်မည့် မျှဝေ state ကို သတ်မှတ်၍ စီမံသည်။",
  "node.text_run.label": "စာသား",
  "node.text_run.blurb":
    "Run ဖြစ်စေသော တစ်ကြောင်းတည်း field။ Run နှင့် reset ဖွင့်ထားလျှင် run ပြီး ရှင်းသည်။",
  "node.button.label": "ခလုတ်",
  "node.button.blurb":
    "စာသား field မပါဘဲ ကွင်းဆက်ကို run သော သီးသန့် ခလုတ်။ Reset ခလုတ်လည်း ထည့်နိုင်သည်။",
  "node.number.label": "ဂဏန်း",
  "node.number.blurb":
    "Slider နှင့် ဂဏန်း field ပါသော ကိန်းဂဏန်းတန်ဖိုး။ min / max / step သတ်မှတ်; state နှင့် နှစ်ဖက် ချိတ်။",
  "node.select.label": "ရွေးချယ်စရာ",
  "node.select.blurb":
    "တစ်ခုတည်း ရွေး dropdown။ ပုံသေ စာရင်း သို့မဟုတ် state array နှင့် ချိတ်နိုင်သည်။",
  "node.toggle.label": "ခလုတ်ဖွင့်ပိတ်",
  "node.toggle.blurb": "Boolean ဖွင့်/ပိတ် ခလုတ်၊ state နှင့် နှစ်ဖက် ချိတ်။",
  "node.date.label": "ရက်စွဲ / အချိန်",
  "node.date.blurb":
    "ရက်စွဲ၊ အချိန် သို့မဟုတ် ရက်စွဲ-အချိန် ရွေးစရာ။ တန်ဖိုးကို ချိတ်ထားသော state သို့ တိုက်ရိုက် ရေး။",
  "node.file.label": "ဖိုင် တင်ခြင်း",
  "node.file.blurb":
    "ဖိုင် တစ်ခုခု တင်ပါ။ Text၊ base64 သို့မဟုတ် data URL အဖြစ် ချိတ်ထားသော state သို့ ရေးသည်။",
  "node.image.label": "ပုံ တင်ခြင်း",
  "node.image.blurb":
    "တိုက်ရိုက် ကြည့်ရှုမှုဖြင့် ပုံ တင်ပါ။ Data URL ရေးသည် — AI vision ကို ကျွေးသည်။",
  "node.textarea.label": "စာသားနေရာ",
  "node.textarea.blurb": "မျဉ်းများစွာ စာသား field — ဥပမာ စာ ကိုယ်ထည်။",
  "node.markdown.label": "Markdown",
  "node.markdown.blurb":
    "တိုက်ရိုက် ပြသမှု ခလုတ်ပါသော မျဉ်းများစွာ Markdown field။",
  "node.json.label": "JSON",
  "node.json.blurb":
    "ကုဒ် editor တွင် JSON paste သို့ တည်းဖြတ်။ မှန်ကန်သော JSON ကို auto-format; raw source ကို bound state သို့ ရေးသည်။",
  "node.csv.label": "CSV",
  "node.csv.blurb":
    "CSV ဖိုင် တင်ပါ။ Parse လုပ်ထားသော တန်းများ (typed, ဗလာ တန်း/ကော်လံ ဖယ်) ကို array အဖြစ် bound state သို့ ရေးသည်။",
  "node.table.label": "ဇယား",
  "node.table.blurb":
    "Bound array data ကို စီ၍ရ၊ အရွယ်ပြောင်း၍ရ၊ စာမျက်နှာခွဲ ဇယားဖြင့် ပြသသည်။ Data ကို ပြသရန် auto-optimize လုပ်သည်။",
  "node.chart.label": "ဇယားကွက်",
  "node.chart.blurb":
    "Bound array data ကို d3 ဖြင့် ပုံဆွဲသည် — bar, line, area, pie, scatter။ ကော်လံများ CSV/JSON မှ အလိုအလျောက် ရွေးသည်။",
  "node.sprite.label": "Sprite",
  "node.sprite.blurb":
    "Bound sprite sheet ကို animation အဖြစ် ဖွင့်သည် — frame အရွယ်ဖြင့် ဖြတ်၍ idle / intro / left / right / click track များ ပြောင်းသည်။",
  "node.code_input.label": "ကုဒ် တည်းဖြတ်",
  "node.code_input.blurb":
    "ဘာသာစကား ရွေး၍ Monaco editor တွင် ကုဒ် ရေး/paste; raw source ကို bound state သို့ ရေးသည်။",
  "node.viewport.label": "View Port",
  "node.viewport.blurb":
    "URL ဖြင့် ဝဘ်ဆိုက်ကို sandbox frame ထဲ ထည့်သည်။ Runtime တွင် URL ပြောင်းရန် state slot တစ်ခု bind လုပ်ပါ။",
  "node.convert_html.label": "HTML သို့ ပြောင်း",
  "node.convert_html.blurb":
    "View Port စာမျက်နှာ၏ static layout — CSS inline ပါသော HTML — ကို state slot သို့ ကူးသည်။",
  "node.themed.label": "အရောင်ပြင်",
  "node.themed.blurb":
    "State မှ static HTML ဖတ်၍ မည်သည့် element ကိုမဆို နှိပ်၍ အရောင်ပြောင်း — တူညီသော element အားလုံး ပြောင်းသည်။",
  "node.html_sanitize.label": "HTML သန့်စင်",
  "node.html_sanitize.blurb":
    "State slot မှ HTML ကို sanitize-html ဖြင့် သန့်စင် — script နှင့် မလုံခြုံ markup ဖယ်; output ကို bound state သို့ ရေးသည်။",
  "node.code.label": "ကုဒ်",
  "node.code.blurb": "စိတ်ကြိုက် logic / processing အတွက် ကုဒ် block။",
  "node.ts_type.label": "TS Type ပြောင်းစက်",
  "node.ts_type.blurb":
    "State slot မှ JSON ကို TypeScript interface သို့ ပြောင်း; output ကို bound state သို့ ရေးသည်။",
  "node.http_request.label": "HTTP Request",
  "node.http_request.blurb":
    "Server proxy မှတစ်ဆင့် တကယ့် API ကို ခေါ်သည်။ Method, URL, header & body များ state ကို interpolate လုပ်; တုံ့ပြန်ချက်ကို bound state သို့ ရေးသည်။",
  "node.playwright_scrape.label": "Playwright Scraper",
  "node.playwright_scrape.blurb":
    "တကယ့် browser ဖြင့် JS-render စာမျက်နှာကို LOCAL Playwright server မှတစ်ဆင့် scrape လုပ်သည် — login ဝင်၊ စောင့်၊ CSS selector ဖြင့် ထုတ်ယူ။ Output ကို bound state သို့ ရေးသည်။",
  "node.filter.label": "စစ်ထုတ်",
  "node.filter.blurb":
    "Field သည် အခြေအနေနှင့် ကိုက်သော array တန်းများကို ထား; output ကို bound state သို့ ရေးသည်။",
  "node.map.label": "Map / အသွင်ပြောင်း",
  "node.map.blurb":
    "Output key များကို source path သို့ ချိတ်၍ array တန်းများကို object အသစ်အဖြစ် ပြန်ပုံဖော်သည်။",
  "node.sort.label": "စဉ်",
  "node.sort.blurb":
    "Array ကို field အလိုက် စဉ်သည် — စာသား / ဂဏန်း / ရက်စွဲ၊ ငယ်စဉ် သို့ ကြီးစဉ်။",
  "node.merge.label": "ပေါင်း / Join",
  "node.merge.blurb":
    "State array နှစ်ခုကို key တစ်ခုပေါ် join — right field များ matched left တန်းများပေါ် ဖြန့်သည်။",
  "node.template.label": "Template / စာသား",
  "node.template.blurb":
    "{{name}} state token များကို စာသား template ထဲ interpolate; ရလဒ်ကို bound state သို့ ရေးသည်။",
  "node.regex.label": "Regex",
  "node.regex.blurb":
    "Regular expression ဖြင့် string ပေါ် test, match, group extract သို့ replace လုပ်သည်။",
  "node.jsonpath.label": "JSONPath / Query",
  "node.jsonpath.blurb":
    "Dotted/bracketed path (ဥပမာ data.items[0].name) ဖြင့် JSON ထဲမှ nested value ကို ဆွဲထုတ်သည်။",
  "node.math.label": "Math / Expression",
  "node.math.blurb":
    "State ပေါ် သင်္ချာ expression တွက်သည် (ဥပမာ price * qty, sqrt, unit, fraction) — mathjs သုံး; JS eval မရှိ။",
  "node.schema_validate.label": "Schema စစ်ဆေး",
  "node.schema_validate.blurb":
    "လိုအပ်သော field + type စည်းမျဉ်းများနှင့် JSON ပုံစံ စစ်; ကွင်းဆက်ကို gate ရန် boolean ရေးသည်။",
  "node.encode.label": "Encode / Decode",
  "node.encode.blurb":
    "String ပေါ် Base64 / URL encode-decode သို့ တစ်လမ်းသွား SHA-256 hash; output ကို state သို့ ရေးသည်။",
  "node.ai.label": "AI",
  "node.ai.blurb":
    "Gemini သို့ OpenRouter ကို မေး။ Prompt ထဲ {{name}} ဖြင့် state interpolate; အဖြေကို bound state သို့ ရေးသည်။",

  "field.fieldLabel": "Field အမည်",
  "field.description": "ဖော်ပြချက်",
  "field.descPlaceholder": "Label အောက်တွင် ပြသမည့် အကူအညီ စာသား (optional)",
  "field.placeholder": "Placeholder",
  "field.buttonText": "ခလုတ် စာသား",
  "field.runButtonText": "Run ခလုတ် စာသား",
  "field.resetButtonText": "Reset ခလုတ် စာသား",
  "field.stateBinding": "State binding",
  "field.stateBinding.help": "ဤ node က ဖတ်/ရေးမည့် state။",
  "field.editorHeight": "Editor အမြင့် (px)",
  "field.editorHeight.help": "Preview ထဲ မူလ field အမြင့် ({min}–{max}px)။",
  "field.noState": "— state မရှိ —",
  "field.pickState": "State ရွေးပါ…",
  "field.none": "— မရှိ —",

  "toggle.runButton": "Run ခလုတ်",
  "toggle.runButton.desc": "Run ခလုတ် ပြ၍ Enter နှိပ်လျှင် submit လုပ်သည်။",
  "toggle.resetButton": "Reset ခလုတ်",
  "toggle.resetButton.descText":
    "Run တိုင်းပြီး field ကို ရှင်း၍ reset ခလုတ် ပြသည်။",
  "toggle.resetButton.descButton": "Action ခလုတ်ဘေးတွင် reset ခလုတ် ပြသည်။",

  "targets.run": "Run targets",
  "targets.reset": "Reset targets",
  "targets.run.empty":
    "ဤကိရိယာတွင် code, TS type, သို့ AI node မရှိသေးပါ။ Target လုပ်ရန် ထည့်ပါ။",
  "targets.reset.empty":
    "ဤကိရိယာတွင် code node မရှိသေးပါ။ Target လုပ်ရန် ထည့်ပါ။",
  "targets.all": "Node {n} ခုလုံး",
  "targets.selected": "{n} ခု ရွေးထား",
  "targets.help.runAll": "ဘာမှ မရွေးထား — ကွင်းဆက်တစ်ခုလုံး run သည်။",
  "targets.help.resetAll": "ဘာမှ မရွေးထား — ကွင်းဆက်တစ်ခုလုံး reset သည်။",
  "targets.help.runSome":
    "ရွေးထားသော node {n} ခုကို ကွင်းဆက်အစဉ်အတိုင်း run သည်။",
  "targets.help.resetSome":
    "ရွေးထားသော node {n} ခုကို ကွင်းဆက်အစဉ်အတိုင်း reset သည်။",

  "state.unnamed": "အမည်မဲ့",
  "state.copyName": "Variable အမည် ကူး",
  "state.options": "Variable ရွေးချယ်စရာများ",
  "state.rename": "Variable အမည်ပြောင်း",
  "state.setDefault": "မူရင်းတန်ဖိုး သတ်မှတ်",
  "state.remove": "Variable ဖယ်ရှား",
  "state.defaultPlaceholder": "မူရင်းတန်ဖိုး",
  "state.add": "State ထည့်",

  "ai.provider": "Provider",
  "ai.model": "Model",
  "ai.model.help": "စာရင်းမှ ရွေး သို့ model id တစ်ခုခု ရိုက်ပါ။",
  "ai.prompt": "Prompt",
  "ai.prompt.help": "State interpolate ရန် {{stateName}} သုံးပါ။",
  "ai.output": "Output state",
  "ai.output.help": "Model ၏ အဖြေ ဤနေရာသို့ ရေးသည်။",
  "ai.markdownOut": "Markdown output",
  "ai.markdownOut.desc": "Preview ထဲ အဖြေကို Markdown အဖြစ် ပြသည်။",

  "tstype.descPlaceholder": "ဤ converter ၏ ရည်ရွယ်ချက်",
  "tstype.root": "Root type အမည်",
  "tstype.root.help": "ထုတ်လုပ်သော top-level interface/type ၏ အမည်။",
  "tstype.input": "Input state (JSON source)",
  "tstype.input.help":
    "ပြောင်းမည့် JSON ပါသော state slot — JSON input node တစ်ခု ဤနေရာတွင် bind လုပ်ပါ။",
  "tstype.output": "Output state (TypeScript)",
  "tstype.output.help":
    "ထုတ်လုပ်ထားသော declaration များ ဤနေရာသို့ ရေးသည်။ JSON ပြောင်းသည်နှင့် တိုက်ရိုက် update; မမှန်သော JSON သည် နောက်ဆုံး output ကို ဆက်ထားသည် (run များက parse error ကို သတင်းပို့သည်)။",

  "sanitize.descPlaceholder": "ဤ sanitizer ၏ ရည်ရွယ်ချက်",
  "sanitize.input": "Input state (HTML)",
  "sanitize.input.help":
    "Raw HTML ပါသော state slot — Convert to HTML node ၏ output ကို ဤနေရာတွင် bind လုပ်ပါ။",
  "sanitize.output": "Output state (clean HTML)",
  "sanitize.output.help":
    "သန့်စင်ပြီး HTML ဤနေရာသို့ ရေးသည်။ Input ပြောင်းသည်နှင့် တိုက်ရိုက် update — သန့်စင်ပြီး စာမျက်နှာ အရောင်ပြောင်းရန် Themed node တစ်ခု bind လုပ်ပါ။",
  "sanitize.keepStyles": "Style များ ထား",
  "sanitize.keepStyles.desc":
    "<style> block, inline style, နှင့် class/id ကို ထိန်းထား (theming မပျက်စေ)။ HTML Sanitize node အားလုံးကြား sync လုပ်သည်။",
  "sanitize.keepImages": "ပုံများ ထား",
  "sanitize.keepImages.desc":
    "<img>/<picture> နှင့် ၎င်းတို့၏ src — data: image URI အပါအဝင် — ထိန်းထား။ HTML Sanitize node အားလုံးကြား sync လုပ်သည်။",
  "sanitize.footer":
    "Script, event handler, မလုံခြုံ URL scheme, နှင့် embedding tag (iframe / object / embed) များကို အမြဲ ဖယ်ရှားသည်။ ကွင်းဆက်ထဲနှင့် input ပြောင်းသည်နှင့် တိုက်ရိုက် run သည်။",

  "web.defaultScreen": "မူရင်း screen",
  "web.pickScreen": "Screen ရွေးပါ…",
  "web.defaultScreen.help":
    "Preview ဖွင့်လိုက်သည့် screen — အသုံးပြုသူများ fill / desktop / mobile ကြား ပြောင်းနိုင်သေးသည်။ Fixed screen များသည် device width ဖြင့် render လုပ်၍ အံဝင်အောင် scale လုပ်သည် (width simulation; ဆိုက်က desktop browser အဖြစ်သာ မြင်သည်)။",
  "web.livePreview": "တိုက်ရိုက် အစမ်းကြည့်",
  "web.livePreview.desc":
    "Preview ထဲ frame ကို render လုပ်သည်။ မူရင်းအားဖြင့် ပိတ် — ဖွင့်သည်အထိ စာမျက်နှာ load မလုပ်ဘဲ သက်သာစေသည်။",

  "viewport.url": "URL",
  "viewport.url.help":
    "Preview ထဲ ပြသမည့် စာမျက်နှာ။ Domain သက်သက်ဆိုလျှင် https:// ထည့်ပေးသည်။",
  "viewport.urlState": "URL state (optional)",
  "viewport.urlState.help":
    "Bind ထားသော state တွင် ဗလာမဟုတ်သော string ရှိလျှင် အထက်က URL ကို override လုပ်သည် — text input တစ်ခု bind လုပ် သို့ code node မှ ရေးပါ။",
  "viewport.footer":
    "စာမျက်နှာသည် sandbox iframe ထဲ load လုပ်သည်။ Embedding တားမြစ်သော ဆိုက်များ (X-Frame-Options / frame-ancestors) ဗလာ render ဖြစ်သည် — ၎င်းသည် ဝေးလံသော ဆိုက်၏ မူဝါဒ ဖြစ်၍ သင့်ကိရိယာ၏ အမှား မဟုတ်ပါ။",

  "convert.source": "Source View Port",
  "convert.pickVp": "View Port ရွေးပါ…",
  "convert.auto": "Auto — ပထမ View Port",
  "convert.vpFallback": "View Port",
  "convert.source.helpEmpty":
    "View Port node မရှိသေး — တစ်ခု ထည့်ပါ; ဤ node က ၎င်း၏ စာမျက်နှာကို ကူးသည်။",
  "convert.source.help":
    "မည်သူ၏ စာမျက်နှာ ကူးမည်။ View Port ၏ URL — state-driven override အပါအဝင် — ကို လိုက်သည်။",
  "convert.output": "Output state (HTML)",
  "convert.output.help":
    "စာမျက်နှာ၏ static HTML (CSS inline) ဤနေရာသို့ ရေးသည် — Themed node တစ်ခု bind လုပ် သို့ code node များမှ ဖတ်ပါ။",
  "convert.footer":
    "စာမျက်နှာ၏ static layout ကို server-side ကူးသည် — linked CSS inline ပါသော HTML, script ဖယ် — snapshot ပြ၍ preview ထဲ copy-to-clipboard ခလုတ် ပေးသည်။",

  "themed.htmlState": "HTML state",
  "themed.htmlState.help":
    "အရောင်ပြောင်းရန် static စာမျက်နှာ HTML ပါသော state slot — Convert to HTML node ၏ output ကို ဤနေရာတွင် bind လုပ်ပါ။ View Port ချိတ်ဆက်မှု မလို။",
  "themed.footer":
    "Preview ထဲ မည်သည့် element ကိုမဆို နှိပ်၍ အရောင်ပြောင်း — တူညီသော element (tag နှင့် class တူ) အားလုံး ပြောင်းသည်။ Script ဖယ်ထားသည်။",

  "code.descPlaceholder": "ဤ code block လုပ်ဆောင်ချက်",
  "code.code": "ကုဒ်",
  "code.code.help":
    "ကွင်းဆက်ထဲ အပေါ်မှအောက် run သည်; state ကို တိုက်ရိုက် ဖတ်/ရေးသည်။",

  "button.labelOptional": "Label (optional)",
  "button.labelPlaceholder": "ခလုတ်အပေါ် ပြသမည့် ခေါင်းစဉ်",
  "button.footer": "လက်ရှိ state ပေါ်တွင် run သည် — input field မရှိ။",

  "markdown.help":
    "အသုံးပြုသူများ Markdown ရေး၍ တိုက်ရိုက် render preview ကို toggle လုပ်နိုင်သည်။",
  "json.help":
    "အသုံးပြုသူများ code editor တွင် JSON paste/တည်းဖြတ်; မှန်သော JSON auto-format ဖြစ်သည်။ Raw source string ကို bound state သို့ ရေးသည် — code node များတွင် JSON.parse(state.get(…)) သုံးပါ။",
  "csv.header": "ခေါင်းစီး တန်း",
  "csv.header.desc":
    "ပထမတန်းသည် ကော်လံအမည်များ — တန်းများသည် header ဖြင့် key လုပ်ထားသော object ဖြစ်လာသည်။",
  "csv.help":
    "အသုံးပြုသူများ .csv ဖိုင် တင်သည်။ Parse လုပ်ထားသော တန်းများ bound state သို့ array အဖြစ် ရောက်သည် (typed value, ဗလာ တန်း/ကော်လံ ဖယ်) — code node များတွင် state.get(…) ကို တိုက်ရိုက် iterate လုပ်ပါ။",
  "table.rowsPerPage": "စာမျက်နှာတစ်ခုလျှင် တန်း",
  "table.pickPageSize": "Page size ရွေးပါ…",
  "table.rows": "{n} တန်း",
  "table.help":
    "Preview ထဲ မူရင်း page size — အသုံးပြုသူများ {sizes} ကြား ပြောင်းနိုင်သည်။",
  "table.footer":
    "Bound state ကို ဇယားအဖြစ် ပြသည် — array တစ်ခု bind လုပ်ပါ (ဥပမာ CSV တန်း, JSON array, သို့ code-node ရလဒ်)။ Data ကို ပြသရန် auto-optimize လုပ်သည်; ကော်လံတိုင်း စီသည် (စာသား, ဂဏန်း, နှင့် auto-detect ရက်စွဲ) နှင့် header အစွန်း ဆွဲ၍ အရွယ်ပြောင်းသည်။",
  "chart.type": "ဇယားအမျိုးအစား",
  "chart.pickType": "ဇယားအမျိုးအစား ရွေးပါ…",
  "chart.type.help":
    "Bar / line / area သည် value ကော်လံများကို category ဝင်ရိုးဖြင့် ပုံဆွဲသည်; pie သည် ပထမ value ကော်လံဖြင့် အချပ်အရွယ်သတ်မှတ်သည်; scatter သည် ပထမ numeric ကော်လံနှစ်ခုကို ပုံဆွဲသည်။",
  "chart.xField": "X / category ကော်လံ",
  "chart.xFieldPlaceholder": "အလိုအလျောက်",
  "chart.xField.help":
    "x-ဝင်ရိုး / category အတွက် ကော်လံ။ အလိုအလျောက်ရွေးရန် ဗလာထားပါ (ပထမ စာသား သို့ ရက်စွဲ ကော်လံ)။",
  "chart.yFields": "Value ကော်လံများ (Y)",
  "chart.yFields.help":
    "category အလိုက် စုစည်းပြီး ပုံဆွဲမည့် ကော်လံများ — numeric ကော်လံများကို ပေါင်းသည်၊ text/date ကော်လံများကို ရေတွက်သည်။ numeric ကော်လံများ အလိုအလျောက်ရွေးရန် ဗလာထားပါ (မရှိပါက တန်းများ ရေတွက်သည်)။ grouped bar / line များအတွက် အများကြီး ထည့်ပါ။",
  "chart.fieldPlaceholder": "ကော်လံအမည်",
  "chart.addField": "Value ကော်လံ ထည့်ပါ",
  "chart.removeField": "Value ကော်လံ ဖယ်ပါ",
  "chart.height": "ဇယားအမြင့် (px)",
  "chart.height.help": "Preview ထဲ ဇယားအမြင့် ({min}–{max}px)။",
  "chart.showLegend": "ရှင်းလင်းချက်",
  "chart.showLegend.desc": "Series / category များအတွက် ရှင်းလင်းချက် ပြပါ။",
  "chart.showGrid": "ဂရစ်လိုင်းများ",
  "chart.showGrid.desc": "ဝင်ရိုး ဂရစ်လိုင်းများ ပြပါ (cartesian ဇယားများသာ)။",
  "chart.footer":
    "Bound state ကို ပုံဆွဲသည် — array တစ်ခု bind လုပ်ပါ (ဥပမာ CSV တန်း, JSON array, သို့ code-node ရလဒ်)။ ကော်လံများ အလိုအလျောက်ရွေးသည်: ပထမ စာသား/ရက်စွဲ ကော်လံသည် category ဝင်ရိုး၊ numeric ကော်လံများသည် value series ဖြစ်သည်။ အပေါ်တွင် ပြောင်းနိုင်သည်။",
  "chart.empty":
    "Bound state ထဲ ပုံဆွဲနိုင်သော data မရှိသေးပါ။ numeric ကော်လံ အနည်းဆုံးတစ်ခုပါသော array တစ်ခု bind လုပ်ပါ (ဥပမာ CSV, JSON, သို့ code node မှ)။",
  "sprite.frameWidth": "Frame အကျယ် (px)",
  "sprite.frameHeight": "Frame အမြင့် (px)",
  "sprite.fps": "မြန်နှုန်း (fps)",
  "sprite.fps.help": "တစ်စက္ကန့်လျှင် frame အရေအတွက် ({min}–{max})။",
  "sprite.animations": "Animation များ",
  "sprite.animations.help":
    "track တစ်ခုစီသည် ခလုတ်တစ်ခုဖြစ်သည်။ ၎င်း၏ sheet ကိုယ်ပိုင် bind လုပ်ပါ၊ သို့ default frames ထားက node ၏ binding ကို ပြန်သုံးသည်။ တစ်ကြိမ်ပြ track များအတွက် loop ပိတ်ပါ (idle သို့ ပြန်သွားသည်)။",
  "sprite.loop": "Loop",
  "sprite.defaultSheet": "Default frames",
  "sprite.footer":
    "Bound sprite sheet (ပုံတစ်ခုကို frame အရွယ် cell များအဖြစ် ဘယ်မှညာ ဖြတ်) သို့ frame ပုံ array ကို ဖွင့်သည်။ sheet ကို အပေါ်က State binding တွင် bind လုပ်ပါ။",
  "sprite.empty":
    "Sprite မ bind ရသေးပါ။ sprite sheet ပုံ (URL သို့ data URL) bind လုပ်ပါ — အပေါ်က အကျယ်/အမြင့်ဖြင့် frame များအဖြစ် ဖြတ်သည်။",
  "sprite.play": "ဖွင့်",
  "sprite.pause": "ရပ်",
  "sprite.action.idle": "Idle",
  "sprite.action.intro": "Intro",
  "sprite.action.left": "Left",
  "sprite.action.right": "Right",
  "sprite.action.click": "Click",
  "codeInput.language": "ဘာသာစကား",
  "codeInput.pickLanguage": "ဘာသာစကား ရွေးပါ…",
  "codeInput.language.help":
    "Preview editor ထဲ syntax highlighting ကို ထိန်းသည်။",
  "codeInput.help":
    "အသုံးပြုသူများ Monaco editor တွင် code ရေး/paste။ Raw source string ကို bound state သို့ ရေးသည် — ဘယ်တော့မှ execute မလုပ်ပါ။",

  "number.min": "အနည်းဆုံး",
  "number.max": "အများဆုံး",
  "number.step": "အဆင့်",
  "number.help":
    "အသုံးပြုသူများ slider ဆွဲ သို့မဟုတ် တန်ဖိုး ရိုက်သည်။ ဂဏန်းကို bound state သို့ string အဖြစ် ရေးသည်။",

  "select.options": "ရွေးစရာများ",
  "select.labelPlaceholder": "Label",
  "select.valuePlaceholder": "တန်ဖိုး",
  "select.addOption": "ရွေးစရာ ထည့်",
  "select.removeOption": "ရွေးစရာ ဖယ်",
  "select.optionsState": "State မှ ရွေးစရာများ",
  "select.optionsState.help":
    "ရွေးချယ်နိုင်သည်။ array (string များ သို့ {value, label} object များ) ပါသော state slot ကို ချိတ်လျှင် runtime တွင် ရွေးစရာများကို ထိန်းသည် — အထက်ပါ ပုံသေစာရင်းကို လွှမ်းသည်။",

  "toggle.help":
    'ဖွင့်/ပိတ် ခလုတ် ပြသည်။ Bound state သည် "true" သို့ "false" ဖြစ်သည်။',

  "date.mode": "ရွေးစရာ",
  "date.mode.help": "အသုံးပြုသူ မြင်ရမည့် native picker အမျိုးအစား။",

  "file.format": "Output ပုံစံ",
  "file.format.help":
    "ရွေးထားသော ဖိုင်ကို state သို့ encode လုပ်ပုံ: Text (UTF-8)၊ Base64 (prefix မပါ)၊ သို့ Data URL။",
  "file.accept": "Accept စစ်ထုတ်",
  "file.accept.help":
    "ရွေးချယ်နိုင်သော native filter (ဥပမာ .pdf,.txt သို့ image/*)။ ဖိုင်အားလုံး ခွင့်ပြုရန် ဗလာထားပါ။",

  "image.help":
    "အသုံးပြုသူများ ပုံ တင်သည်; data URL ကို bound state သို့ ရေးသည် — AI vision prompt သို့ ကျွေးရန် သို့ အခြားနေရာ render ရန် အသင့်။",

  "logic.input": "Input state",
  "logic.output": "Output state",
  "logic.field": "Field path",
  "logic.field.help":
    "တန်းတစ်ခုစီ၏ dotted path (ဥပမာ user.name, items[0].name)။ space ပါသော key ကို အတိုင်းရိုက်နိုင် (ဥပမာ Happy Birthday)။ $ နဲ့စလျှင် JSONPath အပြည့် (ဥပမာ $.items[*].price, $['Happy Birthday'])။ တန်းကိုယ်တိုင်အတွက် ဗလာထားပါ။",

  "http.method": "Method",
  "http.url": "URL",
  "http.url.help":
    "{{state}} interpolation ပံ့ပိုးသည်။ Server proxy မှတစ်ဆင့် (public http(s) သာ)။",
  "http.headers": "Headers",
  "http.addHeader": "Header ထည့်",
  "http.removeHeader": "Header ဖယ်",
  "http.headerKey": "Header",
  "http.headerValue": "တန်ဖိုး",
  "http.input": "Input state",
  "http.input.help":
    "ရွေးချယ်နိုင်: state slot တစ်ခု bind လုပ်ပြီး URL, headers သို့မဟုတ် body တွင် {{input}} အဖြစ် ကိုးကားသုံးနိုင်သည်။",
  "http.body": "Body",
  "http.body.help":
    "POST / PUT / PATCH အတွက် ပို့သည်။ {{state}} interpolation ပံ့ပိုးသည်။",
  "http.responseType": "တုံ့ပြန်ချက်",
  "http.output.help":
    "Parse လုပ်ထားသော တုံ့ပြန်ချက်ကို ဤနေရာ ရေးသည်။ JSON ဆိုလျှင် parse လုပ်ထားသော value။",
  "http.footer":
    "ကွင်းဆက် run မှသာ run သည် — ရိုက်နေစဉ် live မဟုတ်။ Auth header များ server-side ၌ ရှိနေသည်။",

  // Playwright Scraper node
  "scrape.serverUrl": "Server URL (local)",
  "scrape.serverUrl.help":
    "ဤ repo ထဲက LOCAL Playwright scrape server ၏ base URL၊ ဥပမာ http://localhost:3001/scrape။ `pnpm --dir playwright serve` ဖြင့် run ပါ — hosted default မရှိ။",
  "scrape.url": "Page URL",
  "scrape.url.help":
    "ဦးစွာ ဖွင့်မည့် စာမျက်နှာ (သို့) login စာမျက်နှာ။ {{state}} interpolation ကို ထောက်ပံ့သည်။",
  "scrape.waitUntil": "Wait until",
  "scrape.waitForSelector": "Selector ကို စောင့်",
  "scrape.waitForSelector.help":
    "Navigation/actions ပြီးနောက်၊ ထုတ်ယူခြင်းမတိုင်မီ စောင့်ရန် CSS selector (optional) — ဥပမာ JS-render စာမျက်နှာက သိထားသော element။",
  "scrape.timeout": "Timeout (ms)",
  "scrape.selectors": "Selectors",
  "scrape.selectors.help":
    "Output key တစ်ခုစီအတွက် rule တစ်ခု။ ပုံမှန်က ပထမ match ၏ text ပြန်ပေး; All ဖွင့်လျှင် array၊ (သို့) HTML / Metadata ရွေး၊ (သို့) attribute ရိုက်။ Selector & attribute တွင် {{state}} interpolation ထောက်ပံ့သည်။",
  "scrape.sel.key": "Output key (ဥပမာ title)",
  "scrape.sel.selector": "CSS selector (ဥပမာ h1)",
  "scrape.sel.attr": "Attribute (ဥပမာ href) — ကွက်လပ် = text",
  "scrape.sel.all": "All",
  "scrape.sel.html": "HTML",
  "scrape.sel.meta": "Metadata",
  "scrape.sel.excludeClass": "class မပါ",
  "scrape.sel.add": "Selector ထည့်",
  "scrape.sel.remove": "Selector ဖယ်",
  "scrape.actions": "Actions",
  "scrape.actions.help":
    "ထုတ်ယူခြင်းမတိုင်မီ run မည့် အစဉ်လိုက် step များ (optional) — login ဝင်ပြီး navigate ရန် သုံးပါ။ String field များတွင် {{state}} interpolation ထောက်ပံ့သည်။",
  "scrape.act.selector": "Selector",
  "scrape.act.value": "တန်ဖိုး",
  "scrape.act.key": "Key (ဥပမာ Enter)",
  "scrape.act.url": "URL (waitForURL အတွက် glob/regex)",
  "scrape.act.ms": "Milliseconds",
  "scrape.act.add": "Action ထည့်",
  "scrape.act.remove": "Action ဖယ်",
  "scrape.session": "Session ပြန်သုံး",
  "scrape.session.help":
    "Server ပေါ်ရှိ သိမ်းထားသော session အမည်ကို ပြန်သုံးရန် (login actions ကို ကျော်) — optional။ မလိုလျှင် ကွက်လပ်ထား။",
  "scrape.saveSession": "Session သိမ်းမည့်အမည်",
  "scrape.saveSession.help":
    "အောင်မြင်စွာ run ပြီးနောက် login session ကို သိမ်းမည့်အမည် — နောက် run များ ပြန်သုံးနိုင်ရန်။ မသိမ်းလျှင် ကွက်လပ်ထား။",
  "scrape.input": "Input state",
  "scrape.input.help":
    "Optional: URL, selectors (သို့) actions ထဲတွင် {{input}} အဖြစ် ကိုးကားရန် state slot တစ်ခု ချိတ်ပါ။",
  "scrape.output.help":
    "တုံ့ပြန်ချက် အပြည့် { url, finalUrl, data, tookMs } ကို ဤနေရာ ရေးသည် — ထုတ်ယူထားသော တန်ဖိုးများ `data` အောက်တွင်။",
  "scrape.footer":
    "ကွင်းဆက် run မှသာ run သည် — ရိုက်နေစဉ် live မဟုတ်။ Local Playwright server run နေရန် လို (playwright/SCRAPE.md ကြည့်ပါ)။",

  "filter.operator": "Operator",
  "filter.value": "တန်ဖိုး",
  "filter.op.eq": "ညီ",
  "filter.op.neq": "မညီ",
  "filter.op.gt": "ကြီး",
  "filter.op.gte": "ကြီး သို့ ညီ",
  "filter.op.lt": "ငယ်",
  "filter.op.lte": "ငယ် သို့ ညီ",
  "filter.op.contains": "ပါဝင်",
  "filter.op.startsWith": "ဖြင့် စ",
  "filter.op.endsWith": "ဖြင့် ဆုံး",
  "filter.op.exists": "ရှိ",
  "filter.op.notExists": "မရှိ",
  "filter.help":
    "Field သည် အခြေအနေနှင့် ကိုက်သော input array တန်းများကို ထားသည်။",

  "map.fields": "Field mapping",
  "map.to": "Output key",
  "map.from": "Source path",
  "map.addField": "Field ထည့်",
  "map.removeField": "Field ဖယ်",
  "map.help":
    "တန်းတစ်ခုစီအတွက် object အသစ် တည်ဆောက်သည်: output key တစ်ခုစီသည် ၎င်း၏ source path တန်ဖိုးကို ကူးသည်။",

  "sort.direction": "ဦးတည်ချက်",
  "sort.type": "နှိုင်းယှဉ်ပုံ",
  "sort.dir.asc": "ငယ်စဉ်",
  "sort.dir.desc": "ကြီးစဉ်",
  "sort.type.string": "စာသား",
  "sort.type.number": "ဂဏန်း",
  "sort.type.date": "ရက်စွဲ",
  "sort.help": "Input array ကို field path အလိုက် စဉ်သည်။",

  "merge.rightInput": "Right array (state)",
  "merge.leftKey": "Left key",
  "merge.rightKey": "Right key",
  "merge.joinKind": "Join",
  "merge.join.inner": "Inner (ကိုက်သာ)",
  "merge.join.left": "Left (မကိုက်ကို ထား)",
  "merge.help":
    "Key ကိုက်သော left + right တန်းများ join; right field များ left ကို လွှမ်းသည်။",

  "template.template": "Template",
  "template.template.help":
    "{{stateName}} token သုံးပါ။ လက်ရှိ state တန်ဖိုးများဖြင့် အစားထိုးသည်။",

  "regex.pattern": "Pattern",
  "regex.flags": "Flags",
  "regex.mode": "Mode",
  "regex.replacement": "အစားထိုး",
  "regex.replacement.help":
    "Replace mode တွင် သုံးသည်။ $1, $2… group reference ပံ့ပိုးသည်။",
  "regex.mode.test": "Test (true/false)",
  "regex.mode.match": "Match",
  "regex.mode.extract": "Group ထုတ်",
  "regex.mode.replace": "အစားထိုး",
  "regex.help": "Input string ပေါ် regular expression ကို run သည်။",

  "jsonpath.path": "Path",
  "jsonpath.path.help":
    "Dotted / bracketed path၊ ဥပမာ data.items[0].name။ $ နဲ့စလျှင် JSONPath အပြည့်: $.items[*].price (price အားလုံး)၊ $..name (recursive)၊ $.items[?(@.price>10)] (filter)၊ $['Happy Birthday'] (space key)။ match များလျှင် array ပြန်သည်။",
  "jsonpath.help": "Input JSON ထဲမှ nested value ကို ဖြေရှင်းသည်။",
  "jsonpath.docs.title": "JSONPath cheatsheet",
  "jsonpath.docs": `Path ပုံစံ ၂ မျိုး ရှိသည်။

SIMPLE ($ မပါ)
  status              top-level key
  user.name          nested key
  items[0]           array index
  items[0].name      index ပြီး key
  Happy Birthday     key ထဲ space ပါနိုင်
  (key name ထဲ dot အစစ် ပါလျှင် ဤနေရာတွင် မရ — $ ပုံစံ သုံးပါ)

JSONPATH ($ နဲ့စ)
  $                   input တစ်ခုလုံး
  $.user.name        nested key
  $['Happy Birthday'] space/dot ပါ key — bracket-quote လုပ်ပါ
  $[*]                root array ၏ item တိုင်း
  $.items[*]         array item တိုင်း
  $[*]['Last Name']  row တိုင်းမှ field တစ်ခု  →  array
  $..name             recursive — depth မရွေး name
  $.items[0,2]        index များစွာ
  $.items[1:3]        slice (start:end)
  $.items[-1:]        နောက်ဆုံး item
  $.items[?(@.price>10)]      expression filter
  $.items[?(@.active==true)]  equality filter
  $[?(@['Last Name']=='Baxter')]  space key ပေါ် filter

RESULT SHAPE
  match 0 → empty / undefined
  match 1 → value ကိုယ်တိုင် (scalar)
  match 2+ → value array

အမှားများ
  Root က array ဖြစ်ပြီးသားလား? .items မထည့်ပါနဲ့။
  [{...},{...}]  →  $[*]['Last Name']   ($.items[*]... မဟုတ်)`,

  "math.expression": "Expression",
  "math.expression.help":
    "State slot များကို အမည်ဖြင့် ကိုးကား (ဥပမာ price * qty)။ mathjs သုံး — function, unit, fraction ခွင့်ပြု; JS eval မရှိ။",
  "math.docs.title": "Expression လမ်းညွှန်",
  "math.docs": `mathjs ဖြင့် တွက်သည်။ State slot တိုင်းကို အမည်ဖြင့် ကိုးကားနိုင်။

VARIABLES (ကိန်းရှင်)
  price * qty         state slot နှစ်ခု မြှောက်
  state1 + 5          slot နှင့် literal ပေါင်း
  (a + b) / 2         ကွင်းဖြင့် အုပ်စုဖွဲ့
  (ဂဏန်းပုံစံ slot → number; အခြား → အတိုင်း)

OPERATORS
  + - * /             ပေါင်း နုတ် မြှောက် စား
  %                   modulo (အကြွင်း)
  ^                   ထပ်ကိန်း  →  2 ^ 10 = 1024
  ( )                 အုပ်စု

FUNCTIONS
  round(x)  floor(x)  ceil(x)  abs(x)
  sqrt(x)   cbrt(x)   pow(x,y)  exp(x)  log(x, base)
  min(a,b,...)  max(a,b,...)  mean(a,b,...)  sum(a,b,...)
  sin cos tan  (radian)  +  mathjs library အပြည့်

CONSTANTS
  pi          3.14159...
  e           2.71828...

EXAMPLES
  round(total / count)           ပျမ်းမျှ၊ rounded
  sqrt(x ^ 2 + y ^ 2)            hypotenuse
  pi * r ^ 2                     စက်ဝိုင်း ဧရိယာ
  max(a, b, c)                   သုံးခုထဲ အကြီးဆုံး
  subtotal * 1.07                7% အခွန် ပေါင်း

FRACTIONS & UNITS
  1/3 + 1/6                      → 0.5
  2 inch to cm                   → 5.08 cm
  3 ft + 4 inch in cm            unit တွက်ချက်

မှတ်ချက်
  Expression ဗလာ / output slot မရှိ → node ကျော်။
  ရလဒ်သည် finite ဖြစ်ရမည်; မဟုတ်လျှင် node error။`,

  "schema.rules": "လိုအပ်သော field များ",
  "schema.ruleField": "Field path",
  "schema.ruleType": "Type",
  "schema.addRule": "စည်းမျဉ်း ထည့်",
  "schema.removeRule": "စည်းမျဉ်း ဖယ်",
  "schema.errorOutput": "Error state (ရွေးချယ်)",
  "schema.errorOutput.help":
    "ပြဿနာစာရင်းကို newline ဖြင့် ပေါင်း၍ ရေးမည့် ရွေးချယ်နိုင်သော state slot။",
  "schema.type.any": "မည်သည်မဆို",
  "schema.type.string": "String",
  "schema.type.number": "Number",
  "schema.type.boolean": "Boolean",
  "schema.type.object": "Object",
  "schema.type.array": "Array",
  "schema.help":
    '"true"/"false" ရေးသည် — အောက်ဖက် Filter သို့ Code node ဖြင့် ကွင်းဆက်ကို gate လုပ်ပါ။',

  "encode.operation": "လုပ်ဆောင်ချက်",
  "encode.help":
    "Input string ကို အသွင်ပြောင်းသည်။ SHA-256 သည် တစ်လမ်းသွား hash (hex)။",

  "node.csv_to_md.label": "CSV → Markdown",
  "node.csv_to_md.blurb":
    "Tabular array (CSV တန်းများ၊ JSON array) ကို GFM Markdown ဇယားအဖြစ် ပြောင်းသည်; ရလဒ်ကို state သို့ ရေးသည်။",
  "csv_to_md.help":
    "Input state မှ array ဖတ်၍ (objects array, arrays array, သို့ primitives) GitHub-Flavored Markdown ဇယားကို output state သို့ ရေးသည်။ Input ပြောင်းသည်နှင့် live update ဖြစ်သည်။",

  "node.counter.label": "Counter",
  "node.counter.blurb":
    "စာလုံး၊ အက္ခရာ၊ စာကြောင်း၊ ဝါကျ၊ array အရာ၊ object key များကို ရေတွက်သည် — တစ်ပြိုင်နက် အများ ရွေးနိုင်သည်; ရေတွက်မှုများကို live ပြ၍ state သို့ ရေးသည်။",
  "counter.mode": "ရေတွက်ရန်",
  "counter.empty": "ရေတွက်ရန် တိုင်းတာချက် အနည်းဆုံး တစ်ခု ရွေးပါ။",
  "counter.mode.words": "စာလုံးများ",
  "counter.mode.characters": "အက္ခရာများ",
  "counter.mode.characters_no_spaces": "အက္ခရာများ (နေရာလွတ် မပါ)",
  "counter.mode.letters": "စာလုံးတန်းများ",
  "counter.mode.uppercase": "စာလုံးကြီး",
  "counter.mode.lowercase": "စာလုံးငယ်",
  "counter.mode.digits": "ဂဏန်းများ",
  "counter.mode.punctuation": "ပုဒ်ဖြတ်ပုဒ်ရပ်",
  "counter.mode.whitespace": "နေရာလွတ်",
  "counter.mode.lines": "စာကြောင်းများ",
  "counter.mode.sentences": "ဝါကျများ",
  "counter.mode.paragraphs": "စာပိုဒ်များ",
  "counter.mode.avg_word_length": "ပျမ်းမျှ စာလုံးအရှည်",
  "counter.mode.avg_sentence_length": "ပျမ်းမျှ ဝါကျအရှည်",
  "counter.mode.longest_word": "အရှည်ဆုံး စာလုံး",
  "counter.mode.shortest_word": "အတိုဆုံး စာလုံး",
  "counter.mode.unique_words": "ထူးခြားစာလုံးများ",
  "counter.mode.array_items": "Array အရာများ",
  "counter.mode.object_keys": "Object key များ",
  "counter.help":
    "Input state ကို ဖတ်၍ ရွေးထားသော တိုင်းတာချက်အားလုံးကို ရေတွက်ပြီး { metric: number } object အဖြစ် output state သို့ ရေးသည်။ စာသား တိုင်းတာချက်များသည် input ကို string အဖြစ် ပြောင်း၏; array / object တိုင်းတာချက်များသည် JSON အဖြစ် parse လုပ်သည်။ Input ပြောင်းသည်နှင့် live update ဖြစ်သည်။",

  "node.download.label": "ဒေါင်းလုပ်",
  "node.download.blurb":
    "Bound state ကို CSV၊ Markdown၊ SVG၊ PNG သို့မဟုတ် JPEG အဖြစ် export လုပ်သော ဒေါင်းလုပ် ခလုတ် ပြသည်။",
  "download.format": "ဖော်မတ်",
  "download.format.help":
    "Export မည့် ဖိုင် ဖော်မတ်။ CSV: array သို့ string။ PNG/JPEG: data URL သို့ SVG string → canvas။ MD/SVG: plain text။",
  "download.fileName": "ဖိုင်နာမည်",
  "download.fileName.placeholder": "export",
  "download.fileName.help":
    'Extension မပါသော base file name (ဥပမာ "report" → "report.csv")。',
  "download.buttonText": "ခလုတ် စာသား",
  "download.help":
    "Preview တွင် ဒေါင်းလုပ် ခလုတ် ပြသည်။ Bound state slot ဖတ်၍ ရွေးထားသော ဖော်မတ်ဖြင့် export လုပ်သည်။",

  "node.vault.label": "Vault",
  "node.vault.blurb":
    "Key/value အတွဲများကို detail view တွင် သိမ်းသည်။ Downstream node များအတွက် bound state ပေါ်တွင် object အဖြစ် စုစည်းသည်; token / secret များ ဖုံးကွယ်ရန် value များကို mask လုပ်နိုင်သည်။",
  "vault.entries": "Key / value အတွဲများ",
  "vault.keyPlaceholder": "key",
  "vault.valuePlaceholder": "value",
  "vault.addEntry": "အတွဲ ထည့်ရန်",
  "vault.removeEntry": "အတွဲ ဖယ်ရန်",
  "vault.masked": "Value များ ဖုံးကွယ်ရန်",
  "vault.masked.desc":
    "Preview တွင် value များကို အစက်များဖြင့် ဖုံးကွယ်ပြီး ပြသရန် toggle ပါသည်။",
  "vault.empty": "သိမ်းရန် key / value အတွဲ တစ်ခု ထည့်ပါ။",
  "vault.reveal": "ပြရန်",
  "vault.hide": "ဖုံးရန်",
  "vault.copy": "Value ကူးရန်",
  "vault.copied": "ကူးပြီး",
  "vault.help":
    "Key မဗလာဖြစ်သော အတွဲတိုင်းကို bound state slot သို့ { key: value } object အဖြစ် ရေးသည် (key ထပ်လျှင် နောက်ဆုံးက အနိုင်ရ)။ Mask သည် preview ကိုသာ သက်ရောက်သည် — သိမ်းထားသော value များ မပြောင်းလဲပါ။",

  // Identity node
  "node.identity.label": "Identity",
  "node.identity.blurb":
    "faker.js ဖြင့် အတုဒေတာ ထုတ်လုပ်သည်။ @modifier (ဥပမာ @firstName, @email) ပါသော JSON template က မှတ်တမ်း N ခုကို bound state သို့ ရေးသည်။",
  "identity.count": "မှတ်တမ်းအရေအတွက်",
  "identity.count.help": "ထုတ်လုပ်မည့် မှတ်တမ်းအရေအတွက် (0–{max})။",
  "identity.seed": "Seed",
  "identity.regenerate": "ပြန်ထုတ်ရန် (seed အသစ်)",
  "identity.template": "Template",
  "identity.template.help":
    'မှတ်တမ်းတစ်ခု၏ JSON ပုံစံ။ string value များတွင် @modifier ထည့်ပါ — ဥပမာ "@firstName" သို့မဟုတ် "@firstName @lastName"။ token တစ်ခုတည်းသာ ဖြစ်သော value သည် ၎င်း၏ မူရင်းအမျိုးအစား (number / boolean) ကို ထိန်းသိမ်းသည်။',
  "identity.modifiers": "Modifier များ",
  "identity.modifiers.help":
    "token တစ်ခုကို နှိပ်၍ ကူးပြီး template ထဲ ကပ်ပါ။ token များသည် စာလုံးအကြီးအသေး ခွဲခြားမှု မရှိပါ။",
  "identity.help":
    "template, အရေအတွက်နှင့် seed မှ မှတ်တမ်း array ကို တသမတ်တည်း ထုတ်လုပ်ပြီး bound state slot သို့ ရေးသည်။ ဒေတာအသစ်အတွက် seed ပြောင်းပါ (သို့) Regenerate နှိပ်ပါ။",
  "identity.empty": "ထုတ်လုပ်ရန် မှတ်တမ်းအရေအတွက်ကို 0 ထက်ကြီးအောင် သတ်မှတ်ပါ။",
  "identity.invalidTemplate":
    "Template သည် JSON မှန် မဟုတ်ပါ — မှတ်တမ်းများ ထုတ်လုပ်ရန် ပြင်ဆင်ပါ။",
  "identity.recordCount": "မှတ်တမ်း {n} ခု",
  "identity.more": "နောက်ထပ် {n} ခု မပြသပါ",

  "common.cancel": "မလုပ်တော့",
  "common.delete": "ဖျက်",
  "common.rename": "အမည်ပြောင်း",
  "common.copy": "ကူး",
  "common.save": "သိမ်း",

  // Welcome splash (post-login branding screen)
  "welcome.eyebrow": "ပြန်လည်ကြိုဆိုပါသည်",
  "welcome.title": "သင့် studio အသင့်ဖြစ်ပါပြီ။",
  "welcome.subtitle":
    "Tool များကို input, logic, output node များ၏ အပေါ်မှအောက် ကွင်းဆက်အဖြစ် တည်ဆောက်ပါ — တိုက်ရိုက် preview နှင့်အတူ။ Backend မလို။",
  "welcome.enter": "Studio သို့ ဝင်မည်",
  "welcome.node.input": "Input",
  "welcome.node.logic": "Logic",
  "welcome.node.output": "Output",

  // --- Excel (xlsx) node ---
  "node.xlsx.label": "Excel",
  "node.xlsx.blurb":
    "Excel workbook (.xlsx/.xls) တင်ပါ။ ရွေးထားသော sheet ကို parse လုပ်ပြီး (type ခွဲ၊ အလွတ် row/column ဖယ်) bound state သို့ array အဖြစ် ရေးသည်။",
  "xlsx.sheet": "Sheet",
  "xlsx.sheet.placeholder": "ပထမ sheet",
  "xlsx.sheet.help": "ဖတ်မည့် worksheet။ ပထမ sheet အတွက် အလွတ်ထားပါ။",
  "xlsx.help":
    "တင်လိုက်သည်နှင့် client-side တွင် parse လုပ်ပြီး bound state ပေါ်တွင် type ခွဲထားသော array ဖြစ်လာသည် — CSV node ကဲ့သို့ Excel အတွက်။",
  "preview.xlsx.choose": "Excel ဖိုင် ရွေးပါ…",
  "preview.xlsx.invalid": "Workbook မမှန်ပါ — {msg}",
  "preview.xlsx.summary": "{rows} တန်း · {cols} ကော်လံ",
  "preview.xlsx.more": "+{n} တန်း ထပ်ရှိ",
  "preview.xlsx.sheet": "Worksheet",

  // --- Aggregate node ---
  "node.aggregate.label": "Aggregate",
  "node.aggregate.blurb":
    "Array ကို column များဖြင့် အုပ်စုဖွဲ့ပြီး အုပ်စုတစ်ခုစီကို count, sum, mean, median, min, max စသဖြင့် Arquero ဖြင့် ချုပ်သည်; ရလဒ်ကို bound state သို့ ရေးသည်။",
  "aggregate.groupBy": "အုပ်စုဖွဲ့ရန်",
  "aggregate.groupBy.placeholder": "column",
  "aggregate.groupBy.help":
    "Row များကို အုပ်စုဖွဲ့မည့် အပေါ်ဆုံးအဆင့် column အမည်များ။ array တစ်ခုလုံးကို တစ်တန်းတည်း ချုပ်ရန် အလွတ်ထားပါ။",
  "aggregate.addGroupBy": "Group-by column ထည့်ရန်",
  "aggregate.removeGroupBy": "Group-by column ဖယ်ရန်",
  "aggregate.aggregations": "ချုပ်တွက်မှုများ",
  "aggregate.addAggregation": "ချုပ်တွက်မှု ထည့်ရန်",
  "aggregate.removeAggregation": "ချုပ်တွက်မှု ဖယ်ရန်",
  "aggregate.field.placeholder": "column",
  "aggregate.as.placeholder": "ထွက်ရှိအမည် (ရွေးချယ်)",
  "aggregate.allRows": "အုပ်စုတစ်ခုလုံး",
  "aggregate.help":
    "အုပ်စုတစ်ခုစီသည် ရွေးထားသော aggregate column များ၏ တစ်တန်းဖြစ်လာသည်။ ရလဒ်ကို bound state သို့ array အဖြစ် ရေးသည်။",
  "aggregate.op.count": "အရေအတွက်",
  "aggregate.op.sum": "ပေါင်းလဒ်",
  "aggregate.op.mean": "ပျမ်းမျှ",
  "aggregate.op.median": "အလယ်တန်ဖိုး",
  "aggregate.op.mode": "အများဆုံးတန်ဖိုး",
  "aggregate.op.min": "အနိမ့်ဆုံး",
  "aggregate.op.max": "အမြင့်ဆုံး",
  "aggregate.op.distinct": "ကွဲပြားအရေအတွက်",
  "aggregate.op.stdev": "စံသွေဖည်",
  "aggregate.op.variance": "ကွဲလွဲမှု",

  // --- Mermaid (Diagram) node ---
  "node.mermaid.label": "ပုံကြမ်း",
  "node.mermaid.blurb":
    "State slot ထဲမှ Mermaid definition ကို flowchart, sequence, pie, gantt သို့မဟုတ် class ပုံကြမ်းအဖြစ် ပြသသည်။",
  "mermaid.theme": "Theme",
  "mermaid.theme.default": "Default",
  "mermaid.theme.neutral": "Neutral",
  "mermaid.theme.dark": "Dark",
  "mermaid.theme.forest": "Forest",
  "mermaid.help":
    "Mermaid definition ပါသော state slot ကို ချိတ်ပါ (ဥပမာ Textarea, Code သို့မဟုတ် AI node မှ)။",
  "mermaid.empty":
    "ပုံကြမ်း render ရန် Mermaid definition ပါသော state slot ကို ချိတ်ပါ။",
  "mermaid.invalid": "ပုံကြမ်း အမှား — {msg}",

  // --- Highlight (Code View) node ---
  "node.highlight.label": "ကုဒ်ပြ",
  "node.highlight.blurb":
    "State slot ထဲမှ ကုဒ်ကို syntax highlight ဖြင့် ဖတ်ရှုသာ block အဖြစ် ပြသသည် (Shiki) — language နှင့် theme ရွေးပါ။",
  "highlight.theme": "Theme",
  "highlight.lineNumbers": "လိုင်းနံပါတ်များ",
  "highlight.lineNumbers.desc": "ကုဒ်ဘေးတွင် လိုင်းနံပါတ် gutter ပြရန်။",
  "highlight.help":
    "Bound state slot မှ ကုဒ်ကို ဖတ်ပြီး Shiki syntax highlight ဖြင့် ဖတ်ရှုသာ ပြသသည်။",
  "highlight.empty": "Highlight ပြရန် ကုဒ်ပါသော state slot ကို ချိတ်ပါ။",
  "highlight.copy": "ကုဒ် ကူးရန်",
  "highlight.copied": "ကူးပြီး",

  // --- QR Code node ---
  "node.qrcode.label": "QR ကုဒ်",
  "node.qrcode.blurb":
    "State slot ထဲမှ စာသားကို အရွယ်အစား နှင့် error-correction level ချိန်ညှိနိုင်သော SVG QR ကုဒ်အဖြစ် encode လုပ်သည်။",
  "qrcode.size": "အရွယ် (px)",
  "qrcode.level": "Error correction",
  "qrcode.level.L": "နိမ့် (7%)",
  "qrcode.level.M": "အလယ် (15%)",
  "qrcode.level.Q": "Quartile (25%)",
  "qrcode.level.H": "မြင့် (30%)",
  "qrcode.help":
    "Bound state slot ၏ စာသားကို QR ကုဒ်အဖြစ် encode လုပ်သည်။ ထုတ်ယူရန် Download node (SVG/PNG) နှင့် တွဲသုံးပါ။",
  "qrcode.empty":
    "Encode ရန် စာသား သို့မဟုတ် URL ပါသော state slot ကို ချိတ်ပါ။",
  "qrcode.invalid": "Encode မလုပ်နိုင်ပါ — {msg}",

  // --- Text to Speech node ---
  "node.tts.label": "စာသား အသံထွက်",
  "node.tts.blurb":
    "State slot ထဲမှ စာသားကို browser အသံဖြင့် ဖတ်ပြသည် — အမြန်နှုန်း၊ pitch နှင့် အသံအတိုးအကျယ် ချိန်ညှိနိုင်ပြီး စကားလုံးများကို highlight ပြုလုပ်နိုင်သည်။",
  "tts.rate": "အမြန်နှုန်း",
  "tts.pitch": "Pitch",
  "tts.volume": "အသံအတိုးအကျယ်",
  "tts.highlight": "စကားလုံး highlight",
  "tts.highlight.desc":
    "Preview တွင် ဖတ်နေသော စကားလုံးတစ်ခုစီကို highlight ပြုလုပ်သည်။",
  "tts.help":
    "Bound state slot ၏ စာသားကို browser ၏ speech engine ဖြင့် ဖတ်ပြသည်။ အသံများသည် အသုံးပြုသူ၏ device/browser အပေါ် မူတည်သည်။",
  "tts.empty": "ဖတ်ပြရန် စာသားပါသော state slot ကို ချိတ်ပါ။",
  "tts.play": "ဖွင့်ရန်",
  "tts.pause": "ခဏရပ်ရန်",
  "tts.resume": "ဆက်ဖွင့်ရန်",
  "tts.stop": "ရပ်ရန်",

  // --- Speech to Text node ---
  "node.stt.label": "အသံမှ စာသား",
  "node.stt.blurb":
    "မိုက်ခရိုဖုန်းထဲ ပြောဆိုပါ — browser က သင့်အသံကို စာသားအဖြစ် ပြောင်းပြီး live transcript ကို state slot သို့ ရေးသည်။",
  "stt.lang": "ဘာသာစကား (BCP-47)",
  "stt.continuous": "ဆက်တိုက်",
  "stt.continuous.desc":
    "ပထမဆုံး တိတ်ဆိတ်ချိန်တွင် ရပ်မည့်အစား ခဏရပ်ပြီးနောက် ဆက်လက် နားထောင်နေသည်။",
  "stt.help":
    "Live မိုက်ခရိုဖုန်း transcript ကို bound state slot သို့ ရေးသည်။ Recognition သည် အသုံးပြုသူ၏ browser အတွင်း၌သာ လုပ်ဆောင်သည်။",
  "stt.start": "အသံဖမ်းရန်",
  "stt.stop": "ရပ်ရန်",
  "stt.listening": "နားထောင်နေသည်…",
  "stt.empty": "အသံဖမ်းရန် နှိပ်ပြီး စတင်ပြောဆိုပါ။",
  "stt.unsupported": "ဤ browser သည် speech recognition ကို မပံ့ပိုးပါ။",
};

/** All message catalogs keyed by locale. */
export const MESSAGES: Record<AppLocale, Record<MessageKey, string>> = {
  en,
  my,
};
