import { Chapter } from '@/types/chapter';

// Seed content (5 chapters). Do not modify without migrating user data.
export const initialChapters: Chapter[] = [
  {
    id: '1',
    title: 'Understanding Context in Conversations',
    skill: 'Listening & Comprehension',
    objective: 'Develop the ability to infer meaning from context in spoken English, even when unfamiliar vocabulary is present.',
    content: `When listening to native speakers, you won't always understand every word. The key skill at B2 level is inferring meaning from context.

**Key Strategies:**

1. **Listen for stressed words** - Native speakers emphasize the most important words in a sentence.

2. **Pay attention to tone** - The speaker's tone often reveals their attitude or intention.

3. **Use surrounding information** - What comes before and after an unfamiliar word often explains its meaning.

4. **Recognize discourse markers** - Words like "however," "therefore," "in contrast" signal the relationship between ideas.

**Practice Approach:**
Listen to podcasts or news broadcasts without subtitles first. Try to understand the main idea before checking transcripts.`,
    exercises: `**Exercise 1:** Listen to a 2-minute news clip. Write down the main topic and three supporting details without replaying.

**Exercise 2:** Watch a short interview. Identify three moments where the speaker's tone conveys emotion (agreement, skepticism, enthusiasm).

**Exercise 3:** Find five unfamiliar words in a podcast. Try to guess their meaning from context before looking them up.`,
    status: 'completed',
    notes: '',
    order: 1
  },
  {
    id: '2',
    title: 'Expressing Opinions with Nuance',
    skill: 'Speaking & Expression',
    objective: 'Learn to express opinions with appropriate hedging and nuance, moving beyond simple agreement/disagreement.',
    content: `At B2 level, you should express opinions in a sophisticated way that acknowledges complexity.

**Hedging Language:**
- "I tend to think that..."
- "It seems to me that..."
- "I would argue that..."
- "On balance, I believe..."

**Acknowledging Other Views:**
- "While I understand the other perspective..."
- "There's certainly merit in the argument that..."
- "Although some might say..."

**Expressing Degrees of Certainty:**
- Strong: "I'm convinced that..."
- Moderate: "I'm fairly sure that..."
- Tentative: "I suspect that..."`,
    exercises: `**Exercise 1:** Take a controversial topic. Write three sentences expressing your view using different hedging phrases.

**Exercise 2:** Practice responding to an opinion you disagree with by first acknowledging its validity before presenting your counter-argument.

**Exercise 3:** Record yourself discussing a topic for 2 minutes, consciously using at least 5 hedging or nuancing phrases.`,
    status: 'in-progress',
    notes: 'Need to practice the hedging phrases more. The "I would argue" construction feels most natural.',
    order: 2
  },
  {
    id: '3',
    title: 'Complex Sentence Structures',
    skill: 'Grammar & Syntax',
    objective: 'Master complex sentence structures including relative clauses, conditionals, and subordinate clauses.',
    content: `Moving from B1 to B2 requires comfort with longer, more complex sentences.

**Relative Clauses:**
- Defining: "The book that changed my perspective..."
- Non-defining: "My teacher, who studied at Oxford, recommended..."

**Mixed Conditionals:**
- "If I had studied harder, I would be fluent now."
- "If I were more confident, I would have spoken up yesterday."

**Subordinate Clauses:**
- Time: "By the time I finish this course..."
- Reason: "Given that English is widely used..."
- Concession: "Although I've been studying for years..."`,
    exercises: `**Exercise 1:** Combine these simple sentences into one complex sentence using relative clauses.

**Exercise 2:** Write five mixed conditional sentences about your language learning journey.

**Exercise 3:** Rewrite a paragraph from a children's book using complex sentence structures.`,
    status: 'to-do',
    notes: '',
    order: 3
  },
  {
    id: '4',
    title: 'Reading Academic Texts',
    skill: 'Reading & Analysis',
    objective: 'Develop strategies for efficiently reading and comprehending academic and professional texts.',
    content: `Academic texts require different reading strategies than casual reading.

**Skimming Techniques:**
- Read the introduction and conclusion first
- Scan headings and subheadings
- Look for topic sentences (usually the first sentence of each paragraph)

**Annotation Strategies:**
- Underline main arguments
- Mark unfamiliar vocabulary
- Write brief summaries in margins

**Critical Reading:**
- Identify the author's thesis
- Evaluate the evidence presented
- Consider potential biases`,
    exercises: `**Exercise 1:** Skim an academic article in 5 minutes. Write a one-paragraph summary.

**Exercise 2:** Read a newspaper editorial and identify the main argument and three pieces of supporting evidence.

**Exercise 3:** Compare two articles on the same topic. Note differences in perspective and bias.`,
    status: 'to-do',
    notes: '',
    order: 4
  },
  {
    id: '5',
    title: 'Formal vs. Informal Register',
    skill: 'Writing & Style',
    objective: 'Understand and apply appropriate register in different writing contexts.',
    content: `Register refers to the level of formality in language use.

**Formal Register (essays, business):**
- Avoid contractions: "do not" instead of "don't"
- Use passive voice when appropriate
- Choose formal vocabulary: "commence" vs "start"

**Informal Register (emails to friends, casual conversation):**
- Contractions are natural
- Phrasal verbs are common
- Colloquialisms are acceptable

**Semi-formal (workplace emails, professional networking):**
- Friendly but professional tone
- Some contractions acceptable
- Clear and direct language`,
    exercises: `**Exercise 1:** Rewrite an informal text message as a formal business email.

**Exercise 2:** Take a formal document and translate it into casual language.

**Exercise 3:** Write the same message in three registers: formal, semi-formal, and informal.`,
    status: 'to-do',
    notes: '',
    order: 5
  }
];
