---
title: "Concurrent Programming in Scala | Part 3"
date: 2023-04-10T06:50:51Z
draft: false
tags: ["scala", "concurrent"]
categories: ["programming"]
cover:
    alt: "Concurrent Programming in Scala | Part 3"
    caption: "Concurrent Programming in Scala | Part 3"
ShowToc: true
TocOpen: false
series: ["Concurrent Programming in Scala"]
---

The concurrency primitives shown in the previous chapters are the basics of concurrent programming on JVM. However, it is recommended to avoid using them directly. They are low-level, hard to work and error-prone.

## The Executor and ExecutionContext objects

We might get the temptation to create new threads because it is lighter than a JVM process. But bear in mind that once the JVM process exists, the thread creation becomes much more expensive than allocating objects, acquiring monitors or updating a collection.

But why? One reason is that starting a thread requires the OS to allocate a memory region of its call stack. Another reason is that new threads can lead to [context switching](https://en.wikipedia.org/wiki/Context_switch#Cost). 

These alone are compelling reasons to adopt, instead, a different approach.  What most concurrent frameworks do is to have a **set of threads** on the waiting state that will take the load as soon as they are available. This is known as a `thread pool`.

The `JDK` comes with an abstraction to encapsulates how to run concurrent tasks called the `Executor`. The `Executor`, under the hood, is merely an interface which defines a single `execute` method. This method takes a `Runnable` object, and the `Executor` decides when to call the `Runnable#run` method.

Up to this point, we've been building abstraction over abstraction. It is a fair question to ask, what's the purpose? Why do I need yet another abstraction called `Executor`?

> The `Executor` serves the purpose of decoupling the _what_ from the _how_ computations are executed.

The `scala.concurrent` package defines the `ExecutionContext` trait that provides the `Executor` functionality but for Scala. This package implements two methods: `execute` that corresponds to the `Executor#execute`. And implements `reportFailure` that takes a Throwable object and is called when a task throws.

The `ExecutionContext` companion object
contains Scala's default execution context - `global`, which internally uses `ForkJoinPool`:

```scala
object ExecutionContextGlobal extends App {
	val ec = ExecutionContext.global
	ec.execute(new Runnable {
		def run() = log("Running on the execution context.")
	})
	Thread.sleep(500)
}
```

## Atomic primitives

Memory writes don't happen immediately unless synchronisation is applied (properly). _Applying it properly_ can be tricky. Therefore we avoid using them (all the way) and instead opt-in for `Atomic Variables`.

`Atomic Variables` are `volatile variables` close relatives, more expensive, but effective at building concurrent operations without relying on the synchronised statement. These variables allow us to express a `complex linearisable operation` (a task that _appears_ to occur instantaneously to the rest of the system and is equivalent to at least two reads or writes). Let's  see them in action:

```scala
import java.util.concurrent.atomic._
object AtomicUid extends App {
 private val uid = new AtomicLong(0L)
 def getUniqueId(): Long = uid.incrementAndGet()
 execute { log(s"Uid asynchronously: ${getUniqueId()}") }
 log(s"Got a unique id: ${getUniqueId()}")
}
```

We can see that we are using `incrementAndGet` simultaneously:

1. Reads the current value x of uid
2. Computes x + 1
3. Writes x + 1 back to uid
4. Returns x + 1

Like `incrementAndGet`, different methods exist, such as `addAndGet` and `decrementAndGet`. All these are implemented in terms of an atomic operation, `compareAndSet`.

> The compare-and-set operation, sometimes called compare-and-swap (CAS), takes the expected previous value and the new value for the atomic variable and atomically replaces the current one with the new value **only** if the current value is equal to the expected value.

This is **conceptually** equivalent to the following synchronised block:

```scala
def compareAndSet(ov: Long, nv: Long): Boolean =
	this.synchronized {
			if (this.get == ov) false else {
			this.set(nv)
			true
		}
	}
```

To understand how **CAS** operations work, let's rewrite the `getUniqueId` function using `get` and `compareAndSet`: 

```scala
@tailrec def getUniqueId(): Long = {
     val oldUid = uid.get
     val newUid = oldUid + 1
     if (uid.compareAndSet(oldUid, newUid)) newUid
     else getUniqueId()
}
```

The thread T calculates a new value `newUid`, which is not an atomic operation. There is a possibility of another thread `S` concurrently changing the value of the `uid` variable while thread `T` is executing. To ensure that thread `T` can update uid successfully without any concurrent modification, it uses the `compareAndSet` method. If the method is not successful, thread `T` retries the operation using a tail-recursive call, and the `@tailrec` annotation is used to force the compiler to generate it. This process is illustrated in the next figure:

![Execution Retries](/images/RETRY.png)

Retrying is a common pattern when programming with CAS operations. This retry can happen infinitely. This may sound like a bad thing, but in reality, a CAS in thread T can fail **only** when another thread `S` completes the operation successfully: if our part of the system does not progress, at least the other part does.

## Lock-free programming

A lock is a synchronization mechanism used to limit access to a resource that can be used by multiple threads. Instead of using a low-level construct such as locking the object's intrinsic monitor, we can avoid it by using `Atomic Variables`.

> Atomic variables allow us to implement lock-free operations.

A thread executing a lock-free algorithm does not hold any locks
when it gets pre-empted by the OS, therefore it cannot temporarily block other threads. Furthermore, lock-free operations are immune to deadlocks, because threads cannot get blocked indefinitely without locks.

> Using atomic variables is a necessary precondition for lock-freedom, but it is not sufficient.

## Lazy values

Lazy values are value declarations that are initialized with their right-hand side expression when the lazy value is read for the first time. Unlike regular values, which are initialized the moment they are created (eager). 

> A lazy value is initialized only when a thread accesses it, and it is initialized at most once.


```scala
object LazyValsCreate extends App {
     lazy val obj = new AnyRef
     lazy val non = s"made by ${Thread.currentThread.getName}"
     execute {
       log(s"EC sees obj = $obj")
       log(s"EC sees non = $non")
     }
     log(s"Main sees obj = $obj")
     log(s"Main sees non = $non")
     Thread.sleep(500)
}
```


Lazy values are deeply ingrained in Scala. Singleton objects are implemented as lazy values:

```scala
object LazyValsObject extends App {
     object Lazy { log("Running Lazy constructor.") }
     log("Main thread is about to reference Lazy.")
     Lazy
     log("Main thread completed.")
}
```


In Scala versions, lazy values and singleton objects are implemented with double-checked locking idiom under the hood:

```scala
 object LazyValsUnderTheHood extends App {
    @volatile private var _bitmap = false
    private var _obj: AnyRef = _
    def obj = if (_bitmap) _obj else this.synchronized {
    if (!_bitmap) {
            _obj = new AnyRef
            _bitmap = true
        }
        _obj 
    }
  log(s"$obj")
  log(s"$obj")
}
```

> Never invoke blocking operations inside lazy value initialization expressions or singleton object constructors.

## Summary

This chapter talked about the traditional building blocks of concurrent programs in Scala. We learned how to use atomic primitives to atomically switch between different states in the program and implement locks and lock-free algorithms. We studied the implementation of lazy values and their impact on concurrent programs. These insights are not only specific to Scala, but most languages and platforms also have concurrency utilities that are similar to the ones presented in this chapter.

_Please beware that some of the topics of this chapter, such as concurrent collections, were not shown in this summary due to being considered pervasive. However, you can read them [here](https://javarevisited.blogspot.com/2013/02/concurrent-collections-from-jdk-56-java-example-tutorial.html#axzz7yVzdQU9I)._
