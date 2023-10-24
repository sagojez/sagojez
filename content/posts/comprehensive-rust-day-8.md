---
title: "Comprehensive Rust | Day 8"
summary: "Rust error handling through the try-operator [`?`] and how it works"
date: 2023-10-18T10:00:00+00:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 8"
    caption: "Comprehensive Rust | Day 8"
series: ["Comprehensive Rust"]
---

## Error Handling

Rust uses explicit control flow for handling errors. That means
that the errors are also values, hence they have types. This types
are easily distinguishable on the return type:

```rust
fn read_from_file(path: PathBuff) -> Result<String, Error> {
    todo!()
}
```

There are ways to skip this, through `unsafe` programming, see the
following examples:

```rust
let value: Option<String> = None
let value: String = optional.unwrap()
```

According to the type we no longer have an optional, however since
the value of `value` is `None` it'll `panic`.

A `panic` will be triggered if a _fatal error happens at runtime_, 
for example:

```rust
fn main() {
    let v = vec![10, 20, 30];
    println!("v[100]: {}", v[100]);
}
```

Panics are *non recoverable* errors, they're also unexpected. Rust
encourages and makes a great effort into making errors as explicit as
they can be.

### Catch the Stack Unwinding

To answer this one we need to have two concepts crystal clear:

#### What does the `Stack` mean?:

The `Stack` refers as the `Call Stack`. It is a data structure used
to manage function calls in a program. When a function is called,
all necessary information (local variables, return address) are pushed
onto the stack. When the function is called, its context is popped off
allowing the program to resume execution.

As an illustration let's write a very simple program and see how it looks
on the `Call Stack`:

```rust
fn f1() {
    println!("F1");
}

fn f2() {
    println!("F2");
}

f2()
```

```goat
 Stack                      
.---------------------------.
|            f1             |
+---------------------------+
|            f2             |
+---------------------------+
|            GEC            | Global Execution Context
'---------------------------'
```

#### What could cause the stack to `unwind` and what does that mean? 

When an exception occurs the program will start looking for an exception
handler further up the call stack. This process is called `Stack Unwind`.

By default `panic` will cause the stack to unwind. However, this can be caught
by `panic::catch_unwind`:

```rust
use std::panic;

fn main() {
    let result = panic::catch_unwind(|| {
        "No problem here!"
    });
    println!("{result:?}");

    let result = panic::catch_unwind(|| {
        panic!("oh no!");
    });
    println!("{result:?}");
}
```

It won't work if you have `panic = 'abort'` option in your `Cargo.toml`

### Error Propagation `?`

This is called the try-operator `?`. It is used to return the errors
to the caller:

You can go from:                        

```rust
match some_expression {
    Ok(value) => value,
    Err(err) => return Err(err),
}
```

To: 

```rust
some_expression?
```

This is heavily used for programming in the `happy path`
without needing to worry about error handling, only when
the appropriate time comes to do it.

There's a caveat, the return type of the function that uses the try-operator
must be compatible with the nested function it calls. For instance, a function
returning a `Result<T, Err>` can only apply the `?` operator on a function
returning a `Result<AnyT, Err>`. It cannot apply the `?` operator on a function
returning an `Option<AnyT>` or `Result<T, OtherErr>` unless `OtherErr`
implements `From<Err>`.
