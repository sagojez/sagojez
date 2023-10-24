---
title: "Comprehensive Rust | Day 10"
summary: "Rust concurrency, OS Threads, Channels and Mutexes"
date: 2023-10-23T11:00:00+00:00
draft: false
tags: ["rust", "programming", "concurrency"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 10"
    caption: "Comprehensive Rust | Day 10"
series: ["Comprehensive Rust"]
---

## Concurrency

Rust has a few different ways to do concurrency:

- OS Threads
- Channels
- Mutexes

Rust used to have green threads, but they were removed in favor of OS threads. The reason for this is the real cost of green threads.
Green threads require a runtime to manage them, which means that the runtime has to be shipped with the application.
This is not a problem for languages like Go, but it is a problem for Rust, which is often used for low-level applications. Hence, since
[rfc 230](https://github.com/rust-lang/rfcs/blob/master/text/0230-remove-runtime.md) green threads were removed.

### OS Threads

Rust threads work similarly to other languages, they're created with `std::thread::spawn`:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("Count in thread: {i}!");
            thread::sleep(Duration::from_millis(5));
        }
    });

    for i in 1..5 {
        println!("Main thread: {i}");
        thread::sleep(Duration::from_millis(5));
    }
}
```

- Threads are all daemon threads, the main thread does not wait for them.
- Threads `panic` are independent from each other, a `panic` in a thread will not affect the main thread.
    - Panics can carry a payload, which can be unpacked with downcast_ref.

Normally, threads can't share information from the surrounding scope, this would fail:

```rust
use std::thread;

fn foo() {
    let s = String::from("Hello");
    thread::spawn(|| {
        println!("Length: {}", s.len());
    });
}

fn main() {
    foo();
}

//    Compiling playground v0.0.1 (/playground)
// error[E0373]: closure may outlive the current function, but it borrows `s`, which is owned by the current function
//  --> src/main.rs:5:19
//   |
// 5 |     thread::spawn(|| {
//   |                   ^^ may outlive borrowed value `s`
// 6 |         println!("Length: {}", s.len());
//   |                                - `s` is borrowed here
//   |
// note: function requires argument type to outlive `'static`
//  --> src/main.rs:5:5
//   |
// 5 | /     thread::spawn(|| {
// 6 | |         println!("Length: {}", s.len());
// 7 | |     });
//   | |______^
// help: to force the closure to take ownership of `s` (and any other referenced variables), use the `move` keyword
//   |
// 5 |     thread::spawn(move || {
//   |                   ++++
//
// For more information about this error, try `rustc --explain E0373`.
// error: could not compile `playground` (bin "playground") due to previous error
```

However, we can use `scoped threads` to share information from the surrounding scope:

```rust
use std::thread;

// Normal Rust borrowing rules apply: you can either borrow mutably by one thread, or immutably by any number of threads.

fn main() {
    let s = String::from("Hello");

    thread::scope(|scope| {
        scope.spawn(|| {
            println!("Length: {}", s.len());
        });
    });
}
```

### Channels

Channels have two ends, a `Sender` and a `Receiver`. They can be used to send messages between threads:

```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();

    tx.send(10).unwrap();
    tx.send(20).unwrap();

    println!("Received: {:?}", rx.recv());
    println!("Received: {:?}", rx.recv());

    let tx2 = tx.clone();
    tx2.send(30).unwrap();
    println!("Received: {:?}", rx.recv());
}
```

- `mpsc` stands for `multiple producer, single consumer`. For that reason we can clone the Sender but not the Receiver.
- `send()` and `recv()` return Result. If they return Err, it means the counterpart Sender or Receiver is dropped and the channel is closed.

#### Unbounded Channels

By default, channels are unbounded and asynchronus:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let thread_id = thread::current().id();
        for i in 1..10 {
            tx.send(format!("Message {i}")).unwrap();
            println!("{thread_id:?}: sent Message {i}");
        }
        println!("{thread_id:?}: done");
    });
    thread::sleep(Duration::from_millis(100));

    for msg in rx.iter() {
        println!("Main: got {msg}");
    }
}
```

#### Bounded Channels

Bounded channels have a limited capacity, if the capacity is reached the `send()` call will block until there's space in the channel:

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::sync_channel(3);

    thread::spawn(move || {
        let thread_id = thread::current().id();
        for i in 1..10 {
            tx.send(format!("Message {i}")).unwrap();
            println!("{thread_id:?}: sent Message {i}");
        }
        println!("{thread_id:?}: done");
    });
    thread::sleep(Duration::from_millis(100));

    for msg in rx.iter() {
        println!("Main: got {msg}");
    }
}
```

- A bounded channel with a size of zero is called a “rendezvous channel”. Every send will block the current thread until another thread calls read.

### Send and Sync

Rust has two traits to mark types as thread-safe: `Send` and `Sync`. If this traits are implemented for a type, it means that it's safe to share
the resource between threads.

- `Send` means that it's safe to send the type `T` to another thread:
    > A type `T` is `Send` if it is safe to move a `T` value to another thread.

- `Sync` means that it's safe to share the reference `&T` between threads.
    > A type `T` is `Sync` if it is safe to access `T` from multiple threads (i.e. `&T` is `Send`).


#### Examples

Most of the basic types in Rust are `Send` and `Sync`:

- `i8, f32, bool, char, &str, …`
- `(T1, T2), [T; N], &[T], struct { x: T }, …`
- `String, Option<T>, Vec<T>, Box<T>, …`
- `Arc<T>: Explicitly thread-safe via atomic reference count.`
- `Mutex<T>: Explicitly thread-safe via internal locking.`
- `AtomicBool, AtomicU8, …: Uses special atomic instructions.`

The generic types are typically Send + Sync when the type parameters are Send + Sync.

There are also types that are Send but not Sync, or Sync but not Send:

##### Send + !Sync

These types can be moved to other threads, but they’re not thread-safe (i.e. cannot be accessed from multiple threads),
tipically because of inner mutability:

- `mpsc::Sender<T>`
- `mpsc::Receiver<T>`
- `Cell<T>`
- `RefCell<T>`


##### !Send + Sync

These types can be shared between threads, but they can’t be moved to other threads:

- `MutexGuard<T: Sync>`: Uses OS level primitives which must be deallocated on the thread which created them.

##### !Send + !Sync

These types can’t be moved to other threads, and they can’t be shared between threads:

- `Rc<T>`: each `Rc<T>` has a reference to an `RcBox<T>`, which contains a non-atomic reference count.
- `*const T`, `*mut T`: Rust assumes raw pointers may have special concurrency considerations.

### Shared State

Rust has a few types to share state between threads:

- `Arc<T>`: Atomic reference count, allows multiple threads to share a value.
- `Mutex<T>`: Mutual exclusion, allows one thread to access a value at a time.

#### Arc<T>

Arc<T> is a thread-safe reference-counted pointer. It’s similar to Rc<T>, but it uses atomic operations to ensure thread safety.
It gives `read-only` access to the inner value, and it can be cloned and shared between threads:

```rust
use std::thread;
use std::sync::Arc;

fn main() {
    let v = Arc::new(vec![10, 20, 30]);
    let mut handles = Vec::new();
    for _ in 1..5 {
        let v = Arc::clone(&v);
        handles.push(thread::spawn(move || {
            let thread_id = thread::current().id();
            println!("{thread_id:?}: {v:?}");
        }));
    }

    handles.into_iter().for_each(|h| h.join().unwrap());
    println!("v: {v:?}");
}
```

- `Arc::clone()` has the cost of atomic operations that get executed, but after that the use of the T is free.
- `Arc<T>` implements Clone whether or not `T` does. It implements `Send` and `Sync` if and only if `T` implements them both.

#### Mutex<T>

Mutex<T> is a thread-safe wrapper around a value. It allows one thread to access the value at a time.

```rust
use std::sync::Mutex;

fn main() {
    let v = Mutex::new(vec![10, 20, 30]);
    println!("v: {:?}", v.lock().unwrap());

    {
        let mut guard = v.lock().unwrap();
        guard.push(40);
    }

    println!("v: {:?}", v.lock().unwrap());
}
```

- A read-write lock counterpart - `RwLock`.
- `Mutex<T>` implements `Send` and `Sync` if and only if `T` implements them both.
