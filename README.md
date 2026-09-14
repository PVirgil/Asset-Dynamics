# Asset Dynamics

> **A computational modeling laboratory for understanding how systems behave, how variables influence outcomes, and how calculus connects to real-world decisions.**

Asset Dynamics is an interactive modeling environment for building systems from variables and equations, exploring how those systems respond to change, and understanding the mathematics behind those relationships.

Instead of treating calculus as a collection of abstract exercises, Asset Dynamics connects mathematical concepts directly to models of software, businesses, AI systems, economics, growth, operations, and other dynamic systems.

The core idea is simple:

**Build a model. Change its inputs. Observe what happens. Understand why.**

---

## What Is Asset Dynamics?

Most tools represent systems in one of a few ways:

* Spreadsheets represent them as cells.
* Programming environments represent them as code.
* Diagramming tools represent them visually.
* Financial software represents them as predefined models.

Asset Dynamics approaches the problem differently.

A system is represented as a collection of **variables and mathematical relationships**.

For example:

```text
Customers = 1,000
Price = $29

Revenue = Customers × Price

Costs = FixedCost + Customers × VariableCost

Profit = Revenue − Costs

Value = Profit × 12 × Multiple
```

This creates a dependency system:

```text
Customers ───────┐
                 ├──→ Revenue ──┐
Price ───────────┘              │
                                ├──→ Profit ──→ Value
Customers ───────┐              │
                 ├──→ Cost ─────┘
Variable Cost ───┤
Fixed Cost ──────┘
```

Asset Dynamics evaluates the entire system automatically.

Change `Price`, and Revenue changes.

Revenue changes Profit.

Profit changes Value.

The model therefore becomes a computational representation of **cause, effect, and dependency**.

---

# The Core Idea

Asset Dynamics is built around a general workflow:

```text
DESCRIBE
   ↓
MODEL
   ↓
SIMULATE
   ↓
ANALYZE
   ↓
OPTIMIZE
   ↓
VALUE
```

The long-term goal is to create a general-purpose environment for answering questions such as:

* How does this system work?
* What happens if this variable changes?
* Which variables matter most?
* How quickly is an outcome changing?
* What causes that change?
* What happens over time?
* Where are the important thresholds?
* What combination of inputs produces the best result?
* How uncertain is the outcome?
* What is the resulting asset or system worth?

The same underlying mathematical engine can eventually be applied across many different domains.

---

# Current Capabilities

Asset Dynamics currently provides the foundation of the modeling system.

## Computational Models

Models consist of two primary node types:

### Inputs

Inputs are independent variables that can be directly controlled.

Examples:

```text
Customers = 1000
Price = 29
VariableCost = 6
FixedCost = 12000
```

### Formulas

Formulas create relationships between variables.

Examples:

```text
Revenue = Customers * Price

Cost = FixedCost + Customers * VariableCost

Profit = Revenue - Cost
```

Formula nodes can depend on inputs or other formulas.

Asset Dynamics resolves these dependencies and evaluates the resulting system.

---

# Formula Engine

The current expression engine supports standard arithmetic:

```text
+
-
*
/
^
```

as well as parentheses:

```text
(Revenue - Cost) * 12
```

and several mathematical functions:

```text
exp()
log()
sqrt()
abs()
min()
max()
pow()
```

For example:

```text
LifetimeFactor = 1 / max(0.01, 1 - Retention)
```

or:

```text
Value = max(0, Profit * 12 * Multiple)
```

Variable names are case-sensitive.

---

# Sensitivity Analysis

One of the central features of Asset Dynamics is the ability to ask:

> **How sensitive is one result to another variable?**

Suppose:

```text
Revenue = Customers × Price
```

and:

```text
Profit = Revenue − Cost
```

and:

```text
Value = Profit × 12 × Multiple
```

Asset Dynamics can analyze:

```text
Price → Value
```

and approximate:

```text
∂Value
──────
∂Price
```

This measures the local sensitivity of Value to Price.

In practical terms, it asks:

> Near the current model state, how much would Value change if Price changed slightly?

This turns a derivative into something operational rather than purely abstract.

---

# Calculus Inside Asset Dynamics

Calculus is not intended to be a separate educational feature added on top of the application.

It is part of the computational architecture.

Asset Dynamics connects mathematical concepts directly to real systems.

## Functions

A model establishes relationships such as:

```text
Value = f(Price)
```

or:

```text
Profit = f(Customers, Price, Cost)
```

---

## Derivatives

Derivatives measure local change:

```text
dRevenue
────────
 dPrice
```

or:

```text
∂Value
──────
∂Customers
```

In Asset Dynamics, derivatives become **sensitivity measurements**.

---

## Chain Rule

Consider:

```text
Price
  ↓
Revenue
  ↓
Profit
  ↓
Value
```

Changing Price indirectly changes Value through several intermediate relationships.

Mathematically, this corresponds to the chain rule:

```text
dValue     dValue     dProfit     dRevenue
────── = ───────── × ───────── × ─────────
dPrice     dProfit    dRevenue      dPrice
```

This makes the chain rule a description of how influence propagates through a computational system.

---

## Partial Derivatives

Systems often contain many inputs:

```text
Value = f(
    Growth,
    Price,
    Retention,
    Cost,
    Traffic,
    Conversion
)
```

Partial derivatives allow each relationship to be examined independently:

```text
∂Value / ∂Growth

∂Value / ∂Price

∂Value / ∂Retention

∂Value / ∂Cost
```

Together, these measurements can reveal which variables have the greatest local influence on an outcome.

---

## Gradients

When several controllable variables influence an objective, their partial derivatives can eventually be combined into a gradient:

```text
         [ ∂Value / ∂Price      ]
         [                      ]
∇Value = [ ∂Value / ∂Retention  ]
         [                      ]
         [ ∂Value / ∂Cost       ]
         [                      ]
         [ ∂Value / ∂Growth     ]
```

The gradient describes the direction in parameter space in which the objective increases most rapidly.

This provides the mathematical foundation for future optimization capabilities.

---

## Integrals

Future models can use integration to represent accumulated quantities:

```text
Total Cost = ∫ Cost(t) dt
```

```text
Total Revenue = ∫ Revenue(t) dt
```

```text
Present Value = ∫ CashFlow(t)e^(-rt) dt
```

This expands Asset Dynamics from analyzing instantaneous relationships to analyzing quantities accumulated through time.

---

## Differential Equations

Dynamic systems can be represented by equations such as:

```text
dCustomers
─────────── = Acquisition − Churn
     dt
```

or:

```text
dQueue
────── = IncomingRequests − ProcessingRate
  dt
```

This creates the foundation for simulations of systems that evolve over time.

---

# Response Curves

Sensitivity gives information about a system at one operating point.

Response curves provide a broader picture.

Asset Dynamics varies a selected input around its current value and evaluates the corresponding output.

For example:

```text
Price
  ↓
Value
```

produces a curve representing:

```text
Value = f(Price)
```

This makes it possible to see whether the relationship is approximately linear, nonlinear, accelerating, flattening, or approaching a threshold.

The derivative describes the **local slope** of that curve.

The response curve provides the surrounding context.

---

# Built-In Model Examples

Asset Dynamics includes several example systems demonstrating how the same engine can represent very different problems.

## SaaS Economics

The SaaS model connects:

```text
Customers
Price
Variable Cost
Fixed Cost
Multiple
```

to:

```text
Revenue
Cost
Profit
Value
```

This model can be used to explore questions such as:

* How much does another customer contribute to profit?
* How sensitive is value to pricing?
* What happens when variable costs increase?
* Which input has the greatest effect on modeled value?

---

## AI API Economics

The AI API model connects:

```text
Requests
Price per 1K requests
Cost per 1K requests
Success rate
Fixed cost
```

to:

```text
Revenue
Compute Cost
Profit
Successful Requests
Utility
```

This demonstrates that the same modeling engine can analyze software infrastructure and AI economics rather than only traditional financial models.

Possible questions include:

* What is the marginal economic effect of additional API traffic?
* How much does lower inference cost improve profit?
* What is the relationship between reliability and system utility?
* Where does increased usage become economically attractive?

---

## Growth Systems

The growth model connects:

```text
Traffic
Conversion
Price
Retention
```

to:

```text
Customers
Revenue
Lifetime Factor
Value
```

This creates a simple model for exploring growth mechanics and nonlinear relationships.

---

# Asset Dynamics Is Not Just a Valuation Tool

Valuation is one potential application of the modeling engine.

The broader idea is to model **systems**.

A system might be:

### A business

```text
Customers → Revenue → Profit → Value
```

### A website

```text
Traffic → Conversion → Users → Revenue
```

### An AI product

```text
Requests → Compute → Success → Cost → Utility
```

### Software infrastructure

```text
Traffic → Queue → Latency → Reliability → Cost
```

### A marketplace

```text
Buyers ↔ Transactions ↔ Sellers
               ↓
             Revenue
```

### Real estate

```text
Occupancy → Rent → NOI → Cash Flow → Value
```

### A subscription product

```text
Acquisition
     ↓
Customers ← Churn
     ↓
Revenue
     ↓
Profit
```

The domain changes.

The underlying mathematical structure remains similar.

---

# The Long-Term Vision

The goal of Asset Dynamics is to evolve from a computational model editor into a **general-purpose system intelligence platform**.

The architecture can be thought of as several increasingly powerful layers.

```text
┌─────────────────────────────┐
│         AI Interface        │
├─────────────────────────────┤
│          Valuation          │
├─────────────────────────────┤
│         Optimization        │
├─────────────────────────────┤
│        Sensitivity          │
├─────────────────────────────┤
│         Simulation          │
├─────────────────────────────┤
│       Dynamics Engine       │
├─────────────────────────────┤
│      Computational Graph    │
└─────────────────────────────┘
```

Each layer answers a different question.

---

## Model

> **How does the system work?**

Represent variables and relationships.

---

## Dynamics

> **How does the system change?**

Represent rates of change and interactions through time.

---

## Simulation

> **What happens under these assumptions?**

Run the system forward and observe its behavior.

---

## Sensitivity

> **What matters most?**

Measure how strongly inputs influence outputs.

---

## Optimization

> **What should change?**

Search for combinations of controllable variables that improve an objective.

---

## Valuation

> **What is the resulting asset worth?**

Translate modeled economics, cash flows, uncertainty, and future outcomes into estimated value ranges.

Any valuation generated by such models should be treated as an estimate rather than financial advice.

---

## AI

> **Can the system help construct and investigate models?**

Natural language could eventually become another interface to the modeling engine.

A user might describe:

```text
I operate a subscription software company with
4,000 customers, a $30 monthly price, 3% monthly
churn, and approximately $7 of variable cost per
customer.
```

Asset Dynamics could propose a transparent mathematical model.

Instead of hiding the reasoning, the equations remain visible and editable.

The user could then ask:

```text
What happens if churn falls to 2%?
```

or:

```text
Which assumption has the greatest influence on value?
```

or:

```text
What combination of pricing and retention maximizes profit?
```

The AI becomes an interface to the mathematical system—not a replacement for it.

---

# Explainable Mathematics

A core principle of Asset Dynamics is:

> **The mathematics should remain inspectable.**

If the system claims:

```text
Reducing churn has a larger modeled impact
than increasing acquisition.
```

the user should be able to investigate why.

That means exposing:

* variables,
* equations,
* dependencies,
* derivatives,
* response curves,
* assumptions,
* numerical methods,
* simulations,
* and optimization objectives.

The goal is not simply to produce an answer.

The goal is to make the structure behind the answer understandable.

---

# Computational Graphs

The natural underlying representation for Asset Dynamics is a computational graph.

For example:

```text
Traffic ───────┐
               ↓
           Customers
               ↓
Price ─────→ Revenue
               ↓
Costs ──────→ Profit
               ↓
Multiple ───→ Value
```

Nodes represent variables or functions.

Edges represent dependencies.

This creates an important connection between calculus and software architecture.

If:

```text
Value = f(Profit)

Profit = g(Revenue)

Revenue = h(Customers)

Customers = j(Traffic)
```

then the effect of Traffic on Value can propagate through the graph using the chain rule.

This idea eventually leads naturally toward **automatic differentiation**.

---

# Numerical Differentiation

The current sensitivity engine uses a **central finite-difference approximation**.

Conceptually:

```text
              f(x + h) − f(x − h)
f'(x) ≈       ───────────────────
                       2h
```

Instead of requiring an exact symbolic derivative, Asset Dynamics evaluates the model slightly above and below the current input.

This produces an approximation of the local derivative.

Future versions can compare multiple approaches:

```text
Numerical Differentiation
          ↕
Symbolic Differentiation
          ↕
Automatic Differentiation
```

This would allow Asset Dynamics to become not only a modeling environment but also a practical laboratory for understanding how computers perform calculus.

---

# Future: Dynamic Simulation

Static models answer questions about relationships at a particular state.

Dynamic models answer:

> **What happens next?**

A future simulation engine could support state equations such as:

```text
dUsers/dt = Acquisition − Churn
```

```text
dCash/dt = Revenue − Expenses
```

```text
dInventory/dt = Production − Sales
```

Numerical solvers could then calculate how these variables evolve.

Initial methods could include:

* Euler's method
* improved Euler methods
* Runge–Kutta methods
* adaptive numerical integration

This would allow users to observe entire system trajectories rather than isolated calculations.

---

# Future: Optimization

Once Asset Dynamics understands how an objective responds to its inputs, it can begin answering:

> **What combination of variables produces the best outcome?**

For example:

```text
maximize Profit
```

while requiring:

```text
Latency < 500 ms
```

and:

```text
MarketingSpend ≤ $50,000
```

or:

```text
maximize EnterpriseValue
```

by adjusting:

```text
Price
Retention
Marketing
Infrastructure
```

subject to real constraints.

This transforms Asset Dynamics from a descriptive modeling tool into a decision-support system.

---

# Future: Uncertainty

Real systems rarely have perfectly known inputs.

Instead of:

```text
Growth = 12%
```

a model might eventually express:

```text
Growth ~ Probability Distribution
```

Asset Dynamics could then support:

* scenario analysis,
* probability distributions,
* confidence intervals,
* Monte Carlo simulation,
* expected values,
* downside cases,
* sensitivity under uncertainty,
* and probability-weighted outcomes.

Instead of asking:

> What will happen?

the system could ask:

> What range of outcomes is plausible, and what drives that uncertainty?

---

# Future: Asset Valuation

Asset Dynamics can eventually contain specialized valuation modules built on the general modeling engine.

Potential asset classes include:

* software businesses,
* SaaS companies,
* websites,
* digital products,
* AI products,
* APIs,
* marketplaces,
* traditional businesses,
* real estate,
* intellectual property,
* and other cash-flow-producing assets.

Valuation would remain a layer built on top of the broader modeling system.

The more fundamental questions remain:

```text
How does the asset work?

How does it change?

What determines its economics?

What variables create or destroy value?

What is uncertain?

What could improve it?
```

Valuation becomes the final consequence of understanding those underlying dynamics.

---

# Future: AI-Assisted Modeling

One of the most ambitious directions for Asset Dynamics is turning natural-language descriptions into inspectable computational systems.

For example:

```text
Model an AI SaaS company with 10,000 users.

Users pay $25 per month.

Monthly churn is 4%.

Inference costs approximately $5 per active user.

New users come from paid acquisition and referrals.
```

The system could propose:

```text
dUsers/dt =
PaidAcquisition
+ Referrals
- Churn
```

along with:

```text
Revenue = Users × Price

InferenceCost = Users × CostPerUser

Profit =
Revenue
- InferenceCost
- Marketing
- FixedCosts
```

The user could inspect every assumption before running the model.

This preserves an important principle:

> **AI can propose the mathematics, but it should not hide the mathematics.**

---

# The Learning Philosophy

Asset Dynamics is also an experiment in a different way of learning mathematics.

Instead of:

```text
Learn calculus
      ↓
Solve textbook exercises
      ↓
Maybe use it someday
```

Asset Dynamics follows:

```text
Learn a concept
      ↓
Implement the concept
      ↓
Use it on a real system
      ↓
Visualize what it means
      ↓
Build something more powerful
```

For example:

```text
Functions
    ↓
Model relationships

Derivatives
    ↓
Sensitivity engine

Chain rule
    ↓
Dependency propagation

Partial derivatives
    ↓
Multivariable sensitivity

Gradients
    ↓
Optimization

Integrals
    ↓
Accumulated quantities

Differential equations
    ↓
Dynamic simulations

Numerical analysis
    ↓
Computational solvers

Probability
    ↓
Uncertainty modeling

Linear algebra
    ↓
Large interconnected systems

Machine learning
    ↓
Learn relationships from data
```

As the mathematics becomes more sophisticated, the software becomes more capable.

---

# Project Direction

The development path for Asset Dynamics follows the increasing sophistication of the modeling engine.

### Foundation

```text
Inputs
   ↓
Functions
   ↓
Outputs
   ↓
Sensitivity
```

### Computational Graph

```text
Nodes
   ↓
Dependencies
   ↓
Influence propagation
   ↓
Chain rule
```

### Calculus Engine

```text
Numerical derivatives
   ↓
Symbolic derivatives
   ↓
Automatic differentiation
```

### Dynamics Engine

```text
State variables
   ↓
Rates of change
   ↓
Differential equations
   ↓
Numerical solvers
```

### Simulation Engine

```text
Initial conditions
   ↓
Time evolution
   ↓
Scenarios
   ↓
System behavior
```

### Optimization Engine

```text
Objective
   ↓
Decision variables
   ↓
Constraints
   ↓
Search
   ↓
Optimal strategy
```

### Uncertainty Engine

```text
Distributions
   ↓
Monte Carlo
   ↓
Outcome ranges
   ↓
Risk
```

### Valuation Engine

```text
Economics
   ↓
Cash flows
   ↓
Risk
   ↓
Future outcomes
   ↓
Estimated value
```

### AI Modeling Layer

```text
Natural language
   ↓
Proposed model
   ↓
Visible equations
   ↓
Simulation
   ↓
Explanation
```

---

# The Ultimate Goal

Asset Dynamics is ultimately intended to become a place where someone can take an idea, asset, business, piece of software, or complex system and progressively transform it into something understandable.

From:

```text
"I have an idea."
```

to:

```text
"Here is how I think the system works."
```

to:

```text
"Here is the mathematical model."
```

to:

```text
"Here is how it behaves."
```

to:

```text
"Here is what matters most."
```

to:

```text
"Here is what happens if we change it."
```

to:

```text
"Here is the best intervention we can find."
```

to:

```text
"Here is the resulting economic value and uncertainty."
```

In compact form:

```text
                    ASSET DYNAMICS

                         IDEA
                           │
                           ▼
                         MODEL
                           │
                           ▼
                        SYSTEM
                           │
               ┌───────────┼───────────┐
               ▼           ▼           ▼
           SIMULATE     ANALYZE     EXPLAIN
               │           │           │
               └───────────┼───────────┘
                           ▼
                        OPTIMIZE
                           │
                           ▼
                         VALUE
                           │
                           ▼
                        DECISION
```

The ambition is not merely to create another calculator.

It is to create a **general-purpose computational laboratory for understanding systems**.

A place where mathematics, software, simulation, economics, optimization, valuation, and AI can operate on the same underlying model.

---

## Current Status

Asset Dynamics is currently an early-stage prototype.

The existing application establishes the foundation:

**model → calculate → perturb → analyze → understand**

Many of the capabilities described in this README represent the intended direction of the project rather than features already available.

That distinction is intentional.

The project is designed to grow alongside the mathematics, computational methods, and real-world problems required to build it.

---

## Guiding Principle

> **Don't hide complexity. Make complexity understandable.**

Asset Dynamics exists to turn interconnected systems into models that can be explored, questioned, measured, and improved.

**Build the system.
Change the variables.
Observe the consequences.
Understand the mathematics.
Find a better state.**

---

## Disclaimer

Asset Dynamics is an experimental modeling and educational tool.

Models are simplified representations of reality, and their outputs depend on the assumptions, equations, data, and parameters used to construct them. Financial, valuation, forecasting, optimization, or other outputs should be treated as estimates and analytical aids, not guarantees or financial, investment, legal, tax, or other professional advice.

**Asset Dynamics — Model. Simulate. Understand. Optimize.**
