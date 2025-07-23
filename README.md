```
$$$$$$$$$$  $$$$$$$$$$  $$$$$$$$$$
    $$          $$      $$       $$
    $$          $$      $$       $$
    $$          $$      $$$$$$$$$$
    $$          $$      $$
    $$      $$$$$$$$$$  $$
```

# Console Tip Generator

A command-line application for calculating tip amounts, built with TypeScript and structured with object-oriented principles. This project was developed as a practical exercise for the Advanced Web Development course at Spiced Academy (AWD25).

The application prompts the user for the bill amount, tip percentage, and number of people to split the bill, then displays a formatted summary of the calculation.

# Core Concepts

- **Object-Oriented Design:** Logic is encapsulated in distinct classes with clear, single responsibilities.
- **Dependency Injection:** Dependencies are passed into constructors, making the code modular and testable.
- **TypeScript Decorators:** A custom decorator is used to declaratively handle input validation and retry logic, keeping method bodies clean.
- **Asynchronous I/O:** User input is handled asynchronously using a Promise-based wrapper around Node.js's readline module.

# Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Development Tools:** ts-node
