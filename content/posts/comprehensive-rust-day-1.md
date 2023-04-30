---
title: "Comprehensive Rust | Day 1"
date: 2023-04-28T20:00:00+02:00
draft: false
tags: ["rust"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 1"
    caption: "Comprehensive Rust | Day 1"
ShowToc: true
TocOpen: true
series: ["Comprehensive Rust"]
---

## How to run Rust code locally

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

## Using Cargo

When you start reading about Rust, you will soon meet Cargo, the standard tool used in the Rust ecosystem to build and run Rust applications. You can install
cargo and some other useful rust tools with the following command:

```bash
sudo apt install cargo rust-src rustfmt
```

This will allow to use rust-analyzer, a language server for Rust, which is a tool that provides IDEs and text editors with information about Rust programs. This information is used for features like auto-completion, jump-to-definition, and documentation on hover.


## Basic Rust

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

## Supported Types

- Enums and pattern matching
- Generics
- FFI (Foreign Function Interface) with no overhead.  That is, calling functions written in other languages is as fast as calling functions written in Rust.
- Zero Cost Abstractions


### Scalar Types

| | Types | Literals | 
| ---- | ---- | ------ |
| Signed Integers | `i8`, `i16`, `i32`, `i64`, `i128`, `isize` | `10`, `-10`, `1000`, `123i64` |
| Unsigned Integers | `u8`, `u16`, `u32`, `u64`, `u128`, `usize` | `0`, `123`, `123u16` |
| Floating Point | `f32`, `f64` | `1.0`, `1.0f64` |
| Booleans | `bool` | `true`, `false` |
| Characters | `char` | `'a'`, `'α'`, `'∞'` |
| Strings | `str` | `"Hello, world!"`, `"two\nlines"` |

The types have the following sizes:

- `iN` and `fN` is a signed integer with N bits, e.g. `i32`.
- `isize` and `usize` are the size of a pointer (and thus depend on the architecture).
- `char` is 32 bit
- `bool` is 8 bit


### Compound Types

| | Types | Literals |
| ---- | ---- | ------ |
| Arrays | `[T; N]` | `[1, 2, 3, 4, 5]` |
| Tuples | `()`, `(T,)`, `(T, U, ..)` | `(1, true)` |

#### Arrays

```rust
// Arrays assignments and access
fn main() {
    let mut a: [i8; 10] = [42; 10];
    a[5] = 0;
    println!("a: {:?}", a);
}

// a: [42, 42, 42, 42, 42, 0, 42, 42, 42, 42]
```

#### Tuples

```rust
// Tuples assignments and access
fn main() {
    let t: (i8, bool) = (7, true);
    println!("1st index: {}", t.0);
    println!("2nd index: {}", t.1);
}
// 1st index: 7
// 2nd index: true
```

### References

Rust has references as well just like C++:

```rust
fn main() {
    let mut x: i32 = 10;
    let ref_x: &mut i32 = &mut x;
    *ref_x = 20;
    println!("x: {x}");
}
// x: 20
```
- We must dereference (use the `'*'` operator) `ref_x` when assigning to it, similar to C and C++ pointers.
- Rust will automagically dereference with some methods.

#### Dangling References

Rust will infer and check the lifetime of references at compile time.  This prevents dangling references:

```rust
fn main() {
    let ref_x: &i32;
    // This is a new scope with its own lifetime
    {
        // The lifetime of ref_x is greater than `x` because `x` only exists in this scope
        // Thus assignment to `ref_x` is a dangling reference.
        let x: i32 = 10;
        ref_x = &x;
    }
    println!("ref_x: {ref_x}");
}
// error: `x` does not live long enough
```

### Slices

A slice is a `view` to a collection of data:

```rust
fn main() {
    let a: [i32; 6] = [10, 20, 30, 40, 50, 60];
    println!("a: {a:?}");

    // Slice array from index 2 to 4 (exclusive)
    let s: &[i32] = &a[2..4];
    println!("s: {s:?}");
}
// a: [10, 20, 30, 40, 50, 60]
// s: [30, 40]
```

- Slices borrow data from the sliced type.
- What happens if you modify `a[3]`:

```rust
fn main() {
    let mut a: [i32; 6] = [10, 20, 30, 40, 50, 60];
    println!("a: {a:?}");

    // Modify a[3]
    a[3] = 0;

    // Slice array from index 2 to 4 (exclusive)
    let s: &[i32] = &a[2..4];
    println!("s: {s:?}");
}
// a: [10, 20, 30, 0, 50, 60]
// s: [30, 0]
```

### `String` vs `str`

```rust
fn main() {
    let s1: &str = "World";
    println!("s1: {s1}");

    let mut s2: String = String::from("Hello ");
    println!("s2: {s2}");
    s2.push_str(s1);
    println!("s2: {s2}");
    
    let s3: &str = &s2[6..];
    println!("s3: {s3}");
}
// s1: World
// s2: Hello
// s2: Hello World
// s3: World
```

- `String` is a growable, heap-allocated UTF-8 string. In this case you own the data.
- `str` is an immutable reference to a string slice, i.e. a `view` to a data stored `anywhere` (binary, stack or heap).
    - **In Static Storage**: `&'static str` is a string slice that is stored in the program's binary.
    - **In Stack Storage**: `&str` is a string slice that is stored in the stack.
    ```rust 
    use std::str;

    let x: &[u8] = &[b'a', b'b', b'c'];
    let stack_str: &str = str::from_utf8(x).unwrap();
    ```
    - **In Heap Storage**: `String` can be dereferenced to `&str` view:
    ```rust
    fn takes_str(s: &str) { }

    let s = String::from("Hello");

    takes_str(&s);
    ```

## Functions

```rust
fn main() {
    fizzbuzz_to(20);   // Defined below, no forward declaration needed
}

fn is_divisible_by(lhs: u32, rhs: u32) -> bool {
    if rhs == 0 {
        return false;  // Corner case, early return
    }
    lhs % rhs == 0     // The last expression in a block is the return value
}

fn fizzbuzz(n: u32) -> () {  // No return value means returning the unit type `()`
    match (is_divisible_by(n, 3), is_divisible_by(n, 5)) {
        (true,  true)  => println!("fizzbuzz"),
        (true,  false) => println!("fizz"),
        (false, true)  => println!("buzz"),
        (false, false) => println!("{n}"),
    }
}

fn fizzbuzz_to(n: u32) {  // `-> ()` is normally omitted
    for i in 1..=n {
        fizzbuzz(i);
    }
}
// 1
// 2
// fizz
// 4
// buzz
// fizz
// 7
// 8
// fizz
// buzz
// 11
// fizz
// 13
// 14
// fizzbuzz
// 16
// 17
// fizz
// 19
// buzz
```

### Rustdoc

```rust
/// Determine whether the first argument is divisible by the second argument.
///
/// If the second argument is zero, the result is false.
fn is_divisible_by(lhs: u32, rhs: u32) -> bool {
    if rhs == 0 {
        return false;  // Corner case, early return
    }
    lhs % rhs == 0     // The last expression in a block is the return value
}
```

- Contents are written in Markdown.
- All published crates are available at [docs.rs](https://docs.rs/).

### Methods

Rust methods are similar to functions, but associated with a type. The first parameter is always `self`, which represents the instance of the type.

```rust
struct Point {
    x: f64,
    y: f64,
}

// Implementation block, all `Point` methods go in here
impl Point {
    // This is a static method
    // Static methods don't need to be called by an instance
    // These methods are generally used as constructors
    fn origin() -> Point {
        Point { x: 0.0, y: 0.0 }
    }

    // Another static method, taking two arguments:
    fn new(x: f64, y: f64) -> Point {
        Point { x: x, y: y }
    }

    // Instance method
    // `&self` is sugar for `self: &Self`, where `Self` is the type of the
    // caller object. In this case `Self` = `Point`
    fn distance(&self, p: &Point) -> f64 {
        let x_squared = (p.x - self.x) * (p.x - self.x);
        let y_squared = (p.y - self.y) * (p.y - self.y);

        (x_squared + y_squared).sqrt()
    }
}
```

### Function Overloading

- Rust does not support function overloading.
    - Each function must have a unique signature and implementation:
        - Always takes a fixed number of arguments.
        - Always takes a single set of parameter types.
    - Default arguments are not supported.
        - All call sites have the same number of arguments.
        - Macros can be used to provide default values.

```rust
// However, functions parameters can be generic
fn pick_one<T>(a: T, b: T) -> T {
    if std::process::id() % 2 == 0 { a } else { b }
}

fn main() {
    println!("coin toss: {}", pick_one("heads", "tails"));
    println!("cash prize: {}", pick_one(500, 1000));
}

// coin toss: heads
// cash prize: 500
```

## Implicit Conversions

Rust does not perform implicit conversions. To convert 

```rust
fn multiply(x: i16, y: i16) -> i16 {
    x * y
}

fn main() {
    let x: i8 = 15;
    let y: i16 = 1000;

    println!("{x} * {y} = {}", multiply(x, y));
}
// error[E0308]: mismatched types
// println!("{x} * {y} = {}", multiply(x, y));
                              -------- ^ expected `i16`, found `i8`
```

Specifically for numeric types (but also for other types), Rust provides the `Into` and `From`
to convert between them. The `From<T>` has a single method `from()`, analogouslly the `From<T>`
has a single method `into()`.

To see for which types a conversion is available, you can check the `std::convert::From` documentation
[here](https://doc.rust-lang.org/std/convert/trait.From.html).

Interestingly enough, implementing `From` for a type automatically implements `Into` for that type.

```rust
use std::convert::From;

fn multiply(x: i16, y: i16) -> i16 {
    x * y
}

fn main() {
    let x: i8 = 15;
    let y: i16 = 1000;

    println!("{x} * {y} = {}", multiply(x.into(), y.into()));
}
// 15 * 1000 = 15000
```


## `Arrays` and `for` loops

Arrays can be declared as follows:

```rust
// Stack allocated array
let array = [10, 20, 30];
// Or alternatively
let array: [i32; 3] = [10, 20, 30];
```

You can also initialize an array with the same value for each element:

```rust
let array = [0; 20]; // A 20 element array initialized with 0s
```

Arrays are stack allocated. They cannot be resized.

```rust
let array = [1, 2, 3];
println!("array has {} elements", array.len());
```

Arrays can be borrowed as slices. A slice is a `view` or `reference` to a contiguous subset in memory:

```rust
fn analyze_slice(slice: &[i32]) {
    println!("first element of the slice: {}", slice[0]);
    println!("the slice has {} elements", slice.len());
}

fn main() {
    let xs = [1, 2, 3, 4, 5];
    analyze_slice(&xs);
}
// first element of the slice: 1
// the slice has 5 elements
```

Rust lets you iterate over them using a `for` loop:

```rust
fn main() {
    let names = ["Graydon", "Brian", "Niko"]; // names: [&str; 3]
    
    for name in names.iter() {
        match name {
            &"Niko" => println!("There is a rustacean among us!"),
            _ => println!("Hello {}", name),
        }
    }
    
    println!();
    
    for name in names {
        print!(" {name}");
    }
    
    println!();
    
    for i in 0..3 {
        print!(" {}", names[i]);
    }
}
// Hello Graydon
// Hello Brian
// There is a rustacean among us!
//
// Graydon Brian Niko
//
// Graydon Brian Niko
```
