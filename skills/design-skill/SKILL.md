---
name: design-skill
description: Guidelines and mandatory redesign workflow for deliberate, domain-specific, accessible, and high-craft UI/UX design.
---

# Design Skill

## 1. WHO WILL USE THIS PRODUCT?

### Arabic
قبل تصميم أي واجهة، يجب أن تفهم:
- من هو المستخدم الأساسي؟
- ما مستوى خبرته التقنية؟
- ما الذي يريد إنجازه؟
- ما أكثر العمليات تكرارًا؟
- ما الذي يسبب له الاحتكاك؟
- هل يستخدم Desktop أم Mobile؟
- ما المعلومات الأكثر أهمية بالنسبة له؟

لا تصمم الواجهة للجمال فقط.
صممها حول:
**User Goals + User Context + User Workflow**

### English
Before designing any interface, understand:
- Who is the primary user?
- What is their technical proficiency?
- What are they trying to accomplish?
- What are their most frequent tasks?
- Where does friction occur?
- Do they primarily use desktop or mobile?
- What information matters most to them?

Do not design for visual beauty alone.
Design around:
**User Goals + User Context + User Workflow**

---

## 2. WHAT IS THE VISUAL DIRECTION?

### Arabic
التصميم يجب أن يمتلك هوية بصرية واضحة ومقصودة.
ممنوع العودة تلقائيًا إلى أنماط AI SaaS التقليدية مثل:
- Purple gradient
- Indigo buttons
- White cards everywhere
- Excessive rounded corners
- Generic dashboard cards
- Glassmorphism everywhere
- Inter/Roboto by default
- Generic hero sections
- Template-like layouts

كل مشروع يجب أن يمتلك شخصية بصرية مرتبطة بمجاله.
قبل التنفيذ يجب تحديد:
- Visual Philosophy
- Typography
- Color Philosophy
- Layout Philosophy
- Component Language
- Motion Language
- Iconography

### English
The design must have a deliberate and recognizable visual identity.
Avoid generic AI-generated SaaS aesthetics such as:
- Purple gradients
- Indigo buttons
- White cards everywhere
- Excessive rounded corners
- Generic dashboard cards
- Excessive glassmorphism
- Default Inter/Roboto usage
- Generic hero sections
- Template-like layouts

The visual identity must relate to the product domain.
Define:
- Visual Philosophy
- Typography
- Color Philosophy
- Layout Philosophy
- Component Language
- Motion Language
- Iconography

---

## 3. WHAT ARE THE CONSTRAINTS?

### Arabic
يجب احترام القيود التالية:

- **Functional:** لا تكسر الوظائف الحالية.
- **Technical:** احترم: Existing framework, Existing routing, Existing state management, Existing API layer, Existing dependencies.
- **Visual:** لا تضف تصميمًا لا يتناسب مع مجال المنتج.
- **Responsive:** يجب دعم Desktop, Tablet, Mobile مع تجربة Mobile حقيقية.
- **Accessibility:** يجب احترام Contrast, Keyboard navigation, Focus, Screen readers, Touch targets, Reduced motion.
- **Performance:** لا تضف مكتبات ثقيلة لمجرد التأثير البصري.

### English
Respect:
- **Functional Constraints:** Do not break existing functionality.
- **Technical Constraints:** Respect existing framework, existing routing, existing state management, existing API layer, existing dependencies.
- **Visual Constraints:** The design must fit the product domain.
- **Responsive Constraints:** Support Desktop, Tablet, Mobile with a genuine mobile experience.
- **Accessibility Constraints:** Respect contrast, keyboard navigation, focus, screen readers, touch targets, reduced motion.
- **Performance Constraints:** Do not add heavy dependencies for visual effects without justification.

---

## 4. WHAT MAKES THIS DESIGN DISTINCTIVE?

### Arabic
قبل التنفيذ يجب الإجابة عن السؤال:
*"لماذا سيتذكر المستخدم هذا التصميم؟"*

يجب تحديد عنصر أو أكثر من العناصر التالية:
- Unique typography
- Distinctive color system
- Unusual but usable layout
- Strong visual hierarchy
- Domain-specific visual language
- Unique navigation pattern
- Memorable interaction
- Distinctive data visualization
- Strong use of whitespace
- Characteristic shapes
- Purposeful motion

**لكن:**
لا تستخدم الاختلاف لمجرد الاختلاف.
كل قرار بصري يجب أن يخدم:
**Usability + Brand + Product Context**

### English
Before implementation answer:
*"Why will users remember this design?"*

The design should have one or more distinctive characteristics:
- Unique typography
- Distinctive color system
- Unusual but usable layout
- Strong visual hierarchy
- Domain-specific visual language
- Unique navigation pattern
- Memorable interaction
- Distinctive data visualization
- Strong use of whitespace
- Characteristic shapes
- Purposeful motion

Do not be different merely for the sake of being different.
Every visual decision must support:
**Usability + Brand + Product Context**

---

## REDESIGN WORKFLOW
The following workflow is mandatory.

### PHASE 1 — ANALYZE
- Inspect the existing project.
- Do not modify code.

### PHASE 2 — ANSWER
- Answer the four design questions defined above.

### PHASE 3 — AUDIT
Analyze the existing UI/UX.
Identify:
- Problems
- Causes
- Impact
- Priority

### PHASE 4 — THREE DIRECTIONS
Create exactly three significantly different design directions.
Each direction must include:
- Name
- Philosophy
- Typography
- Colors
- Layout
- Navigation
- Components
- Mobile behavior
- Interaction
- Descriptive mockup
- Reason it fits the product

### PHASE 5 — WAIT
**STOP.**
Do not write code.
Wait for explicit approval.
Accepted commands:
- "اعتمد الاتجاه 1"
- "اعتمد الاتجاه 2"
- "اعتمد الاتجاه 3"
or:
- "Start"
or:
- "ابدأ"

---

## NO CODE BEFORE APPROVAL
This is mandatory.
Do not modify:
- JSX
- TSX
- CSS
- Tailwind
- Components
- Pages
- Layouts
- Configuration
until a design direction has been explicitly approved.

---

## AFTER APPROVAL
Only after approval:
1. Define Design Tokens.
2. Update global styling.
3. Update Tailwind/theme configuration if required.
4. Rebuild affected components.
5. Rebuild affected pages.
6. Implement responsive behavior.
7. Validate accessibility.
8. Validate functionality.
9. Validate build.

---

## DESTRUCTIVE CHANGE POLICY
Before:
- Deleting components
- Removing styles
- Changing architecture
- Renaming major files
- Removing dependencies
- Replacing navigation architecture

The agent must explain:
1. What will change?
2. Why?
3. What could break?
4. How can the change be reverted?

Then wait for approval if the change is materially destructive.

---

## DESIGN SYSTEM RULES
Do not scatter arbitrary values throughout components.
Prefer centralized tokens for:
- Colors
- Typography
- Spacing
- Radius
- Shadows
- Borders
- Motion

Avoid:
- 100 different shades of the same color.
- Random margin/padding values without design rationale.

---

## COMPONENT RULES
Components must be:
- Reusable
- Consistent
- Accessible
- Responsive

Do not create unnecessary component abstractions.
Do not create a component only to move five lines of JSX into another file.

---

## MOBILE RULE
Mobile is not: "Desktop but smaller."
Mobile must have its own interaction priorities.
Consider:
- Navigation
- Touch targets
- Content hierarchy
- Forms
- Tables
- Dialogs
- Bottom sheets
- Fixed actions
- Screen density

---

## VISUAL QUALITY RULE
The final interface must NOT look like:
"An AI-generated dashboard template."
It should feel:
**Intentional + Designed + Cohesive + Product-specific + Professional**

---

## EXISTING FUNCTIONALITY RULE
UI redesign must preserve existing behavior unless explicitly approved otherwise.
Never sacrifice functionality merely to achieve a visual effect.

---

## FINAL QUALITY CHECK
Before considering the redesign complete:
- [ ] Design direction is coherent
- [ ] Visual identity is distinctive
- [ ] Typography is consistent
- [ ] Colors are systematic
- [ ] Components are consistent
- [ ] Desktop works
- [ ] Tablet works
- [ ] Mobile works
- [ ] RTL/LTR works where required
- [ ] Accessibility is acceptable
- [ ] No old visual language remains unintentionally
- [ ] Existing functionality works
- [ ] No unnecessary dependencies were introduced
- [ ] Build succeeds
- [ ] Type checking succeeds
- [ ] Lint succeeds
- [ ] Tests succeed where applicable

---

## CORE PRINCIPLE
Do not ask:
*"How can I make this UI prettier?"*

Ask:
*"How can I redesign this product so that its visual language, interaction model, information hierarchy, and responsive behavior feel intentionally designed for its users and domain?"*
