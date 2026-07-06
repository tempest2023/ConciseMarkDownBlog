# About Me

My name is Tempest (Tao Ren). I'm an independent researcher and a senior AI full-stack engineer.

I build AI systems to help models to do real work: read long context, use tools, follow domain constraints, produce artifacts, and stay reliable enough for people to trust. My strongest professional direction is AI Research Engineering, especially the space between LLM research, agent system design, evaluation, and production software.

AGI/ASI is my lifelong pursuit. 

## Early Research Experiences

My first deep learning-related project started in 2014, when I used the Face++ API to build a face recognition app. It was early and application-driven, but it gave me my first concrete contact with deep learning.

In 2017-2018, I took Andrew Ng's Machine Learning and Deep Learning courses on Coursera. Those courses became the real beginning of my deep learning journey. At Southern University of Science and Technology, I worked with [Prof. Ran Cheng](https://chengran.tech/) on computer vision research, especially GAN-based face generation. That period shaped how I think about deeplearning neural network and AI.

Later, I worked with [Yi Liu](https://www.linkedin.com/in/yi-liu-755692145/) and [Prof. Yepang Liu](https://yepangliu.github.io/)'s lab on JavaScript performance-related issues and web accessibility. We explored how constraint solving and linear programming could be used to address accessibility problems in JavaScript and web applications. That work led to [Taming Accessibility Issues in Web Application for the Disabled](https://drive.google.com/file/d/1OeUMlKKRzQRxBwwlv_h6faJBbqWykii8/view), and it gave me an important research instinct: good engineering problems can often be reframed into formal structures that can be analyzed, optimized, and repaired.

## Engineering Experience

After graduating from SUSTech, I joined Ant Group (Alibaba) in 2020 and worked on Alipay financial product systems, low-code content infrastructure, live-streaming components, backend services, and mobile-web integration. That period made me much stronger as a software engineer. I learned how to build systems for real business workflows, real users, and real operational pressure.

In 2021, I moved to the University of Pittsburgh and worked in [Prof. Dan Ding](https://www.shrs.pitt.edu/people/dan-ding)'s lab on software systems for human rehabilitation research. I built web, mobile, data collection, visualization, and low-code research platforms that helped researchers and clinical partners run rehabilitation studies and training programs. That work kept me close to applied research while deepening my ability to deliver full-stack systems.

At TikTok, I worked on large-scale mobile product surfaces and later built an internal LLM-based coding agent from scratch for Objective-C to Swift migration. That project was a meaningful bridge from conventional SDE work into LLM engineering: prompt design, code-generation workflows, custom evaluation harnesses, iterative quality loops, and practical judgment about whether generated code was actually useful to engineers.

## Research and AI Systems

My later research work moved toward LLMs, NLP, code generation, tool use, and real-time AI systems.

FineEdit studies precise, instruction-driven editing in structured domains such as code, LaTeX, and database languages. TreeDiff explores AST-guided code generation with diffusion LLMs, treating code as a structured object rather than plain text. Infant Agent studies a tool-integrated, logic-driven agent design with memory, task-aware functions, and cost-aware API usage. RED studies real-time scheduling for robotic inference under environmental dynamics, where model execution is constrained by latency, dependencies, and changing environments.

These projects reflect the same professional taste from different angles. I like problems where model capability is only one part of the system. The rest is structure, tools, evaluation, constraints, memory, runtime behavior, and careful engineering.

## Nova Agent

Today, at [Newfront](https://www.ycombinator.com/companies/newfront-insurance) / WTW, I work on insurance AI systems and agentic workflows. I have also worked on Quoting and Placement Service, which are more traditional SDE systems but are essential to understanding the insurance domain, operator workflows, and the service boundaries that an AI agent has to respect.

My main AI work is Nova Agent, an internal AI coworker platform for insurance operators.

The closest analogy is **Claude Code, Codex, and Claude Cowork for knowledge work, but designed specifically for insurance operations**. Nova Agent is not a generic chat interface. It is a domain-specific agent that understands insurance documents, tasks, company style, workflow expectations, and operator review needs.

A single insurance task can involve more than 50 PDF files, multiple policy or submission documents, several generated contract files, insurance communication emails written in company style, and coordination with internal systems. Making this work requires agent system design around skills, harnesses, memory, shell-use, browser-use, Chain-of-Thought-style task decomposition, schedules, document processing, structured output generation, and human-in-the-loop review.

This is where my research and engineering background reinforce each other. Research helps me ask whether the agent is reasoning over the right structure, using the right tools, and producing outputs that can be evaluated. Engineering helps me make those ideas work inside production services, real APIs, messy files, user permissions, and domain-specific failure modes.

## What I Bring to AI Research Engineering

- Research taste around structured generation, agentic workflows, evaluation, and model behavior under real constraints
- Strong software engineering experience across full-stack systems, mobile, backend, developer tooling, and production AI products
- Hands-on LLM experience in code generation, document automation, prompt iteration, tool use, and evaluation harnesses
- CV and robotics experience that shaped how I think about latency, runtime constraints, environment dynamics, and reliability
- A product-grounded instinct for turning model capability into usable systems with measurable outcomes

## Work Highlights

- Nova Agent at [Newfront](https://www.newfront.com/) / [WTW](https://www.wtwco.com/en-us): a domain-specific AI coworker for insurance operators, long document workflows, contract generation, email drafting, tool use, and human-in-the-loop operations
- Internal LLM coding agent at TikTok: Objective-C to Swift migration with prompt engineering, code-generation loops, and custom evaluation harnesses
- [TreeDiff: AST-Guided Code Generation with Diffusion LLMs](https://arxiv.org/abs/2508.01473): syntax-aware diffusion LLM research for code generation, accepted to [SURGeLLM at ACL 2026](https://surgellm.github.io/acl2026/)
- [Bridging the Editing Gap in LLMs: FineEdit for Precise and Targeted Text Modifications](https://aclanthology.org/2025.findings-emnlp.118/): Findings of EMNLP 2025
- [Infant Agent: A Tool-Integrated, Logic-Driven Agent with Cost-Effective API Usage](https://arxiv.org/abs/2411.01114)
- [RED: A Systematic Real-Time Scheduling Approach for Robotic Environmental Dynamics](https://ieeexplore.ieee.org/abstract/document/10405986): RTSS 2023
- `RED: Adaptive Real-Time DAG Scheduling for Robotic Inference under Environmental Dynamics`: journal extension under review
- [Taming Accessibility Issues in Web Application for the Disabled](https://drive.google.com/file/d/1OeUMlKKRzQRxBwwlv_h6faJBbqWykii8/view): constraint-solving and optimization work for web accessibility
- [PythonCVDetection](https://github.com/623059008/PythonCVDetection): OpenCV object detection over WebRTC-transmitted video frames
- [Autopilot2PytorchSteering](https://github.com/623059008/Autopilot2PytorchSteering): PyTorch steering-angle prediction from RGB inputs

## Founder Work

I have also spent a meaningful part of my career building startup from zero. In 2018, I joined an EOS Hackathon and reached the top 10%. After that, I received funding from IDG Capital to develop a low-code development platform for Ethereum smart contracts.

In summer 2025, I co-founded [Tira AI](https://tira.tempest.fun) with Sam Liu, a UC Berkeley alumnus. We built an AI-native execution product, received top-10% feedback from YC S25, and were selected by several founder programs and incubators, including Beta University.

I also built [AgentShelf](https://github.com/tempest2023/AgentShelf), an AI commerce readiness console exploring how product data becomes visible, comparable, and operational in AI-native commerce channels.

If you are interested in my work, feel free to [have a look](/?page=Projects/Project).
