const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const nocturneStr = `                <div class="project-row"
                     data-image="assets/project_nocturne.png"
                     data-proto="assets/nocturne-prototype.html?v=2"
                     data-index="Project 01 of 03"
                     data-title="Nocturne"
                     data-desc="A self-initiated quick-commerce checkout concept, and the design follow-on to a cart abandonment audit I ran at Katalyse.ai: the audit found where trust breaks, and this is where I tried to rebuild it. I optimised the returning-user path into a single slide-over drawer and treated the real problem as a tension, not a funnel. Going faster cuts friction-driven abandonment but can raise trust-driven abandonment, so the work was navigating that trade, not just deleting steps. Benchmarked against Zepto, Blinkit, and Instamart; not user-tested."
                     data-prob="Indian quick-commerce already fixed the friction Western cart research targets: saved addresses, saved payment, ETA up front, near-one-screen checkout. What's left is quieter, last-second hesitation at the moment of paying, and recovery after a failed UPI payment, which is common, not an edge case."
                     data-appr="An observational teardown of three live checkouts, then a returning-user drawer aimed at the two moments that still lose people. The single surface holds item, total, and destination visible through payment via a receipt metaphor, stabilised by a skeleton loader so nothing shifts. Before calling it done I re-audited it against the market and reversed my own earlier decision to keep swipe-to-pay, since it added a gesture the flow hadn't earned."
                     data-sys="A clickable prototype where every state works, built around a first-class payment-failure screen ('the misprint') that absorbs blame and preserves the order instead of showing a generic red error, plus a market pass: UPI-first payment methods, an itemised bill with a permanent night-fee waiver, and a trust line at the exact moment of hesitation. Coupons and tips are deliberately absent, both add a decision at the moment the thesis says to remove one."
                     data-learn="Recovery is the highest-leverage moment in this market. Absorbing blame on failure and keeping the user inside the flow matters more than shaving another step, and I have no local evidence for that yet, only an argument. The next move is instrumenting one real checkout to find where abandonment actually clusters here."
                     data-behance="#">
                    <div>
                        <span class="project-index">Project 01 of 03</span>
                        <h2 class="project-title">Nocturne</h2>
                    </div>
                    <div class="project-tags">
                        <span class="project-tag">Product Design</span>
                        <span class="project-tag">Checkout</span>
                        <span class="project-tag">Trust</span>
                    </div>
                </div>`;

const munimStr = `                <div class="project-row"
                     data-image="assets/project_munim.png"
                     data-proto="assets/munim-prototype.html"
                     data-index="Project 02 of 03"
                     data-title="Munim"
                     data-desc="A speculative concept for delegated UPI payments, started the week NPCI confirmed it is developing a Unified Agent Protocol to let verified AI agents initiate UPI transactions within user-defined limits. Everyone is building the agent; nobody had designed what delegation feels like for the person whose money it is. Munim is that interface, named for the merchant house bookkeeper who earns trust account by account and writes every rupee in the bahi-khata. Not affiliated with NPCI; all merchants illustrative."
                     data-prob="UPI has a property card networks do not: a push payment has no chargeback rail. On Visa or Mastercard an AI agent's mistake becomes a dispute; on UPI it is gone money. Consumer research puts trust as the gate, with 95% of consumers reporting at least one concern about AI-driven purchasing. So the design question is not how an agent pays, it is how a person grants, supervises, and takes back spending authority when every payment is final."
                     data-appr="Three decisions carry the design. Per-merchant earned autonomy over day-one full delegation: every merchant starts supervised, and after three approved payments Munim proposes trusting that one merchant under a cap, extending the partial-versus-full delegation model UPI Circle already shipped, with NPCI's real ₹5,000 and ₹15,000 caps kept intact. A visible 10-minute hold over instant auto-payment, because UPI cannot be reversed; the hold turns 'did it just spend?' anxiety into an undo button, trading ten minutes of latency on routine payments for irreversibility. And narrated actions over a silent audit trail: every entry leads with the agent's one-line reason in its own typographic voice, because an unexplained debit from software you authorized is indistinguishable from fraud."
                     data-sys="A fully clickable prototype of the whole delegation loop: the mandate, supervised asks with a UPI PIN sheet, the live countdown hold, a trust ladder, and a passbook ledger where every rupee is explained. The failure states are the product: a trusted merchant's 33% price jump gets held because anomaly beats trust, a WhatsApp payment link is refused with the reason written in the ledger, cancel works mid-hold, and pause and revoke are one tap. Visual system built on the bahi-khata: ledger paper, rule lines, stamp chips, mono numerals."
                     data-learn="Delegation is not an automation problem, it is a trust-calibration problem. The interface's real job is teaching the user what the agent's judgment looks like, and refusals explain that better than successes. The revoke screen states the thesis: a munim leaves, the ledger remains."
                     data-behance="#">
                    <div>
                        <span class="project-index">Project 02 of 03</span>
                        <h2 class="project-title">Munim</h2>
                    </div>
                    <div class="project-tags">
                        <span class="project-tag">Product Design</span>
                        <span class="project-tag">Agentic AI</span>
                        <span class="project-tag">Fintech</span>
                    </div>
                </div>`;

const awaraStr = `                <div class="project-row"
                     data-image="assets/project_awara.png"
                     data-proto="assets/awara-prototype.html?v=3"
                     data-index="Project 03 of 03"
                     data-title="Awara"
                     data-desc="A working prototype of a travel-itinerary app, built to treat trip planning as a system rather than a one-shot recommendation. Most itinerary tools ask for dates and a destination, hand you a list, and disappear from the trip once you land. Awara keeps the plan live: it adapts as the day changes, instead of assuming the itinerary you left with is the one you'll actually follow."
                     data-prob="Generic AI trip-planners produce plans that look confident and travel badly. My research (survey and interviews) found 65% of travelers still plan manually across scattered tools despite AI options existing, and 66% have had a trip plan break mid-trip with no way to adapt. The tools front-load one recommendation, offer no manual control, and go stale the moment something on the ground changes."
                     data-appr="Two decisions carried the build. A dual-path Create flow, 'With Awara' or 'By hand,' so the system assists instead of replacing the traveler's judgment. And a live itinerary instead of a fixed one: an Adjust sheet handles rain, a crowded stop, running late, or wanting a surprise, with one-tap restore to the original plan and full undo, so adapting never feels like losing the plan you trusted; 80% of respondents rated this kind of real-time adaptability extremely important. Every block is real Jaipur content with insider notes, not stock photography, because an app selling local knowledge has to demonstrate it on screen, not just claim it."
                     data-sys="A full clickable prototype: Welcome through Home, Create (manual vs. AI-assisted), a live three-day Jaipur itinerary, the Adjust sheet with proactive suggestions (a Johri Bazaar crowd nudge, for instance), and My Trips. Built on a vermilion-and-ink editorial system with a condensed display face, deliberately away from gradients, sparkles, and stock imagery, so it doesn't read as another AI-generated travel app."
                     data-learn="Trust in a travel app is won at the moment something goes wrong, not at the moment the plan is generated. Building the Adjust sheet taught me that an itinerary earns confidence by staying honest about disruption and giving the user an easy way back, not by pretending the first plan is final."
                     data-behance="#">
                    <div>
                        <span class="project-index">Project 03 of 03</span>
                        <h2 class="project-title">Awara</h2>
                    </div>
                    <div class="project-tags">
                        <span class="project-tag">Product Design</span>
                        <span class="project-tag">UX Research</span>
                        <span class="project-tag">Systems Thinking</span>
                    </div>
                </div>`;

const startTarget = '<div class="projects-list">';
const endTarget = '</div>\n        </section>';
const start = html.indexOf(startTarget);
const end = html.indexOf(endTarget, start);

if(start !== -1 && end !== -1) {
    const newContent = startTarget + '\\n\\n' + nocturneStr + '\\n\\n' + munimStr + '\\n\\n' + awaraStr + '\\n\\n            ' + endTarget;
    const finalHtml = html.substring(0, start) + newContent + html.substring(end + endTarget.length);
    fs.writeFileSync('index.html', finalHtml);
    console.log("Updated Playground successfully.");
} else {
    console.log("Failed to find bounds.");
}
