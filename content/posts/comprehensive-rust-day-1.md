---
title: "Comprehensive Rust Day 1"
date: 2023-04-28T20:00:00+02:00
draft: true 
tags: ["rust"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust Day 1"
    caption: "Comprehensive Rust Day 1"
---

## Basic Rust, ownership and the borrow checker

### How to run Rust code locally

- Install rust

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# On MacOS
xcode-select --install

rustc --version
cargo --version
```

- Create a new project

```bash
cargo new exercise-1 # Created binary (application) `exercise` package
cd exercise-1
```

- Run the project

```bash
cargo run
```

- Check for errors

```bash
cargo check
```

- Add dependencies

```bash
# Add dependencies to Cargo.toml
# Run
cargo build # or --release to produce an optimized release build in target/release/
```

### Basic Rust

- Basic Rust syntax: variables, scalar and compound types, enums, structs, references, functions, and methods.
- Memory management: stack vs heap, manual memory management, scope-based memory management, and garbage collection.
- Ownership: move semantics, copying and cloning, borrowing, and lifetimes.


```rust
// Basic Rust syntax
fn main() {
    println!("Hello 🌍!");
}
```

- Functions are defined with the `fn` keyword.
- Blocks are delimited with curly braces `{}`.
- Keywords like if and while work the same.
- Line comments are started with //, block comments are delimited by /* ... */.
- Variable assignment is done with =, comparison is done with ==.
- The `main` function is the entry point of the program.
- Rust uses [hygienic macros](https://en.wikipedia.org/wiki/Hygienic_macro) such as `println!` (it prevents naming conflicts between the macro-generated code and the surrounding code).
- Rust strings are UTF-8 encoded and can contain any Unicode character.


### Example Small Rust Program

```rust
fn main() {              // Program entry point
    let mut x: i32 = 6;  // Mutable variable binding
    print!("{x}");       // Macro for printing, like printf
    while x != 1 {       // No parenthesis around expression
        if x % 2 == 0 {  // Math like in other languages
            x = x / 2;
        } else {
            x = 3 * x + 1;
        }
        print!(" -> {x}");
    }
    println!();
}
```

### Supported Types

- Enums and pattern matching
- Generics
- FFI (Foreign Function Interface) with no overhead.  That is, calling functions written in other languages is as fast as calling functions written in Rust.
- Zero Cost Abstractions

