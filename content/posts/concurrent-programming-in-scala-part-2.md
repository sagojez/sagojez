---
title: "Concurrent Programming in Scala | Part 2"
summary: "In this post we'll
    navigate the intricate landscape of concurrent programming.
    While low-level constructs are essential, higher-level concurrency frameworks introduced in subsequent chapters
    provide a more intuitive approach. Armed with these foundational insights, you'll be well-equipped to build robust concurrent applications in Scala.
    Happy coding!"
date: 2023-03-13T06:50:51Z
draft: false
tags: ["scala", "concurrent", "programming"]
categories: ["programming"]
cover:
    alt: "Concurrent Programming in Scala | Part 2"
    caption: "Concurrent Programming in Scala | Part 2"
series: ["Concurrent Programming in Scala"]
---

## Processes and Threads

In concurrent programming, understanding processes and threads is paramount. These elements form the bedrock of parallel computing, allowing tasks to execute concurrently and significantly enhancing program performance. Let's delve into their intricacies.

A process is an instance of a computer program that is being executed. Importantly, the memory and other computational resources of one process are isolated from the other processes: two processes cannot read each other's memory directly or simultaneously use most of the resources. In other words, a process is a self-contained computational environment.

Large programs such as web browsers are divided into many logical modules. A browser's download manager downloads files independent of rendering the web page or updating the HTML Document Object Model (DOM). While the user is browsing a social networking website, the file download proceeds in the background; but both independent computations occur
as part of the same process. These independent computations occurring in the same process are called threads.

OS threads are a programming facility provided by the OS, usually exposed through an OS-specific programming interface. Unlike separate processes, separate OS threads within the same process share a region of memory and communicate by writing to and reading parts of that memory. Another way to define a process is
to define it as a set of OS threads along with the memory and resources shared by these threads.

A typical OS is depicted in the following simplified illustration:

![OS](/images/OS.png)

### How does this relate to the JVM?

To grasp the essence of concurrent programming in Scala, it's imperative to comprehend the role of threads within the Java Virtual Machine (JVM). Threads in Scala are intricately linked with their counterparts in the underlying JVM. This interplay profoundly influences how Scala programs execute and behave.

Starting a new JVM instance always creates only one process. Within the JVM process, multiple threads can run simultaneously. The JVM represents its threads with the `java.lang.Thread` class. Unlike runtimes for languages such as Python, the JVM does not implement its custom threads. Instead, each Java thread is directly mapped to an OS thread. This means that Java threads behave in a very similar way to the OS threads, and the JVM depends on the OS and its restrictions.

### Creating and starting threads

Consider a scenario where a web server needs to handle multiple client requests simultaneously. This is where creating and starting threads comes into play. Each incoming request can be processed in a separate thread, ensuring swift and concurrent execution.

Every time a new JVM process starts, it creates several threads by default. The most important thread among them is the main thread, which executes the main method of the Scala program.

On the JVM, thread objects are represented with the Thread class:

```scala
 object ThreadsMain extends App {
     val t: Thread = Thread.currentThread // obtain the current thread reference and store it in t
     val name = t.getName // obtain the name of the current thread and store it in name
     println(s"I am the thread $name")
}
```

Every thread goes into five different states during its lifetime:

- **New**: The thread is created but not yet started.
- **Runnable**: The thread starts executing.
- **Running**: The thread is executing.
- **Blocked**: The thread is blocked and cannot execute, for example, waiting on a synchronization lock.
- **Terminated**: The thread finishes its execution and can't execute anymore.

> Waiting threads notify the OS that they are waiting for some condition and cease spending CPU cycles, instead of repetitively checking that condition.

The following code snippet shows how to create a thread:

```scala
 object ThreadsCreation extends App {
     class MyThread extends Thread {
       override def run(): Unit = {
         println("New thread running.")
} }
     val t = new MyThread
     t.start()
     t.join()
     println("New thread joined.")
}
```

The way this code works is as follows:

- Calling the start method eventually results in executing the run method from the new thread
- The OS is notified that `t` must start executing.
- Then the OS decides to assign the new thread to some processor, (this is largely out of the programmer's control). This method halts the execution of the main thread until `t` completes its execution.
- The join operation puts the main thread into the waiting state until `t` terminates.

![Threads](/images/Threads.png)

It is important to note that the two outputs "New thread running." and "New thread joined." are always printed in this order. This is because the `join` call ensures that the termination of the `t` thread occurs before the instructions following the `join` call.

### Atomic execution

Imagine a critical section of code where data integrity is paramount. Atomic execution ensures that this section runs without interruption, safeguarding against potential conflicts. This is particularly crucial in scenarios where multiple threads access and modify shared resources.

It turns out that the `join` method on threads has an additional property. All the writes to memory performed by the thread being joined occur before the `join` call returns and are visible to the thread that called the `join` method. This is illustrated by the following example:

```scala
 object ThreadsCommunicate extends App {
     var result: String = null
     val t = thread { result = "\nTitle\n" + "=" * 5 }
     t.join()
     log(result)
}
```

The main thread will never print null, as the call to `join` always occurs before
the log call, and the assignment to result occurs before the termination of `t`. This pattern is a very basic way in which the threads can use their results to communicate with each other.

> A race condition is a phenomenon in which the output of a concurrent program depends on the execution schedule of the statements in the program.

**Atomic execution of a block of code means that the individual statements in that block of code executed by one thread cannot interleave with those statements executed by another thread.**

The fundamental Scala construct that allows atomic execution is called the synchronized statement, and it can be called on any object:

```scala
def getUniqueIdSynchronized() = this.synchronized {
     val freshUid = uidCount + 1
     uidCount = freshUid
     freshUid
}

def getUniqueId() = {
  val freshUid = uidCount + 1
  uidCount = freshUid
  freshUid
}
```

For `getUniqueId` the following execution is possible:

![getUniqueId](/images/getUniqueId.png)

This is indeed a program error, because when a test as follows is performed:

```scala
 def printUniqueIds(n: Int): Unit = {
       val uids = for (i<- 0 until n) yield getUniqueId()
       log(s"Generated uids: $uids")
     }
 val t = thread { printUniqueIds(5) }
 printUniqueIds(5)
 t.join()
```

The output could be:

```scala
Vector(1, 2, 3, 4, 5)

Vector(1, 6, 7, 8, 9)
```

As for `getUniqueIdSynchronized` previous execution is not possible, instead, the following execution blueprint takes place:

![getUniqueIdSynchronized](/images/getUniqueIdSynchronized.png)

The `synchronized` call ensures that the subsequent block of code can only execute if there is no other thread simultaneously executing `this` `synchronized` block of code, or any other `synchronized` block of code called on the same object.

> Always explicitly declare the receiver for the synchronized statement—doing so protects you from subtle and hard-to-spot program errors.

Every object created inside the JVM has a special entity called an `intrinsic lock` or a `monitor`, which is used to ensure that only one thread is executing some `synchronized` block on that object. When a thread starts executing the `synchronized` block, we can say that the `T` thread gains ownership of the `x` monitor, or alternatively, `acquires` it. When a thread completes the `synchronized` block, we can say that it `releases` the monitor.

> Use the `synchronized` statement on some object `x` when accessing (**reading** or **modifying**) a state shared between multiple threads. This ensures that at most, a single `T` thread is at any time executing a `synchronized` statement on `x`. It also ensures that all the writes to the memory by the `T` thread are visible to all the other threads that subsequently execute `synchronized` on the same object `x`.

### Monitors and synchronization

In the realm of concurrent programming, monitors and synchronization play a pivotal role. Monitors, or intrinsic locks, regulate access to critical sections of code. Understanding how these mechanisms work is fundamental to preventing race conditions and ensuring thread safety.

As we saw in the previous sections, the synchronized statement serves both to ensure the visibility of writes performed by different threads and to limit concurrent access to a shared region of memory. Generally speaking, a synchronization mechanism that enforces access limits on a shared resource is called a **lock**. Locks are also used to ensure that no two threads execute the same code simultaneously; that is, they implement **mutual exclusion**.

Each object on the JVM has a special built-in **monitor lock**, also called the **intrinsic lock**. When a thread calls the `synchronized` statement on an `x` object, it gains ownership of the monitor lock of the `x` object, given that no other thread owns the `monitor`.

### Deadlocks

Picture two trains approaching a single-track tunnel from opposite directions. If neither yields, they're bound to deadlock. Similarly, in concurrent programming, deadlocks occur when threads are unable to progress due to conflicting resource requirements. Recognizing and mitigating deadlocks is essential for robust concurrent systems.

A deadlock is a general situation in which two or more executions wait for each other to complete an action before proceeding with their own action. The reason for waiting is that each of the executions obtains exclusive access to a resource that the other execution needs to proceed.

> A deadlock occurs when a set of two or more threads acquire resources and then cyclically try to acquire other thread's resources without releasing their own. Establish a total order between resources when acquiring them; this ensures that no set of threads cyclically wait on the resources they previously acquired.

To prevent deadlocks from occurring you should convince yourself that whenever resources are acquired in the same order, When a thread `T` waits for a resource `X` acquired by some other thread `S`, the thread S will never try to acquire any resource `Y` already held by `T`, because `Y < X` and `S` might only attempt to acquire resources `Y > X`. The ordering breaks the cycle, which is one of the necessary preconditions for a deadlock:

![Total order](/images/TotalOrder.png)

### Guarded blocks

Guarded blocks are akin to sentinels, ensuring that a thread proceeds only when specific conditions are met. Picture a traffic light allowing cars to move forward only when the signal is green. Implementing guarded blocks ensures that threads synchronize their actions effectively.

Creating a new thread is much more expensive than creating a new lightweight object. A high-performance system should be quick and responsive, and creating a new thread on each request can be too slow when there are thousands of requests per second. The same thread should be reused for many requests; a set of such reusable threads is usually called a **thread pool**.

In the following example, we will define a special thread called worker that will execute a block of code when some other thread requests it. We will use the mutable Queue class from the Scala standard library collections package to store the scheduled blocks of code:

```scala
object SynchronizedBadPool extends App {
  private val tasks = mutable.Queue[() => Unit]()

  val worker = new Thread {
    def poll(): Option[() => Unit] = tasks.synchronized {
      if (tasks.nonEmpty) Some(tasks.dequeue()) else None
    }
    override def run(): Unit = while (true) poll() match {
      case Some(task) => task()
      case None       =>
    }
  }
  worker.setName("Worker")
  worker.setDaemon(true)
  worker.start()

  def asynchronous(body: => Unit) = tasks.synchronized {
    tasks.enqueue(() => body)
  }
  asynchronous(log("Hello"))
  asynchronous(log("World!"))
  Thread.sleep(500)
}
```

Generally, a JVM process does not stop when the main thread terminates. The JVM process terminates when all non-daemon threads terminate.

Run the preceding example and turn on your Task Manager, one of your CPUs is completely used up by a process called `java`. After the worker completes their work, it is constantly checking if there are any tasks in the queue. We say that the worker thread is **`busy-waiting`**.

> Busy-waiting is a technique in which a thread repeatedly checks a condition, and when the condition becomes true, it proceeds with the execution. Busy-waiting is a bad technique because it wastes CPU cycles.

Still, shouldn't a daemon thread be stopped once the main thread terminates? In general, yes, but we are running this example from `SBT` in the same JVM process that `SBT` itself is running. `SBT` has non-daemon threads of its own,
so our worker thread is not stopped.

Creating new threads all the time might be expensive, but a busy-waiting thread is even more expensive.

What we would really like the worker thread to do is go to the waiting state, similar to what a thread does when we call `join`. It should only wake up after we ensure that there are additional function objects to execute on the tasks queue.

Scala objects (and JVM objects in general) support a pair of special methods called `wait` and `notify`, which allow waiting and awakening the waiting threads, respectively. It is only legal to call these methods on an `x` object if the current thread owns the monitor of the object `x`. In other words, `wait` and `notify` can only be called from a thread that owns the monitor of that object. When a thread `T` calls `wait` on an object, it releases the monitor and goes into the waiting state until some other thread `S` calls `notify` on the same object.

```scala
object SynchronizedGuardedBlocks extends App {
  import Instantiator.{thread, log}

  val lock = new AnyRef
  var message: Option[String] = None
  val greeter = thread {
    lock.synchronized {
      while (message == None) lock.wait()
      log(message.get)
    }
  }
  lock.synchronized {
    message = Some("Hello!")
    lock.notify()
  }
  greeter.join()
}
```

Since `greeter` acquires the same monitor that the main thread previously released, the write-to message by the main thread occurs before the check by the greeter thread. We thus know that the greeter thread will see the message.

An important property of the wait method is that it can cause spurious wakeups. Occasionally, the JVM is allowed to wake up a thread that calls wait even though there is no corresponding `notify` call. To guard against this, we must always use `wait` in conjunction with a while loop that checks the condition, as in the previous example.

A synchronized statement in which some condition is repetitively checked before calling wait is called a **guarded block**. Beware that the stack space of dormant threads is not reclaimed until the application terminates.

### Interrupting threads and the graceful shutdown

Envision a scenario where a long-running thread needs to be terminated promptly. Interrupting threads provides a mechanism to gracefully halt their execution. This is invaluable when threads are engaged in tasks that must be promptly concluded.

In the graceful shutdown, one thread sets the condition for the termination and then calls `notify` to wake up a worker thread. The worker thread then releases all its resources and terminates willingly.

```scala
object Worker extends Thread {
  var terminated = false
  def poll(): Option[() => Unit] = tasks.synchronized {
    while (tasks.isEmpty && !terminated) tasks.wait()
    if (!terminated) Some(tasks.dequeue()) else None
  }
  import scala.annotation.tailrec
  @tailrec override def run() = poll() match {
    case Some(task) => task(); run()
    case None       =>
  }
  def shutdown() = tasks.synchronized {
    terminated = true
    tasks.notify()
  }
}
```

The situation where calling interrupt is preferred to a graceful shutdown is when we cannot wake the thread using `notify`. One example is when the thread blocks I/O on an `InterruptibleChannel` object, in which case the object the thread is calling the wait method on is hidden.

## Complete overview

Let's summarize the key insights:

1. Program order: Actions in a thread follow a defined sequence, providing a basis for understanding their execution flow.
2. Monitor locking: Monitors regulate access to critical sections, preventing concurrent interference.
3. Volatile fields: These fields ensure that writes are immediately visible to other threads, establishing a crucial form of communication.
4. Thread start: Starting a thread marks the initiation of its execution, enabling concurrent operations.
5. Thread termination: Understanding how threads conclude their execution cycle is vital for effective thread management.
6. Transitivity: This principle establishes a logical sequence of actions, crucial for maintaining thread order.

## Summary

In this post, we navigated the intricate landscape of concurrent programming. While low-level constructs are essential, higher-level concurrency frameworks introduced in subsequent chapters provide a more intuitive approach. Armed with these foundational insights, you'll be well-equipped to build robust concurrent applications in Scala. Happy coding!
