---
title: "Comprehensive Rust | Day 5"
summary: "In this post we'll cover the STD library, modules and how to use them"
date: 2023-05-05T11:00:00+02:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 5"
    caption: "Comprehensive Rust | Day 5"
series: ["Comprehensive Rust"]
---

## STD Library [(see more)](https://google.github.io/comprehensive-rust/std.html)

- `Option` and `Result` used for optional values and error handling respectively.
- `Vec` is a growable `Vector`.
- `String` is a growable UTF-8 encoded string.
- `HashMap` is a hash map with keys and values, with a configurable hash algorithm.
- `Box` is a owned pointer to a value in the heap. 
- `Rc` is a reference counted pointer to a value in the heap.


## Modules

Same as `impl` allow to namespace functions to a type, `mod` allows to namespace functions
and types. The syntax is as follows:

```rust
mod foo {
    pub fn do_something() {
        println!("In the foo module");
    }
}

mod bar {
    pub fn do_something() {
        println!("In the bar module");
    }
}

fn main() {
    foo::do_something();
    bar::do_something();
}
```

The module content are private by default, so the `pub` keyword is required 
to make them public.

```rust
mod garden;
```

The `garden` mod can be found at:

- `src/garden.rs` (modern Rust 2018 style)
- `src/garden/mod.rs` (older Rust 2015 style)

Similarly, a `garden::flowers` module can be found at:

- `src/garden/flowers.rs` (modern Rust 2018 style)
- `src/garden/flowers/mod.rs` (older Rust 2015 style)

The `crate` root is in:

- `src/lib.rs` (for libraries)
- `src/main.rs` (for binaries)
