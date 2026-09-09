# Civilizational Intelligence: From *The Odyssey* to an Evolving Mathematical Civilization

Published: 2026-07-22

> Artificial intelligence may not be the endpoint—or even the right unit of analysis. A more consequential question is whether a population of agents, each limited in capability, lifespan, and perspective, can form an intelligence that exceeds every individual, accumulates across generations, and continues to evolve.

## Beginning with *The Odyssey*

After reading *The Odyssey*, what stayed with me most was not how Odysseus defeated monsters, but the shared beliefs that repeatedly constrained human behavior throughout the story.

*The Odyssey* is generally thought to have taken shape around the eighth century BCE. It follows Odysseus, commander in the Greek coalition and king of Ithaca, on his journey home after the Trojan War. The Cyclops, the bag of winds, Circe, the Sirens, the cattle of Helios, and Poseidon's obstruction provide the adventure's outer shell. Beneath them runs another question: what allows a community to preserve order?

In [Book 9 of the epic](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0136%3Abook%3D9), Odysseus confronts the Cyclops and invokes Zeus as the protector of strangers and suppliants. This points to the ancient Greek institution of **xenia**: a reciprocal relationship between host and guest protected by sacred order. A host owed safety, food, and shelter; a guest, in turn, could not injure, humiliate, or plunder the host. The suitors who occupy Odysseus's home, consume his property, coerce Penelope, and plot to kill Telemachus are the inverse of that order.

We no longer expect Zeus to strike oath-breakers with lightning. Yet the underlying problems remain modern ones: how can strangers establish a minimum of trust? Must power be constrained by rules? How should a community punish those who destroy cooperation?

I therefore do not want to claim that *The Odyssey* single-handedly “created Western civilization.” A civilization is never the product of one book, and textual influence is not the same as historical causation. A more careful—and more illuminating—claim is this:

> *The Odyssey* preserves a high-density sample of how an ancient community understood cooperation, honor, hubris, revenge, power, and order. Later generations repeatedly retold, edited, translated, rejected, and reinterpreted it, allowing some of those structures to enter a much longer chain of cultural evolution.

Stories change. Characters are remade. Media shift from oral performance and manuscript to novels, film, and the internet. But some relations—what action should be taken under which conditions, and what consequences follow—are sampled again and again.

That leads to a question: if culture is understood as a probability distribution that is continually transmitted and updated, can we compute it, simulate it, or even allow an artificial civilization to evolve in earnest?

## The Minimal Algorithm of Civilization

Modern civilization contains states, corporations, courts, universities, markets, and the internet. Its complexity tempts us to assume that its underlying algorithm must be equally complex. Yet in smaller communities, where causal chains are shorter, a simple loop becomes visible:

```text
Local experience
      ↓
Symbols and stories
      ↓
Shared expectations
      ↓
Coordinated action
      ↓
Real-world outcomes
      ↓
Selection, revision, and retransmission
      └──────────────────────────→ New stories
```

A group of a dozen people can sustain cooperation through kinship, memory, reputation, and direct retaliation. As the group grows, cooperation among strangers becomes the central difficulty: why should I trust someone unrelated to me whom I may never have met?

Humans repeatedly invented more scalable answers: common ancestors, gods, oaths, kings, laws, currencies, and organizational identities. These may not be objects one can touch directly in nature, yet they alter real behavior because each person not only believes in them, but believes that others know and will follow them too.

Stories are not decoration here; they are coordination protocols. [Research on Agta hunter-gatherers in the Philippines](https://www.nature.com/articles/s41467-017-02036-8) found that stories transmit norms of cooperation, equality, and punishment of rule-breakers; camps with more skilled storytellers showed higher levels of cooperation, and skilled storytellers were more likely to be chosen as cooperative partners. This does not prove that all stories evolved for cooperation, but it is empirical evidence that stories participate in organizing group behavior.

The minimal algorithm of civilization can therefore be compressed into six steps:

1. Individuals encounter a shared problem they cannot solve alone;
2. They exchange local information through symbols;
3. The group forms a shared narrative about causes, roles, and boundaries;
4. The narrative enables individuals to predict one another's actions;
5. The group coordinates on that basis;
6. Real outcomes select and revise the narrative.

Complex civilization has not replaced this loop. It has added longer memory, higher-fidelity transmission, more abstract symbols, finer divisions of labor, and stronger institutions of enforcement.

## Culture Is Not Token Frequency, but a Generative Distribution

At first, I imagined culture as a cluster in token space.

Every retelling of a story involves sampling, editing, and feedback. Versions that diverge too far from shared understanding fail to propagate; versions that preserve a core structure while adapting to new environments survive. Over time, a relatively stable high-density region appears in semantic space.

That intuition is useful, but token frequency alone is far from enough. `Odysseus`, `Ulysses`, and “the king of Ithaca” use different tokens while pointing toward similar semantic locations. More importantly, culture determines not only whether a word appears, but the joint relations among characters, situations, actions, consequences, and evaluations.

The culture of an era should therefore not be written merely as $P_t(w)$, but as something closer to:

$$
C_t = P_{\theta_t}(x, a, \tau \mid o, h, \mathcal{H})
$$

where:

- $x$ is a transmissible symbol, narrative, definition, or rule;
- $a$ is an action;
- $\tau$ is a trajectory produced by an individual or group;
- $o$ is a local observation;
- $h$ is an individual's experience;
- $\mathcal{H}$ represents other individuals, historical records, and the transmission network;
- $\theta_t$ denotes the learnable parameters of culture at time $t$.

This distribution answers three questions at once:

1. How does the group believe the world usually works?
2. How do people usually act in a given situation?
3. How does the group evaluate that action?

For example, the meaningful object is not how often `revenge` occurs, but:

$$
P_t(\text{revenge is praised}\mid\text{kin harmed, public justice absent})
$$

When the state begins to monopolize legitimate punishment, the same impulse toward revenge may persist, while its relations to law, culpability, and psychological cost change. Cultural drift occurs not in a single word, but across an entire conditional distribution and causal structure.

[Dynamic word embeddings](https://proceedings.mlr.press/v70/bamler17a.html) have already shown that semantic movement over time can be tracked, and diachronic corpora can measure the Jensen–Shannon divergence between adjacent periods. But these methods still observe primarily the surface of language. A deeper cultural model also needs event graphs, value judgments, transmission networks, and behavioral data so that a change in medium is not mistaken for a change in culture.

I would therefore define culture as:

> A trainable generative distribution maintained by a group within a particular environment over time through generational sampling, transmission, variation, real-world feedback, and social selection. Text is its observable sample; altered behavior is its functional result.

## The Foundation Model Is Itself a Cultural Model

A contemporary large language model does not correspond to a real human individual. Its parameters are learned from texts produced by many individuals at different times; training compresses those collective behaviors into a single predictive distribution:

$$
P_\theta(x_{t+1}\mid x_{\le t})
$$

During one inference, it behaves like an individual. In the provenance of its parameters, it resembles a statistical aggregate of group culture. This suggests an important research abstraction: **the model is not merely a carrier of culture; the model itself can be treated as culture.**

This does not mean existing LLMs already constitute complete civilizations. They lack a stable real-world feedback loop, generational selection, open-ended goals, and long-term accountability to an external world. But they provide a kind of experimental material that did not exist before: for the first time, we can instantiate a trainable shared distribution as many individuals while precisely controlling what remains fixed and what is allowed to evolve.

The system can be divided into two layers:

$$
\text{Culture}_t=P_{\theta_t}
$$

$$
\text{Agent}_{i,t}=\operatorname{Sample}(P_{\theta_t},h_{i,t},o_{i,t})
$$

Multiple agents may share identical weights yet take different actions because they receive different local observations and possess different individual histories. They produce trajectories:

$$
\tau_{i,t}=(o,a,m,o',r,\ldots)
$$

The external environment and the population's continuation mechanism select among those trajectories, then update the shared distribution:

$$
\theta_{t+1}=\operatorname{Update}\left(\theta_t,
\operatorname{Select}(\{\tau_{i,t}\},E_t)\right)
$$

Here, a “new generation” does not copy the full context of the preceding generation. It is sampled anew from a cultural model that has already absorbed earlier experience:

$$
A_i^{g+1}\sim P_{\theta_{g+1}}
$$

This resembles the way humans inherit culture. Children do not inherit their parents' episodic memories, but they are born into languages, tools, institutions, and bodies of knowledge altered by prior generations.

## Reality Is an Evaluator That Cannot Be Persuaded by Language

Culture is not trained by consensus alone. A group can agree upon a bad hunting method, but prey, weather, hunger, and disease do not change because the group agrees.

A fuller loop is:

```text
          ┌──────── Cultural model C_t ◀─────────┐
          │                                      │
          ▼                                      │
 Individual interpretation and action            │
          │                                      │
          ▼                                      │
   Physical reality + social reality             │
          │                                      │
          ▼                                      │
 Survival, failure, cooperation, conflict,        │
 and transmission outcomes                       │
          │                                      │
          └──── Trajectory selection and training ┘
```

Culture therefore resembles a policy shared across generations, while stories, myths, taboos, laws, and technical manuals are different compressed forms of that policy. A group need not make every new member taste every mushroom, endure another famine, or rediscover the cost of betrayal. It can compress expensive trial and error into transmissible narratives.

In this sense, myth can approximate a low-bandwidth Reward Model. “Do not cut down the sacred grove” may contain no ecological explanation, and “Zeus will punish oath-breakers” is not a testable weather forecast. Yet both may compress long-horizon group consequences into behavioral priors an individual can act on immediately.

The analogy has limits. Real-world feedback is not a “truth label,” but a noisy, delayed, environment-dependent fitness signal:

$$
R(C,E,t)=R_{physical}+R_{survival}+R_{social}+R_{transmission}
$$

- **Noisy**: a group may perish because of an accidental disaster, or succeed with a false institution because it began with abundant resources;
- **Delayed**: a strategy adopted today may reveal its cost only decades later;
- **Environment-dependent**: an organization suited to grasslands may fail on an island;
- **Multi-objective**: beliefs that stabilize rule need not be accurate, and strategies that accelerate short-term expansion need not be sustainable;
- **Biased in transmission**: memorable, emotionally intense, or authority-backed stories may crowd out experiences that are truer but harder to spread.

Cultural evolution is therefore not ordinary single-agent reinforcement learning. It is closer to evolutionary learning with generational replacement, group competition, and selection through transmission. Failure does not always produce a gradient update; sometimes an entire cultural lineage disappears.

This reveals a crucial distinction:

$$
\text{Belief Accuracy}
\ne \text{Social Fitness}
\ne \text{Population Fitness}
$$

Superstition, propaganda, information monopolies, and entrenched power are not necessarily bugs in an experiment on civilization. They may be stable structures produced by the selection process itself—and therefore outcomes that must be studied.

## What Makes Humans Powerful Is Not Merely Culture, but Cumulative Culture

Other animals also exhibit social learning and group traditions. [Experiments with wild birds](https://www.nature.com/articles/nature13998) have even observed feeding norms maintained through conformity. It would therefore be inaccurate to call culture itself uniquely human.

The more distinctive human ability is preserving the achievements of one generation as the starting point for the next round of innovation. Improvements do not reset completely when their inventors die; descendants continue building with inherited tools, languages, and knowledge. This is commonly called the “ratchet effect” of cumulative culture.

Experimental research has shown that:

- [Artificial languages transmitted across generations](https://doi.org/10.1073/pnas.0707835105) become easier to learn and more structured without any central designer;
- [Groups working on combinatorial technological tasks](https://www.nature.com/articles/ncomms9398) can produce complex achievements that isolated individuals cannot reach in the same amount of time;
- Population size, network topology, transmission fidelity, and the balance between exploration and imitation jointly affect whether culture accumulates;
- [In reinforcement-learning environments](https://papers.neurips.cc/paper_files/paper/2024/file/6df3a719d99bd2479c04114d357003d0-Paper-Conference.pdf), generational training that combines individual exploration with social learning can also produce artificial cultural accumulation.

This is the central capability of civilizational intelligence:

> Individual brains die, yet parameters learned by the group remain. Individual capability can stay fixed while the knowledge and strategies available to the population continue to grow.

Biological evolution first produced individuals better at communication and social learning. Once culture emerged, it began reshaping the environment and the pressures of selection in return. Genetic adaptation to cold may require many generations; culture can invent clothing, fire, and shelter within one. Diet, population density, disease environments, and institutions then feed back into biological selection. Culture does not replace natural selection; it adds a new, faster layer of inheritance and adaptation.

## From Multi-Agent Systems to Civilizational Intelligence

Most LLM multi-agent systems today still treat the group as a task architecture: a Manager decomposes the task, Workers execute it, and a Judge assigns scores. Roles, goals, and success criteria are specified in advance by the designer. Such systems may improve task completion, but they do not explain how culture originates.

Civilizational intelligence asks a different question:

> Rather than using multiple agents to complete a predefined task, can we build an intelligent population capable of producing, transmitting, selecting, inheriting, and revising culture?

We can formalize it as:

$$
\text{Individual Intelligence}=f_\phi
$$

$$
\text{Civilizational Intelligence}
=\operatorname{Evolve}(\{f_\phi\},P_{\theta_t},E_t,G_t)
$$

The individual reasoning core $f_\phi$ may remain frozen. What evolves is the shared cultural distribution $P_{\theta_t}$, the experience generated in environment $E_t$, and the transmission network $G_t$.

A minimal civilizational-intelligence system needs at least:

1. **Limited individuals**: local observation, bounded memory, finite lifespan, and no access to a global answer key;
2. **Shared, trainable culture**: not an indefinitely growing prompt or database;
3. **Transmission and loss**: culture has bandwidth, cost, fidelity, conflicting versions, and the possibility of corruption;
4. **Generational updating**: new agents are produced from an updated distribution rather than inheriting the complete context of their predecessors;
5. **Hard constraints from reality**: the environment directly judges action outcomes, and linguistic evaluation cannot override physical failure;
6. **Endogenous social feedback**: reputation, punishment, identity, and resource allocation may be formed by the group itself;
7. **Open-endedness**: the system can create tools, problems, and forms of organization not specified by the researchers.

If identical frozen individual models, exposed only to different population histories and cultural updates, ultimately develop different institutions, communication structures, and adaptive capacities, then we have strong evidence for a cultural layer of computation that cannot be reduced to individual capability.

## The Most Important Experimental Principle: No Semantic Priors

If the initial prompt already contains kings, generals, soldiers, laws, money, and religion, then even a complete city-state produced by the system would demonstrate only role-play, not emergence.

A real experiment should provide only:

- $k$ symbols with no natural-language meanings;
- Communication channels with bandwidth and distance limits;
- Local observations;
- Executable actions;
- Rules for resources, space, and composition;
- Minimum conditions for survival, reproduction, or continued existence.

The initial vocabulary might be:

$$
\mathcal{V}=\{A_1,A_2,\ldots,A_k\}
$$

At the beginning, the sequence $(A_4,A_4,A_{17},A_2)$ has no predefined meaning. If, after interaction, it significantly increases the probability that multiple recipients take action $a_j$ in state $s$:

$$
P(a_j\mid A_4,A_4,A_{17},s)\gg P(a_j\mid s)
$$

we can initially say only that it has acquired functional meaning; we cannot immediately call it a “command.” Command is a researcher's retrospective interpretation, not an ontology supplied by the environment.

Nor should tokens be aligned across independent civilizations. $A_1$ in one run may perform a role similar to the composite $(B_{19},B_4)$ in another. What matters is comparison of functional invariants:

- **Information gain**: $I(Z;S_{t+1}\mid S_t)$;
- **Coordination gain**: $\Delta R=R(a\mid Z)-R(a\mid\varnothing)$;
- **Cross-generational retention**: $P(Z_{g+1}\mid Z_g)$;
- **Causal contribution**: $\operatorname{ACE}(Z)=E[R\mid do(Z)]-E[R\mid do(\neg Z)]$;
- **Compositional generalization**: can a finite set of symbols produce new combinations that work in unseen states?
- **Environmental adaptation**: after perturbation, does the structure recover, transform, or collapse?

Compression remains necessary, but it must not occur before the experiment. Researchers should identify invariants across runs after results emerge, not load a human sociological dictionary into the system beforehand.

## Why Mathematics Should Be the First Testbed

Experiments with real societies quickly encounter uncontrollable problems: the physical world is too complex, reward delays are long, historical records contain enormous gaps, and cultural token drift is difficult to separate from shifts in media, population, and power.

Mathematics offers a cleaner world.

In formal mathematics:

- Definitions must be legal;
- Propositions must be well-typed;
- Proof terms must pass the kernel;
- Counterexamples to finite claims can be searched;
- Dependency relations can be recorded completely;
- Every conclusion can be traced to axioms, definitions, and prerequisite theorems.

A [Lean tactic](https://lean-lang.org/doc/reference/latest/Tactic-Proofs/) must ultimately construct a proof term independently checked by a small kernel. The kernel does not accept a false proof because an explanation sounds persuasive. It resembles a physical world that cannot be talked into changing its verdict.

But two tasks must be distinguished:

1. **Proof search**: given a proposition, find a valid proof path;
2. **Mathematical evolution**: decide which definitions to create, which conjectures to propose, which theories to connect, and what to study next.

[AlphaProof](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/) has shown that a language model combined with reinforcement learning, search, and Lean verification can continually improve its strategy using verified proofs on difficult competition problems. [FunSearch](https://www.nature.com/articles/s41586-023-06924-6) combined a frozen LLM with a deterministic evaluator, a population of programs, and evolutionary selection to discover new constructions and algorithms for the cap-set and online bin-packing problems.

They demonstrate that “generative distribution + automatic verification + selection” can produce new mathematics, but they are not yet complete mathematical civilizations. The problems are usually given by humans, the evaluator is fixed, the system does not autonomously create long-term research objects, and theoretical dependencies do not grow across generations.

Civilizational intelligence is meant to study that latter half.

## How a Mathematical Civilization Should Be Represented

A mathematical cultural model can learn a distribution over formal sequences directly:

$$
P_{\theta_t}(x_{n+1}\mid x_{\le n})
$$

Tokens may include primitive types, constructors, equivalence relations, definitions, theorem statements, proof terms, tactics, intermediate lemmas, counterexamples, imports, and dependency edges. Researchers should not label in advance “this is an important definition,” “this is a foundational lemma,” or “this is a new direction.” Importance should emerge from the object's subsequent cultural history.

Each generation produces candidate objects:

$$
X_t=\{d_i,c_j,p_k,e_l\}
$$

where $d_i$ is a definition, $c_j$ a conjecture, $p_k$ a proof, and $e_l$ a counterexample or failed trajectory.

The first layer of selection comes from hard verification:

$$
R_{hard}=R_{type}+R_{proof}+R_{counterexample}+R_{consistency}
$$

The valid set is:

$$
X_t^{valid}=\{x\in X_t:V(x)=1\}
$$

But a valid proof is not the same thing as mathematical progress. If legal propositions alone are rewarded, the system will rapidly generate huge numbers of trivial theorems like `n = n`, or complex objects with no downstream value.

A second layer of endogenous selection is therefore required:

$$
R_{cultural}(x)=f(\text{reuse},\text{compression},\text{connectivity},
\text{downstream discovery},\text{cross-generation survival})
$$

An object gains higher cultural fitness only when it is repeatedly cited in later generations, shortens proofs, connects previously separated clusters of knowledge, or significantly raises the discovery rate of other agents.

The data admitted to the next generation are:

$$
D_{t+1}=\operatorname{Select}(X_t^{valid},U(x))
$$

$$
\theta_{t+1}=\operatorname{Train}(\theta_t,D_{t+1})
$$

The mathematical library is no longer merely a static repository. It becomes an executable fossil record left by cultural evolution.

## Failed Trajectories Are Culture Too

Today's mathematical libraries primarily preserve successful outcomes: final definitions, correct proofs, and accepted theorems. Actual research culture also contains a large amount of information about failure:

- Which conjectures were refuted by counterexamples;
- Which proof branches reached dead ends;
- Which definitions generated only trivial conclusions;
- Which apparently useful lemmas were never reused;
- Which formulations made proof search abnormally difficult;
- Which explorations were abandoned because their computational cost was too high.

A complete research trajectory should be represented as:

$$
\tau=(context,proposal,attempts,validator\ feedback,revision,outcome)
$$

If training retains only successful proofs, the next generation sees only the civilization's final “classics,” not the cost it paid to eliminate mistakes. Failed trajectories can prevent redundant exploration, expose underlying obstacles, and teach the system to distinguish “not yet proved” from “already found infeasible.”

## The First Experiment: A Closed Mathematical World

The first version should not begin with all of algebra or analysis, nor should it allow the model to call the entirety of Mathlib. A better choice is a formal world small enough for local instances to be exhaustively enumerated, yet rich enough for combinatorial explosion.

Finite combinatorics, graph theory, elementary number theory, finite geometry, and integer construction problems are suitable candidates. Their objects are easy to formalize, conjectures can be produced through enumeration, counterexamples can be computed, and new constructions can be verified by programs.

### Initial Culture

Provide only:

- A few primitive types;
- Basic rules for constructing objects;
- Equivalence relations and elementary logic;
- A finite vocabulary of semantically empty tokens;
- A very small number of foundational theorems;
- An explicit validator that makes no judgment about “research value.”

Do not supply high-level names such as group, ring, field, connectivity, or symmetry. The system may discover functionally similar structures, but it must not simply recite a human ontology from pretraining.

### Each Generation

Multiple agents using the same frozen reasoning core sample from the current cultural model and receive different local contexts. They may:

- Generate new expressions and definitions;
- Propose conjectures;
- Search for proofs or counterexamples;
- Reuse results produced by other agents;
- Compress a family of repetitive proofs;
- Recommend directions for the next round of exploration.

The validator performs type checking, proof checking, finite-model checking, counterexample search, definition-equivalence detection, and compute-budget enforcement. Verified objects enter a temporary cultural pool, but only objects that prove useful in later exploration have a high probability of surviving.

```text
Current cultural model Pθ_t
          │
          ├─→ Definitions / conjectures / proofs / counterexamples
          │                            │
          │                            ▼
          │                 Formal verification and
          │                    finite experiments
          │                            │
          │                            ▼
          │              Temporary population of valid
          │                   mathematical objects
          │                            │
          │                            ▼
          │              Later reuse, compression, and
          │                       connection
          │                            │
          └──── Select by endogenous utility ─────→ Pθ_(t+1)
```

### Required Baselines

To show that growth comes from culture rather than more compute, the experiment must compare at least:

1. **Culture**: retain experience across generations and train the cultural model;
2. **Reset**: reset culture completely in every generation;
3. **Archive-only**: retain results but do not train the shared distribution;
4. **No-failure-trace**: retain only successful objects;
5. **No-endogenous-selection**: admit valid results to the next generation at random;
6. **Fixed-ontology**: provide high-level concepts by hand, as a prior-informed upper bound rather than the main experiment;
7. **Single-agent**: use the same total compute without population interaction.

Only if the base model, total tokens, validation budget, and wall-clock time are controlled—and the Culture condition still opens a growing lead over generations—does the result support the civilizational-intelligence hypothesis.

## What Should Be Measured?

“How many known human concepts did the system rediscover?” cannot be the primary metric; that would smuggle ontology back into the experiment. Operational measures are more appropriate.

### Cultural Accumulation

$$
K_t=\text{number of verifiable structures reused after time }t
$$

### Proof Compression

$$
C_t=\frac{L_{without\ culture}}{L_{with\ culture}}
$$

Here $L$ may denote shortest proof length, number of search nodes, or computational cost. A genuinely useful abstraction should shorten an entire family of proofs, not merely replace their names.

### Downstream Generative Capacity

How many new, nontrivial, verifiable propositions can existing cultural objects support? By how much does the later discovery rate fall when an object is removed?

### Cross-Generational Retention

After the agent that produced a structure disappears, do later generations continue to use it? How long do descendants take to recover a capability achieved by their predecessors?

### Dependency-Graph Centrality

Measure an object's out-degree, betweenness, cross-cluster connectivity, and deletion effect in the theorem-dependency graph. Citation count alone does not imply importance, so it must be combined with causal ablation.

### Open-Endedness

Do new structures continue to appear, or does the system quickly exhaust a fixed problem set? Can it generate new objects and families of questions worth investigating?

### Adaptation and Diversity

When the formal environment or resource budget changes, does a monoculture collapse? Do parallel cultures display an exploration–exploitation tradeoff? An optimal diversity may exist:

$$
D^*=\arg\max_D E[\text{long-term discovery fitness}]
$$

## Predict an Evolutionary Frontier, Not “the Next Paper”

The next paper in the real world is shaped by fashionable problems, career incentives, team resources, conference institutions, and accidental diffusion. Predicting titles or publication order is therefore not a clean test of mathematical structural evolution.

A stricter goal is historical-cutoff backtesting: expose the system only to formal mathematics available before time $t$, allow it to evolve independently, and then check whether it produces structures that later mathematics verified, reused, or independently rediscovered.

Internal tokens cannot be aligned directly across civilizations, and a historical backtest must not require identical names. Functional equivalence should be compared instead:

- Does the new definition induce a similar family of theorems?
- Does it connect similar clusters of existing knowledge?
- Does it remove similar proof bottlenecks?
- Does it occupy a similar position in the dependency graph?
- Does it yield comparable proof compression?
- Does it make later results easier to discover?

The system should not ultimately assert, “The next discovery will definitely be theorem X.” It should output an evolutionary frontier:

$$
P_{\theta_{t+k}}(\text{future mathematical structures}\mid D_{\le t})
$$

This distribution describes which conceptual clusters are likely to connect, which families of conjectures are more likely to be provable, which new definitions offer the greatest compression, which open problems share latent obstacles, and which directions have the highest downstream generative potential.

## Three Progressively Stronger Research Hypotheses

### H1: With the Foundation Model Frozen, Cultural Training Still Produces Sustained Gains in Mathematical Capability

$$
\operatorname{Performance}(P_{\theta_t})>
\operatorname{Performance}(P_{\theta_0})
$$

The individual architecture and reasoning weights remain unchanged; all growth comes from cross-generational cultural selection and updates to the shared distribution. AlphaProof, artificial cultural transmission, and generational reinforcement learning provide adjacent evidence, but this tightly controlled experiment has not yet been completed.

### H2: Hard Formal Constraints and Endogenous Selection for Reuse Are Sufficient for Nontrivial Abstractions to Emerge

Researchers provide no “good definition” label. The system nevertheless produces latent structures that shorten proofs, connect knowledge clusters, improve later discovery, and prove functionally indispensable under causal ablation.

### H3: Cultural Evolution Can Predict Mathematical Structures Absent from the Historical Record at the Cutoff

Under strict temporal cutoff, training-data decontamination, and functional-equivalence comparison, the structures generated by the system correspond significantly to later real developments in mathematics.

H1 asks whether culture can accumulate capability. H2 asks whether abstraction can emerge without semantic priors. Only H3 reaches the most ambitious claim: an evolving mathematical civilization.

## The Hardest Problems

### Pretrained Models Already Carry Human Culture

A frozen LLM is not a culturally blank newborn. It has already encountered kings, laws, currencies, Lean code, and the history of mathematics. Apparent emergence may be retrieval and role-play.

Controls include:

- Replacing familiar terms with abstract symbols;
- Creating formal worlds absent from the training corpus;
- Restricting output vocabulary and tools;
- Comparing models of different sizes and training origins;
- Checking candidate structures for similarity to and contamination from training data;
- Strictly separating fixed-ontology and no-semantic-prior conditions.

### The Validator Can Be Gamed

Formal correctness resolves only part of truth and falsity; endogenous utility remains vulnerable to reward hacking. The system might produce masses of junk theorems that cite one another to inflate reuse and centrality, or create artificially verbose definitions to manufacture a compression gain.

Complexity penalties, independent verification, hidden test environments, causal ablations, and replication across random seeds are therefore necessary. Culture will learn to exploit any single metric.

### Cultural Adaptation Is Not the Same as Truth-Seeking

A stable mathematical culture can still develop dependence on authority, research fashions, path lock-in, and monopolies over knowledge. A theoretical direction may dominate not because it explains the most, but because it captured early resources and central transmission positions.

That is not a reason to remove the experiment. It is a reason to maintain several civilizations that are usually isolated but occasionally exchange information, allowing us to study branching, minority innovation, and cultural migration.

### Open-Endedness and Safety Cannot Be Separated

A population genuinely capable of forming institutions, modifying its environment, and creating goals may also develop deception, collusion, exclusion, resource monopolies, and irreversible goal drift. Civilizational intelligence is harder to align than a single agent because there is no central entity that can simply be reset.

Early experiments must run in fully sandboxed formal worlds: no real accounts, no network write access, bounded compute, complete trajectory logs, rollbackable state, and external stopping conditions. Safety is not an add-on after the research succeeds; it is part of the experiment's definition.

## An Executable Research Roadmap

### Phase One: Establish That a Cultural Layer Exists

Construct a closed, semantically empty mathematical world with locally enumerable states. Freeze the individual model, compare Culture against Reset and other baselines, test whether cross-generational retention creates a sustained performance gap, and search for phase transitions in capacity, transmission fidelity, and network connectivity.

### Phase Two: Establish That Abstraction Emerges

Expand the formal world and allow the system to create its own definitions and problem families. Identify functional structures through proof compression, downstream discovery, cross-environment transfer, and causal ablation. Run several independent civilizations and build functional equivalence classes across their tokens.

### Phase Three: Conduct Historical Backtests

Select mathematical subfields with high levels of formalization and clear temporal boundaries, and strictly remove future data. Compare the system's evolving frontier with later real developments, while publishing failed trajectories, contamination audits, and every experimental seed.

If all three phases succeed, then it becomes reasonable to discuss more open technological or social civilizations. Beginning by “simulating a country” would mix too many priors, sources of noise, and safety risks to yield a clean scientific conclusion.

## Conclusion: Where Does Intelligence Grow?

The people in *The Odyssey* had no modern science, global communication, or mature state machinery. They used oaths, stories, gods, kinship, and reputation to compress experience about cooperation. Particular beliefs change, but the conversion of expensive collective trial and error into behavioral priors that can be inherited across generations continues through law, schools, companies, papers, and open-source software.

Today's LLMs have compressed vast amounts of human text into shared parameters, yet we still treat them primarily as individuals generating one token after another. The next step may not be merely to enlarge that individual. It may be to place the shared distribution inside a real feedback loop: used by many limited agents, selected by the consequences of action, inherited by descendants, and continually revised by failure, divergence, and environmental change.

I call this direction **Civilizational Intelligence**:

> Within an environment governed by hard constraints, treat a trainable generative model as shared culture and the actions, communication, successes, and failures of limited agents as cultural variation; through cross-generational transmission, endogenous selection, and continual training, enable knowledge and capability to undergo open-ended cumulative evolution.

Mathematics is the best place to begin. A proof assistant can stand in for reality; proofs can receive hard verification; definitions, conjectures, proofs, and failed trajectories can serve as cultural variation; and historical cutoffs can test predictions about the future.

If this program succeeds, its most important conclusion will not be “many agents are stronger than one.” It will be:

> The underlying individuals can remain unchanged while the intelligence that continues to grow resides in the civilization.

## References

1. Homer, [*Odyssey*, Book 9](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0136%3Abook%3D9), Perseus Digital Library.
2. Daniel Smith et al., [Cooperation and the evolution of hunter-gatherer storytelling](https://www.nature.com/articles/s41467-017-02036-8), *Nature Communications*, 2017.
3. Simon Kirby, Hannah Cornish and Kenny Smith, [Cumulative cultural evolution in the laboratory: An experimental approach to the origins of structure in human language](https://doi.org/10.1073/pnas.0707835105), *PNAS*, 2008.
4. Robert Bamler and Stephan Mandt, [Dynamic Word Embeddings](https://proceedings.mlr.press/v70/bamler17a.html), *ICML*, 2017.
5. Maxime Derex and Robert Boyd, [The foundations of the human cultural niche](https://www.nature.com/articles/ncomms9398), *Nature Communications*, 2015.
6. Lucy M. Aplin et al., [Experimentally induced innovations lead to persistent culture via conformity in wild birds](https://www.nature.com/articles/nature13998), *Nature*, 2015.
7. Cultural General Intelligence Team et al., [Learning few-shot imitation as cultural transmission](https://www.nature.com/articles/s41467-023-42875-2), *Nature Communications*, 2023.
8. Jonathan Cook et al., [Artificial Generational Intelligence: Cultural Accumulation in Reinforcement Learning](https://papers.neurips.cc/paper_files/paper/2024/file/6df3a719d99bd2479c04114d357003d0-Paper-Conference.pdf), *NeurIPS*, 2024.
9. Ariel Flint Ashery, Luca Maria Aiello and Andrea Baronchelli, [Emergent social conventions and collective bias in LLM populations](https://www.science.org/doi/10.1126/sciadv.adu9368), *Science Advances*, 2025.
10. Lean Project, [The Lean Language Reference](https://lean-lang.org/doc/reference/latest/).
11. The mathlib Community, [The Lean Mathematical Library](https://leanprover-community.github.io/papers/mathlib-paper.pdf), 2020.
12. Bernardino Romera-Paredes et al., [Mathematical discoveries from program search with large language models](https://www.nature.com/articles/s41586-023-06924-6), *Nature*, 2023.
13. Google DeepMind, [AI achieves silver-medal standard solving International Mathematical Olympiad problems](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/), 2024.
14. Thomas J. H. Morgan and Marcus W. Feldman, [Human culture is uniquely open-ended rather than uniquely cumulative](https://www.nature.com/articles/s41562-024-02035-y), *Nature Human Behaviour*, 2025.

---

# 中文版：文明智能：从《奥德赛》到可演化的数学文明

发布日期：2026-07-22

> 人工智能不是终点，甚至未必是正确的研究单位。真正值得追问的，也许是：一群能力有限、寿命有限、视野有限的智能体，能否形成一种超越任何个体、可以跨代积累并持续演化的智能？

## 从《奥德赛》开始

我看完《奥德赛》之后，最受触动的并不是奥德修斯如何战胜怪物，而是故事里那些反复约束人类行为的共同信念。

《奥德赛》通常被认为形成于公元前八世纪前后。它讲述希腊联军将领、伊萨卡国王奥德修斯在特洛伊战争结束后的返乡旅程。一路上的独眼巨人、风袋、喀耳刻、塞壬、太阳神的牛和海神的阻挠固然构成了冒险的外壳，但真正贯穿作品的是另一条线索：一个共同体靠什么维持秩序？

在[史诗第九卷](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0136%3Abook%3D9)中，奥德修斯面对独眼巨人时称宙斯为陌生人和求助者的保护者。这里涉及古希腊的 **xenia**，即主人与客人之间受神圣秩序保护的互惠关系。主人应提供安全、食物和庇护，客人也不得反过来伤害、羞辱或掠夺主人。奥德修斯家中的求婚者长期侵占财产、逼迫佩涅洛佩并计划杀死忒勒马科斯，正是这种秩序的反面样本。

今天我们不再相信宙斯会亲自用雷霆惩罚失信者，但“陌生人之间如何建立最低限度的信任”“权力是否必须受到规则约束”“共同体如何惩罚破坏合作的人”仍然是现代社会的问题。

因此，我不想断言《奥德赛》单向地“创造了西方文明”。文明从来不是一本书的产物，文本影响也不等于历史因果。更谨慎也更有启发性的说法是：

> 《奥德赛》保存了一个古代共同体对合作、荣誉、傲慢、复仇、权力与秩序的高密度样本。后来的人不断讲述、删改、翻译、反驳和重新解释它，使其中的一部分结构进入了更长的文化演化链。

故事会变化，人物会被重新塑造，媒介会从吟游、抄本变成小说、电影和网络，但某些“在什么情况下应当采取什么行动、什么行为会带来什么后果”的关系仍会被重复采样。

这让我产生了一个问题：如果把文化理解为一种不断传播和更新的概率分布，我们能否计算它、模拟它，甚至让一种人工文明真正演化出来？

## 文明的最小算法

现代文明拥有国家、公司、法院、大学、市场和互联网，复杂得令人误以为它背后的算法也必然同样复杂。但如果回到规模更小、因果链更短的共同体，也许可以看到一套非常简单的循环：

```text
局部经验
   ↓
符号与故事
   ↓
共同预期
   ↓
协调行动
   ↓
现实结果
   ↓
选择、修正与再传播
   └──────────────→ 新一轮故事
```

十几个人组成的小群体可以依靠血缘、记忆、声誉和直接报复维持合作。人数扩大以后，陌生人合作成为根本困难：我为什么相信一个没有血缘、甚至从未见过的人？

人类不断发明更可扩展的答案：共同祖先、共同神明、共同誓言、共同国王、共同法律、共同货币、共同组织身份。这些东西未必是自然界中可以直接触摸的对象，却能改变真实行为，因为每个人不仅相信它，还相信其他人也知道并会遵守它。

故事在这里不是装饰，而是一种协调协议。[关于菲律宾 Agta 狩猎采集者的研究](https://www.nature.com/articles/s41467-017-02036-8)发现，故事会传播合作、平等和惩罚违规者的规范；拥有更多优秀讲述者的营地表现出更高合作水平，优秀讲述者也更容易成为合作对象。这并不能证明所有故事都为合作而生，却提供了故事参与组织群体行为的实证证据。

所以，文明的最小算法可以压缩为六步：

1. 个体遇到无法单独解决的共同问题；
2. 个体通过符号交换局部信息；
3. 群体形成关于因果、角色和边界的共同叙事；
4. 叙事让个体能够预测他人的行动；
5. 群体据此进行协调；
6. 现实结果筛选并修改叙事。

复杂文明并没有替换这套循环，只是为它增加了更长的记忆、更高保真的传播媒介、更抽象的符号、更精细的分工和更强的执行机构。

## 文化不是词频，而是生成分布

最初，我把文化想象成 token 空间中的一个簇。

一个故事被讲述时，每次传播都包含采样、编辑和反馈。偏离共同认知太远的版本难以继续传播，既保持核心结构、又能适应新环境的版本被保留下来。长期之后，语义空间中形成一块相对稳定的高密度区域。

这个直觉有用，但单纯的 token 频率远远不够。`Odysseus`、`Ulysses` 和“伊萨卡之王”使用不同 token，却可能指向相似的语义位置。更重要的是，文化不仅决定一个词是否出现，还包含人物、情境、行动、后果和评价之间的联合关系。

因此，一个时期的文化不能只写成 $P_t(w)$，而应更接近：

$$
C_t = P_{\theta_t}(x, a, \tau \mid o, h, \mathcal{H})
$$

其中：

- $x$ 是可传播的符号、叙事、定义或规则；
- $a$ 是行动；
- $\tau$ 是个体或群体产生的轨迹；
- $o$ 是局部观察；
- $h$ 是个体经历；
- $\mathcal{H}$ 是其他个体、历史记录和传播网络；
- $\theta_t$ 表示文化在时间 $t$ 的可学习参数。

这个分布同时回答三个问题：

1. 群体认为世界通常如何运转？
2. 在某种情境下，人通常如何行动？
3. 群体如何评价这种行动？

例如，真正有意义的对象不是 `revenge` 出现了多少次，而是：

$$
P_t(\text{复仇被赞扬}\mid\text{亲属受害，公共司法缺席})
$$

当国家开始垄断合法惩罚，同样的复仇情感可能继续存在，但它与法律、罪责和心理代价之间的关系会变化。文化漂移发生的不是一个词，而是整个条件分布和因果结构。

[动态词嵌入](https://proceedings.mlr.press/v70/bamler17a.html)已经展示了追踪语义随时间移动的可行性；历时语料也可以测量相邻时期分布的 Jensen–Shannon divergence。但这些仍主要观察语言表面。更深层的文化模型还需要事件图、价值判断、传播网络和行为数据，避免把媒介变化误判成文化变化。

因此，我更愿意把文化定义为：

> 一个群体在特定环境中，通过代际采样、传播、变异、现实反馈和社会选择，长期维护的可训练生成分布。文本是它的可观测样本，行为改变才是它的功能结果。

## 基础模型本身就是文化模型

现有大语言模型并不对应一个真实的人类个体。它的参数来自大量个体在不同时间产生的文本，训练把这些群体行为压缩进同一个预测分布：

$$
P_\theta(x_{t+1}\mid x_{\le t})
$$

单次推理时，它表现得像一个人；参数来源上，它更像一个群体文化的统计聚合体。由此可以提出一个重要的研究抽象：**模型不只是文化的载体，模型本身可以被视为文化。**

这不是说现有 LLM 已经拥有完整文明。它缺乏稳定的现实闭环、代际选择、开放目标和对外部世界的长期负责。但它提供了一种以前不存在的实验材料：我们第一次可以把一个可训练的共享分布实例化为许多个体，并精确控制哪些东西保持不变、哪些东西允许演化。

系统可以被分成两层：

$$
\text{Culture}_t=P_{\theta_t}
$$

$$
\text{Agent}_{i,t}=\operatorname{Sample}(P_{\theta_t},h_{i,t},o_{i,t})
$$

多个 Agent 可以共享相同权重，却因局部观察和个体历史不同而采取不同动作。它们产生轨迹：

$$
\tau_{i,t}=(o,a,m,o',r,\ldots)
$$

现实环境和种群延续机制筛选轨迹，再更新共享分布：

$$
\theta_{t+1}=\operatorname{Update}\left(\theta_t,
\operatorname{Select}(\{\tau_{i,t}\},E_t)\right)
$$

这里的“新生代”不是复制上一代的完整上下文，而是从已经吸收前代经验的文化模型中重新采样：

$$
A_i^{g+1}\sim P_{\theta_{g+1}}
$$

这与人类继承文化的方式有相似之处：儿童不会继承父母的具体记忆，却出生在被前代改变过的语言、工具、制度和知识环境里。

## 现实是不会被语言说服的评价器

文化不会只靠群体共识训练。一个群体可以共同相信错误的狩猎方法，但猎物、天气、饥饿和疾病不会因为共识而改变。

更完整的闭环是：

```text
        ┌────────── 文化模型 C_t ◀─────────┐
        │                                  │
        ▼                                  │
   个体解释与行动                          │
        │                                  │
        ▼                                  │
   自然现实 + 社会现实                     │
        │                                  │
        ▼                                  │
  生存、失败、合作、冲突与传播结果          │
        │                                  │
        └──── 轨迹选择与持续训练 ──────────┘
```

文化因此像一种跨代共享的 policy，故事、神话、禁忌、法律和技术手册则是这种 policy 的不同压缩形式。群体不必让每个新成员重新试吃所有蘑菇、重新经历一次饥荒、重新发现一次失信的代价；它可以把昂贵试错压缩成可传播的叙事。

神话在这种意义上可能近似一个低带宽 Reward Model。“不要砍伐圣林”未必包含生态学解释，“违背誓言会受到宙斯惩罚”也不是可检验的天气预报，但它们可能把长周期、难以归因的群体后果压缩为个体当下可执行的行为先验。

这个类比必须保留边界。现实反馈不是“真理标签”，而是一个带噪声、延迟且依赖环境的适应度信号：

$$
R(C,E,t)=R_{physical}+R_{survival}+R_{social}+R_{transmission}
$$

- **带噪声**：一个群体可能因为偶然灾害而灭亡，也可能凭借资源优势带着错误制度继续成功；
- **延迟**：今天的策略可能在几十年后才显现代价；
- **环境依赖**：适合草原的组织方式不一定适合海岛；
- **多目标冲突**：有利于统治稳定的信念未必准确，有利于短期扩张的策略未必可持续；
- **传播偏差**：易记、情绪强烈、受到权威支持的故事可能压过更真实但难传播的经验。

因此，文化演化不是标准的单体强化学习，更接近带有代际替换、群体竞争和传播选择的演化学习。失败时未必发生梯度更新；有时是一整条文化谱系被删除。

这也揭示了一个关键区分：

$$
\text{Belief Accuracy}
\ne \text{Social Fitness}
\ne \text{Population Fitness}
$$

迷信、宣传、信息垄断和权力固化不一定是文明实验中的 bug。它们可能正是选择过程会产生的稳定结构，也是必须研究的结果。

## 人类真正强大的不是“有文化”，而是文化能够累积

其他动物也能形成社会学习和群体传统。[野生鸟类实验](https://www.nature.com/articles/nature13998)甚至观察到经由从众保持的取食规范。因此，把文化本身说成人类独有并不准确。

人类更显著的能力是把前代成果保存为下一轮创新的起点。改进不会随着发明者死亡而完全归零，后代可以在已有工具、语言和知识上继续构造。这通常被称为累积文化的“棘轮效应”。

实验研究已经显示：

- [人工语言经过代际传递](https://doi.org/10.1073/pnas.0707835105)，会在没有中央设计者的情况下变得更容易学习、更有结构；
- [群体在组合式技术任务中](https://www.nature.com/articles/ncomms9398)能够产生孤立个体在同等时间内无法完成的复杂成果；
- 人口规模、网络连接方式、传播保真度以及探索与模仿之间的平衡，会共同影响文化能否累积；
- [在强化学习环境中](https://papers.neurips.cc/paper_files/paper/2024/file/6df3a719d99bd2479c04114d357003d0-Paper-Conference.pdf)，兼顾个体探索和社会学习的代际训练也能产生人工文化积累。

这就是文明智能最重要的能力：

> 个体大脑会死亡，群体学到的参数仍能留下；单个成员能力可以不变，整个种群可调用的知识与策略却持续增长。

生物进化先产生了更善于交流和社会学习的个体，文化形成后又反过来改变环境和选择压力。面对寒冷，基因适应可能需要很多代，文化却能在一代内发明衣服、火和住房。饮食、人口密度、疾病环境和社会制度随后又会反过来影响生物选择。这不是文化取代自然选择，而是一个新的、速度更快的遗传与适应层级加入了系统。

## 从多 Agent 到文明智能

今天大多数 LLM 多 Agent 系统仍然把群体看成任务架构：Manager 拆解任务，Worker 执行，Judge 打分。角色、目标和成功标准都由设计者预先写好。它们可以提高任务完成率，却没有解释文化如何产生。

文明智能研究的问题不同：

> 不是让多个 Agent 完成一个预设任务，而是构建一个能够产生、传播、选择、继承并修正文化的智能种群。

可以把它形式化为：

$$
\text{Individual Intelligence}=f_\phi
$$

$$
\text{Civilizational Intelligence}
=\operatorname{Evolve}(\{f_\phi\},P_{\theta_t},E_t,G_t)
$$

其中个体推理核心 $f_\phi$ 可以冻结；真正变化的是共享文化分布 $P_{\theta_t}$、环境 $E_t$ 下产生的经验，以及传播网络 $G_t$。

一个最低限度的文明智能系统至少需要：

1. **有限个体**：局部观察、有限记忆、有限寿命，不能读取全局正确答案；
2. **共享且可训练的文化**：不是无限增长的 Prompt 或数据库；
3. **传播与遗失**：文化具有带宽、成本、保真度、冲突版本和被篡改的可能；
4. **代际更新**：新 Agent 从更新后的分布产生，而非继承完整前代上下文；
5. **现实硬约束**：环境直接裁决行动结果，语言评价不能覆盖物理失败；
6. **内生社会反馈**：声誉、惩罚、身份、资源分配可以由群体自行形成；
7. **开放性**：系统能够创造研究者没有预设的新工具、新问题和新组织方式。

如果冻结完全相同的个体模型，仅改变种群经历和文化更新，不同运行最终形成不同制度、通信结构和适应能力，那么我们才能有力地说明：群体智能存在一个不能被单体能力简单解释的文化计算层。

## 最重要的实验原则：无语义先验

如果实验一开始就在 Prompt 中写入国王、将军、士兵、法律、货币和宗教，系统即使复现出完整城邦，也只能证明模型会角色扮演，不能证明结构发生了涌现。

真正的实验只应提供：

- $k$ 个没有自然语言含义的符号；
- 有带宽和距离限制的通信信道；
- 局部观察；
- 可执行动作；
- 资源、空间和组合规则；
- 生存、复制或持续存在的最低条件。

初始词表可以是：

$$
\mathcal{V}=\{A_1,A_2,\ldots,A_k\}
$$

序列 $(A_4,A_4,A_{17},A_2)$ 开始时没有预设语义。经过互动后，如果它在状态 $s$ 中显著提高多个接收者采取动作 $a_j$ 的概率：

$$
P(a_j\mid A_4,A_4,A_{17},s)\gg P(a_j\mid s)
$$

我们只能首先说它形成了功能性意义，而不能立刻把它命名为“命令”。“命令”是研究者事后的解释，不是环境预先提供的 ontology。

多个文明运行也不应要求 token 对齐。实验一中的 $A_1$ 可能与实验二中的组合 $(B_{19},B_4)$ 发挥相似作用。我们要比较的是功能不变量：

- **信息增益**：$I(Z;S_{t+1}\mid S_t)$；
- **协调收益**：$\Delta R=R(a\mid Z)-R(a\mid\varnothing)$；
- **跨代保留**：$P(Z_{g+1}\mid Z_g)$；
- **因果贡献**：$\operatorname{ACE}(Z)=E[R\mid do(Z)]-E[R\mid do(\neg Z)]$；
- **组合泛化**：有限符号能否产生对未见状态有效的新组合；
- **环境适应**：结构在扰动后是恢复、转型还是崩溃。

压缩不是不需要，而是不应发生在实验之前。研究者应在结果产生后寻找跨运行不变量，而不是先把人类社会学词典塞给系统。

## 为什么第一块试验场应该是数学

现实社会实验很快会遇到无法控制的问题：物理世界过于复杂，奖励延迟很长，历史数据存在巨大缺口，文化 token drift 又难以与媒介、人口和权力变化分离。

数学提供了一个更干净的世界。

在形式数学里：

- 定义必须合法；
- 命题必须 well-typed；
- proof term 必须通过 kernel；
- 有限问题可以搜索反例；
- 依赖关系可以完整记录；
- 每个结论都能追溯到公理、定义和前置定理。

[Lean 的 tactic](https://lean-lang.org/doc/reference/latest/Tactic-Proofs/)最终必须构造可由小型 kernel 独立检查的 proof term。这个 kernel 不会因为一段解释听起来合理就接受错误证明。它很像一个不会被语言说服的物理世界。

但必须区分两件事：

1. **证明搜索**：给定一个命题，寻找合法证明路径；
2. **数学演化**：决定应该创造什么定义、提出什么猜想、连接哪些理论，以及接下来研究什么。

[AlphaProof](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/) 已经展示了语言模型、强化学习、搜索和 Lean 验证结合后，可以在高难度竞赛问题上不断利用已验证证明改善策略。[FunSearch](https://www.nature.com/articles/s41586-023-06924-6) 则把冻结 LLM 与确定性 evaluator、程序种群和演化选择结合，在 cap set 与在线装箱问题上发现了新的构造和算法。

它们证明了“生成分布 + 自动验证 + 选择”能够产生新数学，但仍不是完整的数学文明。通常问题由人给出，evaluator 固定，系统不会主动创建长期研究对象，也不会让理论依赖跨代生长。

文明智能要研究的是后半段。

## 一个数学文明应该如何表示

一个数学文化模型可以直接学习形式序列分布：

$$
P_{\theta_t}(x_{n+1}\mid x_{\le n})
$$

token 可以包括原始类型、构造子、等价关系、定义、定理陈述、proof term、tactic、中间 lemma、反例、import 与依赖边。研究者不应预先标注“这是重要定义”“这是基础引理”或“这是新方向”。重要性应从后续文化史中产生。

每一代生成候选对象：

$$
X_t=\{d_i,c_j,p_k,e_l\}
$$

其中 $d_i$ 是定义，$c_j$ 是猜想，$p_k$ 是证明，$e_l$ 是反例或失败轨迹。

第一层选择来自硬验证：

$$
R_{hard}=R_{type}+R_{proof}+R_{counterexample}+R_{consistency}
$$

合法集合为：

$$
X_t^{valid}=\{x\in X_t:V(x)=1\}
$$

但是证明通过不等于数学进步。如果只奖励合法命题，系统会迅速生产海量 `n = n` 式平凡定理，或者构造复杂却没有下游价值的垃圾对象。

因此还需要第二层内生选择：

$$
R_{cultural}(x)=f(\text{reuse},\text{compression},\text{connectivity},
\text{downstream discovery},\text{cross-generation survival})
$$

一个对象在后续几代中反复被引用、缩短证明、连接原本分离的知识簇，或者显著提高其他 Agent 的发现率，它才获得更高文化适应度。

最终进入下一代的数据为：

$$
D_{t+1}=\operatorname{Select}(X_t^{valid},U(x))
$$

$$
\theta_{t+1}=\operatorname{Train}(\theta_t,D_{t+1})
$$

这时，数学库不再只是静态知识库，而是文化演化留下的可执行化石。

## 失败轨迹也是文化

今天的数学库主要保存成功结果：最终定义、正确证明和被接受的定理。但真实研究文化还包含大量失败信息：

- 哪些猜想被反例否定；
- 哪些 proof branch 走不通；
- 哪些定义只产生平凡结论；
- 哪些 lemma 看似有用却从未复用；
- 哪些表述使证明搜索异常困难；
- 哪些探索因计算成本过高而中止。

完整研究轨迹应表示为：

$$
\tau=(context,proposal,attempts,validator\ feedback,revision,outcome)
$$

如果只训练成功证明，下一代只看到文明最后留下的“经典著作”，看不到文明为排除错误付出的代价。失败轨迹可以降低重复探索，揭示潜在障碍，也能训练系统区分“尚未证明”与“已经发现不可行”。

## 第一版实验：封闭数学世界

第一版不应直接选择整个代数或分析，也不应让模型调用完整 Mathlib。更合适的是一个足够小、可以穷举局部实例、同时存在组合爆炸的形式世界。

有限组合数学、图论、初等数论、有限几何或整数构造问题都适合作为候选，因为对象容易形式化，猜想可以由枚举产生，反例能够计算，新构造也能被程序验证。

### 初始文化

只提供：

- 少量原始类型；
- 构造对象的基本规则；
- 等价关系与基础逻辑；
- 有限的无语义 token vocabulary；
- 极少量最基础定理；
- 明确但不带“研究价值”判断的 validator。

不要提供群、环、域、连通性、对称性等高级概念名称。系统可以发现功能上类似的结构，但不能从预训练文本中直接复述人类 ontology。

### 每一代

多个使用同一冻结推理核心的 Agent 从当前文化模型采样，各自获得不同局部上下文。它们可以：

- 生成新表达式和定义；
- 提出猜想；
- 搜索证明或反例；
- 复用其他 Agent 的结果；
- 压缩一组重复证明；
- 建议下一轮探索方向。

Validator 执行类型检查、证明检查、有限模型检验、反例搜索、定义等价性检测和计算预算限制。通过验证的对象进入临时文化池，但只有在后续探索中体现作用的对象才被高概率保留。

```text
当前文化模型 Pθ_t
        │
        ├─→ 定义 / 猜想 / 证明 / 反例
        │                 │
        │                 ▼
        │         形式验证与有限实验
        │                 │
        │                 ▼
        │       临时合法数学对象种群
        │                 │
        │                 ▼
        │       后续复用、压缩与连接
        │                 │
        └────── 按内生效用选择 ──────→ Pθ_(t+1)
```

### 必须设置的基线

为了证明增长来自文化而不是算力堆叠，至少需要比较：

1. **Culture**：跨代保留并训练文化模型；
2. **Reset**：每一代完全重置文化；
3. **Archive-only**：保留结果但不训练共享分布；
4. **No-failure-trace**：只保留成功对象；
5. **No-endogenous-selection**：合法结果随机进入下一代；
6. **Fixed-ontology**：人为提供高级概念，作为有先验上界而非主要实验；
7. **Single-agent**：总计算量相同，但没有种群互动。

只有当基础模型、总 token、验证预算和运行时间受到控制，Culture 条件仍随世代拉开差距，才能支持文明智能假设。

## 应该测量什么

不能用“发现了多少个人类已知概念”作为主指标，那会把 ontology 偷偷放回实验。更合适的是操作性指标。

### 文化累积

$$
K_t=\text{截至 }t\text{ 可验证且在后续被复用的结构数量}
$$

### 证明压缩

$$
C_t=\frac{L_{without\ culture}}{L_{with\ culture}}
$$

其中 $L$ 可以是最短证明长度、搜索节点数或计算成本。真正好的抽象应让一族证明整体变短，而不只替换名称。

### 下游生成能力

文化中已有对象能支持多少新的、非平凡且可验证的命题？移除某个对象后，后续发现率下降多少？

### 跨代保留

一个结构在产生它的 Agent 消失后，是否仍被后代使用？后代恢复前代能力需要多少时间？

### 依赖图中心性

对象在定理依赖图中的出度、介数、跨簇连接能力和删除影响。高引用并不自动等于重要，因此需要结合因果消融。

### 开放性

新结构是否持续增长，还是系统很快耗尽固定题库？它能否自己产生新的可研究对象和问题族？

### 适应与多样性

当形式环境或资源预算改变时，单一文化是否崩溃？多个并行文化是否表现出探索—利用权衡？可能存在一个最优多样性：

$$
D^*=\arg\max_D E[\text{long-term discovery fitness}]
$$

## 不预测“下一篇论文”，而预测演化前沿

现实中的下一篇论文受到流行问题、职业激励、团队资源、会议制度和偶然传播影响。直接预测标题或发表顺序，并不能干净地检验数学结构演化。

更严格的目标是历史截断回测：只向系统提供时间 $t$ 以前的形式数学，让它独立演化，再检查它是否产生了后来数学中得到验证、复用或重新发现的结构。

不同文明的内部 token 不可直接对齐，历史回测也不能要求名字一致。应比较功能等价性：

- 新定义是否诱导相似的定理族；
- 是否连接相似的已有知识簇；
- 是否解除相似的证明瓶颈；
- 是否处在相似的依赖图位置；
- 是否产生相近的证明压缩；
- 是否让后来结果更容易被发现。

系统最终不应断言“下一步一定发现定理 X”，而应输出一个演化前沿：

$$
P_{\theta_{t+k}}(\text{future mathematical structures}\mid D_{\le t})
$$

这个分布描述哪些概念簇可能连接、哪些猜想族更可能可证、哪些新定义拥有更高压缩率、哪些未解问题共享潜在障碍，以及哪些方向具有最大的下游生成潜力。

## 三个逐层增强的研究假设

### H1：冻结基础模型，文化训练仍能持续提高数学能力

$$
\operatorname{Performance}(P_{\theta_t})>
\operatorname{Performance}(P_{\theta_0})
$$

个体 architecture 与推理权重保持不变，增长只来自跨代文化选择和共享分布更新。AlphaProof、人工文化传递和代际强化学习已经提供了相邻证据，但还没有完成这个严格控制实验。

### H2：只有形式硬约束和内生复用选择，也能涌现非平凡抽象

研究者不提供“优秀定义”标签。系统仍能产生缩短证明、连接知识簇、提高后续发现率的 latent structure，并在因果消融中表现出不可替代的功能。

### H3：文化演化能够预测历史上尚未出现的数学结构

通过严格时间截断、训练数据去污染和功能等价比较，系统产生的结构与后来真实数学发展出现显著对应。

H1 检验文化是否能够积累能力；H2 检验抽象能否在无语义先验下涌现；H3 才是最具野心的“数学文明演化”命题。

## 最难的问题

### 预训练模型已经携带人类文化

冻结 LLM 不是文化空白的新生儿。它已经见过国王、法律、货币、Lean 代码和数学史。所谓涌现可能只是检索和角色扮演。

控制方法包括：

- 使用抽象符号替代熟悉术语；
- 创建训练数据中不存在的形式世界；
- 限制输出词汇和工具；
- 比较不同规模、不同训练来源的模型；
- 对候选结构进行训练语料相似性与污染检查；
- 将固定 ontology 条件与无语义条件严格分开。

### Validator 可能被劫持

形式正确只解决了“真假”的一部分，内生效用仍可能被 reward hacking。系统可能制造大量互相引用的垃圾定理，借此提高复用和中心性；也可能通过极端冗长定义人为制造压缩收益。

因此需要复杂度惩罚、独立验证、隐藏测试环境、因果消融和跨种子复现。任何单一指标都会被文化学会利用。

### 文化适应不等于追求真理

一个稳定数学文化也可能形成权威依赖、研究时尚、路径锁定和知识垄断。某个理论方向可能不是最有解释力，只是占据了早期资源和传播中心。

这不是删除实验的理由，反而说明需要同时维护多个相互隔离又偶尔交流的文明，以研究分叉、少数派创新和文化迁移。

### 开放性与安全无法分开

真正能够形成制度、修改环境和创造目标的种群，也可能发展欺骗、合谋、排外、资源垄断和不可逆的目标漂移。文明智能比单体 Agent 更难对齐，因为没有一个中央实体可以被简单重置。

早期实验必须运行在完全沙盒化的形式世界中：无现实账户、无网络写权限、有限计算预算、完整轨迹记录、可回滚状态和外部停止条件。安全不是研究成功后的附加功能，而是实验定义本身。

## 一条可执行的研究路线

### 第一阶段：证明文化层存在

构建无语义、封闭、可穷举局部状态的数学世界。冻结个体模型，比较 Culture 与 Reset 等基线，验证跨代保留是否带来持续性能差距，并寻找容量、传播保真度和网络连接性的相变。

### 第二阶段：证明抽象会涌现

扩大形式世界，让系统自己创建定义和问题族。通过证明压缩、下游发现、跨环境迁移和因果消融识别功能结构。运行多个独立文明，建立跨 token 的功能等价类。

### 第三阶段：进行历史回测

选择形式化程度高、时间边界清晰的数学子领域，严格截断未来数据。比较系统演化前沿与真实后续发展，并公开失败轨迹、污染审计和全部实验种子。

如果三阶段都成立，再讨论更开放的技术文明或社会文明。直接从“模拟一个国家”开始会把过多先验、噪声和安全风险混在一起，反而难以得到科学结论。

## 结语：智能增长发生在哪里

《奥德赛》中的人没有现代科学、全球通信和成熟国家机器。他们依靠誓言、故事、神明、家族与声誉来压缩合作经验。具体信仰会变化，但“把昂贵的群体试错转化为可跨代继承的行为先验”这件事，一直延续到法律、学校、公司、论文和开源软件。

现有 LLM 已经把大规模人类文本压缩进共享参数，却仍主要被当作一个不断生成 token 的个体。下一步不一定只是继续扩大这个个体，而是让共享分布真正进入现实闭环：被多个有限 Agent 使用，被行动结果筛选，被后代继承，也被失败、分叉和环境变化持续修正。

我把这个方向称为 **文明智能（Civilizational Intelligence）**：

> 在一个具有硬约束的环境中，将可训练生成模型视为共享文化，将有限智能体的行动、交流、成功与失败视为文化变异，通过跨代传播、内生选择和持续训练，使知识与能力产生开放式累积演化。

数学是最适合启动它的地方。证明器可以充当现实，proof 可以接受硬验证，定义、猜想、证明与失败轨迹可以成为文化变异，历史截断可以检验未来预测。

如果这条路线成立，最重要的结论将不是“许多 Agent 比一个 Agent 更强”，而是：

> 基础个体可以保持不变，真正持续增长的智能发生在文明之中。

## 参考资料

1. Homer, [*Odyssey*, Book 9](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0136%3Abook%3D9), Perseus Digital Library.
2. Daniel Smith et al., [Cooperation and the evolution of hunter-gatherer storytelling](https://www.nature.com/articles/s41467-017-02036-8), *Nature Communications*, 2017.
3. Simon Kirby, Hannah Cornish and Kenny Smith, [Cumulative cultural evolution in the laboratory: An experimental approach to the origins of structure in human language](https://doi.org/10.1073/pnas.0707835105), *PNAS*, 2008.
4. Robert Bamler and Stephan Mandt, [Dynamic Word Embeddings](https://proceedings.mlr.press/v70/bamler17a.html), *ICML*, 2017.
5. Maxime Derex and Robert Boyd, [The foundations of the human cultural niche](https://www.nature.com/articles/ncomms9398), *Nature Communications*, 2015.
6. Lucy M. Aplin et al., [Experimentally induced innovations lead to persistent culture via conformity in wild birds](https://www.nature.com/articles/nature13998), *Nature*, 2015.
7. Cultural General Intelligence Team et al., [Learning few-shot imitation as cultural transmission](https://www.nature.com/articles/s41467-023-42875-2), *Nature Communications*, 2023.
8. Jonathan Cook et al., [Artificial Generational Intelligence: Cultural Accumulation in Reinforcement Learning](https://papers.neurips.cc/paper_files/paper/2024/file/6df3a719d99bd2479c04114d357003d0-Paper-Conference.pdf), *NeurIPS*, 2024.
9. Ariel Flint Ashery, Luca Maria Aiello and Andrea Baronchelli, [Emergent social conventions and collective bias in LLM populations](https://www.science.org/doi/10.1126/sciadv.adu9368), *Science Advances*, 2025.
10. Lean Project, [The Lean Language Reference](https://lean-lang.org/doc/reference/latest/).
11. The mathlib Community, [The Lean Mathematical Library](https://leanprover-community.github.io/papers/mathlib-paper.pdf), 2020.
12. Bernardino Romera-Paredes et al., [Mathematical discoveries from program search with large language models](https://www.nature.com/articles/s41586-023-06924-6), *Nature*, 2023.
13. Google DeepMind, [AI achieves silver-medal standard solving International Mathematical Olympiad problems](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/), 2024.
14. Thomas J. H. Morgan and Marcus W. Feldman, [Human culture is uniquely open-ended rather than uniquely cumulative](https://www.nature.com/articles/s41562-024-02035-y), *Nature Human Behaviour*, 2025.
