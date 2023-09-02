---
title: "Comprehensive Rust | Day 2"
date: 2023-04-29T20:25:00+02:00
draft: false
tags: ["rust", "programming"]
categories: ["programming"]
cover:
    alt: "Comprehensive Rust | Day 2"
    caption: "Comprehensive Rust | Day 2"
series: ["Comprehensive Rust"]
---

## Variables

In rust, variables are immutable by default. To make them mutable, we need to prefix them with `mut`.

```rust
let x = 5;
x = 6; // error: cannot assign twice to immutable variable `x`
```

```rust
let mut x = 5;
x = 6; // ok
```

### Type Inference

Unlike C/C++, Rust can infer the type of a variable from the context.

```rust
fn takes_u32(x: u32) {
    println!("u32: {x}");
}

fn takes_i8(y: i8) {
    println!("i8: {y}");
}

fn main() {
    let x = 10;
    let y = 20;

    takes_u32(x);
    takes_i8(y);
    // takes_u32(y);
}

// u32: 10
// i8: 20
```

### Static and Constants

Global variables are declared using the `static` or `const` keyword.


#### Constants

These are inlined upon use.

```rust
const DIGEST_SIZE: usize = 3;
const ZERO: Option<u8> = Some(42);

fn compute_digest(text: &str) -> [u8; DIGEST_SIZE] {
    let mut digest = [ZERO.unwrap_or(0); DIGEST_SIZE];
    for (idx, &b) in text.as_bytes().iter().enumerate() {
        digest[idx % DIGEST_SIZE] = digest[idx % DIGEST_SIZE].wrapping_add(b);
    }
    digest
}

fn main() {
    let digest = compute_digest("Hello");
    println!("Digest: {digest:?}");
}
// Digest: [222, 254, 150]
```

#### Static

These are not inlined upon use. They have actual memory locations and the variable lives for the entire duration of the program.

> Technically, you can mutate a static variable using `unsafe` code, but that's a topic for another day.

```rust
static BANNER: &str = "Welcome to RustOS 3.14";

fn main() {
    println!("{BANNER}");
}
// Welcome to RustOS 3.14
```

### Scope and Shadowing

Variables are scoped to the block they are declared. Thus, you can `shadow` a variable from outer and inner scopes.

```rust
fn main() {
    let a = 10;
    println!("before: {a}");

    {
        // this is a new scope
        let a = "hello";
        println!("inner scope: {a}");

        // shadowing the variable, this is a new variable in the inner scope
        let a = true;
        println!("shadowed in inner scope: {a}");
    }

    println!("after: {a}");
}
// before: 10
// inner scope: hello
// shadowed in inner scope: true
// after: 10
```

## Memory Management

Modern languages tipically fall into one of the following categories:

- Automatic Memory Management (Java, Python, Go)
- Manual Memory Management (C/C++)

Rust is different. It uses a concept called `ownership` to manage memory.


**How does Memory Management work?**

In general, a program can allocate memory in two ways:

- Stack: Is a contigous block of memory. Fast to allocate and deallocate. Fixed size.
    - Values have a fixed and predefined size.
    - Extremely fast to use since only a stack pointer needs to be updated for program execution.
    - Easy to manage, follows function calls (This refers to the fact that when a function is called it may 
      need to perform some additional tasks or calls to other functions. The stack must "follow" the function call by
      keeping the state of the program before the function call and restoring it after the function call).
    - Great memory locality (Memory locality is when data is stored in addresses that are generally close to each other).

- Heap: Is a pool of memory. Slow to allocate and deallocate. Dynamic size.
    - Values can have a dynamic size, which is only known at runtime.
    - Slower than stack, it requires bookkeeping (Bookkeeping is the process of tracking the usage [allocation and deallocation] of memory).
    - Memory locality is not guaranteed.

### Stack Memory

Creating a String puts fixed-sized data on the stack and dinamically-sized data on the heap.

```rust
fn main() {
    let s = String::from("HELLO");
    println!("{s}");
}
// hello
```

```goat
 Stack                             Heap
.---------------------------.     .-------------------------------.
|                           |     |                               |
|    s1                     |     |                               |
|   +-----------+-------+   |     |   +----+----+----+----+----+  |
|   | ptr       |   o---+---+-----+-->| H  | E  | L  | L  | O  |  |
|   | len       |     5 |   |     |   +----+----+----+----+----+  |
|   | capacity  |     5 |   |     |                               |
|   +-----------+-------+   |     |                               |
|                           |     '-------------------------------'
'---------------------------'
```

Strings in Rust are backed by `Vec`, that's why it has a `capacity` and `length` fields. The 
underlying memory is allocated using the System Allocator `std::alloc::System`.

### Manual Memory Management

Manual memory management is hard and unsafe:

```c
// You might forget to call free in the "lots of code" section and memory will leak.
void foo(size_t n) {
    int* int_array = (int*)malloc(n * sizeof(int));
    //
    // ... lots of code
    //
    free(int_array);
}
```

### Scoped Based Memory Management

Scoped Based Memory Management is safe but hard and has some performance penalties:

```c++
// Once the function returns, the `unique_ptr` destructor will be called regardless of an exception
void say_hello(std::unique_ptr<Person> person) {
  // the person parameter is wrapped in a so called `smart pointer`
  std::cout << "Hello " << person->name << std::endl;
}
```

This process is often called `RAII` (Resource Acquisition Is Initialization). The idea behind `RAII` is
to bound the lifetime of a resource to the lifetime of an object. Once the object is destroyed, the resource
is released.

### Automatic Memory Management

Automatic Memory Management is safe and easy to use but has some severe performance penalties:

```java
// The `person` object will be garbage collected at some point in the future but is guaranteed to be removed
void sayHello(Person person) {
  System.out.println("Hello " + person.getName());
}
```

### Memory Management in Rust

Here we have a mix: 
- **safe and correct** without garbage collection, thus no performance penalties.
- depending on the **abstraction** it can be a `unique_ptr`, `reference counting` or `atomically reference count (thread safe)`.
- **scoped based** (RAII) just like C++.

It accomplishes this by using a concept called `ownership` with `RAII` wrappers such as:

- `Box<T>`: Allocates memory on the heap and stores a value. Doesn't actually allocate memory if `T` is `zero` sized.
- `Rc<T>`: Single thread `Reference Counting`.
- `Arc<T>`: Atomically reference counting, thread safe.
- `Vec<T>`: A growable array, it can be converted to a `Box<[T]>` if needed. If `len == capacity` (as in the case of `vec!` macro)
then this conversion `to` and `from` `Box<[T]>` is a no-op (no reallocation or move).
- `Drop`: A trait that defines a destructor. It is called when the object goes out of scope.


## Ownership

Is a unique Rust feature and core to the language. All variables are valid within the scope 
they are declared. When the variable goes out of scope, it is dropped.

```rust

struct Point(i32, i32);

fn main() {
    {
        let p = Point(3, 4);
        println!("x: {}", p.0);
    }
    println!("y: {}", p.1);
}

// cannot find value `p` in this scope
```

### Move Semantics

```rust
fn main() {
    let s1 = String::from("Rust");
    let s2 = s1;
    println!("{s1}");
}
// cannot find value `s1` in this scope
```

- The **assignment** `let s2 = s1` is a **move**, it transfer the ownership.
- The **data** which was moved is no longer accesible via `s1`.
- When `s1` goes out of scope, nothing happens.
- When `s2` goes out of scope, the memory is freed.
- **There always will be only one owner**.
- The heap data from `s1` is reused for `s2`.

Before move to `s2`:

```goat
 Stack                             Heap
.---------------------------.     .---------------------------.
|                           |     |                           |
|    s1                     |     |                           |
|   +-----------+-------+   |     |   +----+----+----+----+   |
|   | ptr       |   o---+---+-----+-->| R  | u  | s  | t  |   |
|   | len       |     4 |   |     |   +----+----+----+----+   |
|   | capacity  |     4 |   |     |                           |
|   +-----------+-------+   |     |                           |
|                           |     '---------------------------'
|                           |
'---------------------------'
```
After move to `s2`:

```goat
 Stack                             Heap
.---------------------------.     .---------------------------.
|                           |     |                           |
|    s1 "(inaccessible)"    |     |                           |
|   +-----------+-------+   |     |   +----+----+----+----+   |
|   | ptr       |   o---+---+--+--+-->| R  | u  | s  | t  |   |
|   | len       |     4 |   |  |  |   +----+----+----+----+   |
|   | capacity  |     4 |   |  |  |                           |
|   +-----------+-------+   |  |  |                           |
|                           |  |  '---------------------------'
|    s2                     |  |
|   +-----------+-------+   |  |
|   | ptr       |   o---+---+--'
|   | len       |     4 |   |
|   | capacity  |     4 |   |
|   +-----------+-------+   |
|                           |
'---------------------------'
```

When a value is passed to a function, it is also moved:

```rust
fn say_hello(name: String) {
    println!("Hello {name}")
}

fn main() {
    let s = String::from("Rust");
    say_hello(s);
    println!("{s}");
}
// cannot find value `s` in this scope
```

- When `s` is passed to `say_hello`, it is moved.
- `main` loses ownership of `s`.
- The heap data from `s` is reused for `name`.
- The heap will be freed only at the end of `say_hello`.
- `main` could retain ownership by passing a reference `&s` but then `say_hello` would not be able to modify the value.
- Alternatively, `main` could `clone` the value and pass the clone to `say_hello`.

`Clone` in rust is very different from `clone` in C++ because it is very explicit and it is not a default behavior.

### Copying and Cloning

While `move` is the default behavior, there are some types that implement `Copy` trait and are copied instead of moved:

```rust
fn main() {
    let x = 42;
    let y = x;
    println!("x: {x}");
    println!("y: {y}");
}
// x: 42
// y: 42
```

This `Copy` behaviour can be opted-in by implementing the `Copy` and `Clone` traits:

```rust
#[derive(Copy, Clone, Debug)]
struct Point(i32, i32);

fn main() {
    let p1 = Point(3, 4);
    let p2 = p1;
    println!("p1: {p1:?}");
    println!("p2: {p2:?}");
}
// p1: Point(3, 4)
// p2: Point(3, 4)
```

We can also use `clone` to explicitly copy a value:

```rust
#[derive(Clone, Debug)]
struct Point(i32, i32);

fn main() {
    let p1 = Point(3, 4);
    let p2 = p1.clone();
    println!("p1: {p1:?}");
    println!("p2: {p2:?}");
}
// p1: Point(3, 4)
// p2: Point(3, 4)
```

**Note**: `Copying` and `Cloning` are not the same. `Copying` refers to `bitwise copy`.
`Copying` does not allow for custom behaviour. `Cloning` allows for custom behaviour.
`Copying` does not work for types that implement `Drop` trait.

### Borrowing

```rust
#[derive(Debug)]
struct Point(i32, i32);

fn add(p1: &Point, p2: &Point) -> Point {
    // This type of return is very cheap because the compiler does
    // Return Value Optimization (RVO) and does not copy the value (on release mode).
    Point(p1.0 + p2.0, p1.1 + p2.1)
}

fn main() {
    let p1 = Point(3, 4);
    let p2 = Point(10, 20);
    let p3 = add(&p1, &p2);
    println!("{p1:?} + {p2:?} = {p3:?}");
}
// Point(3, 4) + Point(10, 20) = Point(13, 24)
```

#### Shared and Unique Borrows

- You can have one or more `&T` values at any given time, or
- You can have exactly one `&mut T` value at any given time.

```rust
fn main() {
    let mut a: i32 = 10;
    let b: &i32 = &a;

    {
        let c: &mut i32 = &mut a;
        *c = 20;
    }

    println!("a: {a}");
    println!("b: {b}");
}
// cannot borrow `a` as mutable because it is also borrowed as immutable
```

We can fix this by moving the scope of `b`:

```rust
fn main() {
    let mut a: i32 = 10;
    let b: &i32 = &a;

    println!("b: {b}");
    {
        let c: &mut i32 = &mut a;
        *c = 20;
    }

    println!("a: {a}");
}
```

The compiler is able to determine that `b` is only used in the
entire of its lifetime before the variable `a` is again
borrowed as mutable to `c`. Hence, allows you to compile.

**How does the compiler know?**

This feature is called `Non-Lexical Lifetimes`.


### Lifetimes

Borrowing has a lifetime.

- The lifetime can be inferred by the compile, also called `lifetime elision`.
- The lifetime can be explicitly specified.
```rust
struct Point(i32, i32);

fn add<'a>(p1: &'a Point, p2: &'a Point) -> Point {
    Point(p1.0 + p2.0, p1.1 + p2.1)
}

fn main() {
    let p1 = Point(3, 4);
    let p2 = Point(10, 20);
    let p3 = add(&p1, &p2);
    println!("{p1:?} + {p2:?} = {p3:?}");
}
```

- This `&'a Point` can be read as **a borrowed `Point` is valid for at least the lifetime `a`**.
- Like `types`, `lifetimes` are always assigned by the compiler, and putting lifetimes explicitely force the compiler
to verify if there's a valid solution.

#### Lifetime in Structs

If a data structure contains a borrowed value, then it must be annotated with a lifetime:

```rust
#[derive(Debug)]
struct Highlight<'doc>(&'doc str);

fn erase(text: String) {
    println!("Bye {text}!");
}

fn main() {
    let text = String::from("The quick brown fox jumps over the lazy dog.");
    let fox = Highlight(&text[4..19]);
    let dog = Highlight(&text[35..43]);
    // erase(text);
    println!("{fox:?}");
    println!("{dog:?}");
}
```

What happens if we uncomment `erase(text)`?

```bash
error[E0505]: cannot move out of `text` because it is borrowed
```

**Why?**

The `lifetime` in the `Highlight` struct is `'doc`. This means that the `Highlight` struct
forces the compiler to ensure that the data it holds must live **as long as** any instance
of `Highlight`, which is `fox` and `dog` in this case.

The `String` data type is a `owned` value which does not implement the `Copy` trait
and hence, it is moved when passed to `erase` function. This means that the `erase` function
will take ownership of `text` and drop it at the end of the function.

**In general, when possible, it is better to use `owned` values instead of `borrowed` values.**

#### Lifetime in Functions

Functions can also return a borrowed value:

```rust
#[derive(Debug)]
struct Point(i32, i32);

fn left_most<'a>(p1: &'a Point, p2: &'a Point) -> &'a Point {
    if p1.0 < p2.0 { p1 } else { p2 }
}
```

**What if the function returns a value with a different lifetime?**

```rust
#[derive(Debug)]
struct Point(i32, i32);

fn left_most<'a, 'b>(p1: &'a Point, p2: &'a Point) -> &'b Point {
    if p1.0 < p2.0 { p1 } else { p2 }
}
// error: lifetime may not live long enough
```

The compiler will rightfully complain about `b` not living long enough, but
what does it mean?

- Remember that `&'b Point` means that the returned value is valid for at least the lifetime `b`.
- The lifetime `a` is the lifetime of the input parameters.
- The lifetime `b` is not necessarily longer than the lifetime `a`. Is actually unknown.

**Hence the compiler complains that the returned value is not guaranteed to live long enough.**

**How to fix this?**

We must tell the compiler that the returned value is valid for at least the lifetime `a` via `lifetime bounds`:

```rust
#[derive(Debug)]
struct Point(i32, i32);


fn left_most<'a, 'b: 'a>(p1: &'a Point, p2: &'a Point) -> &'b Point {
    if p1.0 < p2.0 { p1 } else { p2 }
}

// Analogous to:
fn left_most<'a>(p1: &'a Point, p2: &'a Point) -> &'a Point 
where 'a: 'b
{
    if p1.0 < p2.0 { p1 } else { p2 }
}
```

This means that the lifetime of `a` must outlive (or at least be as long as) the
lifetime of `b`.
