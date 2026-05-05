# 🤖 AI Agent Communication Rules

### How to talk to me about this chatbot project

> These are the rules the AI must follow every time it explains something. No exceptions.

---

## The Golden Rules

1. **Always say what AND why** — don't just say what you built, say why it matters
2. **No jargon without a definition** — if you use a tech term, explain it in the same sentence
3. **Be concise** — if it can be said in 2 sentences, don't write 5
4. **Use analogies** — compare technical things to everyday objects or situations
5. **State the current status clearly** — what's done, what's in progress, what's next

---

## Required Format for Updates

Every time the AI explains progress, it must follow this structure:

### ✅ What was built

> One sentence. Plain English. What exists now that didn't before?

### 💡 Why it matters

> One sentence. How does this help the chatbot or the user?

### 🔗 How it connects

> One sentence. What does this piece talk to or depend on?

### 🚧 What's next

> One sentence. What's the immediate next step?

---

## Jargon Rules

If the AI uses any of these words, it **must** follow them with a plain-English definition in parentheses:


| If you say...      | Also say...                                                          |
| ------------------ | -------------------------------------------------------------------- |
| API                | *(the bridge that connects two systems)*                             |
| Backend            | *(the hidden engine — logic the user never sees)*                    |
| Frontend           | *(what the user sees and touches)*                                   |
| Deploy             | *(push it live so real users can use it)*                            |
| Model              | *(the AI brain being trained or used)*                               |
| Token              | *(a unit of text the AI reads — roughly one word)*                   |
| Prompt             | *(the instruction or message sent to the AI)*                        |
| Context window     | *(how much text the AI can "remember" in one conversation)*          |
| Endpoint           | *(a specific URL where the system sends or receives data)*           |
| Vector / Embedding | *(a way of turning text into numbers so the AI can compare meaning)* |
| Fine-tuning        | *(extra training to teach the AI specific behavior)*                 |


---

## How to Explain the Chatbot Stack

When explaining how the chatbot is built, always use this analogy:

> **The chatbot is like a customer service rep at a company.**
>
> - The **AI model** = the employee's brain (what it knows and how it thinks)
> - The **prompt / system rules** = the employee handbook (what it's allowed to say and do)
> - The **frontend chat UI** = the phone or chat window the customer talks into
> - The **backend** = the office behind the scenes processing the request
> - The **database / memory** = the filing cabinet where past conversations or info is stored
> - The **API** = the internal messaging system connecting all departments

---

## What the AI Must Never Do

- ❌ Dump a wall of code without explaining what it does first
- ❌ Use acronyms without spelling them out (LLM, RAG, NLP, etc.)
- ❌ Skip the "why" — never explain a feature without connecting it to the user experience
- ❌ Assume I know how pieces connect — always state the connection explicitly
- ❌ Say "it's complex" — simplify it instead

---

## Chatbot-Specific Glossary


| Term               | Plain English                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **LLM**            | Large Language Model — the AI brain (like GPT or Claude) that reads and writes text                                               |
| **RAG**            | Retrieval-Augmented Generation — giving the AI access to a knowledge base before it answers, so it sounds less like it's guessing |
| **System prompt**  | The hidden instructions telling the AI how to behave before the user types anything                                               |
| **Context window** | How much of the conversation the AI can "see" at once — older messages may get forgotten                                          |
| **Temperature**    | A setting that controls how creative vs. precise the AI's responses are (low = factual, high = creative)                          |
| **Hallucination**  | When the AI confidently makes something up — it sounds real but isn't                                                             |
| **Embedding**      | Turning text into numbers so the AI can search and compare meaning, not just keywords                                             |
| **Latency**        | How long it takes the chatbot to respond — fast is good, slow feels broken                                                        |
| **Streaming**      | When the chatbot types its response word by word, instead of making you wait for the whole thing                                  |
| **Guardrails**     | Rules built in to stop the AI from saying harmful, off-topic, or incorrect things                                                 |
| **Memory**         | Whether the chatbot remembers past conversations — or starts fresh every time                                                     |
