---
title: "Concurrent Programming in Scala | Part 1"
summary: "In this post we'll cover the basics of concurrent programming and the Scala preliminaries required for this book"
date: 2023-03-10T06:50:51Z
draft: false
tags: ["scala", "concurrent", "programming"]
categories: ["programming"]
cover:
    alt: "Concurrent Programming in Scala | Part 1"
    caption: "Concurrent Programming in Scala | Part 1"
series: ["Concurrent Programming in Scala"]
---

## Preface

In concurrent programming, we express a program as a collection of computations that run simultaneously, often overlapping in time. Coordinating these computations introduces a level of complexity far beyond that of sequential programming.
Consider scenarios where multiple tasks need to synchronize their actions or share resources. This introduces a layer of intricacy that demands careful design and implementation.

This chapter explains the basics of concurrent computing and presents some Scala preliminaries required for this book. Specifically, it does the following:

- Shows a brief overview of concurrent programming
- Studies the advantages of using Scala when it comes to concurrency
- Covers the Scala preliminaries required for reading this book

Concurrent programming has multiple advantages:

- First, increased concurrency can improve program performance. Instead of executing the entire program on a single processor, different subcomputations can be performed on separate processors making the program run faster.
- Concurrency can ensure the improved responsiveness of a program that interacts with the environment.
- Finally, concurrency can simplify the implementation and maintainability of computer programs. Some programs can be represented more concisely using concurrency.

> Coordination of multiple executions in a concurrent system is called synchronisation, and it is a key part of successfully implementing concurrency. Synchronisation includes mechanisms used to order concurrent executions in time. Furthermore, synchronisation specifies how concurrent executions communicate, that is, how they exchange information.

For concurrent programming the way executions interact with each other is by modifying the shared memory subsystem on the machine, this is called: "Shared Memory Communication". For distributed programs, on the other hand, executions interact by exchanging messages, this is called: "Message Passing Communication".

## Execution of a Scala Program

When a Scala program runs, the JVM runtime allocates the memory required for the program. Here, we consider two crucial memory regions: the **call stack** and the **object heap**.

The call stack is a region of memory in which the program stores information about the local variables and parameters of the currently executed methods. The object heap is a region of memory in which the objects are allocated by the program.

![ExecutionScalaProgram](/images/ExecutionScalaProgram.png)

1. The program allocates an entry on the call stack for the local variable `s`.
2. It invokes the square method to compute the value for `s`. The program places the value 5 on the call stack as the parameter `x`. Additionally, it reserves a stack entry for the return value of the method.
3. The square method now executes, multiplying the parameter x by itself and placing the return value, 25, on the stack.
4. Following the square method's return, the result, 25, is copied into the stack entry for the local variable `s`.
5. Subsequently, the program constructs the string for the `println` statement. In Scala, strings are represented as instances of the String class, necessitating the allocation of a new String object on the object heap.
6. Finally, the program stores the reference to the newly allocated object in the stack entry `x` and calls the println method.

## Summary

In this chapter, we have introduced the basics of concurrent programming. We have seen that concurrent programming is a powerful tool for improving the performance, responsiveness, and maintainability of computer programs. We have also seen that concurrent programming introduces a level of complexity far beyond that of sequential programming.
In particular, we have seen that concurrent programming requires careful design and implementation to ensure that concurrent executions interact correctly.
