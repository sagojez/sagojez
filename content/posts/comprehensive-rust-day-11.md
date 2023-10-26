---
title: "Comprehensive Rust | Final Day"
summary: "Rust's async story is based on `future's`. A `future` is `poll`ed to produce a value.
    If the value is not ready yet, `poll` returns `Poll::Pending` and the executor will schedule
    the task to be polled again in the future. If the value is ready, `poll` returns `Poll::Ready(value)`."
date: 2023-10-24T11:00:00+00:00
draft: false
tags: ["rust", "programming", "concurrency"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 11"
    caption: "Comprehensive Rust | Day 11"
series: ["Comprehensive Rust"]
---

## Async Rust

“Async” is a concurrency model where multiple tasks are executed concurrently by executing each task until it would block,
then switching to another task that is ready to make progress. This is similar to how a multitasking operating system
schedules tasks on a single CPU. The _per-task_ overhead of async is very low, so it can scale to millions of tasks.

Rust's async story is based on `future's`. A `future` is `poll`ed to produce a value. If the value is not ready yet,
`poll` returns `Poll::Pending` and the executor will schedule the task to be polled again in the future. If the value
is ready, `poll` returns `Poll::Ready(value)`.

### Async/Await

At a glance there's not much difference between `async` code and regular code:

```rust
use futures::executor::block_on;

async fn count_to(count: i32) {
    for i in 1..=count {
        println!("Count is: {i}!");
    }
}

async fn async_main(count: i32) {
    count_to(count).await;
}

fn main() {
    block_on(async_main(10));
}
```

### Futures

`Future` is a trait that represents a value that will be available in the future. The `poll` method is called to
produce the value:

```rust
use std::pin::Pin;
use std::task::Context;

pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}
```

### Async Functions

This functions return an `impl Future`. There are also other constructors for `async` primitives such as `Pin` and `Context`.

- `Context` allows a Future to schedule itself to be polled again when an event occurs.
- `Pin` is a wrapper that prevents a value from moving in memory. This is necessary because a Future may be polled
  multiple times, and the value must not move between polls.


### Async Channels

```rust
use tokio::sync::mpsc::{self, Receiver};

async fn ping_handler(mut input: Receiver<()>) {
    let mut count: usize = 0;

    while let Some(_) = input.recv().await {
        count += 1;
        println!("Received {count} pings so far.");
    }

    println!("ping_handler complete");
}

#[tokio::main]
async fn main() {
    let (sender, receiver) = mpsc::channel(32);
    let ping_handler_task = tokio::spawn(ping_handler(receiver));
    for i in 0..10 {
        sender.send(()).await.expect("Failed to send ping.");
        println!("Sent {} pings so far.", i + 1);
    }

    drop(sender);
    ping_handler_task.await.expect("Something went wrong in ping handler task.");
}
```

The `drop` is effectively signalling to the `ping_handler` that no more messages will be sent. This is a common pattern
in Rust, where a channel is closed by dropping the sender. The receiver can detect this by checking if `recv` returns
`None`.

Dropping sender essentially closes the channel, signaling to the ping_handler that it should exit its loop once it has
processed all the pending messages.

### Control Flow

#### Joining

A join operation waits until all of a set of futures are ready, and returns a collection of their results:

```rust
use anyhow::Result;
use futures::future;
use reqwest;
use std::collections::HashMap;

async fn size_of_page(url: &str) -> Result<usize> {
    let resp = reqwest::get(url).await?;
    Ok(resp.text().await?.len())
}

#[tokio::main]
async fn main() {
    let urls: [&str; 4] = [
        "https://google.com",
        "https://httpbin.org/ip",
        "https://play.rust-lang.org/",
        "BAD_URL",
    ];
    let futures_iter = urls.into_iter().map(size_of_page);
    let results = future::join_all(futures_iter).await;
    let page_sizes_dict: HashMap<&str, Result<usize>> =
        urls.into_iter().zip(results.into_iter()).collect();
    println!("{:?}", page_sizes_dict);
}
```

#### Selecting

A select operation waits until any of a set of futures is ready, and responds to that future’s result.
Similar to a match statement, the body of select! has a number of arms, each of the form 
`pattern = future => statement`. When the future is ready, the statement is executed with the variables
in pattern bound to the future’s result:

```rust
use tokio::sync::mpsc::{self, Receiver};
use tokio::time::{sleep, Duration};

#[derive(Debug, PartialEq)]
enum Animal {
    Cat { name: String },
    Dog { name: String },
}

async fn first_animal_to_finish_race(
    mut cat_rcv: Receiver<String>,
    mut dog_rcv: Receiver<String>,
) -> Option<Animal> {
    tokio::select! {
        cat_name = cat_rcv.recv() => Some(Animal::Cat { name: cat_name? }),
        dog_name = dog_rcv.recv() => Some(Animal::Dog { name: dog_name? })
    }
}

#[tokio::main]
async fn main() {
    let (cat_sender, cat_receiver) = mpsc::channel(32);
    let (dog_sender, dog_receiver) = mpsc::channel(32);
    tokio::spawn(async move {
        sleep(Duration::from_millis(500)).await;
        cat_sender
            .send(String::from("Felix"))
            .await
            .expect("Failed to send cat.");
    });
    tokio::spawn(async move {
        sleep(Duration::from_millis(50)).await;
        dog_sender
            .send(String::from("Rex"))
            .await
            .expect("Failed to send dog.");
    });

    let winner = first_animal_to_finish_race(cat_receiver, dog_receiver)
        .await
        .expect("Failed to receive winner");

    println!("Winner is {winner:?}");
}
```

### Pitfalls

#### Blocking the executor

Each runtime has an `executor` and a `reactor`. The `executor` is responsible for executing the futures, and the
`reactor` provides support for performing asynchronous I/O.

Most async runtimes only allow IO operations to run concurrently. If you block the executor, you will block all
other tasks that are running on the executor. This is a common pitfall when using `async` with `std` functions that
are not async-aware.

```rust
use futures::future::join_all;
use std::time::Instant;

async fn sleep_ms(start: &Instant, id: u64, duration_ms: u64) {
    std::thread::sleep(std::time::Duration::from_millis(duration_ms)); // blocks the executor
    // Try: tokio::time::sleep(Duration::from_millis(duration_ms));
    println!(
        "future {id} slept for {duration_ms}ms, finished after {}ms",
        start.elapsed().as_millis()
    );
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let start = Instant::now();
    let sleep_futures = (1..=10).map(|t| sleep_ms(&start, t, t * 10));
    join_all(sleep_futures).await;
}
```

 >  You should not think of tasks as OS threads. They do not map 1 to 1 and most executors will allow
    many tasks to run on a single OS thread. This is particularly problematic when interacting with other
    libraries via FFI, where that library might depend on thread-local storage or map to specific OS threads (e.g., CUDA).
    Prefer tokio::task::spawn_blocking in such situations.


#### Pin

When you `await` a future all local variables are moved into the future (normally they would be allocated in the stack frame).
If your future has pointers to data on the stack, those might be invalidated when the future is resumed. To prevent this,
you can use `Pin` to prevent the future from moving the data.

```rust
use tokio::sync::{mpsc, oneshot};
use tokio::task::spawn;
use tokio::time::{sleep, Duration};

// A work item. In this case, just sleep for the given time and respond
// with a message on the `respond_on` channel.
#[derive(Debug)]
struct Work {
    input: u32,
    respond_on: oneshot::Sender<u32>,
}

// A worker which listens for work on a queue and performs it.
async fn worker(mut work_queue: mpsc::Receiver<Work>) {
    let mut iterations = 0;
    loop {
        tokio::select! {
            Some(work) = work_queue.recv() => {
                sleep(Duration::from_millis(10)).await; // Pretend to work.
                work.respond_on
                    .send(work.input * 1000)
                    .expect("failed to send response");
                iterations += 1;
            }
            // TODO: report number of iterations every 100ms
        }
    }
}

// A requester which requests work and waits for it to complete.
async fn do_work(work_queue: &mpsc::Sender<Work>, input: u32) -> u32 {
    let (tx, rx) = oneshot::channel();
    work_queue
        .send(Work {
            input,
            respond_on: tx,
        })
        .await
        .expect("failed to send on work queue");
    rx.await.expect("failed waiting for response")
}

#[tokio::main]
async fn main() {
    let (tx, rx) = mpsc::channel(10);
    spawn(worker(rx));
    for i in 0..100 {
        let resp = do_work(&tx, i).await;
        println!("work result for iteration {i}: {resp}");
    }
}
```

### Final Thoughts

These were the most important concepts that I learned from the book. I hope you enjoyed it as much as I did.
Even though I have been dabbling with Rust for a while, I learned a lot of new things and I am looking forward
to using Rust in my next project.
