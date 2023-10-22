---
title: "Concurrent Programming in Scala | Part 3"
summary: "In this chapter, we explored fundamental building blocks for concurrent programs in Scala.
    We delved into atomic primitives, lock-free programming, and the use of lazy values."
date: 2023-04-10T06:50:51Z
draft: false
tags: ["scala", "concurrent", "programming"]
categories: ["programming"]
cover:
    alt: "Concurrent Programming in Scala | Part 3"
    caption: "Concurrent Programming in Scala | Part 3"
series: ["Concurrent Programming in Scala"]
---

The concurrency primitives shown in the previous chapters are the basics of concurrent programming on JVM. However, it is recommended to avoid using them directly. They are low-level, hard to work and error-prone.

## The Executor and ExecutionContext objects

Instead of creating threads directly, it's often more efficient to utilize a thread pool, a set of threads in a waiting state, ready to take on tasks. This approach significantly reduces the overhead of thread creation.

The `JDK` offers an abstraction known as the Executor. It encapsulates the execution of concurrent tasks by providing an interface with a single execute method. This method takes a Runnable object, and the Executor manages when to invoke the `Runnable#run` method.

In Scala, the `scala.concurrent` package introduces the `ExecutionContext` trait, which provides similar functionality but tailored for Scala. It encompasses two main methods: `execute`, akin to `Executor#execute`, and `reportFailure`, invoked when a task throws an exception.

The `ExecutionContext` companion object houses Scala's default execution context - `global`, which internally leverages `ForkJoinPool`:

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

When it comes to memory writes, ensuring proper synchronization is crucial. However, synchronizing operations can be intricate. To simplify this, we turn to `Atomic Variables`.

Atomic Variables are akin to volatile variables, albeit more robust albeit more expensive. They enable the construction of concurrent operations without relying on synchronized blocks. These variables are adept at handling complex, linearizable operations.

Let's see them in action:

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

Locks, while essential for synchronizing access to shared resources, can sometimes lead to performance overhead. In such cases, Atomic Variables come to the rescue, enabling lock-free operations. These operations ensure that threads do not get blocked indefinitely without locks.

Utilizing atomic variables is a vital step towards achieving lock-freedom, though additional considerations are necessary for a complete implementation.

A lock is a synchronization mechanism used to limit access to a resource that can be used by multiple threads. Instead of using a low-level construct such as locking the object's intrinsic monitor, we can avoid it by using `Atomic Variables`.

> Atomic variables allow us to implement lock-free operations.

A thread executing a lock-free algorithm does not hold any locks
when it gets pre-empted by the OS, therefore it cannot temporarily block other threads. Furthermore, lock-free operations are immune to deadlocks, because threads cannot get blocked indefinitely without locks.

> Using atomic variables is a necessary precondition for lock-freedom, but it is not sufficient.

## Lazy values

Lazy values are particularly useful for postponing initialization until the value is first accessed. They contrast with eager values, which are initialized upon creation. This deferred initialization can be crucial for optimizing resource utilization.

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


In Scala, singleton objects are essentially lazy values. They are created only when they are first referenced, offering a form of deferred initialization.

```scala
object LazyValsObject extends App {
     object Lazy { log("Running Lazy constructor.") }
     log("Main thread is about to reference Lazy.")
     Lazy
     log("Main thread completed.")
}
```

Under the hood, Scala implements lazy values and singleton objects with the double-checked locking idiom. This ensures that initialization is thread-safe.

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

Remember to avoid blocking operations inside lazy value initialization expressions or singleton object constructors.

## Summary

In this chapter, we explored fundamental building blocks for concurrent programs in Scala. We delved into atomic primitives,
lock-free programming, and the use of lazy values. These concepts, while specific to Scala, have parallels in other languages and platforms. It's worth noting that while the pervasive topic of concurrent collections wasn't covered in this summary, you can find more [information here](https://javarevisited.blogspot.com/2013/02/concurrent-collections-from-jdk-56-java-example-tutorial.html#axzz7yVzdQU9I).
