---
title: "Comprehensive Rust | Day 7"
summary: "Rust most important traits `Drop`, `Iterator`, `IntoIterator`.
    Also we'll cover Closures and how they work in Rust"
date: 2023-09-01T11:00:00+02:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 7"
    caption: "Comprehensive Rust | Day 7"
series: ["Comprehensive Rust"]
---

## Important Traits

### `Drop`
Drop used for defining destructors. Values which implement Drop can specify code to run when they go out of scope:

```rust
struct HasDrop;

impl Drop for HasDrop {
    fn drop(&mut self) {
        println!("Dropping!");
    }
}

fn main() {
    let x = HasDrop;
    println!("Made a HasDrop!");
}
```

### `Iterator` and `IntoIterator`
Iterator and IntoIterator used in for loops,

```rust
struct Fibonacci {
    curr: u32,
    next: u32,
}

impl Iterator for Fibonacci {
    type Item = u32;

    fn next(&mut self) -> Option<u32> {
        let new_next = self.curr + self.next;

        self.curr = self.next;
        self.next = new_next;

        Some(self.curr)
    }
}

fn main() {
    let fib = Fibonacci { curr: 0, next: 1 };
    for (i, n) in fib.enumerate().take(5) {
        println!("fib({i}): {n}");
    }
}
```

### `Closures`
Closures or lambda expressions have types which cannot be named. However, they implement special Fn, FnMut, and FnOnce traits:

```rust
fn apply_with_log(func: impl FnOnce(i32) -> i32, input: i32) -> i32 {
    println!("Calling function on {input}");
    func(input)
}

fn main() {
    let add_3 = |x| x + 3;
    println!("add_3: {}", apply_with_log(add_3, 10));
    println!("add_3: {}", apply_with_log(add_3, 20));

    let mut v = Vec::new();
    let mut accumulate = |x: i32| {
        v.push(x);
        v.iter().sum::<i32>()
    };
    println!("accumulate: {}", apply_with_log(&mut accumulate, 4));
    println!("accumulate: {}", apply_with_log(&mut accumulate, 5));

    let multiply_sum = |x| x * v.into_iter().sum::<i32>();
    println!("multiply_sum: {}", apply_with_log(multiply_sum, 3));
}
```

A `FnOnce` closure takes ownership of variables it uses, so it can only be called once.
A `FnMut` closure can be called multiple times. It can change the captured variables (can't be called concurrently).
A `Fn` closure can be called any number of times, doesn't consume or mutate the captured variables (can be called concurrently).

By default, closures will capture by reference if they can. The move keyword makes them capture by value.




