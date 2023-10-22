---
title: "Comprehensive Rust | Day 4"
summary: "In this post we'll cover control flows in Rust such as if, while, for and match"
date: 2023-05-03T11:00:00+02:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 4"
    caption: "Comprehensive Rust | Day 4"
series: ["Comprehensive Rust"]
---

## Control Flows

### `Blocks`

A block in rust have the following syntax:

```rust
{
    // statements
}
```

Theses blocks are expressions, hence they have both a type and a value which is the value of the last expression in the block unless
the block ends with a semicolon, in which case the block evaluates to `()` or there's a `return` statement before the last expression.


### `If` expressions

`If` are also expressions in Rust, so they have a value and a type. The syntax is as follows:

```rust
fn main() {
    let mut x = 10;
    if x % 2 == 0 {
        x = x / 2;
    } else {
        x = 3 * x + 1;
    }
}
```

### `If let` expressions

`If let` expressions are a shorthand for `match` expressions that only have one pattern. The syntax is as follows:

```rust
fn main() {
    let arg = std::env::args().next();
    if let Some(value) = arg {
        println!("Program name: {value}");
    } else {
        println!("Missing name?");
    }
}
```
`If let` can be can be more concise as it only focuses on one case. A common use is
when working with `Option` values. It does not support `guards`.

From version `1.65` of Rust, `if let` expressions can have an `else` branch. This is useful when you want to handle
the case where the pattern does not match.

```rust
fn main() {
    println!("{:?}", second_word_to_upper("foo bar"));
}
 
fn second_word_to_upper(s: &str) -> Option<String> {
    let mut it = s.split(' ');
    let (Some(_), Some(item)) = (it.next(), it.next()) else {
        return None;
    };
    Some(item.to_uppercase())
}
// Some("BAR")
```

### `While` loops

`While` are very similar to other languages. Nothing special here.

```rust
fn main() {
    let mut x = 10;
    while x > 0 {
        println!("{}", x);
        x -= 1;
    }
}
```

### `While let` loops

`While let` loops are similar to `if let` expressions. They are a shorthand for `loop` loops that only have one pattern. The syntax is as follows:

```rust
fn main() {
    let mut it = std::env::args();
    while let Some(value) = it.next() {
        println!("Program name: {value}");
    }
}
// Program name: /home/samgj18/.cargo/bin/cargo
```

### `For` loops

Will automatically call `into_iter` on the collection and iterate over the elements:

```rust
fn main() {
    let mut v = vec![10, 20, 30];

    for x in v.iter_mut() {
        println!("x: {x}");
        *x = *x + 1;
    }
    
    println!("{:#?}", v);
    
    for i in (0..10).step_by(2) {
        println!("i: {i}");
    }
}
```

### `Loop` loops

`Loop` loops are infinite loops. You can `break`, `continue` or `return` from them.

```rust
fn main() {
    let mut x = 10;
    loop {
        x = if x % 2 == 0 {
            x / 2
        } else {
            3 * x + 1
        };
        if x == 1 {
            break;
        }
    }
    println!("Final x: {x}");
}
```

### `Match` expressions

`Match` expressions are very similar to `switch` statements in other languages. The syntax is as follows:

```rust
fn main() {
    match std::env::args().next().as_deref() {
        Some("cat") => println!("Will do cat things"),
        Some("ls")  => println!("Will ls some files"),
        Some("mv")  => println!("Let's move some files"),
        Some("rm")  => println!("Uh, dangerous!"),
        None        => println!("Hmm, no program name?"),
        _           => println!("Unknown program name!"),
    }
}
```

- What happens if `as_deref` is removed?
    - `std::env::args().next()` returns an `Option<String>`.
    - `Option<String>` can't be matched against.
    - `as_deref` converts `Option<String>` to `Option<&str>`. Or more generally, `Option<T>` to `Option<&T::Target>`.
    - `&str` can be matched against.


### `Break` and `Continue` labels

- To exit a `loop` early, you can use `break`.
- To skip the rest of the current iteration, you can use `continue`.

`break` and `continue` can be used with labels to break out of or continue a specific loop.

```rust
fn main() {
    'outer: loop {
        println!("Entered the outer loop");
        'inner: loop {
            println!("Entered the inner loop");
            break 'outer;
        }
        println!("This point will never be reached");
    }
    println!("Exited the outer loop");
}
// Entered the outer loop
// Entered the inner loop
// Exited the outer loop
```
