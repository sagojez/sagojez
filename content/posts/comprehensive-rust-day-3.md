---
title: "Comprehensive Rust | Day 3"
date: 2023-05-02T10:00:00+02:00
draft: false
tags: ["rust"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 3"
    caption: "Comprehensive Rust | Day 3"
ShowToc: true
TocOpen: false
series: ["Comprehensive Rust"]
---

## Structs

Rust does support `Structs`. `Structs` are a way to group related data together. They are similar to `classes` in `OOP` languages. `Structs` are declared using the `struct` keyword.

```rust
struct Person {
    name: String,
    age: u8,
}

fn main() {
    let mut peter = Person {
        name: String::from("Peter"),
        age: 27,
    };
    println!("{} is {} years old", peter.name, peter.age);
    
    peter.age = 28;
    println!("{} is {} years old", peter.name, peter.age);
    
    let jackie = Person {
        name: String::from("Jackie"),
        ..peter
    };
    println!("{} is {} years old", jackie.name, jackie.age);
}

// Peter is 27 years old
// Peter is 28 years old
// Jackie is 28 years old
```

- Like `C++`, and unlike `C`, `Rust` `Structs` do not need a `typedef` keyword to define a type.
- Methods for `Structs` are defined using the `impl` keyword.
- There are also `Zero Sized` structs, which are used to implement `Traits` on types that do not
hold any data.
- There are also `Tuple Structs`, which are structs without named fields.
- The syntax `..peter` is used to copy the remaining of the fields from `peter` to `jackie`. It
is called the `Struct Update Syntax` and must always be the last part of the `Struct` definition.

### Tuple Structs

```rust
struct Point(i32, i32);

fn main() {
    let p = Point(17, 23);
    println!("({}, {})", p.0, p.1);
}
```

This is often used for `newtype` patterns, single-field wrappers.

```rust
struct Inches(i32);
struct Centimeters(i32);

fn compute_thruster_force() -> PoundsOfForce {
    PoundsOfForce(1.0)
}

fn set_thruster_force(force: Newtons) {
    // ...
}

fn main() {
    let force = compute_thruster_force();
    set_thruster_force(force);
}

//    Compiling playground v0.0.1 (/playground)
// error[E0308]: mismatched types
//  --> src/main.rs:5:5
//   |
// 4 | fn compute_thruster_force() -> PoundsOfForce {
//   |                                ------------- expected `PoundsOfForce` because of return type
// 5 |     Newtons(1.0)
//   |     ^^^^^^^^^^^^ expected `PoundsOfForce`, found `Newtons`
```


### Field Shorthand Syntax

If the field and variable names are the same, you can use the shorthand syntax.

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u8,
}

impl Person {
    fn new(name: String, age: u8) -> Person {
        Person { name, age } // Also could use Self { name, age }
    }
}

fn main() {
    let peter = Person::new(String::from("Peter"), 27);
    println!("{:#?}", peter); // Similar to println!("{peter:?}");
}
```

## Enums

A sum type, also called a tagged union, is a data structure used to hold a value that could
be one (and only one) of several variants.

```rust
fn generate_random_number() -> i32 {
    4  // Chosen by fair dice roll. Guaranteed to be random.
}

#[derive(Debug)]
enum CoinFlip {
    Heads,
    Tails,
}

fn flip_coin() -> CoinFlip {
    let random_number = generate_random_number();
    if random_number % 2 == 0 {
        return CoinFlip::Heads;
    } else {
        return CoinFlip::Tails;
    }
}

fn main() {
    println!("You got: {:?}", flip_coin());
}
```

- `Enums` are declared using the `enum` keyword.
- Methods for `Enums` are defined using the `impl` keyword.

### Variant Payloads

This are _rich_ `Enums`, they can hold data. When pattern matching, you can have access to the data.

```rust
enum WebEvent {
    PageLoad,                 // Variant without payload
    KeyPress(char),           // Tuple struct variant
    Click { x: i64, y: i64 }, // Full struct variant
}

#[rustfmt::skip]
fn inspect(event: WebEvent) {
    match event {
        WebEvent::PageLoad       => println!("page loaded"),
        WebEvent::KeyPress(c)    => println!("pressed '{c}'"),
        WebEvent::Click { x, y } => println!("clicked at x={x}, y={y}"),
    }
}

fn main() {
    let load = WebEvent::PageLoad;
    let press = WebEvent::KeyPress('x');
    let click = WebEvent::Click { x: 20, y: 80 };

    inspect(load);
    inspect(press);
    inspect(click);
}

// page loaded
// pressed 'x'
// clicked at x=20, y=80
```

- It is possible to get the `discriminant` of an `Enum` variant using the `std::mem::discriminant` function. This can
come handy when you want to compare two `Enums` without caring about the data they hold, i.e. `PartialEq` implementation.

### Enum Size

To talk about `Enum` size, we need to talk about Type Layout. The layout of a type is composed by its size, alignment and
padding (relative offsets).

- The alignment of a type specifies what addresses are valid to store the value at. For example, a value of size 4 can only
be stored at addresses that are multiples of 4. **Alignment** is measured in bytes and must be at least 1 and a power of 2.
You can use the `std::mem::align_of` function to get the alignment of a type.

- The size of a value is the offset (in bytes) between the start of the value and the end of the value including padding. Some
types are `0` sized. You can use the `std::mem::size_of_val` function to get the size of a type.


## Methods

Rust allows to associate functions with `structs` and `enums` using the `impl` keyword.

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect.area()
    );
}
```

- `&self` differs from `self` due to `ownership` rules. Check [Day 2](../posts/comprehensive-rust-day-2.md) for more info.

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u8,
}

impl Person {
    fn say_hello(self) {
        println!("Hello, my name is {}", self.name);
    }
}

fn main() {
    let peter = Person {
        name: String::from("Peter"),
        age: 27,
    };
    peter.say_hello();
    peter.say_hello();
}

//    Compiling playground v0.0.1 (/playground)
// error[E0382]: use of moved value: `peter`
//   --> src/main.rs:19:5
//    |
// 14 |     let peter = Person {
//    |         ----- move occurs because `peter` has type `Person`, which does not implement the `Copy` trait
// ...
// 18 |     peter.say_hello();
//    |           ----------- `peter` moved due to this method call
// 19 |     peter.say_hello();
//    |     ^^^^^ value used here after move
//    |
// note: `Person::say_hello` takes ownership of the receiver `self`, which moves `peter`
//   --> src/main.rs:8:18
//    |
// 8  |     fn say_hello(self) {
//    |                  ^^^^
```

### Method Receiver

- `&self` borrows the object with a shared and immutable reference. It can be used again afterwards.
- `&mut self` borrows the object using a unique and mutable reference. It can be used again afterwards.
- `self` takes ownership of the object. It can't be used again afterwards.
- `mut self` takes ownership of the object and can be muted. It can't be used again afterwards.
- If no receiver is specified, it is assumed to be a `static` method.
- See other special receivers [here](https://doc.rust-lang.org/reference/special-types-and-traits.html).

## Pattern Matching

Match allows to compare against one or more patterns. It is evaluated from top to bottom, and stops at the first match.

```rust
fn main() {
    let input = 'x';

    match input {
        'q'                   => println!("Quitting"),
        'a' | 's' | 'w' | 'd' => println!("Moving around"),
        '0'..='9'             => println!("Number input"),
        _                     => println!("Something else"),
    }
}
// Something else
```

- `..=` is the range operator, it is inclusive.
- `_` is the wildcard pattern, it matches anything.
- `|` is the or operator.
- `..` can expand as much as it needs to.

### Destructuring Enums

```rust
enum Result {
    Ok(i32),
    Err(String),
}

fn divide_in_two(n: i32) -> Result {
    if n % 2 == 0 {
        Result::Ok(n / 2)
    } else {
        Result::Err(format!("cannot divide {n} into two equal parts"))
    }
}

fn main() {
    let n = 100;
    match divide_in_two(n) {
        Result::Ok(half) => println!("{n} divided in two is {half}"),
        Result::Err(msg) => println!("sorry, an error happened: {msg}"),
    }
}
```

### Destructuring Structs

```rust
struct Foo {
    x: (u32, u32),
    y: u32,
}

#[rustfmt::skip]
fn main() {
    let foo = Foo { x: (1, 2), y: 3 };
    match foo {
        Foo { x: (1, b), y } => println!("x.0 = 1, b = {b}, y = {y}"),
        Foo { y: 2, x: i }   => println!("y = 2, x = {i:?}"),
        Foo { y, .. }        => println!("y = {y}, other fields were ignored"),
    }
}
```

### Destructuring Arrays

You can destructure arrays, tuples, and slices:

```rust
#[rustfmt::skip]
fn main() {
    let triple = [0, -2, 3];
    println!("Tell me about {triple:?}");
    match triple {
        [0, y, z] => println!("First is 0, y = {y}, and z = {z}"),
        [1, ..]   => println!("First is 1 and the rest were ignored"),
        _         => println!("All elements were ignored"),
    }
}
```

- `..` can account for any number of elements.
    - `[a,..,b]` is valid and will match agains the first and last elements.
    - `[a,..]` is valid and will match against the first element.
    - `[..,b]` is valid and will match against the last element.
    - `[a@..,b]` is valid and will match against the last element, and bind the rest to `a`.

### Match Guards

You can an arbitrary Boolean expression which will be executed if the pattern matches.

```rust
#[rustfmt::skip]
fn main() {
    let pair = (2, -2);
    println!("Tell me about {pair:?}");
    match pair {
        (x, y) if x == y     => println!("These are twins"),
        (x, y) if x + y == 0 => println!("Antimatter, kaboom!"),
        (x, _) if x % 2 == 1 => println!("The first one is odd"),
        _                    => println!("No correlation..."),
    }
}
```

